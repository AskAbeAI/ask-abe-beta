import { Message, ChatCompletionParams } from '../lib/types';
import openAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { insert_completion_cost } from './database';

export function convertToMessages(system: string, user: string): Message[] {
  return [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ];
}

export function getChatCompletionParams(model: string, messages: Message[], temperature?: number, max_tokens?: number, top_p?: number,
  stream?: boolean, frequency_penalty?: number, presence_penalty?: number): ChatCompletionParams {
  const params: ChatCompletionParams = {
    model: model,
    messages: messages,
    temperature: temperature || 1,
    top_p: top_p || 1,
    frequency_penalty: frequency_penalty || 0,
    presence_penalty: presence_penalty || 0,
    stream: stream || false,
  };
  if (max_tokens) {
    params.max_tokens = max_tokens;
  }
  return params;
}

export async function createChatCompletion(params: ChatCompletionParams, openai: openAI, phase: string): Promise<any> {
  // Extract specific parameters from ChatCompletionParams into separate variables
  const { model, messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty, stream } = params;
  let completion;
  if (model === "gpt-4-1106-preview") {
    completion = await openai.chat.completions.create({ model, messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty, response_format: { "type": "json_object" } });
  } else {
    completion = await openai.chat.completions.create({ model, messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty });
  }

  if (!completion) {
    throw new Error(`OpenAI API call failed with status: ${completion}`);
  }
  const prompt_tokens = completion.usage?.prompt_tokens || 0;
  const completion_tokens = completion.usage?.completion_tokens || 0;
  let cost = 0;
  if (prompt_tokens === 0 || completion_tokens === 0) {
    console.log(`WARNING: prompt_tokens or completion_tokens is 0!`);
  } else {
    cost = calculateChatCompletionCost(model, prompt_tokens, completion_tokens);
  }
  insert_completion_cost(phase, prompt_tokens, completion_tokens, cost, model, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
  console.log(`Prompt Tokens: ${prompt_tokens}, Completion Tokens: ${completion_tokens}\nCost of calling ${model} chat completion: $${cost}`);
  return completion.choices[0].message['content'];
}



export function createChatCompletionParallel(params: ChatCompletionParams, openai: openAI): Promise<any> {
  // Extract specific parameters from ChatCompletionParams into separate variables
  const { model, messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty } = params;

  // Return the promise directly without awaiting here
  //console.log("Returning promise directly without awaiting here");
  return openai.chat.completions.create({ model, messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty, response_format: { "type": "json_object" } });
}


// export async function createChatCompletionStream(params: ChatCompletionParams, openai: openAI): Promise<any> {
//   const { model, messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty, stream } = params;

//   const completion = await openai.chat.completions.create({ model, messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty, stream: true });
//   if (!completion) {
//     throw new Error(`OpenAI API call failed with status: ${completion}`);
//   }
//   const streamResponse = OpenAIStream(completion);
//   return streamResponse;
// }

export async function getEmbedding(text: string, openai: openAI) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  return embedding.data[0].embedding;
}

export function calculateChatCompletionCost(model: string, prompt_tokens: number, completion_tokens: number): number {
  let prompt_rate = 0;
  let completion_rate = 0;
  if (model === "gpt-4") {
    prompt_rate = 0.03;
    completion_rate = 0.06;
  } else if (model === "gpt-3.5-turbo") {
    prompt_rate = 0.0015;
    completion_rate = 0.002;
  } else if (model === "gpt-3.5-turbo-16k") {
    prompt_rate = 0.003;
    completion_rate = 0.004;
  } else if (model === "gpt-4-32k") {
    prompt_rate = 0.06;
    completion_rate = 0.12;
  } else if (model === "gpt-4-1106-preview") {
    prompt_rate = 0.01;
    completion_rate = 0.03;
  } else {
    prompt_rate = 0;
    completion_rate = 0;
  }
  return ((prompt_tokens * prompt_rate) / 1000) + ((completion_tokens * completion_rate) / 1000);

}

