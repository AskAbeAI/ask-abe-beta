import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { createChatCompletion } from "@/lib/chatCompletion";
import { getPromptClarificationQuestion, getPromptClarificationQuestionMultiple, getPromptCondenseClarifications } from '@/lib/prompts';
import { ClarificationChoices, Clarification } from '@/lib/types';
import { insert_api_debug_log } from '@/lib/database';

const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

export const maxDuration = 120;

export async function POST(req: Request) {

  const startTime = Date.now();
  console.log("=== queryClarification API ENDPOINT ===");
  

  if (openAiKey === undefined) { throw new Error("process.env.OPENAI_API_KEY is undefined!"); }

  const requestData: any = await req.json();
  const user_prompt_query: string = requestData.user_prompt_query;
  const mode: string = requestData.mode;
  const previous_clarifications_raw = requestData.previous_clarifications;
  const already_answered: string[] = requestData.already_answered;

  try {

    let result;
    let message_to_customer;
    if (mode === "single") {
      // Condense previous clarifications.

      const previous_clarifications: Clarification[] = previous_clarifications_raw;
      const params_condensed = getPromptCondenseClarifications(user_prompt_query, previous_clarifications, [], "single", true);
      const response_condensed = JSON.parse(await createChatCompletion(params_condensed, openai, "condenseClarifications"));

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
      const params_choices = getPromptClarificationQuestionMultiple(user_prompt_query, true);
      const response = JSON.parse(await createChatCompletion(params_choices, openai, "queryClarificationMultiple"));
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
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    await insert_api_debug_log("queryClarification", executionTime, JSON.stringify(requestData), JSON.stringify(queryClarificationResponseBody), false, "", process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    
    return NextResponse.json(queryClarificationResponseBody);



  } catch (error) {
    const endTime = Date.now();
    let errorMessage = `${error},\n`
    if (error instanceof Error) {
      errorMessage += error.stack;
    }
    const executionTime = endTime - startTime;
    return NextResponse.json({ errorMessage: `An error occurred in queryClarification: ${error}` });
  }
}

