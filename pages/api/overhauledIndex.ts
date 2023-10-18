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

// - Get the top 10 most similar vector embedding for each top level title's definitions.
// 2. Call GPT 3.5 to see if user question meets some criteria:
// - Contains a well-formed jurisdiction
// - Is not a disallowed question
// async function check_question_validity(user_query: string) {
//     const prompt = `Question: ${user_query}\nAnswer:`;
//     return result;
// }
// Have conversation with the user. Follow these conditions:
// 1. If question is against the rules, tell the user and restart.
// 2. If jurisdiction is not found, ask the user for a jurisdiction.
// 3. If question is too general, ask the user some clarifying questions.
// 4. Optionally: retrieve a list of similar "well formed" questions asked by other users
// 5. Give suggestions on language substitutions found in the document.

// Once the user has answered all questions, embed the new question in vector embeddings.

// Do for each applicable jurisdiction level (ex: federal vs state vs county corpus of documents)
// for each jurisdiction level:


    // Do the following concurrently:
        // 1. Similarity search on each separate partition of the document.
        // 2. Instantiate an agent for each partition that returns a section with a similarity score higher than threshold.
        
        // - The agent will have the ability to traverse the document, and will bring the question's embedding with it.
        // - Recursively traverse the document until a stop condition is met:
        // -- The similarity of the question to the current node is below a threshold
        // -- All possible paths have been traversed
        // -- A step limit has been reached
        // -- The agent reaches the edge of the document

        // An agent will start with 1 per document partition.
        // - Each time traversal is done, the agent will duplicate into N agents, where N represents the number of possible paths.
        // - Each duplicate agent is not allowed to return to a previous node.
        // - Upon completion of traversal, all agents will break recursion and return to the starter node.
        // - A heatmap or dictionary of nodes visited will be returned.
        // - The top K most visited nodes will be returned.

        // Each top K most visited node will have a TOPIC returned.

    // Call GPT 3.5 to combine similar topics into K topics, as well as keep track of which nodes apply to which topics.
    // - FIRST TOPIC SHOULD ALWAYS BE THE ORIGINAL QUESTION

    // Concurrently: 
        // 1. call GPT 3.5 to create a partial answer for each section applying to a topic.
        // 2. call GPT 4 to create a summary template combining all topics.

    // Stream the answer to the OG topic to the user

    // For each topic in the summary template:
        // Insert relevant sections into the summary template under each jurisdiction level.
        // Concurrently call GPT 3.5 to fully refine the summary template for each section.
        // Stream the answer to the user.

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
