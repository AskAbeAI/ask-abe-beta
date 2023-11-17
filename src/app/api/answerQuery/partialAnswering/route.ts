import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Message, ChatCompletionParams, node_as_row, TopicResponses, GroupedRows, PartialAnswer } from '@/lib/types';
import { NextResponse } from 'next/server';
import { getPromptPartialAnswering } from '@/lib/prompts';
import { createChatCompletionParallel } from '@/lib/chatCompletion';


const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});
export const maxDuration = 120;

export async function POST(req: Request) {

  console.log("=====================================");
  console.log("=== partialAnswering API ENDPOINT ===");
  console.log("=====================================");

  const requestData: any = await req.json();
  const topics: TopicResponses = requestData.topics;
  const legal_question = requestData.legal_question;
  const rows: GroupedRows = requestData.groupedRows;


  // export interface SubTopic {
  //   sub_topic: string;
  //   section_citations: string[];
  // }

  // export interface GeneralTopic {
  //   general_topic: string;
  //   sub_topics: SubTopic[];
  // }

  // export interface TopicResponses {
  //   general_topics: GeneralTopic[];
  // }
  const BATCH_SIZE = 10;
  try {
    const allResponses: any = [];
    let batchPromises: Promise<any>[] = [];

    for (const general_topic of topics.general_topics) {
      for (const sub_topic of general_topic.sub_topics) {
        const section_set = new Set<string>();
        for (const section_citation of sub_topic.section_citations) {
          console.log(section_citation);
          // Find parent_citation by removing all text after the first (
          const parent_citation: string = section_citation.split('(')[0].trim();
          if (!section_set.has(parent_citation)) {
            section_set.add(parent_citation);
          }
        }
        const result = findSectionsByCitation(rows, section_set);
        if (result === undefined) {
          console.log(`WARNING: result for section_citations ${section_set} is undefined!`);
        } else {
          const row_texts = result[0];
          const section_citations = result[1];

          const params = getPromptPartialAnswering(legal_question, general_topic.general_topic, sub_topic.sub_topic, section_citations, row_texts);
          batchPromises.push(createChatCompletionParallel(params, openai));

          if (batchPromises.length === BATCH_SIZE) {
            console.log(`  - Settling batch of ${BATCH_SIZE} completions...`);
            const batchResults = await processBatch(batchPromises);
            allResponses.push(...batchResults);
            batchPromises = []; // Reset for next batch
          }
        }
      }
    }
    if (batchPromises.length > 0) {
      const batchResults = await processBatch(batchPromises);
      allResponses.push(...batchResults);
    }

    const allPartialAnswers: PartialAnswer[] = [];
    for (const result of allResponses) {
      if (result.status === 'fulfilled') {
        try {
          const answer: PartialAnswer = JSON.parse(result.value.choices[0].message['content']);
          //console.log(answer);
          allPartialAnswers.push(answer);
        } catch (error) {
          console.error('Error parsing partial answer response:', error);
        }
      } else {
        console.error('Promise rejected:', result.reason);
      }
    }
    console.log(allPartialAnswers);

    const partialAnsweringResponseBody = {
      partialAnswers: allPartialAnswers,
      statusMessage: 'Successfully generated partial answers!'
    };

    console.log("  - Exiting partialAnswering API endpoint");
    return NextResponse.json(partialAnsweringResponseBody);
  } catch (error) {
    return NextResponse.json({ errorMessage: `An error occurred in partialAnswering: ${error}` });
  }
}


function findSectionsByCitation(groupedRows: GroupedRows, section_citations: Set<string>): [string[], string[]] {

  const allTexts: string[] = [];
  const allCitations: string[] = [];

  for (const parent in groupedRows) {
    const rows = groupedRows[parent].rows;

    const last_citation: string = (rows[rows.length - 1].citation).replace("Addendum", "");
    if (section_citations.has(last_citation)) {
      const [newTexts, newCitations] = extractSectionsTexts(rows);
      allTexts.push(...newTexts);
      allCitations.push(...newCitations);
    }
  }
  return [allTexts, allCitations];
}

function extractSectionsTexts(rows: node_as_row[]): [string[], string[]] {
  const texts: string[] = [];
  const citations: string[] = [];
  for (const row of rows) {
    texts.push(row.node_text);
    citations.push(row.citation);
  }
  return [texts, citations];
}


async function processBatch(batch: Promise<any>[]) {
  return await Promise.allSettled(batch);
}