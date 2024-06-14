import { insertApiUsage } from './database';
import dataset from './dataset.json';

export type Dataset = (typeof dataset)[number];

type BaseLevels = "jurisdiction" | "subjurisdiction" | "corpus" 
type AllowedLevels =     "title" | "subtitle" | "code" | "part" | "subpart" | "division" | "subdivision" | "article" | "subarticle" | "chapter" | "subchapter" | "subject-group" | "section" | "appendix" | "hub"; // Extend as needed
const ALLOWED_LEVELS: AllowedLevels[] = ["title", "subtitle", "code", "part", "subpart", "division", "subdivision", "article", "subarticle", "chapter", "subchapter", "subject-group", "section", "appendix", "hub"];

export interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
}

export interface UiState {
  isMobile: boolean;
  isDesktopOrLaptop: boolean;
  isFormVisible: boolean;
  citationsOpen: boolean;
}
export interface Short {
  lastUserInput: string;

  currentQuestion?: string;
  currentRefinedQuestion?: string;
  currentEmbedding?: number[];

  specificQuestions?: string[];
  previousClarifications?: Clarification[];
}
export interface Long {
  questionJurisdictions?: questionJurisdictions
  inputMode?: string;
  previousQuestions?: string[]
  primaryRows?: node_as_row;
  secondaryRows?: node_as_row;
  prototypeRows?: Node[];
}
export interface History {
  messages: Message[];
  pipelineModel: PipelineModel;
}
export interface Settings {
  clarificationMode: string;

}

export interface AbeMemory {
  short: Short;
  long: Long;
  history: History;
  uiState?: UiState;
  settings?: Settings;
}

// Generic Content Block Types, Props, and Interfaces
export enum ContentType {
  Question,
  Welcome,
  WelcomeVitalia,
  Answer,
  AnswerVitalia,
  Clarification,
  ClarificationVitalia,
  ClarificationQuestion,
  Citation,
  Loading// Future use
  // ... Add more as needed
}
export type ContentBlockParams = {
  type: ContentType,
  content: string,
  fake_stream: boolean,
  concurrentStreaming: boolean;
  citationProps?: CitationBlockProps;
  clarifyingClassifications?: string[];
  clarifyingQuestion?: string;
  clarifyingAnswers?: string[];
  optionchoices?: string[];
  mode?: string;
  content_list?: string[];
  neverLoad?: boolean;
  citationLinks?: CitationLinks;

};
export interface ContentBlock {
  blockId: string;
  type: ContentType;
  content: any; // This can hold different data structures depending on the type
  content_list?: string[];
  fakeStream: boolean;
  concurrentStreaming: boolean;
  userInput?: string;
  mode?: string;
  citationProps?: CitationBlockProps;
  clarifyingQuestion?: string;
  clarifyingAnswers?: string[];
  optionchoices?: string[];
  neverLoad?: boolean;
  citationLinks?: CitationLinks;
}

// Specific UI Block Props
export interface AnswerBlockProps {
  content: string;
  content_list?: string[];
  fakeStream: boolean;
  concurrentStreaming: boolean;
  onStreamEnd: (concurrentStreaming: boolean) => void;
  setActiveCitationId: (citationId: string) => void;
}

export interface QuestionBlockProps {
  content: string;
}
export interface ConciergeIconProps {
  showCurrentLoading: boolean;
  neverLoad: boolean;
}


export interface AnswerVitaliaBlockProps {
  content: string;
  citationLinks: CitationLinks
  onFinishAnswerVitalia: () => void;
  waitForStream: boolean;
}




export interface WelcomeMessageProps {
  message: string;
  isUser: boolean; // Determine if the message is from the user or others
}

export interface ClarificationBlockProps {
  clarifyingQuestion: string;
  clarifyingAnswers: string[];
  content: string;
  mode: string;
  fakeStream: boolean;
  concurrentStreaming: boolean;
  onSubmitClarificationAnswers: (clarification: Clarification, mode: string) => void;
  onStreamEnd: (concurrentStreaming: boolean) => void;

}
export interface ClarificationVitaliaProps {
  clarifyingQuestion: string;
  clarifyingAnswers: string[];
  content: string;
  mode: string;
  fakeStream: boolean;
  concurrentStreaming: boolean;
  onSubmitClarificationVitaliaAnswers: (clarification: Clarification, mode: string) => void;
  onStreamEnd: (concurrentStreaming: boolean) => void;

}
export interface ClarificationQuestionBlockProps {
  clarifyingQuestion: string;
  clarifyingAnswers: string[];
  mode: string;
  content: string;
  onClarificationStreamEnd: (clarifyingQuestion: string, clarifyingAnswers: string[], mode: string) => void;
}


export interface StreamingAnswerBlockProps {
  content: string; // This will be the streamed text content

}
export interface CitationBlockProps {
  citation: string;
  jurisdictionName: string;
  link: string;
  section_text: string[];
  setOpen: (open: boolean) => void;
  open: boolean;

}

