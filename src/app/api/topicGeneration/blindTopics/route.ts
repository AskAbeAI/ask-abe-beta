import OpenAI from "openai";
import { createChatCompletion } from "@/lib/chatCompletion";
import { NextResponse } from 'next/server';
import { getPromptBlindTopics, getPromptFirstTopics } from "@/lib/prompts";
import { node_as_row } from "@/lib/types";
import { mapJurisdictionFullname, getSectionTextFromRow } from "@/lib/utils";



const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

export const maxDuration = 120;

export async function POST(req: Request) {

  
  console.log("==== blindTopics API ENDPOINT ====");
  

  if (openAiKey === undefined) { throw new Error("process.env.OPENAI_API_KEY is undefined!"); }

  const requestData = await req.json();
  const sessionId: string = req.headers.get('x-session-id')!;
  const main_question: string = requestData.main_question;
  const specific_questions: string[] = requestData.specific_questions;
  const state_jurisdiction: string = requestData.state_legal_document;
  const federal_jurisdiction: string = requestData.federal_legal_document;
  const better_question = `In ${state_jurisdiction}, ${federal_jurisdiction}: ${main_question}`;


  try {
    const params = getPromptBlindTopics(better_question, specific_questions, true);
    //console.log(params);
    const result = JSON.parse(await createChatCompletion(params, openai, "blindTopics"));
    //console.log(result);
    // const federal_topics = await generateTopics(federal_rows, federal_jurisdiction, main_question, openai);


    const blindTopicsResponseBody = {
      general_topics: result.general_topics,
      statusMessage: 'Successfully generated blind general_topics!'
    };

    return NextResponse.json(blindTopicsResponseBody);
  } catch (error) {
    console.error(`An error occurred in blindTopics: ${error}`);
    return NextResponse.json({ errorMessage: `An error occurred in blindTopics: ${error}` });
  }
}

