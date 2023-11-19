import { getPromptQueryScoring, getPromptExpandedQuery, getPromptQueryRefinement } from "./prompts";
import { createChatCompletion, getEmbedding } from "./chatCompletion";
import { OpenAI } from "openai";

export const calculateQuestionClarityScore = async (openai: OpenAI, user_prompt_query: string) => {
    const params = getPromptQueryScoring(user_prompt_query, true);
    const res = JSON.parse(await createChatCompletion(params, openai, "queryScoring"));
  
    const quality_score: number = res.quality_score;
    return quality_score;
};


export const generateQueryExpansion = async (openai: OpenAI, legal_questions: string[]) => {
    const params = getPromptExpandedQuery(legal_questions, true);
    const res = JSON.parse(await createChatCompletion(params, openai, "expandedQuery"));
    const legal_statements: string[] = res.legal_statements;
    return legal_statements;
}
  
export const generateEmbedding = async (openai: OpenAI, legal_statements: string[]) => {
    const embedded_expansion_query = await getEmbedding(legal_statements.join('\n'), openai);
return embedded_expansion_query;
}


export const generateQueryRefinement = async (openai: OpenAI, original_question: string, clarifying_questions: string[], customer_clarifying_responses: string[]) => {
const params = getPromptQueryRefinement(original_question, clarifying_questions, customer_clarifying_responses, true);
const res = JSON.parse(await createChatCompletion(params, openai, "queryRefinement"));

return res;
}