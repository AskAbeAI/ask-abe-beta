import { insert_api_usage } from './database';
import dataset from './dataset.json';

export type Dataset = (typeof dataset)[number];

type BaseLevels = "jurisdiction" | "subjurisdiction" | "corpus" 
type AllowedLevels =     "title" | "subtitle" | "code" | "part" | "subpart" | "division" | "subdivision" | "article" | "subarticle" | "chapter" | "subchapter" | "subject-group" | "section" | "appendix" | "hub"; // Extend as needed
const ALLOWED_LEVELS: AllowedLevels[] = ["title", "subtitle", "code", "part", "subpart", "division", "subdivision", "article", "subarticle", "chapter", "subchapter", "subject-group", "section", "appendix", "hub"];


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

export interface QuestionBlockProps {
  content: string;
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

export const ChatOptions: Option[] = [
  // { id: 0, name: 'Include US Federal Jurisdiction', selected: false },
  { id: 0, name: 'Ask Clarifying Questions', selected: false }
];

export interface OptionsListProps {
  
  stateJurisdictions: Jurisdiction[];
  federalJurisdictions: Jurisdiction[];
  miscJurisdictions: Jurisdiction[];
  options: Option[];
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


export class APIParameters {
  vendor: string;
  model: string;
  messages: Message[];
  temperature: number;
  top_p?: number;
  frequency_penalty: number;
  max_tokens?: number;
  stream?: boolean;
  response_format?: { [key: string]: any }; // Assuming a simple object structure
  presence_penalty: number;
  response_model?: any; // TypeScript doesn't directly support Pydantic's BaseModel or dynamic types
  max_retries?: number;
  stop_sequences?: string[];
  calling_function?: string;
  rag_tokens: number;

  constructor(
    vendor: string,
    model: string,
    messages: Message[],
    temperature: number = 1,
    top_p: number = 1,
    frequency_penalty: number = 0,
    rag_tokens: number,
    max_tokens?: number,
    stream: boolean = false,
    response_format?: { [key: string]: any },
    presence_penalty: number = 0,
    response_model?: any,
    max_retries: number = 1,
    stop_sequences?: string[],
    calling_function?: string
  ) {
    this.vendor = vendor;
    this.model = model;
    this.messages = messages;
    this.temperature = Math.min(Math.max(temperature, 0), 1); // Simulate Pydantic's le=1, gt=0
    this.top_p = Math.min(Math.max(top_p, 0), 1); // Optional, with validation
    this.frequency_penalty = Math.min(Math.max(frequency_penalty, 0), 1);
    this.max_tokens = max_tokens;
    this.stream = stream;
    this.response_format = response_format;
    this.presence_penalty = Math.min(Math.max(presence_penalty, 0), 1);
    this.response_model = response_model; // Handling dynamic types might require a different approach
    this.max_retries = max_retries;
    this.stop_sequences = stop_sequences;
    this.calling_function = calling_function; // Consider manually setting this based on use case
    this.rag_tokens = rag_tokens;
  }

  // Add methods for any custom logic or validation as needed.
}





// ##### Usage Stuff ######

export class APIUsage {
  responseId: string;
  sessionId: string | null;
  callingFunction: string;
  vendor: string;
  model: string;
  inputTokens: number | null;
  ragTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  inputCost: number | null;
  ragCost: number | null;
  outputCost: number | null;
  totalCost: number | null;
  requestStatus: number;
  errorMessage: string | null;
  duration: number | null;
  apiKeyName: string | null;
  timestamp: Date | null;

  constructor(
    responseId: string,
    callingFunction: string,
    vendor: string,
    model: string,
    requestStatus: number,
    sessionId: string | null = null,
    inputTokens: number | null = null,
    ragTokens: number | null = null,
    outputTokens: number | null = null,
    totalTokens: number | null = null,
    inputCost: number | null = null,
    ragCost: number | null = null,
    outputCost: number | null = null,
    totalCost: number | null = null,
    errorMessage: string | null = null,
    duration: number | null = null,
    apiKeyName: string | null = null,
    timestamp: Date | null = null
  ) {
    this.responseId = responseId;
    this.sessionId = sessionId;
    this.callingFunction = callingFunction;
    this.vendor = vendor;
    this.model = model;
    this.inputTokens = inputTokens;
    this.ragTokens = ragTokens;
    this.outputTokens = outputTokens;
    this.totalTokens = totalTokens;
    this.inputCost = inputCost;
    this.ragCost = ragCost;
    this.outputCost = outputCost;
    this.totalCost = totalCost;
    this.requestStatus = requestStatus;
    this.errorMessage = errorMessage;
    this.duration = duration;
    this.apiKeyName = apiKeyName;
    this.timestamp = timestamp;
    this.computeCost();

  }

