import {
	PipelineModel,
	questionJurisdictions,
	node_as_row,
	ClarificationChoices,
	Node,
	AnswerChunk,
} from "./types";

export interface BaseRequest {
	vendor: string;
	model: string;
	callingFunction: string;
	pipelineModel: PipelineModel;
}
export interface BaseResponse {
	errorMessage?: string;
	pipelineModel: PipelineModel;
}

export interface QueryScoringRequest {
	base: BaseRequest;
	userQuery: string;
}
export interface QueryScoringResponse {
	base: BaseResponse;
	messageToUser: string;
	qualityScore: number;
}

export interface QueryExpansionRequest {
	base: BaseRequest;
	refinedQuestion: string;
	specificQuestions: string[];
}
export interface QueryExpansionResponse {
	base: BaseResponse;
	embedding: number[];
}

export interface SimilaritySearchRequest {
	base: BaseRequest;
	jurisdictions: questionJurisdictions;
	query_expansion_embedding: number[];
}

export interface SimilaritySearchResponse {
	base: BaseResponse;
	primaryRows: node_as_row[];
	secondaryRows: node_as_row[];
}

export interface SearchSimilarContentRequest {
	base: BaseRequest;
	jurisdictions: questionJurisdictions;
	query_expansion_embedding: number[];
	parentScope?: string;
}

export interface SearchSimilarContentResponse {
	base: BaseResponse;
	primaryRows: Node[];
}

export interface QueryClarificationRequest {
	base: BaseRequest;
	userPromptQuery: string;
	previousClarifications?: ClarificationChoices;
	clarificationMode: string;
}
export interface QueryClarificationResponse {
	base: BaseResponse;
}

export interface DirectAnsweringRequest {
	base: BaseRequest;
	refinedQuestion: string;
	specificQuestions: string[];
	alreadyAnswered: string[];
	answerMode: string;
	clarifications?: ClarificationChoices;
	primaryRows: node_as_row[];
	secondaryRows: node_as_row[];
	questionJurisdictions: questionJurisdictions;
}
export interface DirectAnsweringResponse {
	base: BaseResponse;
	directAnswer: string;
}

export interface AnswerNewQuestionRequest {
	base: BaseRequest;
	refinedQuestion: string;
	primaryRows: Node[];
	questionJurisdictions: questionJurisdictions;
}
export interface AnswerNewQuestionResponse {
	base: BaseResponse;
	directAnswer: AnswerChunk[];
}
