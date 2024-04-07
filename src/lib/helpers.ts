import * as prompts from './prompts';
import { createChatCompletion, getEmbedding, createChatCompletionNew } from "./chatCompletion";
import { Clarification, text_citation_pair, text_citation_document_trio, APIParameters, APIParametersParams, PipelineModel, PhaseReport, PhaseType, Node, AnswerChunk} from "./types";
import { OpenAI } from "openai";
import { BaseRequest } from './api_types';

// Query Scoring
export const scoreQuestionHelper = async (base: BaseRequest, openai: OpenAI, user_question: string) => {
  const [messages, ragTokens] = prompts.scoreQuestion(user_question);

  const params = new APIParameters({
    vendor: base.vendor,
    model: base.model,
    messages: messages, // Assuming new_messages is an array of Message objects
    temperature: 0.4, // Temperature
    rag_tokens: ragTokens,
    stream: false, // Stream
    calling_function:"scoreQuestionHelper" // Calling function
  });
  
  // Create the chat completion
  const [response, api_usage] = await createChatCompletionNew(params, false, openai);
  // Insert the API Usage
  api_usage.session_id = base.pipelineModel.session_id;
  api_usage.insert()
  // Generate the Phase Report
  generateLlmReport(base, "score_question_helper", api_usage.error_message || undefined)
  
  // Get the structured data from the raw response
  const quality_score: number = JSON.parse(response!).quality_score;
  return quality_score;
};

// Query Expansion
export const expandQueryHelper = async (base: BaseRequest, openai: OpenAI, legal_questions: string[]) => {
  const [messages, ragTokens] = prompts.expandQuery(legal_questions); // Ensure expand_query is implemented

  const params = new APIParameters({
    vendor: base.vendor,
    model: base.model,
    messages: messages, // Assuming new_messages is an array of Message objects
    temperature: 0.4, // Temperature
    rag_tokens: ragTokens,
    stream: false, // Stream
    calling_function:"expandQueryHelper" // Calling function
  });
  // Create the chat completion
  const [response, api_usage] = await createChatCompletionNew(params, false, openai);
  if (response === undefined) {
    throw new Error("Undefined completion response!")
  }
  
  api_usage.session_id = base.pipelineModel.session_id;
  api_usage.insert()

  generateLlmReport(base, api_usage.response_id)
  
  // Parse the response to JSON and extract the legal questions.
  const legal_statements: string[] = JSON.parse(response).legal_statements!

  
  return legal_statements;
}

export const generateQueryExpansionVitalia = async (openai: OpenAI, questions: string[]) => {
  const params = prompts.getPromptExpandedQueryVitalia(questions, true);
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
  const params = prompts.getPromptQueryRefinement(original_question, clarifying_questions, customer_clarifying_responses, true);
  const res = JSON.parse(await createChatCompletion(params, openai, "queryRefinement"));
  const customer_messages: string[] = res.customer_messages;
  const refined_question: string = res.refined_question;
  const specific_questions: string[] = res.specific_questions;
  console.log(refined_question)
  return [customer_messages, refined_question, specific_questions];
};
export const generateBasicQueryRefinement = async (openai: OpenAI, original_question: string) => {
  const params = prompts.getPromptBasicQueryRefinement(original_question, true);
  const res = JSON.parse(await createChatCompletion(params, openai, "basicQueryRefinement"));
  return res;
};
 
