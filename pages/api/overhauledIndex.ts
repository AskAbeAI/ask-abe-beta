import OpenAI from 'openai';
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
	apiKey: "placeholder", // defaults to process.env["OPENAI_API_KEY"]
});




// Get initial input from the user, stored in React text state
let user_query = "A very well formed question.";











// Do the following asynchronously:
// 1. Embed the user input in vector embeddings.
async function embed_and_search(user_query: string, jurisdiction_list: string[]) {
    let embedding_raw = await getEmbedding(user_query)
    let embedding_text = embedding_raw.data[0].embedding
    const results = [];
    // SEARCH FOR EVERY JURISDICTION
    for (const jurisdiction of jurisdiction_list) {
        let jurisdiction_match_query = `match_embedding_${jurisdiction}`
        let search_results = await search_for_most_similar_section(embedding_text, jurisdiction_match_query, []);
        results.push(search_results);
    }
    return results;
}







// GRAPH TRAVERSAL FUNCTIONS

const sql_select_children = `SELECT child_node_id FROM ca_node_relationships WHERE parent_node_id = 'CA/statutes/code=PROB/DIVISION=9/PART=4/CHAPTER=2/ARTICLE=2/SECTION=16231';`;

// SIMILARITY SEARCH FUNCTIONS
async function getEmbedding(text: string) {
    const embedding = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    });

    return embedding;
}
async function search_for_most_similar_section(embedding: number[], jurisdiction_match_query: string, partitions: string[]) {
    const client = createClient('https://jwscgsmkadanioyopaef.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3c2Nnc21rYWRhbmlveW9wYWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzE1MTgsImV4cCI6MjAxMTI0NzUxOH0.1QwW9IV1TrMT72xyq2LQcmDr92tmLOEQg07mOPRLDO0');
    
    const { data, error } = await client.rpc(jurisdiction_match_query, { query_embedding: embedding, match_threshold: 0.5, match_count: 1 });
    const data_final = data;
    const error_final = error;
    
    if(error_final !== undefined) {
        throw new Error(`Error calling match_embeddings in supabase database: ${error_final}`);
    }
    return data_final;
}



// CHAT COMPLETION FUNCtIONS

interface Message {
	role: 'system' | 'user';
	content: string;
}

function applyToGeneric(system: string, user: string): Message[] {
	return [
		{ role: 'system', content: system },
		{ role: 'user', content: user }
	];
}
async function createChatCompletion(prompt: Message[], usedModel: string, temp: number): Promise<any> {
	const completion = await openai.chat.completions.create({
		messages: prompt,
		model: usedModel,
		temperature: temp,
	});
	if (!completion) {
		throw new Error(`OpenAI API call failed with status: ${completion}`);
	}
	return completion.choices[0].message['content'];
}




// PROMPT STORAGE FUNCTIONS
