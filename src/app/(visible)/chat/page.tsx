"use client";
import BottomBar from "@/components/bottomBar";
import CitationBar from "@/components/citationBar";
import ContentQueue from "@/components/contentQueue";
import {
	DisclaimerModal,
	JurisdictionModal,
} from "@/components/disclaimermodal";
import OptionsList from "@/components/optionsFilter";
import { useChatOperations } from "@/hooks/useChatOperations";
import {
	ContentBlock,
	ContentType,
	FederalJurisdictionOptions,
	MiscJurisdictionOptions,
	Option,
	StateJurisdictionOptions
} from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { ChatAction, ChatState } from "@/types/chat";
import { useReducer, useState } from "react";

// Initial state
const initialState: ChatState = {
	ui: {
		isFormVisible: true,
		citationsOpen: false,
		activeCitationId: "",
		inputMode: 'initial',
		loading: false,
		showJurisdictionModal: false
	},
	chat: {
		messages: [{
			blockId: `welcome_${Date.now()}`,
			type: ContentType.Welcome,
			content: "",
			fakeStream: false,
			concurrentStreaming: false,
		}],
		citations: [],
		currentQuestion: "",
		clarificationResponses: [],
		alreadyAnswered: [],
		memory: undefined,
		primaryRows: [],
		secondaryRows: [],
		jurisdictions: {
			state: undefined,
			federal: undefined,
			misc: undefined,
			mode: "state"
		}
	},
	settings: {
		askClarifications: false,
		sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
	}
};

// Reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
	switch (action.type) {
		case 'TOGGLE_CITATIONS':
			return {
				...state,
				ui: {
					...state.ui,
					citationsOpen: !state.ui.citationsOpen
				}
			};

		case 'SET_LOADING':
			return {
				...state,
				ui: {
					...state.ui,
					loading: action.payload,
					isFormVisible: !action.payload
				}
			};

		case 'ADD_MESSAGE':
			return {
				...state,
				chat: {
					...state.chat,
					messages: [...state.chat.messages, action.payload]
				}
			};

		case 'SET_JURISDICTION_MODAL':
			return {
				...state,
				ui: {
					...state.ui,
					showJurisdictionModal: action.payload
				}
			};

		case 'SET_STATE_JURISDICTION':
			return {
				...state,
				chat: {
					...state.chat,
					jurisdictions: {
						...state.chat.jurisdictions!,
						state: action.payload,
						mode: action.payload ?
							state.chat.jurisdictions?.federal ? "state_federal" : "state"
							: state.chat.jurisdictions?.mode || "state"
					}
				}
			};

		case 'SET_FEDERAL_JURISDICTION':
			return {
				...state,
				chat: {
					...state.chat,
					jurisdictions: {
						...state.chat.jurisdictions!,
						federal: action.payload,
						mode: action.payload ?
							state.chat.jurisdictions?.state ? "state_federal"
								: state.chat.jurisdictions?.misc ? "misc_federal"
									: "federal"
							: state.chat.jurisdictions?.mode || "state"
					}
				}
			};

		case 'SET_MISC_JURISDICTION':
			return {
				...state,
				chat: {
					...state.chat,
					jurisdictions: {
						...state.chat.jurisdictions!,
						misc: action.payload,
						mode: action.payload ?
							state.chat.jurisdictions?.federal ? "misc_federal" : "misc"
							: state.chat.jurisdictions?.mode || "state"
					}
				}
			};

		case 'SET_INPUT_MODE':
			return {
				...state,
				ui: {
					...state.ui,
					inputMode: action.payload
				}
			};

		case 'SET_QUESTION':
			return {
				...state,
				chat: {
					...state.chat,
					currentQuestion: action.payload
				}
			};

		case 'SET_ACTIVE_CITATION':
			return {
				...state,
				ui: {
					...state.ui,
					activeCitationId: action.payload
				}
			};

		case 'SET_CITATIONS':
			return {
				...state,
				chat: {
					...state.chat,
					citations: action.payload
				}
			};

		case 'SET_MEMORY':
			return {
				...state,
				chat: {
					...state.chat,
					memory: action.payload
				}
			};

		case 'SET_ROWS':
			return {
				...state,
				chat: {
					...state.chat,
					primaryRows: action.payload.primary,
					secondaryRows: action.payload.secondary
				}
			};

		case 'CLEAR_CHAT':
			return {
				...state,
				chat: {
					...initialState.chat,
					jurisdictions: state.chat.jurisdictions
				}
			};

		case 'SET_ASK_CLARIFICATIONS':
			return {
				...state,
				settings: {
					...state.settings,
					askClarifications: action.payload
				}
			};

		default:
			return state;
	}
}

