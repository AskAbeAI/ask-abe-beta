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
  const promptTokens = completion.usage?.prompt_tokens || 0;
  const completionTokens = completion.usage?.completion_tokens || 0;
  let cost = 0; 
  if (promptTokens === 0 || completionTokens === 0) {
    console.log(`WARNING: promptTokens or completionTokens is 0!`);
  } else {
    cost = calculateChatCompletionCost(model, promptTokens, completionTokens);
  }
  try {
    await insert_completion_cost(phase, promptTokens, completionTokens, cost, model, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
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

export function calculateChatCompletionCost(model: string, promptTokens: number, completionTokens: number): number {
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
  return ((promptTokens * prompt_rate) / 1000) + ((completionTokens * completion_rate) / 1000);

}





function createChatCompletionInstructor(params: APIParameters): [string | undefined, APIUsage] {
  // Placeholder implementation
  return ["", {} as APIUsage];
}

function createChatCompletionAnthropic(params: APIParameters): [string | undefined, APIUsage] {
  // Placeholder implementation
  return ["", {} as APIUsage];
}

export async function createChatCompletionNew(params: APIParameters, insertUsage: boolean = true, vendorClient: openAI): Promise<[string | undefined, APIUsage]> {
  let responseTuple: [string | undefined, APIUsage];

  const vendorLower = params.vendor.toLowerCase();
  if (vendorLower === 'openai') {
    responseTuple = await createChatCompletionOpenai(params, vendorClient);
  } else if (vendorLower.includes('instructor/')) {
    responseTuple = createChatCompletionInstructor(params);
  } else if (vendorLower === 'anthropic') {
    responseTuple = createChatCompletionAnthropic(params);
  } else {
    throw new Error("Unsupported vendor");
  }
  
  if (insertUsage) {
    responseTuple[1].insert();
  }

  return responseTuple;
}

async function createChatCompletionOpenai(params: APIParameters, openaiClient: openAI): Promise<[string | undefined, APIUsage]> {
  const start = new Date(); // Capture start time
  let content: string | undefined = undefined;
  let inputTokens: number | undefined = undefined;
  let outputTokens: number | undefined = undefined;
  let totalTokens: number | undefined = undefined;
  let responseId: string | undefined = undefined;
  let status = 200; // Default to success
  let errorMessage: string | undefined = undefined;
  let duration: number | undefined = undefined;
  
  try {
    
    const completion: any = await openaiClient.chat.completions.create({
      model: params.model,
      messages: params.messages,
      temperature: params.temperature,
      top_p: params.top_p,
      frequency_penalty: params.frequency_penalty,
      presence_penalty: params.presence_penalty,
      stream: params.stream,
      response_format: params.response_format
      // Additional properties as required
    });

    if (!completion || !completion.choices || completion.choices.length === 0) {
      throw new Error(`OpenAI API call failed or returned no choices.`);
    }

    content = completion.choices[0].message.content;
    responseId = completion.id;
    // Assume usage data is correctly populated in the completion object
    inputTokens = completion.usage?.promptTokens || null;
    outputTokens = completion.usage?.completionTokens || null;
    totalTokens = completion.usage?.totalTokens || null;
    duration = new Date().getTime() - start.getTime();

  } catch (error) {
    console.error("Error calling OpenAI:", error);
    status = 400; // Indicate failure
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Generate a unique response_id for error tracking (using Date.now() as an example)
    responseId = `ERROR-${Date.now()}`;
  }

  
  // Create APIUsage instance
  const usage = new APIUsage(
    responseId!,
    params.calling_function!, // Assuming callingFunction is known/static in this context
    params.vendor,
    params.model,
    status,
    null, // sessionId would be set according to your application logic
    inputTokens,
    null, // Assuming ragTokens needs to be calculated or provided differently
    outputTokens,
    totalTokens,
    null, // inputCost needs to be calculated or provided differently
    null, // ragCost needs to be calculated or provided differently
    null, // outputCost needs to be calculated or provided differently
    null, // totalCost needs to be calculated or provided differently
    errorMessage,
    duration,
    null, // apiKeyName would be set according to your application logic
    new Date() // timestamp
  );

  return [content, usage];
}