export interface AbeIconProps {
  showCurrentLoading: boolean;
  neverLoad: boolean;
}

// Citation Pop-out
export interface CitationToggleProps {
  citation: string;
  isClicked: boolean;
  onClick: (isClicked: boolean) => void;
}

// Citation Pop-Out(2)
export interface popOutProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;

};

export interface Option {
  id: number;
  name: string;
  selected: boolean;
}
export interface Jurisdiction {
  id: string;
  name: string;
  abbreviation: string;
  corpusTitle: string;
  usesSubContentNodes: boolean;
  jurisdictionLevel: string;
}
export const StateJurisdictionOptions: Jurisdiction[] = [
  
    // { id: '1', name: ' Alabama', abbreviation: 'AL', corpusTitle: 'Alabama Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '2', name: ' Alaska', abbreviation: 'AK', corpusTitle: 'Alaska Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '3', name: ' Arizona', abbreviation: 'AZ', corpusTitle: 'Arizona Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '4', name: ' Arkansas', abbreviation: 'AR', corpusTitle: 'Arkansas Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '5', name: ' California', abbreviation: 'CA', corpusTitle: 'California Statutes', usesSubContentNodes: true, jurisdictionLevel: 'state' },
    // { id: '6', name: ' Colorado', abbreviation: 'CO', corpusTitle: 'Colorado Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '7', name: ' Connecticut', abbreviation: 'CT', corpusTitle: 'Connecticut Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '8', name: ' Delaware', abbreviation: 'DE', corpusTitle: 'Delaware Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '9', name: ' Florida', abbreviation: 'FL', corpusTitle: 'Florida Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '10', name: ' Georgia', abbreviation: 'GA', corpusTitle: 'Georgia Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '11', name: ' Hawaii', abbreviation: 'HI', corpusTitle: 'Hawaii Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '12', name: ' Idaho', abbreviation: 'ID', corpusTitle: 'Idaho Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '13', name: ' Illinois', abbreviation: 'IL', corpusTitle: 'Illinois Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '14', name: ' Indiana', abbreviation: 'IN', corpusTitle: 'Indiana Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '15', name: ' Iowa', abbreviation: 'IA', corpusTitle: 'Iowa Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '16', name: 'Kansas', abbreviation: 'KS', corpusTitle: 'Kansas Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '17', name: 'Kentucky', abbreviation: 'KY', corpusTitle: 'Kentucky Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '18', name: 'Louisiana', abbreviation: 'LA', corpusTitle: 'Louisiana Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '19', name: 'Maine', abbreviation: 'ME', corpusTitle: 'Maine Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '20', name: 'Maryland', abbreviation: 'MD', corpusTitle: 'Maryland Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '21', name: 'Massachusetts', abbreviation: 'MA', corpusTitle: 'Massachusetts Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '22', name: 'Michigan', abbreviation: 'MI', corpusTitle: 'Michigan Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '23', name: 'Minnesota', abbreviation: 'MN', corpusTitle: 'Minnesota Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '24', name: 'Mississippi', abbreviation: 'MS', corpusTitle: 'Mississippi Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '25', name: 'Missouri', abbreviation: 'MO', corpusTitle: 'Missouri Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '26', name: 'Montana', abbreviation: 'MT', corpusTitle: 'Montana Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '27', name: 'Nebraska', abbreviation: 'NE', corpusTitle: 'Nebraska Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '28', name: 'Nevada', abbreviation: 'NV', corpusTitle: 'Nevada Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '29', name: 'New Hampshire', abbreviation: 'NH', corpusTitle: 'New Hampshire Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '30', name: 'New Jersey', abbreviation: 'NJ', corpusTitle: 'New Jersey Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '31', name: 'New Mexico', abbreviation: 'NM', corpusTitle: 'New Mexico Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '32', name: 'New York', abbreviation: 'NY', corpusTitle: 'New York Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '33', name: 'North Carolina', abbreviation: 'NC', corpusTitle: 'North Carolina Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '34', name: 'North Dakota', abbreviation: 'ND', corpusTitle: 'North Dakota Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '35', name: 'Ohio', abbreviation: 'OH', corpusTitle: 'Ohio Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '36', name: 'Oklahoma', abbreviation: 'OK', corpusTitle: 'Oklahoma Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '37', name: 'Oregon', abbreviation: 'OR', corpusTitle: 'Oregon Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '38', name: 'Pennsylvania', abbreviation: 'PA', corpusTitle: 'Pennsylvania Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    { id: '39', name: 'Rhode Island', abbreviation: 'RI', corpusTitle: 'Rhode Island Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '40', name: 'South Carolina', abbreviation: 'SC', corpusTitle: 'South Carolina Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '41', name: 'South Dakota', abbreviation: 'SD', corpusTitle: 'South Dakota Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '42', name: 'Tennessee', abbreviation: 'TN', corpusTitle: 'Tennessee Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '43', name: 'Texas', abbreviation: 'TX', corpusTitle: 'Texas Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '44', name: 'Utah', abbreviation: 'UT', corpusTitle: 'Utah Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '45', name: 'Vermont', abbreviation: 'VT', corpusTitle: 'Vermont Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '46', name: 'Virginia', abbreviation: 'VA', corpusTitle: 'Virginia Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '47', name: 'Washington', abbreviation: 'WA', corpusTitle: 'Washington Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '48', name: 'West Virginia', abbreviation: 'WV', corpusTitle: 'West Virginia Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '49', name: 'Wisconsin', abbreviation: 'WI', corpusTitle: 'Wisconsin Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '50', name: 'Wyoming', abbreviation: 'WY', corpusTitle: 'Wyoming Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },


  ];

