import { NextResponse } from 'next/server';
import { generateBasicQueryRefinement, generateDirectAnswerSimple, generateEmbedding } from '@/lib/helpers';
import { jurisdiction_similarity_search_all_partitions } from '@/lib/database';
import OpenAI from 'openai';
import { Jurisdiction, node_as_row, text_citation_pair } from '@/lib/types';

export const maxDuration = 120;
const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

// export function OPTIONS(req: Request) {
    
//     // Set CORS headers
//     const headers = {
//         'Access-Control-Allow-Origin': 'https://web.postman.co', // Modify as needed for your use case
//         'Access-Control-Allow-Methods': 'POST, OPTIONS',
//         'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//         // Include any other headers you might need for your requests
//     };

//     // Return the response with CORS headers and no body
//     return new NextResponse(null, { status: 204, headers });
// }

export async function POST(req: Request) {
    
    const startTime = Date.now();
    
    console.log("=== EXTERNAL QA API EndPoint ===");

    const requestData: any = await req.json();
    const api_key: string = requestData.api_key;
    const question: string = requestData.question;
    const jurisdiction: Jurisdiction = requestData.jurisdiction;
    
    // Vitalia API key & Telegram Bot API key
    if (api_key !== 'privateQAPassInternalShit') {
        return NextResponse.json({ errorMessage: `Invalid API key: ${api_key}`, status: 401 });
    }
    
    
    try {
        // Spawn a child process to run the Python script
          // for(const question of testing_question_list) {
        

        console.log(question);
        
        const res_0 = await generateBasicQueryRefinement(openai, question);
        const specific_questions = res_0.specific_questions;

        
        const legal_questions: string[] = specific_questions
        // const legal_statements: string[] = await generateQueryExpansion(openai, legal_questions);
        const embedded_expansion_query_raw:number[] = await generateEmbedding(openai, legal_questions);
        // Convert the embedded expansion query into a string
        const embedded_expansion_query:string = "[" + embedded_expansion_query_raw.join(",") + "]";

        const rows = await jurisdiction_similarity_search_all_partitions(jurisdiction.abbreviation.toLowerCase(), embedded_expansion_query, 0.8, 20, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
        const all_text_citation_pairs: text_citation_pair[] =[];
        for (const row of rows) {
            // Join row.node_text into a single string with '\n' as the delimiter
            //console.log(row.node_text)
            let new_text = row.node_text.join('\n');
            //console.log(new_text)
            let citation = row.node_citation;
            
            if(citation === undefined || citation === null) {
            
            citation = row.node_name;
            }
            if(citation === undefined || citation === null) {
            citation = row.node_id.split("/").pop()!;
            }
            //console.log(citation)
            const pair: text_citation_pair = {
                section_citation: citation,
                text: new_text,
            };
            all_text_citation_pairs.push(pair);
        }

        const instructions:string = `The user is looking for a general answer to the legal question. Please include relevant statistics and values included in the legislation. Answer the question directly, and include values that could be used to create graphs/statistical analysis after that.\n All sections you analyze will be from the ${jurisdiction.corpusTitle}.`
        const direct_answer = await generateDirectAnswerSimple(openai, question, instructions, all_text_citation_pairs);
        console.log(direct_answer);
        
        
        return NextResponse.json({ answer: direct_answer });

    } catch (error) {
        //console.error('Error running Python script:', error);
        console.log('Error in privateQA', error)
        return NextResponse.json({ errorMessage: `Error in privateQA: ${error}`, status: 500 });
    }
}


