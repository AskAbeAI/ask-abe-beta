export type Dataset = 'California Code' | 'EU MICA Regulations'; // | 'Federal Regulation' | 'MICA Regulations';

export interface ProcessBody {
  question: string;
  dataset: Dataset;
  apiKey: string;
}

export interface FinalAnswerBody {
  userQuery: string;
  openAiKey: string;
  summaryTemplate: string;
  partialAnswers: string;
  exampleCitation: string;
}

export interface AnswerResponse {
  code: string;
}

export interface AnswerTemplateBody {
  userQuery: string;
  openAiKey: string;
  partialAnswers: string;
  exampleCitation: string;
}

export interface SearchBody {
  similarQuery: string;
  openAiKey: string;
  jurisdiction: string;
}

export interface PartialAnswerBody {
  legalText: string;
  openAiKey: string;
  templateQuestion: string;
  citationExample: string
}

