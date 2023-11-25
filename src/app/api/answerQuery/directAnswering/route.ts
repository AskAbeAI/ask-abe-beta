import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Message, ChatCompletionParams, node_as_row, TopicResponses, GroupedRows, PartialAnswer, ClarificationChoices, text_citation_pair } from '@/lib/types';
import { NextResponse } from 'next/server';
import { getPromptDirectAnswering, getPromptPartialAnswering, getPromptDirectAnsweringSeparate, getPromptCondenseClarifications } from '@/lib/prompts';
import { createChatCompletion } from '@/lib/chatCompletion';
import { dir } from 'console';
import { insert_api_debug_log } from '@/lib/database';
import { condenseClarificationsIntoInstructions, convertGroupedRowsToTextCitationPairs, generateDirectAnswer } from '@/lib/helpers';


const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});
export const maxDuration = 120;

export async function POST(req: Request) {

  const startTime = Date.now();
  console.log("=== directAnswering API ENDPOINT ===");
  

  const requestData: any = await req.json();
  const sessionId: string = req.headers.get('x-session-id')!;
  const legal_question = requestData.legal_question;
  const primaryGroupedRows: GroupedRows = requestData.primary_grouped_rows;
  const secondaryGroupedRows: GroupedRows = requestData.secondary_grouped_rows;
  const clarifications: ClarificationChoices = requestData.clarifications;
  const specific_questions: string[] = requestData.specific_questions;
  const mode: string = requestData.mode;
  const already_answered: string[] = requestData.already_answered;

  const primary_text_citation_pairs: text_citation_pair[] = convertGroupedRowsToTextCitationPairs(primaryGroupedRows);
  let secondary_text_citation_pairs: text_citation_pair[] = [];
  if(secondaryGroupedRows) {
    secondary_text_citation_pairs = convertGroupedRowsToTextCitationPairs(secondaryGroupedRows);
  }
  const all_text_citation_pairs: text_citation_pair[] = primary_text_citation_pairs.concat(secondary_text_citation_pairs);
  
  
  const all_questions: string[] = [];
  all_questions.push(legal_question);
  for (const question of specific_questions) {
    all_questions.push(question);
  }

  try {
    let direct_answer;

    if (mode === "separate") {
      const params = getPromptDirectAnsweringSeparate(all_questions, clarifications, all_text_citation_pairs, false);
      const result = JSON.parse(await createChatCompletion(params, openai, "directAnsweringSeparate"));
      
      direct_answer = result.all_instructions;
      
      
    } else {
      const instructions = await condenseClarificationsIntoInstructions(openai, legal_question, clarifications.clarifications, already_answered, "answering");
      console.log(instructions);
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

    return NextResponse.json(directAnsweringResponseBody);
    
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


