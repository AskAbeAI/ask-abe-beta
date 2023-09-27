// sbp_53f67b9dbf4b4b2d4747dd028d571cdec0366d93
import type { NextRequest } from 'next/server'
import {
  Configuration,
  OpenAIApi,
  CreateModerationResponse,
  CreateEmbeddingResponse,
  ChatCompletionRequestMessage,
} from 'openai-edge'
import { Dataset} from '../../types/types';
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { ApplicationError, UserError } from '@/lib/errors'

export const config = {
  runtime: 'edge',
};

const handler = async (req: NextRequest): Promise<Response> => {
  console.log("In handler function...")
  const requestData: { question:string, dataset:Dataset, apiKey:string } =
      (await req.json()) as AnswerBody;
  const config = new Configuration({
    apiKey: requestData.apiKey,
  })
  console.log(requestData.dataset)
  console.log(requestData.question)
  console.log(requestData.apiKey)
  try {
    if (!requestData.apiKey) {
      throw new ApplicationError('Missing environment variable OPENAI_KEY')
    }
    const openai = new OpenAIApi(config)

    if (!requestData) {
      throw new UserError('Missing request data')
    }

    if (!requestData.question) {
      throw new UserError('Missing query in request data')
    }

    console.log("Sanitizing user query...")
    // Moderate the content to comply with OpenAI T&C
    const sanitizedQuery = requestData.question.trim()
    const moderationResponse: CreateModerationResponse = await openai
      .createModeration({ input: sanitizedQuery })
      .then((res) => res.json())

    const [results] = moderationResponse.results
    console.log("Checking if results are flagged...")
    if (results.flagged) {
      throw new UserError('Flagged content', {
        flagged: true,
        categories: results.categories,
      })
    }

    
    // Transform the response into a readable stream
    console.log(sanitizedQuery)
    const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')

    const { data, error } = await supabase.functions.invoke('ask-abe-a-question', {
      body: { name: 'Functions' },
    })
    console.log(data)
    

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream)
  } catch (err: unknown) {
    if (err instanceof UserError) {
      return new Response(
        JSON.stringify({
          error: err.message,
          data: err.data,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } else if (err instanceof ApplicationError) {
      // Print out application errors with their additional data
      console.error(`${err.message}: ${JSON.stringify(err.data)}`)
    } else {
      // Print out unexpected errors as is to help with debugging
      console.error(err)
    }

    // TODO: include more response info in debug environments
    return new Response(
      JSON.stringify({
        error: 'There was an error processing your request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
export default handler;



