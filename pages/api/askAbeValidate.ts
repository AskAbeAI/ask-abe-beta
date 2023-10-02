import type { NextRequest } from 'next/server'
import { NextApiResponse } from 'next'
import {
  Configuration,
  OpenAIApi,
} from 'openai-edge'
import { ApplicationError, UserError } from '@/lib/errors'


export const config = {
  maxDuration: 200,
};
export default async function handler(req: NextRequest, res: NextApiResponse) {
  
  console.log("===========================================");
	console.log("======= Validate - Debug Screen :) ========");
	console.log("===========================================");
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  
  const requestData:any = req.body;
  console.log(requestData)
  const config = new Configuration({
    apiKey: requestData.apiKey,
  });

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

    res.status(200).json({statusMessage: 'Succesfully validated parameters!'})
  } catch (error) {
    res.status(400).json({errorMessage: `An error occurred in validation: ${error}`})
  } finally {
    console.log("Exiting askAbeValidate.ts!")
    res.end()
    return;
  }
}