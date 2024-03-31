import { getPromptQueryScoring, getPromptAnsweringInstructions, getPromptQueryRefinement, getPromptCondenseClarifications, getPromptClarificationQuestion, getPromptClarificationQuestionMultiple, getPromptDirectAnswering, getPromptBasicQueryRefinement, getPromptFollowupQuestion, getPromptDirectAnsweringVitalia, getPromptExpandedQueryVitalia, getPromptDirectAnsweringSimple, expand_query } from "./prompts";
import { createChatCompletion, getEmbedding, create_chat_completion } from "./chatCompletion";
import { Clarification, text_citation_pair, text_citation_document_trio, APIParameters} from "./types";
import { OpenAI } from "openai";

// Query Scoring
export const calculateQuestionClarityScore = async (openai: OpenAI, user_prompt_query: string) => {
  const params = getPromptQueryScoring(user_prompt_query, true);
  const res = JSON.parse(await createChatCompletion(params, openai, "queryScoring"));

  const quality_score: number = res.quality_score;
  return quality_score;
};

// Query Expansion
export const generateQueryExpansion = async (vendor: string, model: string, openai: OpenAI, legal_questions: string[], session_id: string) => {
  const [messages, rag_tokens] = expand_query(legal_questions); // Ensure expand_query is implemented
  const params = new APIParameters(
    vendor,
    model,
    messages, // Assuming new_messages is an array of Message objects
    0.4, // Temperature
    undefined, // top_p is optional, so we can skip it or set it as undefined explicitly
    0, // Frequency penalty
    rag_tokens,
    undefined, // Max tokens
    false, // Stream
    undefined, // Response format
    0, // Presence penalty
    undefined, // Response model
    1, // Max retries
    undefined, // Stop sequences
    "generateQueryExpansion" // Calling function
  );
  // Create the chat completion
  const [response, api_usage] = await create_chat_completion(params, false, openai);
  api_usage.sessionId = session_id;
  api_usage.insert()
  // Parse the response to JSON and extract the legal questions.
  const legal_statements: string[] = JSON.parse(response!).legal_questions!
  
  return legal_statements;
}

export const generateQueryExpansionVitalia = async (openai: OpenAI, questions: string[]) => {
  const params = getPromptExpandedQueryVitalia(questions, true);
  const res = JSON.parse(await createChatCompletion(params, openai, "expandedQueryVitalia"));
  const tourism_statements: string[] = res.tourism_statements;
  return tourism_statements;
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
  console.log(refined_question)
  return [customer_messages, refined_question, specific_questions];
};
export const generateBasicQueryRefinement = async (openai: OpenAI, original_question: string) => {
  const params = getPromptBasicQueryRefinement(original_question, true);
  const res = JSON.parse(await createChatCompletion(params, openai, "basicQueryRefinement"));
  return res;
};
 
// Query Clarification
export const generateFollowupQuestion = async (openai: OpenAI, question_string: string, already_answered: string[]): Promise<string> => {
  const params = getPromptFollowupQuestion(question_string, already_answered, true);
  const response = JSON.parse(await createChatCompletion(params, openai, "followupQuestion"));
  console.log(response.followup_question)
  return response.followup_question;
};
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


export const generateDirectAnswer = async (openai: OpenAI, user_prompt_query: string, instructions: string, all_text_citation_pairs: text_citation_document_trio[]): Promise<string> => {
  const params = getPromptDirectAnswering(user_prompt_query, instructions, all_text_citation_pairs, false);
  const result = JSON.parse(await createChatCompletion(params, openai, "directAnswering"));
  const direct_answer: string = result.direct_answer;
  return direct_answer;
};

export const generateDirectAnswerSimple = async (openai: OpenAI, user_prompt_query: string, instructions: string, all_text_citation_pairs: text_citation_pair[]): Promise<string> => {
  const params = getPromptDirectAnsweringSimple(user_prompt_query, instructions, all_text_citation_pairs, false);
  const result = JSON.parse(await createChatCompletion(params, openai, "directAnswering"));
  const direct_answer: string = result.direct_answer;
  return direct_answer;
};

export const generateDirectAnswerVitalia = async (openai: OpenAI, user_prompt_query: string,already_asked_questions: string[], all_text_citation_pairs: text_citation_pair[]): Promise<string> => {
  const params = getPromptDirectAnsweringVitalia(user_prompt_query, already_asked_questions, all_text_citation_pairs, false);
  const result = JSON.parse(await createChatCompletion(params, openai, "directAnsweringVitalia"));
  const direct_answer: string = result.direct_answer;
  return direct_answer;
};
