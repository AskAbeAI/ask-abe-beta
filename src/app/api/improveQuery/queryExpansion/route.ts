import { NextResponse } from "next/server";
import { PipelineModel, PhaseReport, PhaseType } from "@/lib/types";
import {
	BaseResponse,
	QueryExpansionRequest,
	QueryExpansionResponse,
} from "@/lib/api_types";
import { expandQueryHelper, generateEmbedding } from "@/lib/helpers";
import OpenAI from "openai";
import { insert_api_debug_log } from "@/lib/database";
import {
	generateApiRequestReport,
	generateApiResponseReport,
} from "@/lib/utilities";

const openAiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
	apiKey: openAiKey,
});
export const maxDuration = 120;

export function OPTIONS(req: Request) {
	console.log(req.headers);
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
const API_ROUTE: string = "api/improveQuery/queryExpansion";

export async function POST(req: Request) {
	console.log("=== QUERY EXPANSION API ENDPOINT ===");

	if (openAiKey === undefined) {
		throw new Error("process.env.OPENAI_API_KEY is undefined!");
	}
	const request: QueryExpansionRequest = await req.json();

	// Create the API_REQUEST report and add it.
	generateApiRequestReport(request.base, API_ROUTE);

	const legal_questions: string[] = [request.refinedQuestion];
	let errorMessage: string | undefined = undefined;
	let embedding: number[] = [];

	try {
		// Get a list of generated legal_statements (expanded_queries)
		const legal_statements: string[] = await expandQueryHelper(
			request.base,
			openai,
			legal_questions,
		);
		console.log(legal_statements);
		// Generate an embedding
		embedding = await generateEmbedding(openai, legal_statements);
	} catch (error) {
		console.error(error);
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
		const response: QueryExpansionResponse = {
			base: baseResponse,
			embedding: embedding,
		};

		generateApiResponseReport(
			request.base,
			API_ROUTE,
			response?.base.errorMessage,
		);
		return NextResponse.json(response);
	}
}
