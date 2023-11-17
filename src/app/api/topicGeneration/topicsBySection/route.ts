import OpenAI from "openai";
import { createChatCompletion, createChatCompletionParallel } from "@/lib/chatCompletion";
import { NextResponse } from 'next/server';
import { getPromptFirstTopics, getPromptTopicCombination } from "@/lib/prompts";
import { node_as_row, text_citation_pair, TopicResponses, GroupedRows, GeneralTopic, SubTopic } from "@/lib/types";
import { mapJurisdictionFullname, getSectionTextFromRow } from "@/lib/utils";



const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

export const maxDuration = 120;
const BATCH_SIZE = 10;
export async function POST(req: Request) {

  console.log("=====================================");
  console.log("==== topicsBySection API ENDPOINT ====");
  console.log("=====================================");

  if (openAiKey === undefined) { throw new Error("process.env.OPENAI_API_KEY is undefined!"); }

  const requestData = await req.json();

  const legal_question: string = requestData.legal_question;
  const state_jurisdiction: string = requestData.state_jurisdiction;
  const federal_jurisdiction: string = requestData.federal_jurisdiction;
  const state_rows: GroupedRows = requestData.state_rows;
  const general_topics: string[] = requestData.general_topics;
  const row_limit: number = requestData.row_limit;

  const federal_rows: node_as_row[] = requestData.federal_rows;
  try {
    // ... existing code ...


    let index = 1;
    const allResponses: any = [];
    let batchPromises: Promise<any>[] = [];
    for (const parentNode in state_rows) {
      const rows = state_rows[parentNode].rows;
      // ... existing logic to determine rows_with_similarity_score ...
      // Get the last row's citation
      const lastRow = rows[rows.length - 1];
      const lastRowCitation = lastRow.citation.replace("Addendum", "");
      let rows_with_similarity_score = rows.filter((row) => row.similarity > 0);
      // Sort rows by similarity. First row should be highest similarity:
      rows_with_similarity_score.sort((a, b) => b.similarity - a.similarity);
      if (rows_with_similarity_score.length === 0) {
        rows_with_similarity_score = [rows[0]];
      }
      for (const row of rows_with_similarity_score) {
        console.log(row.citation);
        console.log(row.node_text);
        const params = getPromptFirstTopics(legal_question, general_topics, mapJurisdictionFullname(state_jurisdiction), `{section_citation: ${row.citation}, legal_text: ${row.node_text}}`);
        //console.log(`  - Generating topics for row ${index}`);
        index++;
        batchPromises.push(createChatCompletionParallel(params, openai));

        if (batchPromises.length === BATCH_SIZE) {
          const batchResults = await processBatchWithTimeout(batchPromises) as PromiseSettledResult<any>[];
          allResponses.push(...batchResults);
          batchPromises = [];
        }

      }
    }
    if (batchPromises.length > 0) {
      const batchResults = await processBatchWithTimeout(batchPromises) as PromiseSettledResult<any>[];
      allResponses.push(...batchResults);
    }


    // Wait for all completions
    const allTopicResponses: TopicResponses[] = [];

    for (const result of allResponses) {
      if (result.status === 'fulfilled') {
        try {
          const topic: TopicResponses = JSON.parse(result.value.choices[0].message['content']);
          console.log(topic);
          allTopicResponses.push(topic);
        } catch (error) {
          console.error('Error parsing topic response:', error);
        }
      } else {
        console.error('Promise rejected:', result.reason);
      }
    }

    console.log("Finished awaiting all completions in Promse.all!");

    const combinedResponse: TopicResponses = combineTopicResponses(allTopicResponses, general_topics);
    console.log(`Combined response:\n ${combinedResponse.general_topics}`);


    const topicGenerationResponseBody = {
      combinedResponse: combinedResponse,
      statusMessage: 'Successfully generated many sub_topics for general_topics!'
    };

    return NextResponse.json(topicGenerationResponseBody);
  } catch (error) {
    console.error(`An error occurred in topicGeneration: ${error}`);
    return NextResponse.json({ errorMessage: `An error occurred in topicGeneration: ${error}` });
  }
}



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


function combineTopicResponses(topicResponsesArray: TopicResponses[], validGeneralTopics: string[]): TopicResponses {
  const combinedResponse: TopicResponses = {
    general_topics: validGeneralTopics.map(topic => ({
      general_topic: topic,
      sub_topics: []
    }))
  };

  for (const topicResponses of topicResponsesArray) {
    topicResponses.general_topics.forEach(topic => {
      const combinedTopic = combinedResponse.general_topics.find(ct => ct.general_topic === topic.general_topic);

      if (combinedTopic) {
        topic.sub_topics.forEach(subTopic => {
          const existingSubTopic = combinedTopic.sub_topics.find(st => st.sub_topic === subTopic.sub_topic);

          if (!existingSubTopic) {
            combinedTopic.sub_topics.push(subTopic);
          } else {
            existingSubTopic.section_citations = Array.from(new Set([...existingSubTopic.section_citations, ...subTopic.section_citations]));
          }
        });
      }
    });
  }

  return combinedResponse;
}


const TIMEOUT = 60000; // Timeout in milliseconds

async function processBatchWithTimeout(batchPromises: Promise<any>[]) {
  const timeoutPromise = new Promise(resolve =>
    setTimeout(() => resolve('timeout'), TIMEOUT)
  );

  try {
    const results = await Promise.race([Promise.allSettled(batchPromises), timeoutPromise]);
    if (results === 'timeout') {
      throw new Error('Batch processing timeout');
    }
    return results as PromiseSettledResult<any>[];
  } catch (error) {
    console.error('Batch processing error:', error);
    console.log('Batch contents for debugging:', batchPromises);
    return await Promise.allSettled(batchPromises) as PromiseSettledResult<any>[];
  }
}

