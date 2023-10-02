export type Dataset = 'California Code' | 'Federal Regulation' | 'MICA Regulations';

export interface AnswerBody {
  question: string;
  dataset: Dataset;
  apiKey: string;
}

export interface FinalAnswerBody {
  userQuery: string;
  openAiKey: string;
  summaryTemplate: string;
  partialAnswers: string;
}

export interface AnswerResponse {
  code: string;
}

export interface TemplateBody {
  userQuery: string;
  openAiKey: string;
  partialAnswers: string;
}
