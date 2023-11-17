import { createClient } from '@supabase/supabase-js';
import { node_as_row, node_key, GroupedRows } from "@/lib/types";



export async function jurisdiction_similarity_search_all_partitions(
  jurisdiction: string,
  query_embedding: string,
  match_threshold: number,
  match_count: number,
  max_rows: number,
  supabaseUrl: string,
  supabaseKey: string
): Promise<node_as_row[]> {

  const supabase = createClient(supabaseUrl!, supabaseKey!);
  const { data, error } = await supabase
    .rpc(`${jurisdiction}_similarity_search`, {
      query_embedding: query_embedding,
      k: match_count,
      match_threshold: match_threshold,
      max_rows: max_rows,
    });
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
}

export async function get_sibling_rows(
  jurisdiction: string,
  node_keys: node_key[],
  supabaseUrl: string,
  supabaseKey: string
): Promise<node_as_row[]> {

  const supabase = createClient(supabaseUrl!, supabaseKey!);
  const { data, error } = await supabase.rpc(`${jurisdiction}_get_sibling_rows`, { keys: node_keys });
  if (error) {
    console.error("ERRRRRRRRORRR!", error);
    throw error;
  }
  return data;
}


export async function aggregateSiblingRows(rows: node_as_row[]): Promise<GroupedRows> {

  const extractSortKey = (id: string): string => {
    const parts = id.split('/');
    const lastPart = parts[parts.length - 1];
    if (lastPart === "") {
      return " "; // Special case: empty string (no identifier) sorts before alphabetical identifiers
    }
    if (lastPart.includes("Addendum")) {
      return "zzzzzzzz"; // Sort "Addendum" last by giving it a sort key that will come alphabetically last
    }
    const match = lastPart.match(/\(([^)]+)\)/);
    return match ? match[1] : lastPart; // Extract the identifier within parentheses or the whole part if no parentheses are found
  };


  const groupedRows: GroupedRows = {};

  for (const row of rows) {
    if (!groupedRows[row.parent_node]) {
      groupedRows[row.parent_node] = { rows: [], section_text: [], citation: '', link: '' };
    }
    if (!groupedRows[row.parent_node].rows.some(existingRow => existingRow.id === row.id)) {
      groupedRows[row.parent_node].rows.push(row);
    }

  }

  for (const parent_node in groupedRows) {
    const siblingRows = groupedRows[parent_node].rows;

    // Sorting logic
    siblingRows.sort((a, b) => {
      const keyA = extractSortKey(a.id);
      const keyB = extractSortKey(b.id);
      if (keyA.trim() === "" && keyB.trim() !== "") return -1;
      if (keyB.trim() === "" && keyA.trim() !== "") return 1;
      return keyA.localeCompare(keyB);
    });

    let section_text: string[] = [];
    let citation = "";
    let link = "";

    for (const row of siblingRows) {
      section_text.push(row.node_text);
      if (row.citation.includes("Addendum")) {
        citation = row.citation.replace("Addendum", "");
        link = "https://leginfo.legislature.ca.gov/faces/codes.xhtml";
      }
    }

    groupedRows[parent_node] = {
      rows: siblingRows,
      section_text: section_text,
      citation: citation,
      link: link
    };
  }

  return groupedRows;
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