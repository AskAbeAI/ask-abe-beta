import { NextResponse } from 'next/server';
import { getPromptQueryRefinement } from '@/lib/prompts';
import { createChatCompletion } from "@/lib/chatCompletion";
import OpenAI from "openai";
import { insert_api_debug_log } from '@/lib/database';

const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

export const maxDuration = 120;

export async function POST(req: Request) {
  const startTime = Date.now();
  
  console.log("=== QUERY REFINEMENT API ENDPOINT ===");

  const requestData: any = await req.json();
  const original_question = requestData.original_question;
  const clarifying_questions: string[] = requestData.clarifyingQuestions;
  const customer_clarifying_responses: string[] = requestData.clarifyingAnswers;




  try {
    const params = getPromptQueryRefinement(original_question, clarifying_questions, customer_clarifying_responses, true);
    //console.log(params);
    const refinementJSON = JSON.parse(await createChatCompletion(params, openai, "queryRefinement"));

    const queryRefinementResponseBody = {
      customer_messages: refinementJSON.customer_messages,
      refined_question: refinementJSON.refined_question,
      specific_questions: refinementJSON.specific_questions,
      statusMessage: 'Succesfully refined query!'
    };
    

    const endTime = Date.now();
    const executionTime = endTime - startTime;
    await insert_api_debug_log("queryRefinement", executionTime, JSON.stringify(requestData), JSON.stringify(queryRefinementResponseBody), false, "", process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

    return NextResponse.json(queryRefinementResponseBody);
  } catch (error) {
    const endTime = Date.now();
    let errorMessage = `${error},\n`
    if (error instanceof Error) {
      errorMessage += error.stack;
    }
    const executionTime = endTime - startTime;
    await insert_api_debug_log("queryRefinement", executionTime, JSON.stringify(requestData), "{}", true, errorMessage, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    return NextResponse.json({ errorMessage: `An error occurred in queryRefinement: ${error}` });
  }
}



