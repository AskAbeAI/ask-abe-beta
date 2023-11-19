
import { NextResponse } from 'next/server';
import { getEmbedding, createChatCompletion } from "@/lib/chatCompletion";
import { getPromptExpandedQuery } from '@/lib/prompts';
import OpenAI from "openai";
import { insert_api_debug_log } from '@/lib/database';

const openAiKey = process.env.OPENAI_API_KEY;


const openai = new OpenAI({
  apiKey: openAiKey,
});

export const maxDuration = 120;

export async function POST(req: Request) {

  const startTime = Date.now();
  console.log("=== QUERY EXPANSION API ENDPOINT ===");
  

  if (openAiKey === undefined) { throw new Error("process.env.OPENAI_API_KEY is undefined!"); }
  const requestData: any = await req.json();
  const refined_question = requestData.refined_question;
  const specific_questions = requestData.specific_questions;



  try {
    const legal_questions: string[] = [refined_question, ...specific_questions];
    const params = getPromptExpandedQuery(legal_questions, true);
    const refinementJSON = JSON.parse(await createChatCompletion(params, openai, "expandedQuery"));
    const legal_statements: string[] = refinementJSON.legal_statements;
    const embedded_expansion_query = await getEmbedding(legal_statements.join('\n'), openai);
    const queryExpansionResponseBody = {
      embedded_expansion_query: embedded_expansion_query,
      statusMessage: 'Succesfully expanded query!'
    };

    const endTime = Date.now();
    const executionTime = endTime - startTime;
    await insert_api_debug_log("queryExpansion", executionTime, JSON.stringify(requestData), JSON.stringify(queryExpansionResponseBody), false, "", process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    
    return NextResponse.json(queryExpansionResponseBody);
  } catch (error) {
    const endTime = Date.now();
    let errorMessage = `${error},\n`
    if (error instanceof Error) {
      errorMessage += error.stack;
    }
    const executionTime = endTime - startTime;
    await insert_api_debug_log("queryExpansion", executionTime, JSON.stringify(requestData), "{}", true, errorMessage, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    return NextResponse.json({ errorMessage: `An error occurred in queryExpansion: ${error}` });
  }
}
