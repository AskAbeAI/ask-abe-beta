import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { condenseClarificationsIntoInstructions, generateNewClarificationQuestion, generateMultipleClarificationQuestions } from '@/lib/helpers';
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
  const sessionId: string = req.headers.get('x-session-id')!;

  try {

    
    let response;
    if (mode === "single") {
      // Condense previous clarifications.

      const previous_clarifications: Clarification[] = previous_clarifications_raw;
      const instructions: string = await condenseClarificationsIntoInstructions(openai, user_prompt_query, previous_clarifications, already_answered, mode);
      const [new_clarification, message_to_customer] = await generateNewClarificationQuestion(openai, user_prompt_query, instructions);
      response = {
        messages_to_customer: [message_to_customer],
        clarifications: [new_clarification],
        statusMessage: 'Asked one new clarification question!'
      };
    } else {
      const [new_clarifications, messages_to_customer] = await generateMultipleClarificationQuestions(openai, user_prompt_query);
      response = {
        messages_to_customer: messages_to_customer,
        clarifications: new_clarifications,
        statusMessage: 'Asked many new clarification questions!'
      };
    }

    
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    await insert_api_debug_log("queryClarification", executionTime, JSON.stringify(requestData), JSON.stringify(response), false, "", process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
    return NextResponse.json(response);



  } catch (error) {
    const endTime = Date.now();
    let errorMessage = `${error},\n`
    if (error instanceof Error) {
      errorMessage += error.stack;
    }
    const executionTime = endTime - startTime;
    await insert_api_debug_log("queryClarification", executionTime, JSON.stringify(requestData), "{}", true, errorMessage, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
    return NextResponse.json({ errorMessage: `An error occurred in queryClarification: ${error}` });
  }
}

