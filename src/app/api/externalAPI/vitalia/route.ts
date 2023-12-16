import { NextResponse } from 'next/server';
import { generateEmbedding, generateDirectAnswerVitalia, generateFollowupQuestion } from '@/lib/helpers';
import { CitationLinks, text_citation_pair } from '@/lib/types';
import OpenAI from "openai";
import { vitalia_search } from '@/lib/database';

const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});
export const maxDuration = 120;


export function OPTIONS(req: Request) {
    
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
    let original_question: string = requestData.question;
    const api_key: string = requestData.api_key;
    let already_answered: string[] = requestData.already_answered;
    // Vitalia API key & Telegram Bot API key
    if (api_key !== 'ak_jTMkA0rfIrMhu0WBkiHzy4YEZiVq82ym' && api_key !==  'ak_EjMsYGPJpLHcb48r4uCfP2ZYyrjwL') {
        return NextResponse.json({ errorMessage: `Invalid API key: ${api_key}`, status: 401 });
    }
    const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_KEY;

	if (supabaseUrl === undefined) { throw new Error("process.env.SUPABUSE_URL is undefined!"); }
	if (supabaseKey === undefined) { throw new Error("process.env.SUPABASE_KEY is undefined!"); }
    
    try {
       
        if (already_answered.length > 0) {
            let newQuestion = await generateFollowupQuestion(openai, original_question, already_answered)
            if (newQuestion === original_question) {
                already_answered = [];
            } else {
                original_question = newQuestion;
            }
        }
        
        const embedding = JSON.parse(JSON.stringify(await generateEmbedding(openai, [original_question])));

        const rows = await vitalia_search("vitalia", embedding, 0.6, 50, supabaseUrl, supabaseKey);
        const text_citation_pairs: text_citation_pair[] = [];
        for (const row of rows){
            let new_text = row.node_text.join('\n');
            const pair: text_citation_pair = {
                section_citation: row.node_name,
                text: new_text
            };
            text_citation_pairs.push(pair);
        }
        
        
        console.log(text_citation_pairs)
        let direct_answer = await generateDirectAnswerVitalia(openai, original_question, already_answered,  text_citation_pairs);
        console.log(direct_answer)
        const citationLinks: CitationLinks = {};
        for (const row of rows) {
            citationLinks[cleanString(row.node_name!.trim())] = row.node_link;
        }
        
        const endTime = Date.now();
        already_answered.push(original_question);
        if (api_key ===  'ak_EjMsYGPJpLHcb48r4uCfP2ZYyrjwL') {
            direct_answer = replaceCitationsWithLinks(direct_answer, citationLinks);
            
        }
        const response = NextResponse.json({
            "answer": direct_answer,
            "citationLinks": citationLinks,
            "response_time": endTime - startTime,
            "already_answered": already_answered,
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


function cleanString(inputString: string): string {
    // Remove all newline characters
    let cleanedString = inputString.replace(/\n/g, ' ');
  
    // Replace multiple whitespaces with a single whitespace
    cleanedString = cleanedString.replace(/\s+/g, ' ');
  
    return cleanedString.trim();
  }

  function replaceCitationsWithLinks(text: string, citationLinks: CitationLinks): string {
    let updatedText = text;
  
    // Iterate over the record entries
    Object.entries(citationLinks).forEach(([citationText, url]) => {
      // Escape special regex characters in the citation text to avoid issues in regex operations
      const escapedCitationText = citationText.replace(/[.*+?^${}()'|[\]\\]/g, '\\$&');
      
      // Create a regex pattern that matches the citation text enclosed within '###'
      const pattern = new RegExp(`###\\s*${escapedCitationText}\\s*###`, 'g');
      
      // Replacement text with an HTML anchor tag
      const replacement = `[${citationText}](${url})`;
      
      // Replace the pattern with the replacement text
      updatedText = updatedText.replace(pattern, replacement);
    });
  
    return updatedText;
  }