export const FederalJurisdictionOptions: Jurisdiction[] = [
  { id: '1', name: 'US Federal Regulations', abbreviation: 'ecfr', corpusTitle: 'United States Code of Federal Regulations', usesSubContentNodes: false, jurisdictionLevel: 'federal' },
  { id: '2', name: 'US Code', abbreviation: 'musc', corpusTitle: 'United States Code', usesSubContentNodes: false, jurisdictionLevel: 'federal' },
  { id: '3', name: 'Marshall Islands', abbreviation: 'mhl', corpusTitle: 'Republic of the Marshall Islands', usesSubContentNodes: false, jurisdictionLevel: 'federal' },

];

export const MiscJurisdictionOptions: Jurisdiction[] = [
  {id: '1', name: 'Aeronautical Information Manual', abbreviation: 'aim', corpusTitle: 'FAAs official guide to basic flight information and Air traffic control (ATC) procedures.', usesSubContentNodes: false, jurisdictionLevel: 'misc' },
];


export interface OptionsListProps {
  
  stateJurisdictions: Jurisdiction[];
  federalJurisdictions: Jurisdiction[];
  miscJurisdictions: Jurisdiction[];
  options : Option[];
  onOptionChange: (options: Option[]) => void;
  onStateJurisdictionChange: (jurisdictions: Jurisdiction | undefined) => void;
  onFederalJurisdictionChange: (jurisdictions: Jurisdiction | undefined) => void;
  onMiscJurisdictionChange: (jurisdictions: Jurisdiction | undefined) => void;
}


export interface JurisdictionModalProps {
  shown: boolean;
  setShown: () => void;
}
export type CitationLinks = Record<string, string>;
// Types for UI Logic
// Clarification types
export type ClarificationChoices = {
  clarifications: Clarification[];
};
export type Clarification = {
  question: string;
  multiple_choice_answers: string[];
  response: string;
};
// Type for row returned from database


export type node_as_row = {
  node_id: string;
  node_top_level_title: string;
  node_type: string;
  node_level_classifier: string;
  node_citation: string;
  node_link: string;
  node_addendum: string;
  node_name: string;
  node_summary: string;
  node_hyde: string[];
  node_parent: string;
  node_direct_children: string[];
  node_siblings: string[];
  node_references: JSON;
  node_incoming_references: JSON;
  node_text: string[];
  similarity: number;
  
};

export interface AnswerChunk {
  answerTopic: string;
  text: string;
}


// OpenAI API Types
// Type for openAI chat completion parameters
export type Message = {
  role: 'system' | 'user';
  content: string;
};
export type ChatCompletionParams = {
  model: string;
  messages: Message[];
  temperature: number;
  max_tokens?: number;
  top_p: number;
  // n?: number;
  frequency_penalty: number;
  presence_penalty: number;
  stream: boolean;
};


// Citation Types
export type text_citation_document_trio = {
  section_citation: string;
  text: string;
  document: string;
};

export type text_citation_pair = {
  section_citation: string;
  text: string;
};

export type questionJurisdictions = {
  mode: string;
  state: Jurisdiction | undefined;
  federal: Jurisdiction | undefined;
  misc: Jurisdiction | undefined;
};














// ### Completion Stuff ###



export interface APIParametersParams {
  vendor: string;
  model: string;
  messages: Message[];
  temperature?: number; // Optional with default value
  top_p?: number; // Optional with validation
  frequency_penalty?: number; // Optional with default value
  rag_tokens: number;
  max_tokens?: number; // Optional
  stream?: boolean; // Optional with default value
  response_format?: { [key: string]: any }; // Optional
  presence_penalty?: number; // Optional with default value
  response_model?: any; // Optional, dynamic type
  max_retries?: number; // Optional with default value
  stop_sequences?: string[]; // Optional
  calling_function?: string; // Optional
}

export class APIParameters {
  vendor: string;
  model: string;
  messages: Message[];
  temperature: number = 1;
  top_p: number = 1;
  frequency_penalty: number = 0;
  rag_tokens: number;
  max_tokens?: number;
  stream: boolean = false;
  response_format?: { [key: string]: any };
  presence_penalty: number = 0;
  response_model?: any;
  max_retries: number = 1;
  stop_sequences?: string[];
  calling_function?: string;

