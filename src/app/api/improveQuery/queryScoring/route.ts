import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { createChatCompletion } from "@/lib/chatCompletion";
import { getPromptQueryScoring } from '@/lib/prompts';
import { ClarificationChoices } from '@/lib/types';


const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

export const maxDuration = 120;

export async function POST(req: Request) {

  console.log("=================================");
  console.log("=== queryScoring API ENDPOINT ===");
  console.log("=================================");

  if (openAiKey === undefined) { throw new Error("process.env.OPENAI_API_KEY is undefined!"); }

  const requestData: any = await req.json();
  const user_prompt_query: string = requestData.user_prompt_query;

  try {
    // console.log("Calling queryClarification API endpoint with original_query: ", original_query);
    const params = getPromptQueryScoring(user_prompt_query, true);
    const res = JSON.parse(await createChatCompletion(params, openai, "queryScoring"));
    // console.log("Query Clarification Response: ", res);


    const quality_score: number = res.quality_score;


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
    const queryScoringResponseBody = {
      message_to_user: message_to_user,
      quality_score: quality_score,
      statusMessage: 'Finished scoring query!'
    };
    console.log(`- Exiting queryClarification API endpoint`);
    return NextResponse.json(queryScoringResponseBody);



  } catch (error) {
    console.error(`An error occurred in queryScoring: ${error}`);
    return NextResponse.json({ errorMessage: `An error occurred in queryScoring: ${error}` });
  }
}

