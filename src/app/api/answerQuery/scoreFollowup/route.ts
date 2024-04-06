import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { createChatCompletion } from "@/lib/chatCompletion";
import { getPromptClarificationQuestion, getPromptQuerySimilarity, getPromptClarificationQuestionMultiple, condenseClarifications } from '@/lib/prompts';
import { Clarification } from '@/lib/types';
import { insert_api_debug_log } from '@/lib/database';

const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

export const maxDuration = 120;

export async function POST(req: Request) {

  const startTime = Date.now();
  console.log("=== scoreFollowupQuestion API ENDPOINT ===");
  

  if (openAiKey === undefined) { throw new Error("process.env.OPENAI_API_KEY is undefined!"); }

  const requestData: any = await req.json();
  const sessionId: string = req.headers.get('x-session-id')!;
  const user_prompt_query: string = requestData.user_prompt_query;
  const previous_clarifications_raw = requestData.previous_clarifications;
  const already_answered: string[] = requestData.already_answered;


  try {
    const previous_clarifications: Clarification[] = previous_clarifications_raw;
    
    const params_condensed = getPromptQuerySimilarity(user_prompt_query, previous_clarifications, already_answered, true);
    const response_condensed = JSON.parse(await createChatCompletion(params_condensed, openai, "querySimilarity"));
    


    const scoreFollowupResponseBody = {
      do_new_research_score: response_condensed.do_new_research_score,
      statusMessage: 'Asked new clarification question!'
    };

    const endTime = Date.now();
    const executionTime = endTime - startTime;
    await insert_api_debug_log("scoreFollowup", executionTime, JSON.stringify(requestData), JSON.stringify(scoreFollowupResponseBody), false, "", process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
    return NextResponse.json(scoreFollowupResponseBody);
  } catch (error) {
    const endTime = Date.now();
    let errorMessage = `${error},\n`
    if (error instanceof Error) {
      errorMessage += error.stack;
    }
    const executionTime = endTime - startTime;
    await insert_api_debug_log("scoreFollowup", executionTime, JSON.stringify(requestData), "{}", true, errorMessage, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
    return NextResponse.json({ errorMessage: `An error occurred in scoreFollowup: ${error}` });
  }

}