  constructor(params: APIParametersParams) {
    // Assign each parameter, applying default values and validation as needed
    this.vendor = params.vendor;
    this.model = params.model;
    this.messages = params.messages;
    this.temperature = Math.min(Math.max(params.temperature || 1, 0), 1);
    this.top_p = params.top_p !== undefined ? Math.min(Math.max(params.top_p, 0), 1) : 1;
    this.frequency_penalty = Math.min(Math.max(params.frequency_penalty || 0, 0), 1);
    this.rag_tokens = params.rag_tokens;
    this.max_tokens = params.max_tokens;
    this.stream = params.stream !== undefined ? params.stream : false;
    this.response_format = params.response_format;
    this.presence_penalty = Math.min(Math.max(params.presence_penalty || 0, 0), 1);
    this.response_model = params.response_model;
    this.max_retries = params.max_retries !== undefined ? params.max_retries : 1;
    this.stop_sequences = params.stop_sequences;
    this.calling_function = params.calling_function;
  }
}




// ##### Usage Stuff ######

export class APIUsage {
  response_id: string;
  session_id: string | null;
  calling_function: string;
  vendor: string;
  model: string;
  input_tokens: number | null;
  rag_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  input_cost: number | null;
  rag_cost: number | null;
  output_cost: number | null;
  total_cost: number | null;
  request_status: number;
  error_message: string | null;
  duration: number | null;
  api_key_name: string | null;
  timestamp: Date | null;

  constructor(
    response_id: string,
    calling_function: string,
    vendor: string,
    model: string,
    request_status: number,
    session_id: string | null = null,
    input_tokens: number | null = null,
    rag_tokens: number | null = null,
    output_tokens: number | null = null,
    total_tokens: number | null = null,
    input_cost: number | null = null,
    rag_cost: number | null = null,
    output_cost: number | null = null,
    total_cost: number | null = null,
    error_message: string | null = null,
    duration: number | null = null,
    api_key_name: string | null = null,
    timestamp: Date | null = null
  ) {
    this.response_id = response_id;
    this.session_id = session_id;
    this.calling_function = calling_function;
    this.vendor = vendor;
    this.model = model;
    this.input_tokens = input_tokens;
    this.rag_tokens = rag_tokens;
    this.output_tokens = output_tokens;
    this.total_tokens = total_tokens;
    this.input_cost = input_cost;
    this.rag_cost = rag_cost;
    this.output_cost = output_cost;
    this.total_cost = total_cost;
    this.request_status = request_status;
    this.error_message = error_message;
    this.duration = duration;
    this.api_key_name = api_key_name;
    this.timestamp = timestamp;
    this.computeCost();
  }

  // Method names should also follow the convention, if you're changing them
  updateStatus(request_status: number, error_message: string | null): void {
    this.request_status = request_status;
    this.error_message = error_message;
  }
  insert() {
    insertApiUsage(this);
  }
  computeCost(): void {
    // Implementation remains unchanged
    if (this.total_cost !== null) {
      return;
    }
    if (this.input_cost === null) {
      return;
    }
    
    let vendor = this.vendor.includes("instructor/") ? this.vendor.replace("instructor/", "") : this.vendor;
    let modelPricing;
    try {
      modelPricing = PRICING_DATA[vendor][this.model];
    } catch (error) {
      throw new Error(`Pricing data not found for model ${this.model} and vendor ${this.vendor}`);
    }

    this.input_cost = (this.input_tokens || 0) / 1e6 * parseFloat(modelPricing.input_price);
    this.rag_cost = (this.rag_tokens || 0) / 1e6 * parseFloat(modelPricing.input_price);
    this.output_cost = (this.output_tokens || 0) / 1e6 * parseFloat(modelPricing.output_price);
    this.total_cost = (this.input_cost || 0) + (this.output_cost || 0);
  }

  // Keep other methods unchanged in functionality but renamed to fit conventions.
}





export enum PhaseType {
  SQL_TRANSFER = "SQL_TRANSFER",
  API_REQUEST = "API_REQUEST",
  API_RESPONSE = "API_RESPONSE",
  TS_LOAD = "TS_LOAD",
  LLM_CALL = "LLM_CALL",
  TS_DUMP = "TS_DUMP"
}

interface PhaseReportParams {
  phase_type: PhaseType;
  timestamp: Date;
  description?: string;
  source_table?: string;
  ts_function?: string;
  api_route?: string;
  destination_table?: string;
  api_usage_id?: string;
  error_code?: number;
  error_message?: string;
}



export class PhaseReport {
  phase_type: PhaseType;
  timestamp: Date;
  description?: string;
  source_table?: string;
  ts_function?: string;
  api_route?: string;
  destination_table?: string;
  api_usage_id?: string;
  error_code?: number;
  error_message?: string;

