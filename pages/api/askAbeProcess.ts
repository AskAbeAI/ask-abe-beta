import { createClient } from "@supabase/supabase-js";
import OpenAI from 'openai';
import type { NextRequest } from 'next/server';
import { NextApiResponse } from 'next';
const openai = new OpenAI({
	apiKey: "placeholder", // defaults to process.env["OPENAI_API_KEY"]
});



// Starts one "run" of the project
export default async function process(req: NextRequest, res: NextApiResponse) {
	// ... (function implementation)
	try {
		if (!req.body) {
			throw new Error("Process Request Body invalid in askAbeProcess.ts!");
		}
		const requestData: any = req.body;
		const userQuery = requestData.question;
		const jurisdiction = requestData.dataset;
		openai.apiKey = requestData.apiKey;
		

		interface Row {
			id: number;
			similarity: number;
			code: string;
			division: string;
			title: string;
			part: string;
			chapter: string;
			article: string;
			section: string;
			content: string;
			definitions: string;
			titlePath: string;
			contentTokens: number;
			definitionTokens: number;
			link: string;
		}


		const questionListStr: string = getOriginalUniversalAnswerTemplate(userQuery);
		const promptConvertQuestion = getPromptConvertQuestion(questionListStr);

		let chatCompletionConvert = await createChatCompletion(
			promptConvertQuestion,
			"gpt-4",
			0,
		);
		chatCompletionConvert = chatCompletionConvert.replace(/\?\?/g, '?'); // Replace ?? with ?
		chatCompletionConvert = chatCompletionConvert.replace(/\?/g, '?\n'); // Replace ? with ?\n

		const questionList: string[] = chatCompletionConvert.split("\n");
		//console.log(questionList)
		let data_final;
		let error_final;
		
		const embedding = await getEmbedding(userQuery);
		const client = createClient('https://jwscgsmkadanioyopaef.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3c2Nnc21rYWRhbmlveW9wYWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzE1MTgsImV4cCI6MjAxMTI0NzUxOH0.1QwW9IV1TrMT72xyq2LQcmDr92tmLOEQg07mOPRLDO0');
		if (jurisdiction === 'EU MICA Regulations') {
			const { data, error } = await client.rpc('match_embedding_mica', { query_embedding: embedding, match_threshold: 0.5, match_count: 1 });
			data_final = data;
			error_final = error;
		} else {
			const { data, error } = await client.rpc('match_embedding', { query_embedding: embedding, match_threshold: 0.5, match_count: 1 });
			data_final = data;
			error_final = error;
		}
		
		if (!data_final) {
			throw new Error("type error for data_final!")
		}
		const first_legal_text = data_final[0].content
		console.log(first_legal_text)
		
		// Generate similar search queries for questions:
		const lawful = getPromptSimilarQueriesLawful(userQuery);
		//const unlawful = prompts.getPromptSimilarQueriesUnlawful(userQuery);
		const lawfulChat = await createChatCompletion(
			lawful,
			"gpt-3.5-turbo",
			0,
		);

		const lawfulDct = JSON.parse(lawfulChat);
		const similarQueries = lawfulDct["queries"].join(" ");

		//  return questionList, lawfulQueries
		const processResponseBody = {
			questionList,
			similarQueries,
			statusMessage: 'Succesfully processed question!'
		};
		res.status(200);
		res.json(processResponseBody);
	} catch (error) {
		res.status(400).json({ errorMessage: `An error occurred in processing: ${error}` });
	} finally {
		console.log("Exiting askAbeProcess.ts!");
		res.end();
		return;
	}
}

interface Message {
	role: 'system' | 'user';
	content: string;
}

// Helper functions
function applyToGeneric(system: string, user: string): Message[] {
	return [
		{ role: 'system', content: system },
		{ role: 'user', content: user }
	];
}
// PRE PROCESSING PROMPTS ===============================================

// Generates an array of similar search queries
function getPromptSimilarQueriesLawful(userQuery: string): Message[] {

	const system = `You are a helpful legal assistant that rephrases a user's legal question into many legal statements that include key terms. The goal is to generate 16 new legal statements that have the same terminology, style, and format as actual legislation.

Generate legal statements that follow these criteria:
1. Include similar meaning of the original question. 
2. Include variation of related keywords from this list ["Lawful", "legal", "valid", "warranted", "legitimate", "permissible", "rights", "privileges", "authority", "as authorized by", "as otherwise provided by law", "shall not be a violation of state or local law", "shall be lawful"]


Return in JSON format: {"queries": ["query_1", "query_2", "query_3"]}`;

	const user = `User question: ${userQuery}`;

	return applyToGeneric(system, user);
}

function getPromptSimilarQueriesUnlawful(userQuery: string): Message[] {

	const system = `You are a helpful legal assistant that rephrases a user's legal question into many legal statements that include key terms. The goal is to generate 16 new legal statements that have the same terminology and format as actual legislation.

Generate legal statements that follow these criteria:  
1. Include similar meaning of the original question.
2. Include variation of related keywords from this list ["unlawful", "criminal", "illicit", "prohibited", "illegitimate", "against the law", "shall be punished", "guilty of", "restrictions", "does not permit", "violation", "the offense"]

Return in JSON format: {"queries": ["query_1", "query_2", "query_3"]}`;

	const user = `User question: ${userQuery}`;

	return applyToGeneric(system, user);
}
// SCORING PROMPTS ===============================================
// Combine and rephrase all template questions to ask about specific topics in a user query
function getPromptConvertQuestion(OGQuestionList: string): Message[] {

	let systemFormat = '';

	for (let i = 0; i < OGQuestionList.length - 1; i++) {
		systemFormat += `QUESTION ${i + 1}:`;
	}

	const system = `You will be provided with a user query and generic questions.

	Rephrase all questions by applying the topics in the user_query. Keep question 1 and 2 in their original phrasing.

	Output should be in a single string with the following format:
	${systemFormat}`;
	const user = OGQuestionList;
	return applyToGeneric(system, user);
}
// UNIVERSAL ANSWER TEMPLATES ===============================================
// USE THIS
function getOriginalUniversalAnswerTemplate(userQuery: string): string {
	return `
		User_Query: ${userQuery}\n,
		QUESTION 1: What is the simple answer to ${userQuery}?\n,
		QUESTION 2: What is the exact legal text that answers ${userQuery}?\n,
		Question 3: What rights and privileges does a user have relating to TOPICS?\n,
		Question 4: What are restrictions, caveats, and conditions to TOPICS?\n,
		Question 5: What are any penalties, punishments, or crimes which apply to violating restrictions of TOPICS?
		`;
}
// single completion
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

async function getEmbedding(text: string) {
	const embedding = await openai.embeddings.create({
		model: "text-embedding-ada-002",
		input: text,
	});

	return embedding.data[0].embedding;
}