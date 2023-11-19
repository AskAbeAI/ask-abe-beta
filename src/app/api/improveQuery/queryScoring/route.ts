import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { calculateQuestionClarityScore } from "@/lib/helpers";
import { insert_api_debug_log } from '@/lib/database';

const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

export const maxDuration = 120;

const questionClarityScoreToUserMessage = (quality_score: number) => {
  let message_to_user: string = "Placeholder!";
  if (quality_score <= 1) {
    // If query is so bad it needs to be restarted, scored 0-1.
    message_to_user = "I'm sorry, I don't quite understand how your query is relevant to the law. Can you restate your query in a different way or ask a different question?";
  } else if (quality_score == 7) {
    // Question is already excellent, scored 7.
    message_to_user = "Great question! I will now begin my legal research.";
  } else {
    // If query needs more work or is bad, scored 2-6.
    message_to_user = "I'd like to ask a few clarifying questions to better understand your query. Please answer the following questions to the best of your ability.";
  }

  return message_to_user;
};



export async function POST(req: Request) {
  const startTime = Date.now();
  console.log("=== queryScoring API ENDPOINT ===");

  if (openAiKey === undefined) { throw new Error("process.env.OPENAI_API_KEY is undefined!"); }

  const requestData: any = await req.json();
  const sessionId: string = req.headers.get('x-session-id')!;
  const user_prompt_query: string = requestData.user_prompt_query;

  try {
    const quality_score: number = await calculateQuestionClarityScore(openai, user_prompt_query);
    const message_to_user: string = questionClarityScoreToUserMessage(quality_score);

    const response = {
      message_to_user: message_to_user,
      quality_score: quality_score,
      statusMessage: 'Finished scoring query!'
    };

    const endTime = Date.now();
    const executionTime = endTime - startTime;
    await insert_api_debug_log("queryScoring", executionTime, JSON.stringify(requestData), JSON.stringify(response), false, "", process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
    return NextResponse.json(response);

  } catch (error) {
    const endTime = Date.now();
    let errorMessage = `${error},\n`;
    if (error instanceof Error) {
      errorMessage += error.stack;
    }
    const executionTime = endTime - startTime;
    await insert_api_debug_log("queryScoring", executionTime, JSON.stringify(requestData), "{}", true, errorMessage, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
    return NextResponse.json({ errorMessage: `An error occurred in queryScoring: ${error}` });
  }
}

