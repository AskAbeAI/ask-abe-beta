import { NextResponse } from "next/server";
import OpenAI from "openai";
import { scoreQuestionHelper } from "@/lib/helpers";
import { PipelineModel, PhaseReport, PhaseType } from "@/lib/types";
import {
	BaseResponse,
	QueryScoringRequest,
	QueryScoringResponse,
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

const questionClarityScoreToUserMessage = (quality_score: number) => {
	let message_to_user: string = "Placeholder!";
	if (quality_score <= 1) {
		// If query is so bad it needs to be restarted, scored 0-1.
		message_to_user =
			"I'm sorry, I don't quite understand how your query is relevant to the law. Can you restate your query in a different way or ask a different question?";
	} else if (quality_score == 7) {
		// Question is already excellent, scored 7.
		message_to_user =
			"Great question! I would still like to ask a few clarifying questions to better understand your query.";
	} else {
		// If query needs more work or is bad, scored 2-6.
		message_to_user =
			"I'd like to ask a few clarifying questions to better understand your query. Please answer the following questions to the best of your ability.";
	}

	return message_to_user;
};

const API_ROUTE: string = "api/improveQuery/queryScoring";

export async function POST(req: Request) {
	console.log("=== queryScoring API ENDPOINT ===");

	if (openAiKey === undefined) {
		throw new Error("process.env.OPENAI_API_KEY is undefined!");
	}

	const request: QueryScoringRequest = await req.json();

	generateApiRequestReport(request.base, API_ROUTE);
	let messageToUser = "";
	let qualityScore = 0;
	let errorMessage: string | undefined = undefined;

	try {
		qualityScore = await scoreQuestionHelper(
			request.base,
			openai,
			request.userQuery,
		);
		messageToUser = questionClarityScoreToUserMessage(qualityScore);
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
		const response = {
			base: baseResponse,
			messageToUser: messageToUser,
			qualityScore: qualityScore,
		};

		generateApiResponseReport(
			request.base,
			API_ROUTE,
			response?.base.errorMessage,
		);
		return NextResponse.json(response);
	}
}
