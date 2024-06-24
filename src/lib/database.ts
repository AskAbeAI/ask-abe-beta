import { createClient } from '@supabase/supabase-js';
import { node_as_row, Node, APIUsage } from "@/lib/types";
import { match } from 'assert';




export async function jurisdiction_similarity_search_all_partitions(
  jurisdiction: string,
  query_embedding: string,
  match_threshold: number,
  max_rows: number,
  supabaseUrl: string,
  supabaseKey: string
): Promise<node_as_row[]> {

  const supabase = createClient(supabaseUrl!, supabaseKey!);
  const { data, error } = await supabase
    .rpc(`${jurisdiction}_similarity_search`, {
      query_embedding: query_embedding,
      match_threshold: match_threshold,
      max_rows: max_rows,
    });
  if (error) {
    console.log(error);
    throw error;
  }
  //console.log(data);
  return data;
}
export async function searchSimilarContent(
  jurisdiction: string,
  query_embedding: string,
  search_scope_id: string,
  match_threshold: number,
  max_rows: number,
  supabaseUrl: string,
  supabaseKey: string
): Promise<Node[]> {

  const supabase = createClient(supabaseUrl!, supabaseKey!);
  const { data, error } = await supabase
    .rpc(`${jurisdiction}_searchsimilarcontent`, {
      query_embedding: query_embedding,
      match_threshold: match_threshold,
      max_rows: max_rows,
      parent_scope_id: search_scope_id,
    });
  if (error) {
    console.log(error);
    throw error;
  }
  
  return data;
}
export async function searchSimilarStructure(
  jurisdiction: string,
  query_embedding: string,
  search_scope_id: string,
  match_threshold: number,
  max_rows: number,
  supabaseUrl: string,
  supabaseKey: string
): Promise<Node[]> {

  const supabase = createClient(supabaseUrl!, supabaseKey!);
  const { data, error } = await supabase
    .rpc(`${jurisdiction}_searchSimilarStructure`, {
      query_embedding: query_embedding,
      match_threshold: match_threshold,
      max_rows: max_rows,
      search_scope_id,
    });
  if (error) {
    console.log(error);
    throw error;
  }
  
  return data;
}
export async function searchSimilarDefinitions(
  jurisdiction: string,
  query_embedding: string,
  search_scope_id: string,
  match_threshold: number,
  max_rows: number,
  supabaseUrl: string,
  supabaseKey: string
): Promise<Node[]> {

  const supabase = createClient(supabaseUrl!, supabaseKey!);
  const { data, error } = await supabase
    .rpc(`${jurisdiction}_searchSimilarDefinitions`, {
      query_embedding: query_embedding,
      match_threshold: match_threshold,
      max_rows: max_rows,
      search_scope_id,
    });
  if (error) {
    console.log(error);
    throw error;
  }
  
  return data;
}

export async function vitalia_search(
  jurisdiction: string,
  query_embedding: string,
  match_threshold: number,
  max_rows: number,
  supabaseUrl: string,
  supabaseKey: string
): Promise<node_as_row[]> {

  const supabase = createClient(supabaseUrl!, supabaseKey!);
  const { data, error } = await supabase
    .rpc(`${jurisdiction}_similarity_search`, {
      query_embedding: query_embedding,
      match_threshold: match_threshold,
      max_rows: max_rows,
    });
  if (error) {
    console.log(error);
    throw error;
  }
  //console.log(data);
  return data;
}



export async function insert_completion_cost(
  phase: string,
  prompt_tokens: number,
  completion_tokens: number,
  total_cost: number,
  model: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<void> {
  const supabase = createClient(supabaseUrl!, supabaseKey!);
  const { error } = await supabase
    .from('completionCosts')
    .insert({ phase, prompt_tokens, completion_tokens, total_cost, model });
  if (error) {
    console.error("Error inserting completion cost into database!" + error);
    
    throw error;
  }
}

export async function insertApiUsage(
  api_usage: APIUsage
): Promise<void> {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { error } = await supabase
    .from('api_usage')
    .insert(api_usage);
  if (error) {
    console.error("Error inserting api usage into database!" + error);
    throw error;
  }
}


export async function insert_api_debug_log(
  api_phase: string,
  execution_time: number,
  input_json_str: string,
  output_json_str: string,
  did_error: boolean,
  error_message: string,
  supabaseUrl: string,
  supabaseKey: string,
  session_id: string
): Promise<void> {
  const supabase = createClient(supabaseUrl!, supabaseKey!);
  let input_json;
  let output_json;
  try {
    input_json = JSON.parse(input_json_str);
    output_json = JSON.parse(output_json_str);
  } catch (error) {
    console.error("Error parsing input or output JSON in insert_api_debug_log!");
    throw error;
  }
  const { error } = await supabase
    .from('production_api_debug')
    .insert({ api_phase, execution_time, input_json, output_json, did_error, error_message, session_id });
  if (error) {
    console.error("Error inserting api_debug_log into database!" + error);
    throw error;
  }
}

export async function insert_testing_suite_question_results(
  question: string,
  quality_score: number,
  specific_questions: string,
  direct_answer: string,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<void> {
  const supabase = createClient(supabaseUrl!, supabaseKey!);
  const { error } = await supabase
    .from('testing_suite_question_results')
    .insert({ question, quality_score, specific_questions, direct_answer});
  if (error) {
    console.error("Error inserting testing_suite_question_results into database!" + error);
    throw error;
  }
}