  constructor(params: PhaseReportParams) {
    // Use object destructuring with default values for optional parameters
    this.phase_type = params.phase_type;
    this.timestamp = params.timestamp;
    this.description = params.description;
    this.source_table = params.source_table;
    this.ts_function = params.ts_function;
    this.api_route = params.api_route;
    this.destination_table = params.destination_table;
    this.api_usage_id = params.api_usage_id;
    this.error_code = params.error_code;
    this.error_message = params.error_message;
  }

  updateError(errorCode: number, errorMessage: string): void {
    this.error_code = errorCode;
    this.error_message = errorMessage;
  }
  static fromObject(obj: any): PhaseReport {
    // Convert the timestamp string back to a Date object if necessary
    const timestamp = obj.timestamp instanceof Date ? obj.timestamp : new Date(obj.timestamp);

    // Instantiate and return a new PhaseReport using the deserialized object
    return new PhaseReport({
      phase_type: obj.phase_type,
      timestamp: timestamp,
      description: obj.description,
      source_table: obj.source_table,
      ts_function: obj.ts_function,
      api_route: obj.api_route,
      destination_table: obj.destination_table,
      api_usage_id: obj.api_usage_id,
      error_code: obj.error_code,
      error_message: obj.error_message,
    });
  }
}

// #### New Types ####
class NodeID {
  rawId: string;
  componentLevels: string[] = [];
  componentClassifiers: string[] = [];
  componentNumbers: string[] = [];

  constructor(id: string | NodeID) {
    if (id instanceof NodeID) {
      // Copy properties from the existing NodeID instance
      this.rawId = id.rawId;
      this.componentLevels = [...id.componentLevels];
      this.componentClassifiers = [...id.componentClassifiers];
      this.componentNumbers = [...id.componentNumbers];
    } else {
      // Assuming id is a string in this case
      this.rawId = id;
      this.parseComponents();
    }
  }
  

  parseComponents(): void {
    if (!this.rawId) {
      return;
    }

    const components = this.rawId.split('/');
    this.componentLevels = components;
    this.componentClassifiers = [];
    this.componentNumbers = [];

    components.forEach((level, i) => {
      if (i < 3) {
        // Assuming first three levels are fixed as "JURISDICTION", "SUBJURISDICTION", "CORPUS"
        const predefinedClassifiers: BaseLevels[] = ["jurisdiction", "subjurisdiction", "corpus"];
        this.componentClassifiers.push(predefinedClassifiers[i]);
        this.componentNumbers.push(level);
      } else {
        const [classifier, number] = level.split('=');
        if (!classifier || !number || !ALLOWED_LEVELS.includes(classifier as AllowedLevels)) {
          throw new Error(`Invalid level format or classifier: ${level}`);
        }
        this.componentClassifiers.push(classifier);
        this.componentNumbers.push(number);
      }
    });
  }

  get currentLevel(): [string, string] | undefined {
    if (this.componentLevels.length > 0) {
      const lastIndex = this.componentLevels.length - 1;
      return [this.componentClassifiers[lastIndex], this.componentNumbers[lastIndex]];
    }
    return undefined;
  }

  get parentLevel(): [string, string] | undefined {
    if (this.componentLevels.length > 2) {
      const parentIndex = this.componentLevels.length - 2;
      return [this.componentClassifiers[parentIndex], this.componentNumbers[parentIndex]];
    }
    return undefined;
  }

  // Implement additional methods as needed...
}

// # Definitions

class Definition {
  definition: string;
  subdefinitions?: Definition[];
  source_section?: string;
  source_paragraph: string;
  source_link: string;
  is_subterm?: boolean;

  constructor(
    definition: string,
    source_paragraph: string,
    source_link: string,
    subdefinitions?: Definition[],
    source_section?: string,
    is_subterm?: boolean
  ) {
    this.definition = definition;
    this.source_paragraph = source_paragraph;
    this.source_link = source_link;
    this.subdefinitions = subdefinitions;
    this.source_section = source_section;
    this.is_subterm = is_subterm;
  }
}


class IncorporatedTerms {
  import_source_link?: string;
  import_source_corpus?: string;
  import_sourceId?: string;
  terms?: string[];

  constructor(
    import_source_link?: string,
    import_source_corpus?: string,
    import_sourceId?: string,
    terms?: string[]
  ) {
    this.import_source_link = import_source_link;
    this.import_source_corpus = import_source_corpus;
    this.import_sourceId = import_sourceId;
    this.terms = terms;
  }
}


class DefinitionHub {
  local_definitions: { [key: string]: Definition };
  incorporated_definitions?: IncorporatedTerms[];
  scope?: string;
  scopeIds?: string[];

  constructor(
    local_definitions: { [key: string]: Definition },
    incorporated_definitions?: IncorporatedTerms[],
    scope?: string,
    scopeIds?: string[]
  ) {
    this.local_definitions = local_definitions;
    this.incorporated_definitions = incorporated_definitions;
    this.scope = scope;
    this.scopeIds = scopeIds;
  }