  // Example Method: A method to update the status and error message of the ApiUsage instance
  updateStatus(requestStatus: number, errorMessage: string | null): void {
    this.requestStatus = requestStatus;
    this.errorMessage = errorMessage;
  }
  insert() {
    insert_api_usage(this)
  }
  computeCost(): void {
    // Don't recompute if the cost is already set
    if (this.totalCost !== null) {
      return;
    }
    // Don't compute if there are no input tokens (Failed completion)
    if (this.inputCost === null) {
      return;
    }
    
    // Access the vendor and model specific pricing information
    let vendor = this.vendor.includes("instructor/") ? this.vendor.replace("instructor/", "") : this.vendor;
    let modelPricing;
    try {
      modelPricing = PRICING_DATA[vendor][this.model];
    } catch (error) {
      throw new Error(`Pricing data not found for model ${this.model} and vendor ${this.vendor}`);
    }

    // Calculate costs assuming inputTokens, ragTokens, and outputTokens are not null
    this.inputCost = (this.inputTokens || 0) / 1e6 * parseFloat(modelPricing.input_price);
    this.ragCost = (this.ragTokens || 0) / 1e6 * parseFloat(modelPricing.input_price);
    this.outputCost = (this.outputTokens || 0) / 1e6 * parseFloat(modelPricing.output_price);
    this.totalCost = (this.inputCost || 0) + (this.outputCost || 0);
  }

  // Additional methods can be added here to handle other behaviors.
}




enum PhaseType {
  SQL_TRANSFER = "SQL_TRANSFER",
  PYTHON_LOAD = "PYTHON_LOAD",
  LLM_CALL = "LLM_CALL",
  PYTHON_DUMP = "PYTHON_DUMP"
}


class PhaseReport {
  phaseType: PhaseType;
  description?: string;
  sourceTable?: string;
  pythonFunction?: string;
  destinationTable?: string;
  apiUsageId?: string;
  timestamp: Date;
  errorCode?: number;
  errorMessage?: string;

  constructor(
    phaseType: PhaseType,
    timestamp: Date, // Required fields must be included in the constructor
    description?: string,
    sourceTable?: string,
    pythonFunction?: string,
    destinationTable?: string,
    apiUsageId?: string,
    errorCode?: number,
    errorMessage?: string
  ) {
    this.phaseType = phaseType;
    this.timestamp = timestamp;
    this.description = description;
    this.sourceTable = sourceTable;
    this.pythonFunction = pythonFunction;
    this.destinationTable = destinationTable;
    this.apiUsageId = apiUsageId;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }

  // Example Method: Update the phase report's error information
  updateError(errorCode: number, errorMessage: string): void {
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
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
  import_source_id?: string;
  terms?: string[];

  constructor(
    import_source_link?: string,
    import_source_corpus?: string,
    import_source_id?: string,
    terms?: string[]
  ) {
    this.import_source_link = import_source_link;
    this.import_source_corpus = import_source_corpus;
    this.import_source_id = import_source_id;
    this.terms = terms;
  }
}


class DefinitionHub {
  local_definitions: { [key: string]: Definition };
  incorporated_definitions?: IncorporatedTerms[];
  scope?: string;
  scope_ids?: string[];

  constructor(
    local_definitions: { [key: string]: Definition },
    incorporated_definitions?: IncorporatedTerms[],
    scope?: string,
    scope_ids?: string[]
  ) {
    this.local_definitions = local_definitions;
    this.incorporated_definitions = incorporated_definitions;
    this.scope = scope;
    this.scope_ids = scope_ids;
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
class Reference {
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


class ReferenceHub {
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
class Paragraph {
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


class NodeText {
  paragraphs: { [key: string]: Paragraph };
  root_paragraph_id: string;
  length: number;

  constructor(
    paragraphs: { [key: string]: Paragraph } = {},
    root_paragraph_id: string = "ROOT", // Default value if not provided
    length: number = 0 // Default value if not provided
  ) {
    this.paragraphs = paragraphs;
    this.root_paragraph_id = root_paragraph_id;
    this.length = length;
  }

  // Example method: Add a new paragraph
  addParagraph(paragraphId: string, paragraph: Paragraph): void {
    if (!this.paragraphs[paragraphId]) {
      this.paragraphs[paragraphId] = paragraph;
      this.length++;
    }
  }

  // Example method: Get a paragraph by its ID
  getParagraph(paragraphId: string): Paragraph | undefined {
    return this.paragraphs[paragraphId];
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