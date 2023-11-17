import { NextResponse } from 'next/server';
import { getPromptQueryRefinement } from '@/lib/prompts';
import { createChatCompletion } from "@/lib/chatCompletion";
import OpenAI from "openai";


const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

export const maxDuration = 120;

export async function POST(req: Request) {

  console.log("=====================================");
  console.log("=== QUERY REFINEMENT API ENDPOINT ===");
  console.log("=====================================");

  const requestData: any = await req.json();
  const original_question = requestData.original_question;
  const clarifying_questions: string[] = requestData.clarifyingQuestions;
  const customer_clarifying_responses: string[] = requestData.clarifyingAnswers;




  try {
    const params = getPromptQueryRefinement(original_question, clarifying_questions, customer_clarifying_responses, true);
    //console.log(params);
    const refinementJSON = JSON.parse(await createChatCompletion(params, openai, "queryRefinement"));
    console.log(refinementJSON.customer_messages);

    const queryRefinementResponseBody = {
      customer_messages: refinementJSON.customer_messages,
      refined_question: refinementJSON.refined_question,
      specific_questions: refinementJSON.specific_questions,
      statusMessage: 'Succesfully refined query!'
    };
    console.log("Query Refinement Response: ", queryRefinementResponseBody);

    return NextResponse.json(queryRefinementResponseBody);
  } catch (error) {
    return NextResponse.json({ errorMessage: `An error occurred in queryRefinement: ${error}` });
  }
}