  // Example method: Add a local definition
  addLocalDefinition(key: string, definition: Definition): void {
    this.local_definitions[key] = definition;
  }

  // Example method: Add an incorporated terms object
  addIncorporatedTerms(incorporatedTerms: IncorporatedTerms): void {
    if (!this.incorporated_definitions) {
      this.incorporated_definitions = [];
    }
    this.incorporated_definitions.push(incorporatedTerms);
  }
}


// # References
export class Reference {
  text: string;
  placeholder?: string;
  corpus?: string;
  id?: string;
  paragraphId?: string;

  constructor(text: string, placeholder?: string, corpus?: string, id?: string, paragraphId?: string) {
    this.text = text;
    this.placeholder = placeholder;
    this.corpus = corpus;
    this.id = id;
    this.paragraphId = paragraphId;
  }
}


export class ReferenceHub {
  references: { [key: string]: Reference };

  constructor(references: { [key: string]: Reference } = {}) {
    this.references = references;
  }

  // Method to combine the references from another ReferenceHub into this one
  combine(otherHub: ReferenceHub): void {
    this.references = {
      ...this.references,
      ...otherHub.references
    };
  }
}


// # Node Text
export class Paragraph {
  index: number;
  text: string;
  parent: string;
  children: string[];
  classification?: string;
  topic?: string;
  references?: ReferenceHub; // Assuming ReferenceHub is defined elsewhere

  constructor(
    index: number,
    text: string,
    parent: string = "", // Default value if not provided
    children: string[] = [], // Default value if not provided
    classification?: string,
    topic?: string,
    references?: ReferenceHub
  ) {
    this.index = index;
    this.text = text;
    this.parent = parent;
    this.children = children;
    this.classification = classification;
    this.topic = topic;
    this.references = references;
  }

  // Example method: Add a child paragraph ID
  addChild(childId: string): void {
    this.children.push(childId);
  }
}


export class NodeText {
  paragraphs: { [key: string]: Paragraph };
  root_paragraphId: string;
  length: number;

  constructor(
    paragraphs: { [key: string]: Paragraph } = {},
    root_paragraphId: string = "ROOT", // Default value if not provided
    length: number = 0 // Default value if not provided
  ) {
    this.paragraphs = paragraphs;
    this.root_paragraphId = root_paragraphId;
    this.length = length;
  }

  private _displayTreeJson(rootId?: string, level: number = 1): any {
    if (!rootId) {
      rootId = this.root_paragraphId;
    }

    let tree: any = {};
    // Check if the rootId is in paragraphs to ensure it's a valid starting point.
    if (this.paragraphs[rootId]) {
      const rootParagraph = this.paragraphs[rootId];
      // Initialize the object for the root paragraph with text and an empty children object.
      tree[rootId] = { text: rootParagraph.text, children: {} };

      for (const childId of rootParagraph.children) {
        // Recursively build the tree for each child.
        const childTree = this._displayTreeJson(childId, level + 1);
        if (childTree) {
          // Directly add the child tree without repeating the child ID as a key inside its own object.
          Object.assign(tree[rootId].children, childTree);
        }
      }
    } else {
      // If rootId is not a valid key in paragraphs, attempt to build trees for paragraphs without a parent.
      for (const [id, paragraph] of Object.entries(this.paragraphs)) {
        if (paragraph.parent === this.root_paragraphId) {
          const childTree = this._displayTreeJson(id, level);
          if (childTree) {
            Object.assign(tree, childTree);
          }
        }
      }
    }

    return tree;
  }

  displayTreeAsJson(sectionCitation: string, sectionName: string): any {
    // Assuming _displayTreeJson is a method in this class that returns
    // a nested dictionary (object in TypeScript) representing the tree
    const treeDict = this._displayTreeJson(); // Assume this method exists and is implemented

    // Construct the JSON representation of the section with the nested tree
    const sectionJson = {
      Section: {
        name: sectionName,
        citation: sectionCitation,
        Content: treeDict,
      },
    };

    return sectionJson;
  }



}


// # Addendum Stuff
class AddendumType {
  type: string;
  text: string;
  prefix?: string;
  references?: ReferenceHub; // Assuming ReferenceHub is defined elsewhere

  constructor(
    text: string,
    type: string = "history", // Default value for type
    prefix?: string,
    references?: ReferenceHub
  ) {
    this.type = type;
    this.text = text;
    this.prefix = prefix;
    this.references = references;
  }
}

class Addendum {
  source?: AddendumType;
  authority?: AddendumType;
  history?: AddendumType;
  metadata?: { [key: string]: any };

  constructor(
    source?: AddendumType,
    authority?: AddendumType,
    history?: AddendumType,
    metadata?: { [key: string]: any }
  ) {
    this.source = source;
    this.authority = authority;
    this.history = history;
    this.metadata = metadata;
  }