// Query Clarification
export const generateFollowupQuestion = async (openai: OpenAI, question_string: string, already_answered: string[]): Promise<string> => {
  const params = prompts.getPromptFollowupQuestion(question_string, already_answered, true);
  const response = JSON.parse(await createChatCompletion(params, openai, "followupQuestion"));
  console.log(response.followup_question)
  return response.followup_question;
};
export const condenseClarificationsIntoInstructions = async (base: BaseRequest, openai: OpenAI, refinedQuestion: string, previousClarifications: Clarification[]): Promise<string> => {
  const [messages, ragTokens] = prompts.condenseClarifications(refinedQuestion, previousClarifications); // Ensure expand_query is implemented

  const params = new APIParameters({
    vendor: base.vendor,
    model: base.model,
    messages: messages, // Assuming new_messages is an array of Message objects
    temperature: 0.4, // Temperature
    rag_tokens: ragTokens,
    stream: false, // Stream
    calling_function:"condenseClarificationsIntoInstructions" // Calling function
  });
  const [response, api_usage] = await createChatCompletionNew(params, false, openai);
  if (response === undefined) {
    throw new Error("Undefined completion response!")
  }
  
  api_usage.session_id = base.pipelineModel.session_id;
  api_usage.insert()

  generateLlmReport(base, api_usage.response_id);
  const instructions: string = JSON.parse(response).instructions;
  return instructions;
};
export const answeringInstructionsHelper = async (base: BaseRequest, openai: OpenAI, refinedQuestion: string, customerInformation: string, alreadyAnswered: string[]): Promise<string> => {
  const [messages, ragTokens] = prompts.answeringInstructions(refinedQuestion, alreadyAnswered, customerInformation);
  const params = new APIParameters({
    vendor: base.vendor,
    model: base.model,
    messages: messages, // Assuming new_messages is an array of Message objects
    temperature: 0.4, // Temperature
    rag_tokens: ragTokens,
    stream: false, // Stream
    calling_function:"answeringInstructionsHelper", // Calling function
    response_format:{ type: "json_object" }
    
  });
  const [response, api_usage] = await createChatCompletionNew(params, false, openai);
  console.log(response)
  if (response === undefined) {
    throw new Error("Undefined completion response!")
  }
  
  api_usage.session_id = base.pipelineModel.session_id;
  api_usage.insert()
  const answeringInstructions: string = JSON.parse(response).instructions;
  return answeringInstructions;
};
export const generateNewClarificationQuestion = async (openai: OpenAI, user_prompt_query: string, instructions: string): Promise<[Clarification, string]> => {
  const params_choices = prompts.getPromptClarificationQuestion(user_prompt_query, instructions, true);
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
  const params_choices = prompts.getPromptClarificationQuestionMultiple(user_prompt_query, true);
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


export const directAnswerHelper = async (base: BaseRequest, openai: OpenAI, refinedQuestion: string, instructions: string, all_text_citation_pairs: text_citation_document_trio[]): Promise<string> => {
  const [messages, ragTokens] = prompts.directAnswering(refinedQuestion, instructions, all_text_citation_pairs);

  const params = new APIParameters({
    vendor: base.vendor,
    model: base.model,
    messages: messages, // Assuming new_messages is an array of Message objects
    temperature: 0.4, // Temperature
    rag_tokens: ragTokens,
    stream: false, // Stream
    calling_function:"directAnswerHelper", // Calling function
    response_format:{ type: "json_object" }
  });
  const [response, api_usage] = await createChatCompletionNew(params, false, openai);
  console.log(response)
  if (response === undefined) {
    throw new Error("Undefined completion response!")
  }
  
  api_usage.session_id = base.pipelineModel.session_id;
  api_usage.insert()

  const directAnswer: string = JSON.parse(response).directAnswer;
  return directAnswer;
};

export const answerNewQuestionHelper = async (base: BaseRequest, openai: OpenAI, refinedQuestion: string, instructions: string, rows: Node[]): Promise<[AnswerChunk]> => {
  let sectionList: string[] = [];
  for(let i = 0; i < rows.length; i++) {
    let current = rows[i]!
    sectionList.push(current.nodeText!.displayTreeAsJson(current.number!, current.nodeName!))
  }

  const [messages, ragTokens] = prompts.answerNewQuestion(refinedQuestion, instructions, sectionList);

  const params = new APIParameters({
    vendor: base.vendor,
    model: base.model,
    messages: messages, // Assuming new_messages is an array of Message objects
    temperature: 0.4, // Temperature
    rag_tokens: ragTokens,
    stream: false, // Stream
    calling_function:"answerNewQuestionHelper", // Calling function
    response_format:{ type: "json_object" }
  });
  const [response, api_usage] = await createChatCompletionNew(params, false, openai);
  console.log(response)
  if (response === undefined) {
    throw new Error("Undefined completion response!")
  }
  
  api_usage.session_id = base.pipelineModel.session_id;
  api_usage.insert()

  const directAnswer: [AnswerChunk] = JSON.parse(response).answer;

  return directAnswer;
};


export const generateDirectAnswerSimple = async (openai: OpenAI, user_prompt_query: string, instructions: string, all_text_citation_pairs: text_citation_pair[]): Promise<string> => {
  const params = prompts.getPromptDirectAnsweringSimple(user_prompt_query, instructions, all_text_citation_pairs, false);
  const result = JSON.parse(await createChatCompletion(params, openai, "directAnswering"));
  const direct_answer: string = result.direct_answer;
  return direct_answer;
};

export const generateDirectAnswerVitalia = async (openai: OpenAI, user_prompt_query: string,already_asked_questions: string[], all_text_citation_pairs: text_citation_pair[]): Promise<string> => {
  const params = prompts.getPromptDirectAnsweringVitalia(user_prompt_query, already_asked_questions, all_text_citation_pairs, false);
  const result = JSON.parse(await createChatCompletion(params, openai, "directAnsweringVitalia"));
  const direct_answer: string = result.direct_answer;
  return direct_answer;
};

export function generateLlmReport(
  base: BaseRequest,
  apiUsageId: string,
  errorMessage?: string
): void {
  let phaseReport = new PhaseReport({
    phase_type: PhaseType.LLM_CALL,
    timestamp: new Date(),
    description: `LLM Call for vendor: ${base.vendor}, model: ${base.model}.`,
    ts_function: base.callingFunction,
    api_usage_id: apiUsageId,
    
  });
  if (errorMessage !== undefined) {
    phaseReport.error_message = errorMessage;
    phaseReport.error_code = 400;
  }
  base.pipelineModel.history.push(phaseReport)
  return
}

