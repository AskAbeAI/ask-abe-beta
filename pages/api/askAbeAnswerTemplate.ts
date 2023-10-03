import OpenAI from 'openai';
import type { NextRequest } from 'next/server';
import { NextApiResponse } from 'next';
const openai = new OpenAI({
	apiKey: "placeholder", // defaults to process.env["OPENAI_API_KEY"]
});

// userQuery, openAIkey, summaryTemplate, responseTotal
export default async function (req: NextRequest, res: NextApiResponse) {

	
	try {
		if (!req.body) {
			throw new Error("Answer Template Request Body invalid in askAbeTemplate.ts!");
		}
		const requestData: any = req.body;
		const userQuery = requestData.userQuery;
		const partialAnswers = requestData.partialAnswers;
		openai.apiKey = requestData.openAiKey;

		const promptSummarize = getPromptSummaryTemplate(userQuery, partialAnswers);
		let summaryTemplate = await createChatCompletion(
			promptSummarize,
			"gpt-4",
			0.6,
		);
		summaryTemplate = summaryTemplate.replace(/\n- /g, "> ");
		// return summaryTemplate, partialAnswers
		const templateResponseBody = {
			summaryTemplate,
			statusMessage: 'Succesfully created answer template!'
		};
		res.status(200);
		res.json(templateResponseBody);
	} catch (error) {
		res.status(400).json({ errorMessage: `An error occurred in templating: ${error}` });
	} finally {
		console.log("Exiting askAbeTemplate.ts!");
		res.end();
		return;
	}
}


function applyToGeneric(system: string, user: string): Message[] {
	return [
		{ role: 'system', content: system },
		{ role: 'user', content: user }
	];
}
interface Message {
	role: 'system' | 'user';
	content: string;
}
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

The first main idea should always be a rephrasing of the question followed by a sub-idea called TLDR, where you should write ">" and guidance on giving a simple and short answer to the user question.

**Output:**

A carefully curated markdown blueprint with clear titles, headers, and succinct guidance. This blueprint should seamlessly guide a legal expert in their endeavor to comprehensively address the posed question using the supplied legal documentation.`;

	const user = JSON.stringify({
		Question: question,
		LegalDocumentation: legalDocumentation
	});

	return applyToGeneric(system, user);
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