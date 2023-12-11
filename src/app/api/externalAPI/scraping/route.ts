import { NextResponse } from 'next/server';
import { generateDirectAnswer, generateEmbedding, generateQueryRefinement,generateDirectAnswerVitalia, convertRowsToTextCitationPairsVitalia, generateFollowupQuestion } from '@/lib/helpers';
import { GroupedRows, Jurisdiction, CitationLinks } from '@/lib/types';
import { spawn } from 'child_process';


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
    
    console.log("=== EXTERNAL SCRAPING API ENDPOINT ===");

    const requestData: any = await req.json();
    let original_question: string = requestData.question;
    const api_key: string = requestData.api_key;
    let already_answered: string[] = requestData.already_answered;
    // Vitalia API key & Telegram Bot API key
    if (api_key !== 'ak_jTMkA0rfIrMhu0WBkiHzy4YEZiVq82ym' && api_key !==  'ak_EjMsYGPJpLHcb48r4uCfP2ZYyrjwL') {
        return NextResponse.json({ errorMessage: `Invalid API key: ${api_key}`, status: 401 });
    }
    
    
    
    try {
        const process = spawn('python', ['./test.py', 'Hello Will!']);

        process.stdout.on('data', function(data) { 
            console.log(data.toString()); 
        } ) 
            
        const response = NextResponse.json({
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