  // Example method to illustrate class functionality
  getAddendumText(): string {
    const result: string[] = [];
    
    if (this.source) {
        result.push(this.source.text);
    }
    
    if (this.history) {
        result.push(this.history.text);
    }
    
    if (this.authority) {
        result.push(this.authority.text);
    }
  
    return result.join('\n');
  }
}



// Session ID
interface PipelineModelParams {
  session_id: string;
  history: PhaseReport[];
  queryScoring?: any; // Optional
  queryClarification?: any; // Optional
  queryRefinement?: any; // Optional
  queryExpansion?: any; // Optional
  similaritySearch?: any; // Optional
  directAnswering?: any; // Optional
  scoreFollowup?: any; // Optional
}

export class PipelineModel {
  session_id: string;
  history: PhaseReport[];
  queryScoring?: any;
  queryClarification?: any;
  queryRefinement?: any;
  queryExpansion?: any;
  similaritySearch?: any;
  directAnswering?: any;
  scoreFollowup?: any;

  constructor(params: PipelineModelParams) {
    this.session_id = params.session_id;
    this.history = params.history;
    this.queryScoring = params.queryScoring;
    this.queryClarification = params.queryClarification;
    this.queryRefinement = params.queryRefinement;
    this.queryExpansion = params.queryExpansion;
    this.similaritySearch = params.similaritySearch;
    this.directAnswering = params.directAnswering;
    this.scoreFollowup = params.scoreFollowup;
  }

  addReport(report: PhaseReport) {
    this.history.push(report);
  }

  static fromObject(obj: any): PipelineModel {
    // Assuming PhaseReport also has a way to be initialized from a plain object
    const history = obj.history.map((report: any) => PhaseReport.fromObject(report));

    // Create the new PipelineModel with all properties, defaulting optional ones as necessary
    const model = new PipelineModel({
      session_id: obj.session_id,
      history: history,
      queryScoring: obj.queryScoring,
      queryClarification: obj.queryClarification,
      queryRefinement: obj.queryRefinement,
      queryExpansion: obj.queryExpansion,
      similaritySearch: obj.similaritySearch,
      directAnswering: obj.directAnswering,
      scoreFollowup: obj.scoreFollowup,
    });

    return model;
  }
}




interface NodeConstructorParams {
  id: NodeID | string;
  citation?: string;
  link?: string;
  status?: string;
  nodeType: string;
  topLevelTitle?: string;
  levelClassifier: string;
  number?: string;
  nodeName?: string;
  alias?: string;
  nodeText?: NodeText;
  definitions?: DefinitionHub;
  coreMetadata?: { [key: string]: any };
  processing?: { [key: string]: any };
  addendum?: Addendum;
  dates?: { [key: string]: any };
  summary?: string;
  hyde?: string[];
  agency?: string;
  parent: string;
  directChildren?: string[];
  siblings?: string[];
  incomingReferences?: ReferenceHub;
  textEmbedding?: string;
  summaryEmbedding?: string;
  hydeEmbedding?: string;
  dateCreated?: Date;
  dateModified?: Date;
  similarity?: number;
}
// # Infastructure Node Type
export class Node {
  // Fields Used For Identification
  id: NodeID | string; // Assuming NodeID is a compatible type
  citation?: string;
  link?: string;

  // Core Fields
  status?: string;
  nodeType: string;
  topLevelTitle?: string;
  levelClassifier: string;
  number?: string;
  nodeName?: string;
  alias?: string;
  nodeText?: NodeText;
  definitions?: DefinitionHub;
  coreMetadata?: { [key: string]: any };
  processing?: { [key: string]: any };

  // Addendum Fields
  addendum?: Addendum;
  dates?: { [key: string]: any };

  // Additional Fields
  summary?: string;
  hyde?: string[];
  agency?: string;

  // Node/Graph Traversal Fields
  parent: string;
  directChildren?: string[];
  siblings?: string[];
  incomingReferences?: ReferenceHub;

  // Embedding Fields
  textEmbedding?: string;
  summaryEmbedding?: string;
  hydeEmbedding?: string;

  // Metadata Fields
  dateCreated?: Date; // Assuming usage of JavaScript Date object
  dateModified?: Date;

  // Similarity Fields:
  similarity?: number;

