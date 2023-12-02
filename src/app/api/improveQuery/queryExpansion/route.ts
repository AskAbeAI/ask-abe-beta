
import { NextResponse } from 'next/server';
import { generateQueryExpansion, generateEmbedding } from '@/lib/helpers';
import OpenAI from "openai";
import { insert_api_debug_log } from '@/lib/database';

const openAiKey = process.env.OPENAI_API_KEY;


const openai = new OpenAI({
  apiKey: openAiKey,
});
export const maxDuration = 120;

export function OPTIONS(req: Request) {
  console.log(req.headers)
  // Set CORS headers
  const headers = {
      'Access-Control-Allow-Origin': 'https://www.strikingly.com', // Modify as needed for your use case
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      // Include any other headers you might need for your requests
  };

  // Return the response with CORS headers and no body
  return new NextResponse(null, { status: 204, headers });
}

export async function POST(req: Request) {

  const startTime = Date.now();
  console.log("=== QUERY EXPANSION API ENDPOINT ===");
  
  if (openAiKey === undefined) { throw new Error("process.env.OPENAI_API_KEY is undefined!"); }
  const requestData: any = await req.json();
  const sessionId: string = req.headers.get('x-session-id')!;
  const refined_question = requestData.refined_question;
  const specific_questions = requestData.specific_questions;
  const legal_questions: string[] = [refined_question, ...specific_questions];

  try {
    
    const legal_statements: string[] = await generateQueryExpansion(openai, legal_questions);
    const embedded_expansion_query: number[] = await generateEmbedding(openai, legal_statements);

    const response = {
      embedded_expansion_query: embedded_expansion_query,
      statusMessage: 'Succesfully expanded query!'
    };

    const endTime = Date.now();
    const executionTime = endTime - startTime;
    await insert_api_debug_log("queryExpansion", executionTime, JSON.stringify(requestData), JSON.stringify(response), false, "", process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
    const finalResponse = NextResponse.json(response);
    finalResponse.headers.set('Access-Control-Allow-Origin', 'https://www.strikingly.com');
    finalResponse.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    finalResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return finalResponse;
  } catch (error) {
    const endTime = Date.now();
    let errorMessage = `${error},\n`
    if (error instanceof Error) {
      errorMessage += error.stack;
    }
    const executionTime = endTime - startTime;
    await insert_api_debug_log("queryExpansion", executionTime, JSON.stringify(requestData), "{}", true, errorMessage, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
    return NextResponse.json({ errorMessage: `An error occurred in queryExpansion: ${error}` });
  }
}
