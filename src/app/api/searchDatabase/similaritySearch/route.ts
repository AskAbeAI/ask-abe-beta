
import { NextResponse } from 'next/server';
import { node_as_row, questionJurisdictions } from "@/lib/types";
import { jurisdiction_similarity_search_all_partitions, insert_api_debug_log } from "@/lib/database";
import { request } from 'http';

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
	console.log("=== similaritySearch API ENDPOINT ===");
	

	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_KEY;

	if (supabaseUrl === undefined) { throw new Error("process.env.SUPABUSE_URL is undefined!"); }
	if (supabaseKey === undefined) { throw new Error("process.env.SUPABASE_KEY is undefined!"); }

	const requestData: any = await req.json();
	const sessionId: string = req.headers.get('x-session-id')!;
	const jurisdictions: questionJurisdictions = requestData.jurisdictions;
	const query_expansion_embedding = requestData.query_expansion_embedding;
	const federalJurisdiction = jurisdictions.federal;
	const stateJurisdiction = jurisdictions.state;
	const miscJurisdiction = jurisdictions.misc;
	const mode:string = jurisdictions.mode;
	//console.log("HERE!")
	//console.log(requestData)
	// CHECK FOR INITIAL ERRORS

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
		
		const primary_rows = await callWithRetries(
			() => jurisdiction_similarity_search_all_partitions(jurisdiction, query_expansion_embedding, 0.6, maxRows, supabaseUrl, supabaseKey),
			maxRetries
		);
		

		let secondary_rows: node_as_row[] = [];
		if (mode === "state_federal" || mode === "misc_federal") {
			
			secondary_rows = await callWithRetries(
			() => jurisdiction_similarity_search_all_partitions(federalJurisdiction!.abbreviation, query_expansion_embedding, 0.6, maxRows, supabaseUrl, supabaseKey),
			maxRetries
			);
		}
		
		
		console.log("Made it out of the similarity search function!")
		const searchResponseBody = {
			primary_rows: primary_rows,
			secondary_rows: secondary_rows,
			statusMessage: 'Succesfully searched database for primary and secondary rows!'
		};
		//console.log(primary_rows)

		const endTime = Date.now();
   		const executionTime = endTime - startTime;
    	await insert_api_debug_log("similaritySearch", executionTime, JSON.stringify(requestData), JSON.stringify(searchResponseBody), false, "", process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
		const finalResponse = NextResponse.json(searchResponseBody);
		finalResponse.headers.set('Access-Control-Allow-Origin', 'https://www.strikingly.com');
		finalResponse.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
		finalResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		return finalResponse;
			
	} catch (error) {
		const endTime = Date.now();
		let errorMessage = `${error},\n`
		if (error instanceof Error) {
		errorMessage += error.stack;
		}
		const executionTime = endTime - startTime;
		await insert_api_debug_log("similaritySearch", executionTime, JSON.stringify(requestData), "{}", true, errorMessage, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
		return NextResponse.json({ errorMessage: `An error occurred in similarity searching: ${error}` });
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