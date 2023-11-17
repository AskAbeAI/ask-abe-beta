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

export async function POST(req: Request) {

  console.log("=======================================");
  console.log("==== topicCombination API ENDPOINT ====");
  console.log("=======================================");

  if (openAiKey === undefined) { throw new Error("process.env.OPENAI_API_KEY is undefined!"); }

  const requestData = await req.json();

  const main_question: string = requestData.main_question;
  const state_jurisdiction: string = requestData.state_jurisdiction;
  const federal_jurisdiction: string = requestData.federal_jurisdiction;
  const combinedResponse: TopicResponses = requestData.combinedResponse;
  const legal_question = `In ${state_jurisdiction}, ${federal_jurisdiction}: ${main_question}`;
  try {
    // Process the results in completions
    const params = getPromptTopicCombination(legal_question, combinedResponse);
    console.log(params);
    const final_topics: TopicResponses = JSON.parse(await createChatCompletion(params, openai, "topicCombination"));
    console.log("Here!");
    console.log(final_topics);


    const topicCombinationResponseBody = {
      final_topics: final_topics,
      statusMessage: 'Successfully generated first major_topic and sub_topics!'
    };

    return NextResponse.json(topicCombinationResponseBody);
  } catch (error) {
    console.error(`An error occurred in topicCombination: ${error}`);
    return NextResponse.json({ errorMessage: `An error occurred in topicCombination: ${error}` });
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


