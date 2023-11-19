import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { NextResponse } from 'next/server';
import { NextApiResponse } from 'next';
import { node_as_row, node_key } from "@/lib/types";
import { get_sibling_rows } from "@/lib/database";
import { insert_api_debug_log } from "@/lib/database";


export const maxDuration = 120;

export async function POST(req: Request) {

  const startTime = Date.now();
  console.log("==== getSiblingRows API ENDPOINT ====");

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (supabaseUrl === undefined) { throw new Error("process.env.SUPABUSE_URL is undefined!"); }
  if (supabaseKey === undefined) { throw new Error("process.env.SUPABASE_KEY is undefined!"); }

  const requestData: any = await req.json();
  const jurisdictions = requestData.jurisdictions;
  const node_keys: node_key[] = requestData.node_keys;
  const federalJurisdiction = jurisdictions["federal"];
  const stateJurisdiction = jurisdictions["state"];
  const sessionId: string = req.headers.get('x-session-id')!;
  
  try {

    const all_rows: node_as_row[] = await get_sibling_rows(stateJurisdiction, node_keys, supabaseUrl, supabaseKey);
    //console.log(all_rows[0]);
    // const federal_rows: node_as_row[] = await jurisdiction_similarity_search_all_partitions(federalJurisdiction, query_expansion_embedding, 0.8, 40, "40");
    const searchResponseBody = {
      all_rows: all_rows,
      statusMessage: 'Succesfully got sibling rows!'
    };

    const endTime = Date.now();
   	const executionTime = endTime - startTime;
    await insert_api_debug_log("getSiblingRows", executionTime, JSON.stringify(requestData), JSON.stringify(searchResponseBody), false, "", process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
    return NextResponse.json(searchResponseBody);
  } catch (error) {
    const endTime = Date.now();
		let errorMessage = `${error},\n`
		if (error instanceof Error) {
		errorMessage += error.stack;
		}
		const executionTime = endTime - startTime;
		await insert_api_debug_log("getSiblingRows", executionTime, JSON.stringify(requestData), "{}", true, errorMessage, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, sessionId);
    return NextResponse.json({ errorMessage: `An error occurred in getSiblingRows: ${error}` });
  }
}


