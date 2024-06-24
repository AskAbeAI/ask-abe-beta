import { NextResponse } from 'next/server';
import { generateQueryRefinement } from '@/lib/helpers';
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
  const sessionId: string = req.headers.get('x-session-id')!;
  const original_question = requestData.original_question;
  const clarifying_questions: string[] = requestData.clarifyingQuestions;
  const customer_clarifying_responses: string[] = requestData.clarifyingAnswers;

  try {
    const [customer_messages, refined_question, specific_questions] = await generateQueryRefinement(openai, original_question, clarifying_questions, customer_clarifying_responses);
    console.log("customer_messages: " + customer_messages);
    console.log("refined_question: " + refined_question);
    console.log("specific_questions: " + specific_questions)
    const response = {
      customer_messages: customer_messages,
      refined_question: refined_question,
      specific_questions: specific_questions,
      statusMessage: 'Succesfully refined query!'
    };
    

    const endTime = Date.now();
    const executionTime = endTime - startTime;
    await insert_api_debug_log("queryRefinement", executionTime, JSON.stringify(requestData), JSON.stringify(response), false, "", process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);

    return NextResponse.json(response);
  } catch (error) {
    const endTime = Date.now();
    let errorMessage = `${error},\n`
    if (error instanceof Error) {
      errorMessage += error.stack;
    }
    const executionTime = endTime - startTime;
    await insert_api_debug_log("queryRefinement", executionTime, JSON.stringify(requestData), "{}", true, errorMessage, process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
    return NextResponse.json({ errorMessage: `An error occurred in queryRefinement: ${error}` });
  }
}



