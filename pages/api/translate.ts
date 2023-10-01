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

export const config = {
  maxDuration: 120,
};
async function handler(req: NextRequest, res: NextApiResponse) {
  console.log("In handler function...");
  console.log(req.method)
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  
  const requestData:any = req.body;

  const stream = new Readable({
    read() {}
  });

  const config = new Configuration({
    apiKey: requestData.apiKey,
  });

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

    // console.log("Sanitizing user query...");

    // const sanitizedQuery = requestData.question;
    // const moderationResponse: CreateModerationResponse = await openai
    //   .createModeration({ input: sanitizedQuery })
    //   .then((res) => res.json());

    // const [results] = moderationResponse.results;
    // console.log("Checking if results are flagged...");
    // if (results.flagged) {
    //   throw new UserError('Flagged content', {
    //     flagged: true,
    //     categories: results.categories,
    //   });
    // }

    res.setHeader('Content-Type', 'text/plain');
    res.status(200);

    
    

    for await (const text of runAbe(requestData.question, requestData.apiKey)) {
      console.log("Middleman:")
      console.log(text)
      
      stream.push(text);
      if (text.includes("[SECTIONS]")) {
        stream.push(text)
        stream.push(null)
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    console.log("FINALLY")
    stream.push(null);
    stream.pipe(res);
  }
}

export default handler;