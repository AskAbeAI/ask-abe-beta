import { NextResponse } from 'next/server';
import { generateBasicQueryRefinement, generateDirectAnswerSimple, generateEmbedding, answeringInstructionsHelper, directAnswerHelper } from '@/lib/helpers';
import { callWithRetries } from '@/lib/utils';
import { jurisdiction_similarity_search_all_partitions } from '@/lib/database';
import OpenAI from 'openai';
import { Jurisdiction, node_as_row, text_citation_pair, text_citation_document_trio, PipelineModel } from '@/lib/types';

export const maxDuration = 120;
const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

export function OPTIONS(req: Request) {
    
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': 'https://concierge-live.vercel.app/chat/', // Modify as needed for your use case
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        // Include any other headers you might need for your requests
    };

    // Return the response with CORS headers and no body
    return new NextResponse(null, { status: 204, headers });
}
interface PrivateQARequest {
    abe_api_key: string;
    question: string;
    jurisdiction: string;
    
}

export async function POST(req: Request) {
    
    console.log("=== EXTERNAL QA API EndPoint ===");

    const request: PrivateQARequest = await req.json();
    const abe_api_key: string = request.abe_api_key;
    const question: string = request.question;
    const jurisdiction: string = request.jurisdiction;
    const maxRows = 10;
    const maxRetries = 2;
    
    const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_KEY;

	if (supabaseUrl === undefined) { throw new Error("process.env.SUPABUSE_URL is undefined!"); }
	if (supabaseKey === undefined) { throw new Error("process.env.SUPABASE_KEY is undefined!"); }
    
    
    if (abe_api_key !== 'conciergeTestKey') {
        return NextResponse.json({ errorMessage: `Invalid API key: ${abe_api_key}`, status: 401 });
    }
    
    
    try {
        const base = {
            vendor: "openai",
            model: "gpt-4-turbo-preview",
            callingFunction: "privateQA",
            pipelineModel: new PipelineModel({session_id: "random1", history: [] }),
          }
        const legal_questions: string[] = [question];

        const embedding: number[] = await generateEmbedding(openai, legal_questions);
        const query_expansion_embedding = `[${embedding.toString()}]`;
        const primaryRows: node_as_row[] = await callWithRetries(
			() => jurisdiction_similarity_search_all_partitions(jurisdiction, query_expansion_embedding, 0.6, maxRows, supabaseUrl, supabaseKey),
			maxRetries
		);

        const all_text_citation_pairs: text_citation_document_trio[] =[];
        for (const row of primaryRows) {
            // Join row.node_text into a single string with '\n' as the delimiter
            let new_text = row.node_text.join('\n');
            let citation = row.node_citation;
            
            if(citation === undefined || citation === null) {
            
            citation = row.node_name;
            }
            if(citation === undefined || citation === null) {
            citation = row.node_id.split("/").pop()!;
            }
            //console.log(citation)
            const pair: text_citation_document_trio = {
            section_citation: citation,
            text: new_text,
            document: jurisdiction
            };
            all_text_citation_pairs.push(pair);
        }
        const customer_information = "The customer is interested in getting accurate legal information about their question. They are a resident of the applicable jurisdiction. They are looking for a general answer to their question, not specific legal advice. They only want to understand current legislation, not any future or upcoming changes.";
        const instructions = await answeringInstructionsHelper(base, openai, question, customer_information, []);
       
        const directAnswer = await directAnswerHelper(base, openai, question, instructions, all_text_citation_pairs);
        
        
        return NextResponse.json({ "response": directAnswer });

    } catch (error) {
        //console.error('Error running Python script:', error);
        console.log('Error in privateQA', error)
        return NextResponse.json({ errorMessage: `Error in privateQA: ${error}`, status: 500 });
    }
}


