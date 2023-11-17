
import { NextResponse } from 'next/server';
import { getEmbedding, createChatCompletion } from "@/lib/chatCompletion";
import { getPromptExpandedQuery } from '@/lib/prompts';
import OpenAI from "openai";


const openAiKey = process.env.OPENAI_API_KEY;


const openai = new OpenAI({
  apiKey: openAiKey,
});

export const maxDuration = 120;

export async function POST(req: Request) {

  console.log("=====================================");
  console.log("=== QUERY EXPANSION API ENDPOINT ===");
  console.log("=====================================");

  if (openAiKey === undefined) { throw new Error("process.env.OPENAI_API_KEY is undefined!"); }
  const requestData: any = await req.json();
  const refined_question = requestData.refined_question;
  const specific_questions = requestData.specific_questions;


  // CHECK FOR INITIAL ERRORS


  try {
    const legal_questions: string[] = [refined_question, ...specific_questions];
    const params = getPromptExpandedQuery(legal_questions, true);
    const refinementJSON = JSON.parse(await createChatCompletion(params, openai, "expandedQuery"));
    const legal_statements: string[] = refinementJSON.legal_statements;
    console.log(legal_statements);
    const embedded_expansion_query = await getEmbedding(legal_statements.join('\n'), openai);
    const queryExpansionResponseBody = {
      embedded_expansion_query: embedded_expansion_query,
      statusMessage: 'Succesfully expanded query!'
    };

    return NextResponse.json(queryExpansionResponseBody);
  } catch (error) {
    return NextResponse.json({ errorMessage: `An error occurred in queryExpansion: ${error}` });
  }
}
