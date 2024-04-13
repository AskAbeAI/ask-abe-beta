
import { BaseRequest } from './api_types';
import { node_as_row, PhaseReport, PhaseType, PipelineModel,Long, History, AbeMemory, Short, questionJurisdictions } from './types';




export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

// After fin
export function constructPromptQuery(
  user_query: string,
  state_jurisdiction: string,
  federal_jurisdiction: string
): string {
  return `According to the law in ${state_jurisdiction}, ${federal_jurisdiction}: ${user_query}`;
}

export function constructPromptQueryMisc(
  user_query: string,
  legal_document: string
): string {
  return `According to the regulations in ${legal_document}: ${user_query}`;
}
export function constructPromptQueryBoth(
  user_query: string,
  legal_document: string,
  legal_document_two: string,
): string {
  return `According to the rules and regulations in ${legal_document} and ${legal_document_two}: ${user_query}`;
}

export function generateApiRequestReport(base: BaseRequest, apiRoute: string): void {
  const requestReport = new PhaseReport({
    phase_type: PhaseType.API_REQUEST,
    timestamp: new Date(),
    description: `API_REQUEST: ${base.callingFunction} --> ${apiRoute}`,
    ts_function: base.callingFunction,
    api_route: apiRoute,
  });
  
  base.pipelineModel.history.push(requestReport)
}

export function generateApiResponseReport(base: BaseRequest, apiRoute: string, errorMessage?: string): void {
  const responseReport = new PhaseReport({
    phase_type: PhaseType.API_RESPONSE,
    timestamp: new Date(),
    description: `API_RESPONSE: ${apiRoute} --> ${base.callingFunction}`,
    ts_function: base.callingFunction,
    api_route: apiRoute
  });
  if (errorMessage !== undefined) {
    responseReport.error_message = errorMessage;
  }
  
  base.pipelineModel.history.push(responseReport)
}


export function createNewMemory(userInput: string, sessionId: string, questionJurisdictions: questionJurisdictions): AbeMemory {
  const pipelineModel = new PipelineModel({
    session_id: sessionId,
    history: []
  });
  const history: History = {
    messages: [],
    pipelineModel: pipelineModel
  }
  const short: Short = {
    lastUserInput: userInput,
    currentQuestion: userInput,
    currentRefinedQuestion: userInput
  }
  const long: Long = {
    questionJurisdictions: questionJurisdictions
  }
  const memory: AbeMemory = {
    short: short,
    long: long,
    history: history
  }
  return memory;
}

export async function callWithRetries<T>(
	fn: () => Promise<T>, 
	maxRetries: number
  ): Promise<T> {
	let attempts = 0;
	while (true) {
	  try {
		return await fn();
	  } catch (error) {
		attempts++;
		if (attempts > maxRetries) {
		  throw error;
		}
		console.log(`Attempt ${attempts} failed, retrying...`);
	  }
	}
  }