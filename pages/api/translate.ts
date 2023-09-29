// sbp_53f67b9dbf4b4b2d4747dd028d571cdec0366d93
import type { NextRequest } from 'next/server'
import { NextApiResponse } from 'next'
import {
  Configuration,
  OpenAIApi,
  CreateModerationResponse,
  CreateEmbeddingResponse,
  ChatCompletionRequestMessage,
} from 'openai-edge'
import { Dataset, AnswerBody } from '../../types/types';
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { ApplicationError, UserError } from '@/lib/errors'
import { createClient } from "@supabase/supabase-js"
import { runAbe } from "./askAbe"
import { Readable } from 'stream';  // Make sure you have this at the top if using Readable streams
// ... other necessary imports ...

async function handler(req: NextRequest, res: NextApiResponse) {
  console.log("In handler function...");
  console.log(req)
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const requestData: { question: string, dataset: Dataset, apiKey: string } = await req.json();

  const stream = new Readable({
    read() {}
  });

  const config = new Configuration({
    apiKey: requestData.apiKey,
  });

  console.log(requestData.dataset);
  console.log(requestData.question);
  console.log(requestData.apiKey);

  let citations = "";
  try {
    if (!requestData.apiKey) {
      throw new ApplicationError('Missing environment variable OPENAI_KEY');
    }

    const openai = new OpenAIApi(config);

    if (!requestData) {
      throw new UserError('Missing request data');
    }

    if (!requestData.question) {
      throw new UserError('Missing query in request data');
    }

    console.log("Sanitizing user query...");

    const sanitizedQuery = requestData.question.trim();
    const moderationResponse: CreateModerationResponse = await openai
      .createModeration({ input: sanitizedQuery })
      .then((res) => res.json());

    const [results] = moderationResponse.results;
    console.log("Checking if results are flagged...");
    if (results.flagged) {
      throw new UserError('Flagged content', {
        flagged: true,
        categories: results.categories,
      });
    }

    res.setHeader('Content-Type', 'text/plain');
    res.status(200);

    console.log(sanitizedQuery);
    const client = createClient('https://xyzcompany.supabase.co', 'public-anon-key');

    for await (const text of runAbe(client, sanitizedQuery, requestData.apiKey)) {
      if (text.includes("[DONE]")) {
        citations = text;
      }
      stream.push(text);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    stream.push(null);
    stream.pipe(res);
  }
}

export default handler;