import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { createChatCompletion } from "@/lib/chatCompletion";
import { getPromptClarificationQuestion, getPromptClarificationQuestionMultiple, getPromptCondenseClarifications } from '@/lib/prompts';
import { ClarificationChoices, Clarification } from '@/lib/types';


const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

export const maxDuration = 120;

export async function POST(req: Request) {

  console.log("==========================================");
  console.log("=== queryClarification API ENDPOINT ===");
  console.log("==========================================");

  if (openAiKey === undefined) { throw new Error("process.env.OPENAI_API_KEY is undefined!"); }

  const requestData: any = await req.json();
  console.log(requestData);
  const user_prompt_query: string = requestData.user_prompt_query;
  const mode: string = requestData.mode;
  const previous_clarifications_raw = requestData.previous_clarifications;
  const already_answered: string[] = requestData.already_answered;

  try {

    let result;
    let message_to_customer;
    if (mode === "single") {
      // Condense previous clarifications.
      console.log("single clarification mode");

      const previous_clarifications: Clarification[] = previous_clarifications_raw;
      console.log(previous_clarifications);
      const params_condensed = getPromptCondenseClarifications(user_prompt_query, previous_clarifications, [], "single", true);
      const response_condensed = JSON.parse(await createChatCompletion(params_condensed, openai, "condenseClarifications"));
      console.log(response_condensed.instructions);

      const params_choices = getPromptClarificationQuestion(user_prompt_query, response_condensed.instructions, true);
      const response = JSON.parse(await createChatCompletion(params_choices, openai, "queryClarificationQuestion"));

      const new_question: string = response.new_clarification.question;
      const new_answers: string[] = response.new_clarification.multiple_choice_answers;
      message_to_customer = response.new_clarification.message_to_customer;

      result = {
        question: new_question,
        multiple_choice_answers: new_answers,
        response: ""
      };
    } else {
      console.log("multiple clarification mode");
      const params_choices = getPromptClarificationQuestionMultiple(user_prompt_query, true);
      const response = JSON.parse(await createChatCompletion(params_choices, openai, "queryClarificationMultiple"));
      console.log(response);
      result = [];
      message_to_customer = [];
      for (const clarification of response.new_clarifications) {
        const new_question: string = clarification.question;
        const new_answers: string[] = clarification.multiple_choice_answers;
        const message: string = clarification.message_to_customer;
        const temp = {
          question: new_question,
          multiple_choice_answers: new_answers,
          response: ""
        };
        message_to_customer.push(message);
        result.push(temp);
      }
    }

    const queryClarificationResponseBody = {
      message_to_customer: message_to_customer,
      clarification: result,
      statusMessage: 'Asked new clarification question!'
    };
    console.log(`- Exiting queryClarification API endpoint`);
    return NextResponse.json(queryClarificationResponseBody);



  } catch (error) {
    console.error(`An error occurred in queryClarification: ${error}`);
    return NextResponse.json({ errorMessage: `An error occurred in queryClarification: ${error}` });
  }
}

