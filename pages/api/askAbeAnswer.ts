import  OpenAI  from 'openai';
import type { NextRequest } from 'next/server'
import { NextApiResponse } from 'next'
const openai = new OpenAI({
	apiKey: "placeholder", // defaults to process.env["OPENAI_API_KEY"]
});

// userQuery, openAIkey, summaryTemplate, responseTotal
export default async function (req: NextRequest, res: NextApiResponse) {

    console.log("=========================================");
	console.log("======= Answer - Debug Screen :) ========");
	console.log("=========================================");
    try {

    
        if (!req.body) {
            throw new Error("Answer Request Body invalid in askAbeAnswer.ts!");
        }
        console.log("Starting answering stage...");
        const requestData:any = req.body;
        const userQuery = requestData.userQuery;
        const summaryTemplate = requestData.summaryTemplate;
        const partialAnswers = requestData.partialAnswers;
    
        openai.apiKey = requestData.openAiKey;

        let finalAnswer= "";
        console.log("  - Populating summary template with GPT 4")
        for await (const message of populateSummaryTemplate(userQuery, partialAnswers, summaryTemplate)) {
            if (message) {
                finalAnswer += message;
                //yield message;
            }
        }
        console.log("  - Finished populating summary template.")
        const answerResponseBody = {
            finalAnswer,
            statusMessage: 'Succesfully answered question!'
        }
        res.status(200);
        res.json(answerResponseBody);
    } catch(error) {
		res.status(400).json({errorMessage: `An error occurred in answering: ${error}`})
	} finally {
		console.log("Exiting askAbeAnswer.ts!")
    	res.end()
    	return;
	}
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