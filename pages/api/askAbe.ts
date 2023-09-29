// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Project Ref: jwscgsmkadanioyopaef
import { Dataset, AnswerBody } from '../../types/types';
import { SupabaseClient } from "@supabase/supabase-js";
import  OpenAI  from 'openai';
const openai = new OpenAI({
	apiKey: "placeholder", // defaults to process.env["OPENAI_API_KEY"]
  });



// Starts one "run" of the project
export const runAbe = async function* (client: SupabaseClient, userQuery: string, openAiKey: string): AsyncGenerator<string> {
	// ... (function implementation)
	openai.apiKey = openAiKey;

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

	console.log("================================");
	console.log("======= Debug Screen :) ========");
	console.log("================================");
	console.log("Initializing instance of Abe...");
	console.log(`User Query:\n ${userQuery}`);


	console.log("Starting processing stage...");
	// Get similar queries by calling GPT 3.5, maybe Google BARD instead
	console.log(" - Converting query to list of questions using template");
	// Convert Query To Question List

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
	console.log(questionList)

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
	console.log(lawfulQueries)
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
	console.log(similarQueriesList[0])
	const embedding = await getEmbedding(similarQueriesList[0]);
	const embeddingStr = `${embedding}`;
	console.log("Retrieved embedding")
	
	const { data, error } = await client.rpc('match_embedding', {query_embedding: embedding, match_threshold: 0.5, match_count: 40})
	console.log(data)
	console.log(error)
	if (error) {
		throw new ApplicationError('Error calling match_embeddings in supabase database');
	}
	const sections: any[] = ["Error"]
	if (data) {
		const sections = data;
	}
	console.log(sections)
	
	let currentTokens = 0;
	let row = 0;
	const legalText: any[] = [];
	let maxTokens = 24000; // override

	while (currentTokens < maxTokens && row < sections.length) {
		currentTokens += sections[row][12];
		legalText.push(sections[row]);
		row++;
	}

	// format sql rows
	let result = "";
	const citationList: [string, string, string][] = [];

	for (const row of sections) {

		let content = row.content;
		const citation = `Cal. ${row.code} § ${row.section}`;
		const link = row.link;
		citationList.push([citation, content, link]);
		result += `\n* ${citation}:\n${content}\n`;

	}
	
	let legalTextLawful = result.split("\n*").slice(1);
	console.log(legalTextLawful)

	
	console.log("Starting answering stage...");
	
	const responsesList: string[] = await getCompletions(
		legalTextLawful,
		questionList[2],
	);

	console.log(" - Creating answer template with GPT 4");
	let responseTotal = "";
	for (let response_str of legalTextLawful) {
		responseTotal = "====" + responseTotal;
	}
	const promptSummarize = getPromptSummaryTemplate(userQuery, responseTotal);
	const summaryTemplate = await createChatCompletion(
		promptSummarize,
		"gpt-4",
		1,
	);
	console.log("Finished creating answer template.")
	let finalAnswer= "";
	for await (const message of populateSummaryTemplate(userQuery, responseTotal, summaryTemplate)) {
		if (message) {
			finalAnswer += message;
			yield message;
		}
	}
	let citedSections = findSectionsCited(citationList, finalAnswer);
	return citedSections;

}

interface Message {
	role: 'system' | 'user';
	content: string;
}

// Helper functions
function findSectionsCited(citationList: any[], finalAnswer: string) {

	let citedSections = "";

	for (const tup of citationList) {
		const citation = tup[0];
		if (!finalAnswer.includes(citation)) {
			continue;
		}

		const content = tup[1];
		const link = tup[2];

		const sectionCitation = `<a href="${link}" target="_blank" id="${citation}">${citation}</a>\n<p>${content}</p>\n`;

		citedSections += sectionCitation;
	}

	return citedSections;
}

function linkAnswerToCitations(citationList: any[], finalAnswer: string) {

	for (const tup of citationList) {
		const citation = tup[0];
		if (!finalAnswer.includes(citation)) {
			continue;
		}

		const newCitation = `<a href="#${citation}">${citation}</a>`;
		finalAnswer = finalAnswer.replace(citation, newCitation);
	}

	return finalAnswer;
}


async function* populateSummaryTemplate(
	question: string,
	legalDocumentation: string,
	template: string
) {

	const promptPopulate = getPromptPopulateSummaryTemplate(question, template, legalDocumentation);
	for await (const message of streamChatCompletion(
		promptPopulate,
		"gpt-3.5-turbo-16k",
		0,
	)) {
		yield message;
	}

}




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

// Using legal text as input, answer all questions from a specific answer template

