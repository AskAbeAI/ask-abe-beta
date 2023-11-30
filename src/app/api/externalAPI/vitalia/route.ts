import { NextResponse } from 'next/server';
import { generateDirectAnswer, generateEmbedding, generateQueryRefinement, convertGroupedRowsToTextCitationPairs } from '@/lib/helpers';
import { GroupedRows, Jurisdiction } from '@/lib/types';
import OpenAI from "openai";
import { insert_api_debug_log, jurisdiction_similarity_search_all_partitions, aggregateSiblingRows } from '@/lib/database';

const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});
export const maxDuration = 120;



export async function POST(req: Request) {
    if (req.method === 'OPTIONS') {
        const headers = {
            'Access-Control-Allow-Origin': '*', // Modify as needed
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };
        return new NextResponse(null, { status: 204, headers });
    }

    // Ensure that the method is POST
    if (req.method !== 'POST') {
        return new NextResponse(null, { status: 405 }); // Method Not Allowed
    }
    const startTime = Date.now();
    
    console.log("=== EXTERNAL VITALIA API ENDPOINT ===");
    
    const requestData: any = await req.json();
    
    const original_question: string = requestData.question;
    const api_key: string = requestData.api_key;

    if (api_key !== 'ak_EjMsYGPJpLHcb48r4uCfP2ZYyrjwL') {
        return NextResponse.json({ errorMessage: `Invalid API key: ${api_key}`, status: 401 });
    }
    const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_KEY;

	if (supabaseUrl === undefined) { throw new Error("process.env.SUPABUSE_URL is undefined!"); }
	if (supabaseKey === undefined) { throw new Error("process.env.SUPABASE_KEY is undefined!"); }
    
    try {
        const embedding = JSON.parse(JSON.stringify(await generateEmbedding(openai, [original_question])));

        const rows = await jurisdiction_similarity_search_all_partitions("vitalia", embedding, 0.6, 10, 15, supabaseUrl, supabaseKey);
        const jurisdiction: Jurisdiction = {id: '1', name: 'Vitalia Wiki', abbreviation: 'vitalia', corpusTitle: 'Vitalia Wiki Documentation', usesSubContentNodes: false, jurisdictionLevel: 'misc' };
        const combined_parent_nodes: GroupedRows = await aggregateSiblingRows(rows, false, jurisdiction);
        const text_citation_pairs = convertGroupedRowsToTextCitationPairs(combined_parent_nodes);
        const instructions = `The user is looking to receive information about Vitalia 2024, which is a popup city event in the special economic zone of Prospera, on the island of Roatan Honduras. Here are some general facts that may help with answering: Location: Vitalia 2024 will be hosted in Próspera, a Special Economic Zone on the island of Roatan, Honduras.
        Duration: The pop-up city experience will take place from Jan 6th to March 1st 2024, and encourages a minimum stay of 1 month, with a focus on participants willing to spend at least 2 months.
        Cost: Room pricing ranges from $1,000 to $3,000 per month, including accommodation and shared amenities like a gym and shared cars.
        Who's Coming: The resident profile consists of scientists, entrepreneurs, artists, and thinkers specializing in fields like longevity biotechnology, healthcare, and decentralized governance.
        Work Compatibility: Vitalia is not a conference; participants are encouraged to bring their work with them.
        Amenities: The package includes medium-range private suites, free-use facilities like a gym and pool, on-site healthcare, and logistical services like car pooling.
        Additional Services: Childcare services and a variety of wellness activities organized by residents are available.
        Local Community: Roatan has a diverse and friendly local community with many accepting Bitcoin and other cryptocurrencies.
        Acceleration of Longevity Innovation: Vitalia, long-term, aims to eliminate bureaucratic roadblocks to speed up clinical trials and lower costs in the longevity field.
        
        Answer the user's more specific question as best you can. For broad or general questions, it's okay to give a general overview.`
        
        const direct_answer_raw = await generateDirectAnswer(openai, original_question, instructions, text_citation_pairs);
        let direct_answer = createTextWithEmbeddedLink(direct_answer_raw);
        for (const row of rows) {
            if (direct_answer.includes(row.citation)) {
                // find the index of row.citation in direct_answer
                const index = direct_answer.indexOf(row.citation);
                // Replace the citation with the row.link, while also removing the character right before index
                direct_answer = direct_answer.slice(0, index - 1) + row.link + direct_answer.slice(index + row.citation.length);
            }
        }
        const endTime = Date.now();

        const response = {
            "answer": direct_answer,
            "response_time": endTime - startTime,
            "status": 200
        }
        
    
        return NextResponse.json(response);
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