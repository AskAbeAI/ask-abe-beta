import OpenAI from "openai";
import {
	ClarificationChoices,
	node_as_row,
	questionJurisdictions,
	text_citation_document_trio,
	Node,
	AnswerChunk,
} from "@/lib/types";
import { NextResponse } from "next/server";
import {
	condenseClarificationsIntoInstructions,
	answeringInstructionsHelper,
	answerNewQuestionHelper,
} from "@/lib/helpers";
import {
	generateApiRequestReport,
	generateApiResponseReport,
} from "@/lib/utilities";
import {
	BaseResponse,
	AnswerNewQuestionRequest,
	AnswerNewQuestionResponse,
} from "@/lib/api_types";

const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
	apiKey: openAiKey,
});
const API_ROUTE = "api/answerQuery/directAnswering";
export const maxDuration = 120;

export function OPTIONS(req: Request) {
	//console.log(req.headers)
	// Set CORS headers
	const headers = {
		"Access-Control-Allow-Origin": "https://www.strikingly.com", // Modify as needed for your use case
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
		// Include any other headers you might need for your requests
	};

	// Return the response with CORS headers and no body
	return new NextResponse(null, { status: 204, headers });
}

export async function POST(req: Request) {
	const startTime = Date.now();
	console.log("=== directAnswering API ENDPOINT ===");

	const request: AnswerNewQuestionRequest = await req.json();
	console.log(request);
	generateApiRequestReport(request.base, API_ROUTE);

	let errorMessage: string | undefined = undefined;
	let directAnswer: AnswerChunk[] = [];

	const refinedQuestion = request.refinedQuestion;
	const primaryRows: Node[] = request.primaryRows;

	const questionJurisdictions: questionJurisdictions =
		request.questionJurisdictions;

	try {
		const customer_information =
			"The customer is interested in getting accurate legal information about their question. They are a resident of the applicable jurisdiction. They are looking for a general answer to their question, not specific legal advice. They only want to understand current legislation, not any future or upcoming changes.";
		const instructions = await answeringInstructionsHelper(
			request.base,
			openai,
			refinedQuestion,
			customer_information,
			[],
		);
		console.log("Finished instructions!");

		directAnswer = await answerNewQuestionHelper(
			request.base,
			openai,
			refinedQuestion,
			instructions,
			primaryRows,
		);
		console.log("Returned from directAnswerHelper!");
		console.log(directAnswer);
	} catch (error) {
		console.log(error);
		errorMessage = `${error},\n`;
		if (error instanceof Error) {
			errorMessage += error.stack;
		}
	} finally {
		const baseResponse: BaseResponse = {
			pipelineModel: request.base.pipelineModel,
		};
		if (errorMessage !== undefined) {
			baseResponse.errorMessage = errorMessage;
		}
		const response: AnswerNewQuestionResponse = {
			base: baseResponse,
			directAnswer: directAnswer,
		};

		generateApiResponseReport(
			request.base,
			API_ROUTE,
			response?.base.errorMessage,
		);
		return NextResponse.json(response);
	}
}
