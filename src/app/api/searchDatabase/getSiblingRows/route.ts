import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { NextResponse } from 'next/server';
import { NextApiResponse } from 'next';
import { node_as_row, node_key } from "@/lib/types";
import { get_sibling_rows } from "@/lib/database";





export const maxDuration = 120;

export async function POST(req: Request) {

  console.log("=====================================");
  console.log("==== getSiblingRows API ENDPOINT ====");
  console.log("=====================================");

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (supabaseUrl === undefined) { throw new Error("process.env.SUPABUSE_URL is undefined!"); }
  if (supabaseKey === undefined) { throw new Error("process.env.SUPABASE_KEY is undefined!"); }

  const requestData: any = await req.json();
  const jurisdictions = requestData.jurisdictions;
  const node_keys: node_key[] = requestData.node_keys;
  const federalJurisdiction = jurisdictions["federal"];
  const stateJurisdiction = jurisdictions["state"];
  console.log("HERE");
  try {

    const all_rows: node_as_row[] = await get_sibling_rows(stateJurisdiction, node_keys, supabaseUrl, supabaseKey);
    //console.log(all_rows[0]);
    // const federal_rows: node_as_row[] = await jurisdiction_similarity_search_all_partitions(federalJurisdiction, query_expansion_embedding, 0.8, 40, "40");
    const searchResponseBody = {
      all_rows: all_rows,
      statusMessage: 'Succesfully got parent rows!'
    };


    return NextResponse.json(searchResponseBody);
  } catch (error) {
    console.error("ERROR!", error);
    return NextResponse.json({ errorMessage: `An error occurred in getSiblingRows: ${error}` });
  }
}


