
import { NextResponse } from 'next/server';
import { node_as_row, questionJurisdictions } from "@/lib/types";
import { jurisdiction_similarity_search_all_partitions, insert_api_debug_log } from "@/lib/database";
import { request } from 'http';
import { SimilaritySearchRequest, SimilaritySearchResponse } from '@/lib/api_types';
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
const API_ROUTE = "api/searchDatabase/similaritySearch"

export async function POST(req: Request) {

	
	console.log("=== similaritySearch API ENDPOINT ===");
	

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_KEY;

	if (supabaseUrl === undefined) { throw new Error("process.env.NEXT_PUBLIC_SUPABASE_URL is undefined!"); }
	if (supabaseKey === undefined) { throw new Error("process.env.SUPABASE_KEY is undefined!"); }

	const request: SimilaritySearchRequest = await req.json();
	generateApiRequestReport(request.base, API_ROUTE)
	const jurisdictions: questionJurisdictions = request.jurisdictions;
	const query_expansion_embedding = `[${request.query_expansion_embedding.toString()}]`;
	const federalJurisdiction = jurisdictions.federal;
	const stateJurisdiction = jurisdictions.state;
	const miscJurisdiction = jurisdictions.misc;
	const mode:string = jurisdictions.mode;
	//console.log("HERE!")
	//console.log(requestData)
	// CHECK FOR INITIAL ERRORS
	let primaryRows: node_as_row[] = [];
	let secondaryRows: node_as_row[] = [];
	let errorMessage: string | undefined = undefined;
	

	try {
		let jurisdiction: string;
		let maxRows = 30;

		if (mode === "misc" || mode === "misc_federal") {
			jurisdiction = miscJurisdiction!.abbreviation;
		} else if (mode === "state" || mode === "state_federal") {
			if (stateJurisdiction?.usesSubContentNodes) {
				maxRows = 60;
			}
			jurisdiction = stateJurisdiction!.abbreviation;
		} else {
			jurisdiction = federalJurisdiction!.abbreviation;
		}
		
		jurisdiction = jurisdiction.toLowerCase();
		//console.log(jurisdiction)
		const maxRetries = 2;
		
		primaryRows = await callWithRetries(
			() => jurisdiction_similarity_search_all_partitions(jurisdiction, query_expansion_embedding, 0.6, maxRows, supabaseUrl, supabaseKey),
			maxRetries
		);
		

		
		if (mode === "state_federal" || mode === "misc_federal") {
			
			secondaryRows = await callWithRetries(
			() => jurisdiction_similarity_search_all_partitions(federalJurisdiction!.abbreviation, query_expansion_embedding, 0.6, maxRows, supabaseUrl, supabaseKey),
			maxRetries
			);
		}
	
			
	} catch (error) {
		
		errorMessage = `${error},\n`
		if (error instanceof Error) {
		errorMessage += error.stack;
		}
	} finally {
		const response: SimilaritySearchResponse = {
			base: request.base,
			primaryRows: primaryRows,
			secondaryRows: secondaryRows
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