import { NextResponse } from 'next/server';
import { generateDirectAnswer, generateEmbedding, generateQueryRefinement, convertGroupedRowsToTextCitationPairs, generateFollowupQuestion } from '@/lib/helpers';
import { GroupedRows, Jurisdiction, CitationLinks } from '@/lib/types';
import OpenAI from "openai";
import { insert_api_debug_log, jurisdiction_similarity_search_all_partitions, aggregateSiblingRows } from '@/lib/database';

const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});
export const maxDuration = 120;


export function OPTIONS(req: Request) {
    console.log(req.headers)
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': 'https://www.strikingly.com', // Modify as needed for your use case
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        // Include any other headers you might need for your requests
    };

    // Return the response with CORS headers and no body
    return new NextResponse(null, { status: 204, headers });
}

export async function POST(req: Request) {
   
    const startTime = Date.now();
    
    console.log("=== EXTERNAL VITALIA API ENDPOINT ===");
    
    const requestData: any = await req.json();
    
    const original_question: string = requestData.question;
    const api_key: string = requestData.api_key;
    let already_answered: string[] = requestData.already_answered;

    if (api_key !== 'ak_EjMsYGPJpLHcb48r4uCfP2ZYyrjwL') {
        return NextResponse.json({ errorMessage: `Invalid API key: ${api_key}`, status: 401 });
    }
    const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_KEY;

	if (supabaseUrl === undefined) { throw new Error("process.env.SUPABUSE_URL is undefined!"); }
	if (supabaseKey === undefined) { throw new Error("process.env.SUPABASE_KEY is undefined!"); }
    
    try {
        const newQuestion = await generateFollowupQuestion(openai, original_question, already_answered);
        if (newQuestion === original_question) {
            already_answered = [];
        }
        const embedding = JSON.parse(JSON.stringify(await generateEmbedding(openai, [newQuestion])));

        const rows = await jurisdiction_similarity_search_all_partitions("vitalia", embedding, 0.6, 10, 15, supabaseUrl, supabaseKey);
        const jurisdiction: Jurisdiction = {id: '1', name: 'Vitalia Wiki', abbreviation: 'vitalia', corpusTitle: 'Vitalia Wiki Documentation', usesSubContentNodes: false, jurisdictionLevel: 'misc' };
        const combined_parent_nodes: GroupedRows = await aggregateSiblingRows(rows, false, jurisdiction);
        const text_citation_pairs = convertGroupedRowsToTextCitationPairs(combined_parent_nodes);
        let instructions = `The user is looking to receive information about Vitalia 2024, which is a popup city event in the special economic zone of Prospera, on the island of Roatan Honduras. Here are some general facts that may help with answering: Location: Vitalia 2024 will be hosted in Próspera, a Special Economic Zone on the island of Roatan, Honduras.
        Duration: The pop-up city experience will take place from Jan 6th to March 1st 2024, and encourages a minimum stay of 1 month, with a focus on participants willing to spend at least 2 months.
        
        
        Answer the user's more specific question as best you can. For broad or general questions, it's okay to give a general overview.
        `
        if (already_answered.length > 0) {
            instructions += `The following questions have already been answered: ${already_answered.join(', ')}. If there are previous questions, make sure to integrate them into your answer as their current question is most likely a followup question.`;
        }
        
        const direct_answer = await generateDirectAnswer(openai, newQuestion, instructions,  text_citation_pairs);
        const citationLinks: CitationLinks = {};
        for (const row of rows) {
            citationLinks[row.citation] = row.link!
        }
        const endTime = Date.now();

        const response = NextResponse.json({
            "answer": direct_answer,
            "citationLinks": citationLinks,
            "response_time": endTime - startTime,
            "status": 200
        })
        
        // Set CORS headers for POST response
        response.headers.set('Access-Control-Allow-Origin', 'https://www.strikingly.com');
        response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
        return response;
    } catch (error) {
        const endTime = Date.now();
        let errorMessage = `${error},\n`
        if (error instanceof Error) {
        errorMessage += error.stack;
        }
        const executionTime = endTime - startTime;
        return NextResponse.json({"answer": undefined, "response_time": executionTime, "status": 500, "errorMessage": errorMessage});
    }
}

const createTextWithEmbeddedLink = (text: string): string => {
    // Replace all occurrences of "(#" with just "#"
    text = text.replace(/\n§/g, "§");
    text = text.replace(/\(#/g, '#');
    // Replace all occurrences of "#)" with just "#"
    text = text.replace(/#\)/g, '#');

    const citationPattern = /###(.*?)###/g;

    // Replace citations in the text with HTML anchor tags
    text = text.replace(citationPattern, (_, citation) => {
        const trimmedCitation = citation.trim();
        return `<a href="#${trimmedCitation}" class="text-blue-500 hover:text-blue-700">${trimmedCitation}</a>`;
    });

    return text;
}