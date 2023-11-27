import { getPromptQueryScoring, getPromptExpandedQuery, getPromptAnsweringInstructions, getPromptQueryRefinement, getPromptCondenseClarifications, getPromptClarificationQuestion, getPromptClarificationQuestionMultiple, getPromptDirectAnswering, getPromptBasicQueryRefinement } from "./prompts";
import { createChatCompletion, getEmbedding } from "./chatCompletion";
import { Clarification, text_citation_pair, GroupedRows } from "./types";
import { OpenAI } from "openai";

// Query Scoring
export const calculateQuestionClarityScore = async (openai: OpenAI, user_prompt_query: string) => {
  const params = getPromptQueryScoring(user_prompt_query, true);
  const res = JSON.parse(await createChatCompletion(params, openai, "queryScoring"));

  const quality_score: number = res.quality_score;
  return quality_score;
};

// Query Expansion
export const generateQueryExpansion = async (openai: OpenAI, legal_questions: string[]) => {
  const params = getPromptExpandedQuery(legal_questions, true);
  const res = JSON.parse(await createChatCompletion(params, openai, "expandedQuery"));
  const legal_statements: string[] = res.legal_statements;
  return legal_statements;
};

export const generateEmbedding = async (openai: OpenAI, legal_statements: string[]) => {
  const embedded_expansion_query = await getEmbedding(legal_statements.join('\n'), openai);
  return embedded_expansion_query;
};

// Query Refinement

export const generateQueryRefinement = async (openai: OpenAI, original_question: string, clarifying_questions: string[], customer_clarifying_responses: string[]): Promise<[string[], string, string[]]> => {
  const params = getPromptQueryRefinement(original_question, clarifying_questions, customer_clarifying_responses, true);
  const res = JSON.parse(await createChatCompletion(params, openai, "queryRefinement"));
  const customer_messages: string[] = res.customer_messages;
  const refined_question: string = res.refined_question;
  const specific_questions: string[] = res.specific_questions;
  return [customer_messages, refined_question, specific_questions];
};
export const generateBasicQueryRefinement = async (openai: OpenAI, original_question: string) => {
  const params = getPromptBasicQueryRefinement(original_question, true);
  const res = JSON.parse(await createChatCompletion(params, openai, "basicQueryRefinement"));
  return res;
};

// Query Clarification

export const condenseClarificationsIntoInstructions = async (openai: OpenAI, user_prompt_query: string, previous_clarifications: Clarification[]): Promise<string> => {
  const params = getPromptCondenseClarifications(user_prompt_query, previous_clarifications, true);
  const response = JSON.parse(await createChatCompletion(params, openai, "condenseClarifications"));
  return response.instructions;
};
export const generateAnsweringInstructions = async (openai: OpenAI, user_prompt_query: string, customer_information: string, already_answered: string[]): Promise<string> => {
  const params = getPromptAnsweringInstructions(user_prompt_query, already_answered, customer_information, true);
  const response = JSON.parse(await createChatCompletion(params, openai, "condenseClarifications"));
  return response.instructions;
};
export const generateNewClarificationQuestion = async (openai: OpenAI, user_prompt_query: string, instructions: string): Promise<[Clarification, string]> => {
  const params_choices = getPromptClarificationQuestion(user_prompt_query, instructions, true);
  const response = JSON.parse(await createChatCompletion(params_choices, openai, "queryClarificationQuestion"));
  const new_question: string = response.new_clarification.question;
  const new_answers: string[] = response.new_clarification.multiple_choice_answers;
  const message_to_customer: string = response.new_clarification.message_to_customer;
  const refined_question: string = response.refined_question;
  const clarification: Clarification = {
    question: new_question,
    multiple_choice_answers: new_answers,
    response: ""
  };
  return [clarification, message_to_customer];
};
export const generateMultipleClarificationQuestions = async (openai: OpenAI, user_prompt_query: string): Promise<[Clarification[], string[]]> => {
  const params_choices = getPromptClarificationQuestionMultiple(user_prompt_query, true);
  const response = JSON.parse(await createChatCompletion(params_choices, openai, "queryClarificationMultiple"));
  const clarifications: Clarification[] = [];
  const message_to_customer: string[] = [];
  
  for (const clarification of response.new_clarifications) {
    const new_question: string = clarification.question;
    const new_answers: string[] = clarification.multiple_choice_answers;
    const message: string = clarification.message_to_customer;
    const temp: Clarification = {
      question: new_question,
      multiple_choice_answers: new_answers,
      response: ""
    };
    message_to_customer.push(message);
    clarifications.push(temp);
  }
  return [clarifications, message_to_customer];
};


export const generateDirectAnswer = async (openai: OpenAI, user_prompt_query: string, instructions: string, all_text_citation_pairs: text_citation_pair[]): Promise<string> => {
  const params = getPromptDirectAnswering(user_prompt_query, instructions, all_text_citation_pairs, false);
  const result = JSON.parse(await createChatCompletion(params, openai, "directAnswering"));
  const direct_answer: string = result.direct_answer;
  return direct_answer;
};

export const convertGroupedRowsToTextCitationPairs = (groupedRows: GroupedRows): text_citation_pair[] => {
  const all_text_citation_pairs: text_citation_pair[] = [];
  for (const key in groupedRows) {
    const pair: text_citation_pair = {
      section_citation: groupedRows[key].citation,
      text: groupedRows[key].section_text.join("\n"),
      document: groupedRows[key].jurisdiction.corpusTitle
    };
    all_text_citation_pairs.push(pair);
  }
  return all_text_citation_pairs;
};