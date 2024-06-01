import OpenAI from 'openai';
import {  ClarificationChoices, node_as_row, questionJurisdictions, text_citation_document_trio} from '@/lib/types';
import { NextResponse } from 'next/server';
import { condenseClarificationsIntoInstructions,answeringInstructionsHelper, directAnswerHelper } from '@/lib/helpers';
import { generateApiRequestReport, generateApiResponseReport } from '@/lib/utilities';
import { BaseResponse, DirectAnsweringRequest, DirectAnsweringResponse } from '@/lib/api_types';


const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});
const API_ROUTE = "api/answerQuery/directAnswering"
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
  

  const request: DirectAnsweringRequest = await req.json();
  console.log(request)
  generateApiRequestReport(request.base, API_ROUTE)

  let errorMessage: string | undefined = undefined;
  let directAnswer: string = "ERROR";


  const refinedQuestion = request.refinedQuestion
  const clarifications: ClarificationChoices = request.clarifications!;
  const specificQuestions: string[] = request.specificQuestions;
  const answerMode: string = request.answerMode;
  const alreadyAnswered: string[] = request.alreadyAnswered;
  const primaryRows: node_as_row[] = request.primaryRows;
  const secondaryRows: node_as_row[] = request.secondaryRows;
  const questionJurisdictions:questionJurisdictions = request.questionJurisdictions;
  let primaryJurisdiction;
  let secondaryJurisdiction;
  
  if (questionJurisdictions.mode === "state_federal") {
    primaryJurisdiction = questionJurisdictions.state!;
    secondaryJurisdiction = questionJurisdictions.federal!;
  } else if (questionJurisdictions.mode === "state") {
    primaryJurisdiction = questionJurisdictions.state!;
  } else if (questionJurisdictions.mode === "federal") {
    primaryJurisdiction = questionJurisdictions.federal!;
  } else if (questionJurisdictions.mode === "misc") {
    primaryJurisdiction = questionJurisdictions.misc!;
  } else if (questionJurisdictions.mode === "misc_federal") {
    primaryJurisdiction = questionJurisdictions.misc!;
    secondaryJurisdiction = questionJurisdictions.federal!;
  }
  

  const all_text_citation_pairs: text_citation_document_trio[] =[];
  for (const row of primaryRows) {
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
      document: primaryJurisdiction!.corpusTitle
    };
    all_text_citation_pairs.push(pair);
  }
  if (secondaryRows) {
    for (const row of secondaryRows) {
      // Join row.node_text into a single string with '\n' as the delimiter
      let new_text = row.node_text.join('\n');

      const pair: text_citation_document_trio = {
        section_citation: row.node_citation,
        text: new_text,
        document: secondaryJurisdiction!.corpusTitle
      };
      all_text_citation_pairs.push(pair);
    }
  }
  
  const all_questions: string[] = [];
  all_questions.push(refinedQuestion);
  for (const question of specificQuestions) {
    all_questions.push(question);
  }

  try {
    

    if (answerMode === "clarifications") {
      const instructions = await condenseClarificationsIntoInstructions(request.base, openai, refinedQuestion, clarifications.clarifications);
      directAnswer = await directAnswerHelper(request.base, openai, refinedQuestion, instructions, all_text_citation_pairs);
    } else {
      const customer_information = "The customer is interested in getting accurate legal information about their question. They are a resident of the applicable jurisdiction. They are looking for a general answer to their question, not specific legal advice. They only want to understand current legislation, not any future or upcoming changes.";
      const instructions = await answeringInstructionsHelper(request.base, openai, refinedQuestion, customer_information, alreadyAnswered);
      console.log("Finished instructions!")
      directAnswer = await directAnswerHelper(request.base, openai, refinedQuestion, instructions, all_text_citation_pairs);
      console.log("Returned from directAnswerHelper!")
      console.log(directAnswer)

    }

    
    
  } catch (error) {
    console.log(error)
		errorMessage = `${error},\n`
		if (error instanceof Error) {
		errorMessage += error.stack;
		}
		
  } finally {
    const baseResponse: BaseResponse = {
      pipelineModel: request.base.pipelineModel
    }
    if (errorMessage !== undefined) {
      baseResponse.errorMessage = errorMessage;
    }
    const response: DirectAnsweringResponse = {
      base: baseResponse,
      directAnswer: directAnswer
      
    };

    generateApiResponseReport(request.base, API_ROUTE, response?.base.errorMessage )
    return NextResponse.json(response);
  }
}


