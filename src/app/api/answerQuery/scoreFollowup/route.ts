import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { createChatCompletion } from "@/lib/chatCompletion";
import { getPromptClarificationQuestion, getPromptQuerySimilarity, getPromptClarificationQuestionMultiple, getPromptCondenseClarifications } from '@/lib/prompts';
import { ClarificationChoices, Clarification } from '@/lib/types';


const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

export const maxDuration = 120;

export async function POST(req: Request) {

  console.log("==========================================");
  console.log("=== scoreFollowupQuestion API ENDPOINT ===");
  console.log("==========================================");

  if (openAiKey === undefined) { throw new Error("process.env.OPENAI_API_KEY is undefined!"); }

  const requestData: any = await req.json();
  console.log(requestData);
  const user_prompt_query: string = requestData.user_prompt_query;
  const previous_clarifications_raw = requestData.previous_clarifications;
  const already_answered: string[] = requestData.already_answered;


  try {



    // Condense previous clarifications.
    console.log("scoring followup!");

    const previous_clarifications: Clarification[] = previous_clarifications_raw;
    console.log(previous_clarifications);
    console.log(user_prompt_query);
    console.log(already_answered);
    const params_condensed = getPromptQuerySimilarity(user_prompt_query, previous_clarifications, already_answered, true);
    const response_condensed = JSON.parse(await createChatCompletion(params_condensed, openai, "querySimilarity"));
    console.log(response_condensed);
    console.log(response_condensed.do_new_research_score);


    const scoreFollowupResponseBody = {
      do_new_research_score: response_condensed.do_new_research_score,
      statusMessage: 'Asked new clarification question!'
    };
    console.log(`- Exiting scoreFollowup API endpoint`);
    return NextResponse.json(scoreFollowupResponseBody);
  } catch (error) {
    console.error(`An error occurred in scoreFollowup: ${error}`);
    return NextResponse.json({ errorMessage: `An error occurred in scoreFollowup: ${error}` });
  }

}