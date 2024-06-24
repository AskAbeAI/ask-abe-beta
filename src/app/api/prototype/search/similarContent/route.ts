
import { NextResponse } from 'next/server';
import {  questionJurisdictions, Node } from "@/lib/types";
import { searchSimilarContent, insert_api_debug_log } from "@/lib/database";
import { request } from 'http';
import { SearchSimilarContentRequest, SearchSimilarContentResponse} from '@/lib/api_types';
import { generateApiRequestReport, generateApiResponseReport } from '@/lib/utilities';

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
const API_ROUTE = "api/searchDatabase/similarContent"

export async function POST(req: Request) {

	
	console.log("=== similarContent API ENDPOINT ===");
	

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (supabaseUrl === undefined) { throw new Error("process.env.NEXT_PUBLIC_SUPABASE_URL is undefined!"); }
	if (supabaseKey === undefined) { throw new Error("process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY is undefined!"); }

	const request: SearchSimilarContentRequest = await req.json();
	generateApiRequestReport(request.base, API_ROUTE)
	const jurisdictions: questionJurisdictions = request.jurisdictions;
	const query_expansion_embedding = `[${request.query_expansion_embedding.toString()}]`;
    const parentScope = request.parentScope || "us/federal/ecfr/";
	
	
	// CHECK FOR INITIAL ERRORS
	let primaryRows: Node[] = [];
	
	let errorMessage: string | undefined = undefined;
	

	try {
		let jurisdiction = jurisdictions.federal!.abbreviation;
		let maxRows = 30;
		
		//console.log(jurisdiction)
		const maxRetries = 2;
		console.log(jurisdiction)
		console.log(query_expansion_embedding)
		console.log(parentScope)
		console.log(maxRows)
		
		primaryRows = await callWithRetries(
			() => searchSimilarContent(jurisdiction, query_expansion_embedding, parentScope, 0.6, maxRows, supabaseUrl, supabaseKey),
			maxRetries
		);
		console.log(primaryRows)
		
	
			
	} catch (error) {
		console.log(error)
		errorMessage = `${error},\ne`
		if (error instanceof Error) {
		errorMessage += error.stack;
		}
	} finally {
		const response: SearchSimilarContentResponse = {
			base: request.base,
			primaryRows: primaryRows
		}
		generateApiResponseReport(request.base, API_ROUTE, response?.base.errorMessage )
    	return NextResponse.json(response);
	}
}



async function callWithRetries<T>(
	fn: () => Promise<T>, 
	maxRetries: number
  ): Promise<T> {
	let attempts = 0;
	while (true) {
	  try {
		return await fn();
	  } catch (error) {
		attempts++;
		if (attempts > maxRetries) {
		  throw error;
		}
		console.log(`Attempt ${attempts} failed, retrying...`);
	  }
	}
  }