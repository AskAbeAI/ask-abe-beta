import OpenAI from 'openai';
import {  ClarificationChoices, node_as_row, questionJurisdictions, text_citation_document_trio} from '@/lib/types';
import { NextResponse } from 'next/server';
import { insert_api_debug_log } from '@/lib/database';
import { condenseClarificationsIntoInstructions,generateAnsweringInstructions, generateDirectAnswer } from '@/lib/helpers';


const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});
export const maxDuration = 120;

export function OPTIONS(req: Request) {
  //console.log(req.headers)
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
  console.log("=== directAnswering API ENDPOINT ===");
  

  const requestData: any = await req.json();
  const sessionId: string = req.headers.get('x-session-id')!;
  const legal_question = requestData.legal_question;
  const clarifications: ClarificationChoices = requestData.clarifications;
  const specific_questions: string[] = requestData.specific_questions;
  const mode: string = requestData.mode;
  const already_answered: string[] = requestData.already_answered;
  const primary_rows: node_as_row[] = requestData.primary_rows;
  const secondary_rows: node_as_row[] = requestData.secondary_rows;
  const question_jurisdictions:questionJurisdictions = requestData.question_jurisdiction;
  let primary_jurisdiction;
  let secondary_jurisdiction;
  //console.log(`mode: ${mode}`)
  //console.log(`question_jurisdictions: ${question_jurisdictions}`)
  //console.log(`primary_rows: ${primary_rows}`)
  if (question_jurisdictions.mode === "state_federal") {
    primary_jurisdiction = question_jurisdictions.state!;
    secondary_jurisdiction = question_jurisdictions.federal!;
  } else if (question_jurisdictions.mode === "state") {
    primary_jurisdiction = question_jurisdictions.state!;
  } else if (question_jurisdictions.mode === "federal") {
    primary_jurisdiction = question_jurisdictions.federal!;
  } else if (question_jurisdictions.mode === "misc") {
    primary_jurisdiction = question_jurisdictions.misc!;
  } else if (question_jurisdictions.mode === "misc_federal") {
    primary_jurisdiction = question_jurisdictions.misc!;
    secondary_jurisdiction = question_jurisdictions.federal!;
  }
  




  const all_text_citation_pairs: text_citation_document_trio[] =[];
  for (const row of primary_rows) {
    // Join row.node_text into a single string with '\n' as the delimiter
    let new_text = row.node_text.join('\n');
    let citation = row.node_citation;
    
    if(citation === undefined || citation === null) {
      
      citation = row.node_name;
    }
    if(citation === undefined || citation === null) {
      citation = row.node_id.split("/").pop()!;
    }
    //console.log(citation)
    const pair: text_citation_document_trio = {
      section_citation: citation,
      text: new_text,
      document: primary_jurisdiction!.corpusTitle
    };
    all_text_citation_pairs.push(pair);
  }
  if (secondary_rows) {
    for (const row of secondary_rows) {
      // Join row.node_text into a single string with '\n' as the delimiter
      let new_text = row.node_text.join('\n');

      const pair: text_citation_document_trio = {
        section_citation: row.node_citation,
        text: new_text,
        document: secondary_jurisdiction!.corpusTitle
      };
      all_text_citation_pairs.push(pair);
    }
  }
  
  const all_questions: string[] = [];
  all_questions.push(legal_question);
  for (const question of specific_questions) {
    all_questions.push(question);
  }

  try {
    let direct_answer;
    

    if (mode === "clarifications") {
      const instructions = await condenseClarificationsIntoInstructions(openai, legal_question, clarifications.clarifications);
      direct_answer = await generateDirectAnswer(openai, legal_question, instructions, all_text_citation_pairs);
    } else {
      const customer_information = "The customer is interested in getting accurate legal information about their question. They are a resident of the applicable jurisdiction. They are looking for a general answer to their question, not specific legal advice. They only want to understand current legislation, not any future or upcoming changes.";
      const instructions = await generateAnsweringInstructions(openai, legal_question, customer_information, already_answered);
      //console.log(instructions);
      direct_answer = await generateDirectAnswer(openai, legal_question, instructions, all_text_citation_pairs);
      console.log(direct_answer)

    }

    const directAnsweringResponseBody = {
      directAnswer: direct_answer,
      statusMessage: 'Successfully generated directAnswer!'
    };

    const endTime = Date.now();
    const executionTime = endTime - startTime;
    await insert_api_debug_log("directAnswering", executionTime, JSON.stringify(requestData), JSON.stringify(directAnsweringResponseBody), false, "", process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);

    const finalResponse = NextResponse.json(directAnsweringResponseBody);
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
		await insert_api_debug_log("directAnswering", executionTime, JSON.stringify(requestData), "{}", true, errorMessage, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
    return NextResponse.json({ errorMessage: `An error occurred in directAnswering: ${error}` });
  }
}


