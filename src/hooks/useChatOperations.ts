import {
	DirectAnsweringRequest,
	QueryExpansionRequest,
	QueryScoringRequest,
	SimilaritySearchRequest
} from '@/lib/api_types';
import { AbeMemory, ContentBlock, ContentBlockParams, ContentType, questionJurisdictions } from '@/lib/types';
import { constructPromptQuery, createNewMemory } from '@/lib/utilities';
import { useCallback } from 'react';
import { ChatAction, ChatState } from '../types/chat';

export function useChatOperations(state: ChatState, dispatch: React.Dispatch<ChatAction>) {
	const createBlock = useCallback((params: ContentBlockParams): ContentBlock => {
		return {
			blockId: `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			type: params.type,
			content: params.content,
			fakeStream: params.fake_stream,
			concurrentStreaming: params.concurrentStreaming,
			userInput: "",
			clarifyingQuestion: params.clarifyingQuestion,
			clarifyingAnswers: params.clarifyingAnswers,
			citationProps: params.citationProps,
			content_list: params.content_list,
			mode: params.mode,
			neverLoad: params.neverLoad,
		};
	}, []);

	const addLoadingBlock = useCallback((message: string = "Loading...") => {
		dispatch({
			type: 'ADD_MESSAGE',
			payload: createBlock({
				type: ContentType.Loading,
				content: message,
				fake_stream: true,
				concurrentStreaming: false,
				neverLoad: false
			})
		});
	}, [createBlock]);

	const expandQuery = useCallback(async (memory: AbeMemory): Promise<number[]> => {
		const requestBody: QueryExpansionRequest = {
			base: {
				vendor: "openai",
				model: "gpt-4-turbo-preview",
				callingFunction: "expandQuery",
				pipelineModel: memory.history.pipelineModel,
			},
			refinedQuestion: memory.short.currentRefinedQuestion!,
			specificQuestions: memory.short.specificQuestions!,
		};

		const response = await fetch("/api/improveQuery/queryExpansion", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestBody),
		});

		const result = await response.json();
		return result.embedding;
	}, []);

	const scoreQuestion = useCallback(async (memory: AbeMemory): Promise<[number, string]> => {
		const currentQuestion = memory.short.currentQuestion!;
		const jurisdictions = memory.long.questionJurisdictions!;

		const maskedQuestion = constructPromptQuery(
			currentQuestion,
			jurisdictions.state?.corpusTitle || "The Country Of ",
			jurisdictions.federal?.corpusTitle || "USA"
		);

		const requestBody: QueryScoringRequest = {
			base: {
				vendor: "openai",
				model: "gpt-4-turbo-preview",
				callingFunction: "scoreQuestion",
				pipelineModel: memory.history.pipelineModel,
			},
			userQuery: maskedQuestion,
		};

		const response = await fetch("/api/improveQuery/queryScoring", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestBody),
		});

		const result = await response.json();
		return [result.qualityScore, result.messageToUser];
	}, []);

	const handleSimilaritySearch = useCallback(async (memory: AbeMemory) => {
		dispatch({ type: 'SET_LOADING', payload: true });

		try {
			const requestBody: SimilaritySearchRequest = {
				base: {
					vendor: "openai",
					model: "gpt-4-turbo-preview",
					callingFunction: "similaritySearch",
					pipelineModel: memory.history.pipelineModel,
				},
				jurisdictions: memory.long.questionJurisdictions!,
				query_expansion_embedding: memory.short.currentEmbedding!,
			};

			const response = await fetch("/api/searchDatabase/similaritySearch", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});

			const result = await response.json();

			dispatch({
				type: 'SET_ROWS',
				payload: {
					primary: result.primaryRows,
					secondary: result.secondaryRows
				}
			});

			await handleDirectAnswering(memory, result.primaryRows, result.secondaryRows);
		} catch (error) {
			console.error('Error in similarity search:', error);
			// TODO: Add error handling
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false });
		}
	}, []);

	const handleDirectAnswering = useCallback(async (
		memory: AbeMemory,
		primaryRows: any[],
		secondaryRows: any[],
	) => {
		try {
			const requestBody: DirectAnsweringRequest = {
				base: {
					vendor: "openai",
					model: "gpt-4-turbo-preview",
					callingFunction: "directAnswering",
					pipelineModel: memory.history.pipelineModel,
				},
				refinedQuestion: memory.short.currentRefinedQuestion!,
				specificQuestions: memory.short.specificQuestions!,
				primaryRows,
				secondaryRows,
				alreadyAnswered: state.chat.alreadyAnswered,
				clarifications: {
					clarifications: state.chat.clarificationResponses,
				},
				answerMode: state.settings.askClarifications ? "clarifications" : "single",
				questionJurisdictions: memory.long.questionJurisdictions!,
			};

			const response = await fetch("/api/answerQuery/directAnswering", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});

			const result = await response.json();

			dispatch({
				type: 'ADD_MESSAGE',
				payload: createBlock({
					type: ContentType.Answer,
					content: result.directAnswer,
					fake_stream: true,
					concurrentStreaming: false
				})
			});

			dispatch({ type: 'SET_INPUT_MODE', payload: 'followup' });
		} catch (error) {
			console.error('Error in direct answering:', error);
			// TODO: Add error handling
		}
	}, [state.chat.alreadyAnswered, state.chat.clarificationResponses, state.settings.askClarifications, createBlock]);

	const handleNewQuestion = useCallback(async (question: string) => {
		if (!state.chat.jurisdictions?.state && !state.chat.jurisdictions?.federal && !state.chat.jurisdictions?.misc) {
			dispatch({ type: 'SET_JURISDICTION_MODAL', payload: true });
			return;
		}

		dispatch({ type: 'SET_LOADING', payload: true });
		dispatch({ type: 'SET_QUESTION', payload: question });

		try {
			const memory = createNewMemory(
				question,
				state.settings.sessionId,
				state.chat.jurisdictions as questionJurisdictions // Type assertion since we've already checked jurisdictions exist
			);

			dispatch({ type: 'SET_MEMORY', payload: memory });
			dispatch({
				type: 'ADD_MESSAGE', payload: createBlock({
					type: ContentType.Question,
					content: question,
					fake_stream: false,
					concurrentStreaming: false
				})
			});

			if (!state.settings.askClarifications || state.chat.jurisdictions.misc) {
				await handleSimilaritySearch(memory);
			} else {
				const [score] = await scoreQuestion(memory);
				if (score <= 1) {
					dispatch({ type: 'SET_LOADING', payload: false });
					return;
				}
			}
		} catch (error) {
			console.error('Error handling question:', error);
			// TODO: Add error handling action
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false });
		}
	}, [
		state.chat.jurisdictions,
		state.settings.sessionId,
		state.settings.askClarifications,
		createBlock,
		handleSimilaritySearch,
		scoreQuestion
	]);

	const handleNewFollowupQuestion = useCallback(async (question: string) => {
		// Implementation of handleNewFollowupQuestion
	}, []);

	return {
		handleNewQuestion,
		handleDirectAnswering,
		handleSimilaritySearch,
		handleNewFollowupQuestion,
		scoreQuestion,
		createBlock,
		addLoadingBlock
	};
} 