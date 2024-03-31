import { Message, ChatCompletionParams, APIUsage, APIParameters } from '../lib/types';
import openAI from 'openai';
import ChatCompletionMessageParam from 'openai';

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
  try {
    await insert_completion_cost(phase, prompt_tokens, completion_tokens, cost, model, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
  } catch (error) {
    console.error("Error inserting completion cost into database!" + error);
  }
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





function create_chat_completion_instructor(params: APIParameters): [string, APIUsage] {
  // Placeholder implementation
  return ["", {} as APIUsage];
}

function create_chat_completion_anthropic(params: APIParameters): [string, APIUsage] {
  // Placeholder implementation
  return ["", {} as APIUsage];
}

export async function create_chat_completion(params: APIParameters, insert_usage: boolean = true, vendor_client: openAI): Promise<[string | null, APIUsage]> {
  let response_tuple: [string | null, APIUsage];

  const vendorLower = params.vendor.toLowerCase();
  if (vendorLower === 'openai') {
    response_tuple = await create_chat_completion_openai(params, vendor_client);
  } else if (vendorLower.includes('instructor/')) {
    response_tuple = create_chat_completion_instructor(params);
  } else if (vendorLower === 'anthropic') {
    response_tuple = create_chat_completion_anthropic(params);
  } else {
    throw new Error("Unsupported vendor");
  }
  
  if (insert_usage) {
    response_tuple[1].insert();
  }

  return response_tuple;
}

async function create_chat_completion_openai(params: APIParameters, openai_client: openAI): Promise<[string | null, APIUsage]> {
  const start = new Date(); // Capture start time
  let content: string | null = null;
  let input_tokens: number | null = null;
  let output_tokens: number | null = null;
  let total_tokens: number | null = null;
  let response_id: string | null = null;
  let status = 200; // Default to success
  let error_message: string | null = null;
  let duration: number | null = null;
  
  try {
    const completion: any = await openai_client.chat.completions.create({
      model: params.model,
      messages: params.messages,
      temperature: params.temperature,
      top_p: params.top_p,
      frequency_penalty: params.frequency_penalty,
      presence_penalty: params.presence_penalty,
      stream: params.stream,
      // Additional properties as required
    });

    if (!completion || !completion.choices || completion.choices.length === 0) {
      throw new Error(`OpenAI API call failed or returned no choices.`);
    }

    content = completion.choices[0].message.content;
    response_id = completion.id;
    // Assume usage data is correctly populated in the completion object
    input_tokens = completion.usage?.prompt_tokens || null;
    output_tokens = completion.usage?.completion_tokens || null;
    total_tokens = completion.usage?.total_tokens || null;
    duration = new Date().getTime() - start.getTime();

  } catch (error) {
    console.error("Error calling OpenAI:", error);
    status = 400; // Indicate failure
    error_message = error instanceof Error ? error.message : 'Unknown error';
    // Generate a unique response_id for error tracking (using Date.now() as an example)
    response_id = `ERROR-${Date.now()}`;
  }

  
  // Create APIUsage instance
  const usage = new APIUsage(
    response_id!,
    params.calling_function!, // Assuming callingFunction is known/static in this context
    params.vendor,
    params.model,
    status,
    null, // sessionId would be set according to your application logic
    input_tokens,
    null, // Assuming rag_tokens needs to be calculated or provided differently
    output_tokens,
    total_tokens,
    null, // inputCost needs to be calculated or provided differently
    null, // ragCost needs to be calculated or provided differently
    null, // outputCost needs to be calculated or provided differently
    null, // totalCost needs to be calculated or provided differently
    error_message,
    duration,
    null, // apiKeyName would be set according to your application logic
    new Date() // timestamp
  );

  return [content, usage];
}