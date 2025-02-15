import { AbeMemory, Clarification, ContentBlock, Jurisdiction, node_as_row } from "@/lib/types";

export interface ChatState {
	ui: {
		isFormVisible: boolean;
		citationsOpen: boolean;
		activeCitationId: string;
		inputMode: 'initial' | 'followup';
		loading: boolean;
		showJurisdictionModal: boolean;
	};
	chat: {
		messages: ContentBlock[];
		citations: ContentBlock[];
		currentQuestion: string;
		clarificationResponses: Clarification[];
		alreadyAnswered: string[];
		memory?: AbeMemory;
		primaryRows: node_as_row[];
		secondaryRows: node_as_row[];
		jurisdictions?: {
			state?: Jurisdiction;
			federal?: Jurisdiction;
			misc?: Jurisdiction;
			mode: string;
		};
	};
	settings: {
		askClarifications: boolean;
		sessionId: string;
	};
}

export type ChatAction =
	| { type: 'TOGGLE_CITATIONS'; }
	| { type: 'SET_LOADING'; payload: boolean; }
	| { type: 'ADD_MESSAGE'; payload: ContentBlock; }
	| { type: 'SET_JURISDICTION_MODAL'; payload: boolean; }
	| { type: 'SET_STATE_JURISDICTION'; payload: Jurisdiction | undefined; }
	| { type: 'SET_FEDERAL_JURISDICTION'; payload: Jurisdiction | undefined; }
	| { type: 'SET_MISC_JURISDICTION'; payload: Jurisdiction | undefined; }
	| { type: 'SET_INPUT_MODE'; payload: 'initial' | 'followup'; }
	| { type: 'SET_QUESTION'; payload: string; }
	| { type: 'SET_ACTIVE_CITATION'; payload: string; }
	| { type: 'SET_CITATIONS'; payload: ContentBlock[]; }
	| { type: 'SET_MEMORY'; payload: AbeMemory; }
	| { type: 'SET_ROWS'; payload: { primary: node_as_row[]; secondary: node_as_row[]; }; }
	| { type: 'CLEAR_CHAT'; }
	| { type: 'SET_ASK_CLARIFICATIONS'; payload: boolean; }; 