  constructor(params: NodeConstructorParams) {
    this.id = params.id;
    this.citation = params.citation;
    this.link = params.link;
    this.status = params.status;
    this.nodeType = params.nodeType;
    this.topLevelTitle = params.topLevelTitle;
    this.levelClassifier = params.levelClassifier;
    this.number = params.number;
    this.nodeName = params.nodeName;
    this.alias = params.alias;
    this.nodeText = params.nodeText;
    this.definitions = params.definitions;
    this.coreMetadata = params.coreMetadata;
    this.processing = params.processing;
    this.addendum = params.addendum;
    this.dates = params.dates;
    this.summary = params.summary;
    this.hyde = params.hyde;
    this.agency = params.agency;
    this.parent = params.parent;
    this.directChildren = params.directChildren;
    this.siblings = params.siblings;
    this.incomingReferences = params.incomingReferences;
    this.textEmbedding = params.textEmbedding;
    this.summaryEmbedding = params.summaryEmbedding;
    this.hydeEmbedding = params.hydeEmbedding;
    this.dateCreated = params.dateCreated || new Date(); // Defaulting to current date if not provided
    this.dateModified = params.dateModified || new Date(); // Defaulting to current date if not provided
    this.similarity = params.similarity || undefined;
  }
}



const PRICING_DATA: { [vendor: string]: { [model: string]: { input_price: string, output_price: string, context_window?: number, RPM?: number, TPM?: number } } } = {
  "anthropic": {
    "claude-3-opus-20240229": {
      "input_price": "15.00",
      "output_price": "75.00",
      "context_window": 200000,
      "RPM": 2000,
      "TPM": 100000
    },
    "claude-3-sonnet-20240229": {
      "input_price": "3.00",
      "output_price": "15.00",
      "context_window": 200000,
      "RPM": 2000,
      "TPM": 100000
    },
    "claude-3-haiku-20240307": {
      "input_price": "0.25",
      "output_price": "1.25",
      "context_window": 200000,
      "RPM": 2000,
      "TPM": 100000
    }
  },
  "openai": {
    "gpt-4-turbo-preview": {
      "input_price": "10.00",
      "output_price": "30.00",
      "TPM": 800000,
      "RPM": 10000,
      "context_window": 128000
    },
    "gpt-4-0125-preview": {
      "input_price": "10.00",
      "output_price": "30.00",
      "TPM": 800000,
      "RPM": 10000,
      "context_window": 128000
    },
    "gpt-4-1106-preview": {
      "input_price": "10.00",
      "output_price": "30.00",
      "TPM": 800000,
      "RPM": 10000,
      "context_window": 128000
    },
    "gpt-4-1106-vision-preview": {
      "input_price": "10.00",
      "output_price": "30.00",
      "TPM": 150000,
      "RPM": 300000
    },
    "gpt-4": {
      "input_price": "30.00",
      "output_price": "60.00",
      "TPM": 300000,
      "RPM": 10000,
      "context_window": 8192
    },
    "gpt-4-32k": {
      "input_price": "60.00",
      "output_price": "120.00"
    },
    "gpt-3.5-turbo": {
      "input_price": "0.50",
      "output_price": "1.50",
      "TPM": 1000000,
      "RPM": 10000,
      "context_window": 16385
    },
    "gpt-3.5-turbo-0125": {
      "input_price": "0.50",
      "output_price": "1.50",
      "TPM": 1000000,
      "RPM": 10000,
      "context_window": 16385
    },
    "gpt-3.5-turbo-1106": {
      "input_price": "1.00",
      "output_price": "2.00",
      "TPM": 1000000,
      "RPM": 10000,
      "context_window": 16385
    },
    "gpt-3.5-turbo-0301": {
      "input_price": "1.50",
      "output_price": "2.00",
      "TPM": 1000000,
      "RPM": 10000
    },
    "gpt-3.5-turbo-0613": {
      "input_price": "1.50",
      "output_price": "2.00",
      "TPM": 1000000,
      "RPM": 10000
    },
    "gpt-3.5-turbo-instruct": {
      "input_price": "1.50",
      "output_price": "2.00",
      "TPM": 90000,
      "RPM": 3500,
      "context_window": 4096
    },
    "gpt-3.5-turbo-16k": {
      "input_price": "3.00",
      "output_price": "4.00",
      "TPM": 1000000,
      "RPM": 10000,
      "context_window": 16385
    },
    "gpt-3.5-turbo-16k-0613": {
      "input_price": "3.00",
      "output_price": "4.00",
      "TPM": 1000000,
      "RPM": 10000,
      "context_window": 16385
    },
    "text-embedding-3-small": {
      "input_price": "0.02",
      "output_price": "",
      "TPM": 5000000,
      "RPM": 10000
    },
    "text-embedding-3-large": {
      "input_price": "0.13",
      "output_price": "",
      "TPM": 5000000,
      "RPM": 10000
    },
    "text-embedding-ada-002": {
      "input_price": "0.10",
      "output_price": "",
      "TPM": 5000000,
      "RPM": 10000
    },
    "davinci-002": {
      "input_price": "12.00",
      "output_price": "12.00",
      "TPM": 250000,
      "RPM": 3000,
      "context_window": 16384
    },
    "babbage-002": {
      "input_price": "1.60",
      "output_price": "1.60",
      "TPM": 250000,
      "RPM": 3000,
      "context_window": 16384
    }
  }
}