export default function ChatPage() {
	const [state, dispatch] = useReducer(chatReducer, initialState);
	const {
		handleNewQuestion,
		handleNewFollowupQuestion,
		handleDirectAnswering,
		handleSimilaritySearch,
		scoreQuestion,
		createBlock,
		addLoadingBlock
	} = useChatOperations(state, dispatch);

	// Only keep streaming-related state since it's UI-specific
	const [streamingQueue, setStreamingQueue] = useState<ContentBlock[]>([]);

	const onStreamEnd = (concurrentStreaming: boolean) => {
		if (concurrentStreaming) {
			streamingQueue.shift();
		}
	};

	const handleOptionChange = (options: Option[]) => {
		for (const option of options) {
			if (option.name === "Skip Clarifying Questions") {
				dispatch({ type: 'SET_ASK_CLARIFICATIONS', payload: option.selected });
			}
		}
	};

	return (
		<div className="h-screen bg-background">
			<div className="h-full grid grid-cols-[auto_1fr_auto] gap-4 p-4">
				{/* Citation Sidebar */}
				<div className={cn(
					"transition-all duration-300 ease-in-out",
					"bg-card rounded-lg shadow-sm border border-border",
					state.ui.citationsOpen ? "w-[400px]" : "w-[50px]"
				)}>
					<CitationBar
						open={state.ui.citationsOpen}
						setOpen={() => dispatch({ type: 'TOGGLE_CITATIONS' })}
						citationItems={state.chat.citations}
						activeCitationId={state.ui.activeCitationId}
					/>
				</div>

				{/* Main Chat Area */}
				<main className="flex flex-col overflow-hidden bg-background rounded-lg">
					<div className="flex-1 overflow-y-auto">
						<ContentQueue
							items={state.chat.messages}
							showCurrentLoading={state.ui.loading}
							onSubmitClarificationAnswers={() => { }}
							onSubmitClarificationVitaliaAnswers={() => { }}
							onClarificationStreamEnd={() => { }}
							onStreamEnd={onStreamEnd}
							onFinishAnswerVitalia={() => { }}
							setActiveCitationId={(id) =>
								dispatch({ type: 'SET_ACTIVE_CITATION', payload: id })}
						/>
					</div>

					{state.ui.isFormVisible && (
						<div className="flex-none bg-background/80 backdrop-blur-sm border-t border-border">
							<BottomBar
								inputMode={state.ui.inputMode}
								handleSubmit={handleNewQuestion}
								handleSubmitFollowup={async (q) => {
									dispatch({ type: 'SET_LOADING', payload: true });
									await handleNewFollowupQuestion(q);
									dispatch({ type: 'SET_LOADING', payload: false });
								}}
							/>
						</div>
					)}
				</main>

				{/* Options Panel */}
				<div className="w-[300px] bg-card rounded-lg shadow-sm p-4">
					<OptionsList
						options={[]}
						stateJurisdictions={StateJurisdictionOptions}
						federalJurisdictions={FederalJurisdictionOptions}
						miscJurisdictions={MiscJurisdictionOptions}
						onOptionChange={handleOptionChange}
						onStateJurisdictionChange={(j) =>
							dispatch({ type: 'SET_STATE_JURISDICTION', payload: j })}
						onFederalJurisdictionChange={(j) =>
							dispatch({ type: 'SET_FEDERAL_JURISDICTION', payload: j })}
						onMiscJurisdictionChange={(j) =>
							dispatch({ type: 'SET_MISC_JURISDICTION', payload: j })}
					/>
				</div>
			</div>

			{/* Modals */}
			<JurisdictionModal
				shown={state.ui.showJurisdictionModal}
				setShown={() => dispatch({ type: 'SET_JURISDICTION_MODAL', payload: false })}
			/>
			<DisclaimerModal />
		</div>
	);
}
