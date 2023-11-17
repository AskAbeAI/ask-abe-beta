import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Message, ChatCompletionParams, node_as_row, TopicResponses, GroupedRows, PartialAnswer, ClarificationChoices, text_citation_pair } from '@/lib/types';
import { NextResponse } from 'next/server';
import { getPromptDirectAnswering, getPromptPartialAnswering, getPromptDirectAnsweringSeparate, getPromptCondenseClarifications } from '@/lib/prompts';
import { createChatCompletion } from '@/lib/chatCompletion';
import { dir } from 'console';


const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});
export const maxDuration = 120;

export async function POST(req: Request) {

  console.log("=====================================");
  console.log("=== directAnswering API ENDPOINT ===");
  console.log("=====================================");

  const requestData: any = await req.json();
  const legal_question = requestData.legal_question;
  const groupedRows: GroupedRows = requestData.legal_texts;
  const clarifications: ClarificationChoices = requestData.clarifications;
  const specific_questions: string[] = requestData.specific_questions;
  const mode: string = requestData.mode;
  const already_answered: string[] = requestData.already_answered;

  const all_text_citation_pairs: text_citation_pair[] = [];
  for (const key in groupedRows) {
    const pair: text_citation_pair = {
      section_citation: groupedRows[key].citation,
      text: groupedRows[key].section_text.join("\n")
    };
    all_text_citation_pairs.push(pair);
  }
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
      console.log(direct_answer);
    } else {
      const params_condensed = getPromptCondenseClarifications(legal_question, clarifications.clarifications, already_answered, "answering", true);
      const response_condensed = JSON.parse(await createChatCompletion(params_condensed, openai, "condenseClarifications"));
      console.log(response_condensed.instructions);
      const params = getPromptDirectAnswering(legal_question, response_condensed.instructions, all_text_citation_pairs, false);
      const result = JSON.parse(await createChatCompletion(params, openai, "directAnswering"));
      direct_answer = result.direct_answer;
      console.log(direct_answer);
    }

    const directAnsweringResponseBody = {
      directAnswer: direct_answer,
      statusMessage: 'Successfully generated partial answers!'
    };

    console.log("  - Exiting directAnswering API endpoint");
    return NextResponse.json(directAnsweringResponseBody);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ errorMessage: `An error occurred in directAnswering: ${error}` });
  }
}


