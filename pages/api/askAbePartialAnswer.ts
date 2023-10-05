import OpenAI from 'openai';
import type { NextRequest } from 'next/server';
import { NextApiResponse } from 'next';
import { ApplicationError, UserError } from '@/lib/errors';



const openai = new OpenAI({
	apiKey: "placeholder", // defaults to process.env["OPENAI_API_KEY"]
});
export default async function partialAnswer(req: NextRequest, res: NextApiResponse) {

    console.log("=================================================");
    console.log("======= Partial Answer - Debug Screen :) ========");
    console.log("=================================================");


    const requestData: any = req.body;
    const legalTextLawful = requestData.legalText;
    openai.apiKey = requestData.openAiKey;
    const templateQuestion = requestData.templateQuestion;
	const citationExample = requestData.citationExample
    // CHECK FOR INITIAL ERRORS


    try {
        // API LOGIC HERE
        console.log(" - Partially answering with GPT-3.5-turbo for all relevant legal sections");

        const responsesList: string[] = await getCompletions(
            legalTextLawful,
            templateQuestion,
			citationExample,
        );
        console.log("Exiting concurrent API calls")
        let partialAnswers = "";
        for (let response_str of responsesList) {
            partialAnswers = partialAnswers + "\n====\n" + response_str;
        }
        //  return partialAnswers
		const partialAnswerResponseBody = {
			partialAnswers,
			statusMessage: 'Succesfully completed partial answering!'
		};
		res.status(200);
		res.json(partialAnswerResponseBody);
    } catch (error) {
        res.status(400).json({ errorMessage: `An error occurred in partial answering: ${error}` });
    } finally {
        console.log("Exiting askAbePartialAnswers.ts!");
        res.end();
        return;
    }
}


interface Message {
	role: 'system' | 'user';
	content: string;
}

async function getCompletions(
	texts: string[],
	question: string,
	citationExample: string
): Promise<any[]> {
	const allPromises = texts.map(async text => {
		const prompt = getPromptSimpleAnswer(text, question, citationExample);
		return createChatCompletion(prompt, "gpt-3.5-turbo-16k", 0);
	});
	return await Promise.all(allPromises);
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
function getPromptSimpleAnswer(
	legalText: string,
	question: string,
	citationExample: string,
): Message[] {

	const system = `As a helpful legal assistant, your goal is to answer a user's question by referencing information in a legal document. Your answer should be brief, concise, and provide a simple response to the question. Once you have answered the question accurately, exit the conversation. All provided legal documentation is verified to be up to date, legally accurate, and not subject to change.
	Include all citations of any relevant legal principles or statutes from the legal text that support the answer given.
	Citation Example:"[${citationExample}]"
		
	Ensure the generated answer directly addresses the question asked by the user and includes important information from the legal documentation.
	If absolutely none of the legal text does not specifically address the question, return "[IGNORE]" at the end of your answer.`;

	const user = `Read the entire legal documentation and answer the following question from the documentation:
	Question: ${question}
	Legal documentation:${legalText}`;

	return applyToGeneric(system, user);
}

// Apply prompts to generic chatCompletion with a system and user, returns chatCompletion.messages
function applyToGeneric(system: string, user: string): Message[] {
	return [
		{ role: 'system', content: system },
		{ role: 'user', content: user }
	];
}