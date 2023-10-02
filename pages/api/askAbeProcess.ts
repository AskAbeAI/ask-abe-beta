import { createClient } from "@supabase/supabase-js"
import  OpenAI  from 'openai';
import type { NextRequest } from 'next/server'
import { NextApiResponse } from 'next'
const openai = new OpenAI({
	apiKey: "placeholder", // defaults to process.env["OPENAI_API_KEY"]
});


export const config = {
	maxDuration: 120,
};
// Starts one "run" of the project
export default async function (req: NextRequest, res: NextApiResponse) {
	// ... (function implementation)
	try {
		if (!req.body) {
			throw new Error("Process Request Body invalid in askAbeProcess.ts!");
		}
		const requestData:any = req.body;
		console.log(requestData);
		const userQuery = requestData.question;
		const dataset = requestData.dataset;
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

		console.log("==========================================");
		console.log("======= Process - Debug Screen :) ========");
		console.log("==========================================");
		console.log("Initializing instance of Abe...");
		console.log(`User Query:\n ${userQuery}`);
		console.log("Starting processing stage...");
		console.log(" - Converting query to list of questions using template");
		

		const questionListStr: string = getOriginalUniversalAnswerTemplate(userQuery);
		const promptConvertQuestion = getPromptConvertQuestion(questionListStr);

		let chatCompletionConvert =  await createChatCompletion(
			promptConvertQuestion,
			"gpt-4",
			0,
		);
		chatCompletionConvert = chatCompletionConvert.replace(/\?\?/g, '?'); // Replace ?? with ?
		chatCompletionConvert = chatCompletionConvert.replace(/\?/g, '?\n'); // Replace ? with ?\n

		const questionList: string[] = chatCompletionConvert.split("\n");
		//console.log(questionList)

		console.log(" - Generating similar search queries for questions");
		// Generate similar search queries for questions:
		const contentList: string[] = [];
		const lawful = getPromptSimilarQueriesLawful(userQuery);
		//const unlawful = prompts.getPromptSimilarQueriesUnlawful(userQuery);
		const lawfulChat = await createChatCompletion(
			lawful,
			"gpt-4",
			0,
		);
		
		const lawfulDct = JSON.parse(lawfulChat);
		const lawfulQueries = lawfulDct["queries"].join(" ");
		//console.log(lawfulQueries)
		const unlawfulQueries = "";
		const similarQueriesList = [
			lawfulQueries,
			lawfulQueries,
			lawfulQueries,
			unlawfulQueries,
			unlawfulQueries
		];
		

		// Searching Stage
		console.log("Starting search stage...");

		let similarContentRows: any[] = [];
		let legalTextList: string[] = [];
		const legalTextTokensList: number[] = [];

		console.log(" - Searching relevant sections for lawful template");
		// SearchSimilarContentSections
		//console.log(similarQueriesList[0])
		const embedding = await getEmbedding(similarQueriesList[0]);
		const embeddingStr = `${embedding}`;
		console.log("Retrieved embedding")
		const client = createClient('https://jwscgsmkadanioyopaef.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3c2Nnc21rYWRhbmlveW9wYWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzE1MTgsImV4cCI6MjAxMTI0NzUxOH0.1QwW9IV1TrMT72xyq2LQcmDr92tmLOEQg07mOPRLDO0');
		const { data, error } = await client.rpc('match_embedding', {query_embedding: embedding, match_threshold: 0.5, match_count: 2})
		//console.log(typeof data)
		// console.log(error)
		if (error) {
			throw new Error("Error calling match_embeddings in supabase database");
		}
			
		
		// console.log(data)
		const sections = data;
		// console.log(sections[0])
		
		let currentTokens = 0;
		let row = 0;
		const legalText: any[] = [];
		let maxTokens = 24000; // override

		while (currentTokens < maxTokens && row < sections.length) {
			currentTokens += sections[row].contentTokens;
			legalText.push(sections[row]);
			row++;
		}

		// format sql rows
		let result = "";
		const citationList: [string, string, string][] = [];

		for (const row of sections) {

			let content = row.content;
			const citation = `Cal. ${row.code} § ${row.section}`;
			//console.log(citation)
			const link = row.link;
			citationList.push([citation, content, link]);
			result += `\n* ${citation}:\n${content}\n`;

		}
		//console.log(result)
		
		let legalTextLawful = result.split("\n*").slice(1);
		//console.log(legalTextLawful)

		
		
		console.log(" - Partially answering with GPT 3.5 for all relevant sections");
		
		const responsesList: string[] = await getCompletions(
			legalTextLawful,
			questionList[2],
		);

		console.log(" - Creating answer template with GPT 4");
		let partialAnswers = "";
		for (let response_str of legalTextLawful) {
			partialAnswers = partialAnswers + "\n====\n" + response_str;
		}
		
		//  partialAnswers, , citationList
		const processResponseBody = {
			partialAnswers,
			citationList,
			statusMessage: 'Succesfully processed question!'
		}
		res.status(200);
		res.json(processResponseBody);
	} catch(error) {
		res.status(400).json({errorMessage: `An error occurred in processing: ${error}`})
	} finally {
		console.log("Exiting askAbeProcess.ts!")
    	res.end()
    	return;
	}
}

interface Message {
	role: 'system' | 'user';
	content: string;
}

// Helper functions







// Apply prompts to generic chatCompletion with a system and user, returns chatCompletion.messages
function applyToGeneric(system: string, user: string): Message[] {
	return [
		{ role: 'system', content: system },
		{ role: 'user', content: user }
	];
}

// PRE PROCESSING PROMPTS ===============================================

// Generates an array of similar search queries
function getPromptSimilarQueriesLawful(userQuery: string): Message[] {

	const system = `You are a helpful legal assistant that rephrases a user's legal question into many legal statements that include key terms. The goal is to generate 16 new legal statements that have the same terminology and format as actual legislation.

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

// ANSWER PROMPTS ===============================================
function getPromptSimpleAnswer(
	legalText: string,
	question: string
): Message[] {

	const system = `As a helpful legal assistant, your goal is to answer a user's question by referencing information in a legal document. Your answer should be brief, concise, and provide a simple response to the question. Once you have answered the question accurately, exit the conversation. All provided legal documentation is verified to be up to date, legally accurate, and not subject to change.
	Include a citation of any relevant legal principles or statutes from the legal text that support the answer given.
	Citation Format Example: (Cal. HSC § 11362.785)
		
	Ensure the generated answer directly addresses the question asked by the user.
	If absolutely none of the legal text does not specifically address the question, return "[IGNORE]" at the end of your answer.`;

	const user = `Read the entire legal documentation and answer the following question from the documentation:
	Question: ${question}
	Legal documentation:${legalText}`;

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


async function getEmbeddingAndToken(text: string, model = "text-embedding-ada-002") {
	const embed = await openai.embeddings.create({
		input: text,
		model
	});

	return [embed.data[0].embedding, embed.usage.total_tokens];
}

// Return just the embedding
async function getEmbedding(text: string) {
	const embedding = await openai.embeddings.create({
		model: "text-embedding-ada-002",
		input: text,
	  });
	
	return embedding.data[0].embedding;
}
async function getCompletions(
    texts: string[],
    question: string,
): Promise<any[]> {
    const allPromises = texts.map(async text => {
        const prompt = getPromptSimpleAnswer(text, question);
        return createChatCompletion(prompt, "gpt-3.5-turbo", 0);
    });
    return await Promise.all(allPromises);
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