export type Dataset = 'California Code' | 'Federal Regulation' | 'MICA Regulations';

export interface AnswerBody {
  question: string;
  dataset: Dataset;
  apiKey: string;
}

export interface AnswerResponse {
  code: string;
}
