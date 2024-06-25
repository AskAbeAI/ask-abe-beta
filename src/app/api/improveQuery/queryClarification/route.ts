import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
	condenseClarificationsIntoInstructions,
	generateNewClarificationQuestion,
	generateMultipleClarificationQuestions,
} from "@/lib/helpers";
import { Clarification } from "@/lib/types";
import { insert_api_debug_log } from "@/lib/database";
import {
	QueryClarificationRequest,
	QueryClarificationResponse,
	BaseRequest,
	BaseResponse,
} from "@/lib/api_types";
import {
	generateApiRequestReport,
	generateApiResponseReport,
} from "@/lib/utilities";

const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
	apiKey: openAiKey,
});
export const maxDuration = 120;

const API_ROUTE = "api/improveQuery/queryClarification";
export async function POST(req: Request) {
	const startTime = Date.now();
	console.log("=== queryClarification API ENDPOINT ===");

	if (openAiKey === undefined) {
		throw new Error("process.env.OPENAI_API_KEY is undefined!");
	}

	const request: QueryClarificationRequest = await req.json();

	generateApiRequestReport(request.base, API_ROUTE);
	const userPromptQuery: string = request.userPromptQuery;
	const clarificationMode: string = request.clarificationMode;

	let errorMessage: string | undefined = undefined;

	try {
		console.log("Placeholder for queryClarification.");
	} catch (error) {
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
		const response: QueryClarificationResponse = {
			base: baseResponse,
		};

		generateApiResponseReport(
			request.base,
			API_ROUTE,
			response?.base.errorMessage,
		);
		return NextResponse.json(response);
	}
}