function getPromptSummaryTemplate(
	question: string,
	legalDocumentation: string
): Message[] {

	// 201 tokens in system message
	const system = `Using the supplied legal question and its corresponding legal documentation, produce a markdown structure that outlines the essential themes and ideas. This structure will guide a legal expert in answering the posed question.

**Input Description:**

- **Question**: A distinct legal query needing expert interpretation.
- **Legal Documentation**: The reference material that a legal expert will use to formulate an answer.  

**Instructions:**

1. Start by dissecting the question to understand its primary themes and key concerns.
2. Delve into the legal documentation, extracting the principal ideas and related concepts that will aid in answering the question.
3. While structuring the markdown:
- Use "#" for principal ideas taken from the legal documentation.
- For each main idea, establish secondary points and label them using "##".
- Beneath each secondary point, highlight any tertiary points with "###".  
- For each detail or specific concept which applies to an idea, write ">" and guidance to the legal expert on how to answer the legal question, as well as legal citations from where this answer may come from.
4. Keep the guidance concise, especially for the ">" level. Avoid placeholders or lengthy notes. The emphasis should be on clear headers and brief guidance.  

The first main idea should always be a rephrasing of the question followed by a sub-idea called TLDR, which has guidance on giving a simple and short answer to the user question.

**Output:**

A carefully curated markdown blueprint with clear titles, headers, and succinct guidance. This blueprint should seamlessly guide a legal expert in their endeavor to comprehensively address the posed question using the supplied legal documentation.`;

	const user = JSON.stringify({
		Question: question,
		LegalDocumentation: legalDocumentation
	});

	return applyToGeneric(system, user);
}

function getPromptPopulateSummaryTemplate(
	question: string,
	template: string,
	legalDocumentation: string
) {

	const user = JSON.stringify({
		Template: template,
		LegalDocumentation: legalDocumentation,
		Question: question
	});

	const system = `Using the provided markdown template and the associated legal documentation, improve the initial guidance from the legal expert to become a full answer with pertinent details and in line citations. 

**Input Description:**

- **Template**: A structured markdown outline utilizing various levels of headers (#, ##, ###, ####). The ">" symbol in the template signifies guidance from a legal expert, which should be improved and refined.

- **Legal Documentation**: Your primary reference material containing all necessary information to address the legal inquiry. Use this document to derive content to replace the guidance after the ">" in the template.

- **Question**: The specific legal inquiry that will be answered using the populated template and the legal documentation.

**Instructions:**

1. Thoroughly acquaint yourself with the template. Note areas marked by the ">" symbol; these are pointers from the legal expert that should be improved and refined with content and citations.

2. Delve into the legal documentation, sourcing information that aligns with the ">" pointers and the related headers.

3. In the sections with ">", substitute the expert's guidance with relevant content from the legal documentation, ensuring to include legal citations in line.

4. Emphasize accuracy and integrity, ensuring that the content reflects the essence and specifics of the original legal documentation. 

**Output:**

A refined markdown template where guidance after the ">" symbol has been seamlessly refined with content from the legal documentation, resulting in a well-structured response to the legal inquiry.`;

	return applyToGeneric(system, user);
}


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

function getPromptUpdateAnswer(
	legalText: string,
	question: string
): Message[] {

	const system = `As a helpful legal assistant, answer a legal question in a simple and concise manner. You will be provided with a legal question and accompanying legal documentation.

Follow these guidelines:  
1. Ensure the answer directly addresses the legal question and is easy to understand.
2. Include a clear citation to the specific legal section that supports the answer. 
3. Keep the answer concise, and answer the question in 1 topic sentence.
4. If you can answer yes or no to the question, include yes or no in your answer.`;

	const user = `question: ${question}
	documentation: ${legalText}`;

	return applyToGeneric(system, user);
}


// SCORING PROMPTS ===============================================

// Score questions on a) relevancy of legal text (sections) to user's question, b) quality of generated answer based on legal text
function getPromptScoreQuestions(
	legalText: string,
	templateQuestions: string[],
	generatedAnswers: string[]
): Message[] {

	const system = `You are LawProfessorGPT, a witheringly critical legal scholar who reviews answers to legal questions to ensure that they are comprehensive and grounded entirely in the provided legal text.

	You will be provided pairs of questions and answers to score.
	For each pair, answer the following questions and output a score in the format [(Relevance_score 1, Answer_score 1), (), (), (), ()].
		Relevance_score: Based on the provided legal text, how relevant are the given sections of legal text to the user's question (on a scale from 0 to 100)?
		Answer_score: How well does the provided answer address the user's question based on the legal text (on a scale from 0 to 100)?`;

	const user = `Legal Text: ${legalText}\n\n
	(Question 1: ${templateQuestions[0]}, Answer 1: ${generatedAnswers[0]})\n  
	(Question 2: ${templateQuestions[1]}, Answer 2: ${generatedAnswers[1]})\n
	(Question 3: ${templateQuestions[2]}, Answer 3: ${generatedAnswers[2]})\n
	(Question 4: ${templateQuestions[3]}, Answer 4: ${generatedAnswers[3]})\n
	(Question 5: ${templateQuestions[4]}, Answer 5: ${generatedAnswers[4]})\n`;

	return applyToGeneric(system, user);
}

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


async function* streamChatCompletion(prompt: Message[], usedModel: string, temp: number) {
	const completion = await openai.chat.completions.create({
	  model: usedModel,
	  messages: prompt,
	  stream: true,
	  temperature: temp,
	});
  
	for await (const chunk of completion) {
	  yield chunk.choices[0].delta.content;
	}
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


	




