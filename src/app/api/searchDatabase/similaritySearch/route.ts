
import { NextResponse } from 'next/server';
import { node_as_row } from "@/lib/types";
import { jurisdiction_similarity_search_all_partitions, insert_api_debug_log } from "@/lib/database";

export const maxDuration = 120;

export async function POST(req: Request) {

	const startTime = Date.now();
	console.log("=== similaritySearch API ENDPOINT ===");
	

	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_KEY;

	if (supabaseUrl === undefined) { throw new Error("process.env.SUPABUSE_URL is undefined!"); }
	if (supabaseKey === undefined) { throw new Error("process.env.SUPABASE_KEY is undefined!"); }

	const requestData: any = await req.json();
	const sessionId: string = req.headers.get('x-session-id')!;
	const jurisdictions = requestData.jurisdictions;
	const query_expansion_embedding = requestData.query_expansion_embedding;
	const federalJurisdiction = jurisdictions["federal"] || null ;
	const stateJurisdiction = jurisdictions["state"];
	const miscJurisdiction = jurisdictions["misc"] || null ;

	// CHECK FOR INITIAL ERRORS

	try {
		const state_rows: node_as_row[] = await jurisdiction_similarity_search_all_partitions(stateJurisdiction, query_expansion_embedding, 0.8, 20, 60, supabaseUrl, supabaseKey);
		// const federal_rows: node_as_row[] = await jurisdiction_similarity_search_all_partitions(federalJurisdiction, query_expansion_embedding, 0.8, 40, "40");
		const searchResponseBody = {
			state_rows: state_rows,
			federal_rows: "",
			statusMessage: 'Succesfully searched database for state and federal jurisdiction rows!'
		};

		const endTime = Date.now();
   		const executionTime = endTime - startTime;
    	await insert_api_debug_log("similaritySearch", executionTime, JSON.stringify(requestData), JSON.stringify(searchResponseBody), false, "", process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
		return NextResponse.json(searchResponseBody);
		
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



