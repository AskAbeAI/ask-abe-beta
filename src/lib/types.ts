import dataset from './dataset.json';

export type Dataset = (typeof dataset)[number];



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
  StreamingAnswer,
  Approval,
  InteractiveElement,
  Citation,
  Topics,
  FinalAnswer,
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
  topicResponses?: TopicResponses;
  finalAnswer?: PartialAnswer[];
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
  topicResponses?: TopicResponses;
  finalAnswer?: PartialAnswer[];
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
}
export interface FinalAnswerBlockProps {
  content: string;
  fakeStream: boolean;
  concurrentStreaming: boolean;
  onStreamEnd: (concurrentStreaming: boolean) => void;
  finalAnswer: PartialAnswer[];
}
export interface ApprovalBlockProps {
  content: string;
  fakeStream: boolean;
  concurrentStreaming: boolean;
  onStreamEnd: (concurrentStreaming: boolean) => void;

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
export interface TopicsBlockProps {
  topicResponses: TopicResponses,
  content: string,
  fakeStream: boolean,
  concurrentStreaming: boolean,
  onStreamEnd: (concurrentStreaming: boolean) => void,
  onSubmitTopicChoices: (topicChoices: TopicResponses) => void,
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
    // { id: '9', name: ' Florida', abbreviation: 'FL', corpusTitle: 'Florida Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '10', name: ' Georgia', abbreviation: 'GA', corpusTitle: 'Georgia Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '11', name: ' Hawaii', abbreviation: 'HI', corpusTitle: 'Hawaii Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '12', name: ' Idaho', abbreviation: 'ID', corpusTitle: 'Idaho Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '13', name: ' Illinois', abbreviation: 'IL', corpusTitle: 'Illinois Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '14', name: ' Indiana', abbreviation: 'IN', corpusTitle: 'Indiana Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '15', name: ' Iowa', abbreviation: 'IA', corpusTitle: 'Iowa Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '16', name: 'Kansas', abbreviation: 'KS', corpusTitle: 'Kansas Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '17', name: 'Kentucky', abbreviation: 'KY', corpusTitle: 'Kentucky Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '18', name: 'Louisiana', abbreviation: 'LA', corpusTitle: 'Louisiana Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '19', name: 'Maine', abbreviation: 'ME', corpusTitle: 'Maine Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '20', name: 'Maryland', abbreviation: 'MD', corpusTitle: 'Maryland Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '21', name: 'Massachusetts', abbreviation: 'MA', corpusTitle: 'Massachusetts Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '22', name: 'Michigan', abbreviation: 'MI', corpusTitle: 'Michigan Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '23', name: 'Minnesota', abbreviation: 'MN', corpusTitle: 'Minnesota Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '24', name: 'Mississippi', abbreviation: 'MS', corpusTitle: 'Mississippi Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '25', name: 'Missouri', abbreviation: 'MO', corpusTitle: 'Missouri Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '26', name: 'Montana', abbreviation: 'MT', corpusTitle: 'Montana Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '27', name: 'Nebraska', abbreviation: 'NE', corpusTitle: 'Nebraska Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '28', name: 'Nevada', abbreviation: 'NV', corpusTitle: 'Nevada Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '29', name: 'New Hampshire', abbreviation: 'NH', corpusTitle: 'New Hampshire Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '30', name: 'New Jersey', abbreviation: 'NJ', corpusTitle: 'New Jersey Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '31', name: 'New Mexico', abbreviation: 'NM', corpusTitle: 'New Mexico Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '32', name: 'New York', abbreviation: 'NY', corpusTitle: 'New York Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '33', name: 'North Carolina', abbreviation: 'NC', corpusTitle: 'North Carolina Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '34', name: 'North Dakota', abbreviation: 'ND', corpusTitle: 'North Dakota Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '35', name: 'Ohio', abbreviation: 'OH', corpusTitle: 'Ohio Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '36', name: 'Oklahoma', abbreviation: 'OK', corpusTitle: 'Oklahoma Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '37', name: 'Oregon', abbreviation: 'OR', corpusTitle: 'Oregon Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '38', name: 'Pennsylvania', abbreviation: 'PA', corpusTitle: 'Pennsylvania Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
    // { id: '39', name: 'Rhode Island', abbreviation: 'RI', corpusTitle: 'Rhode Island Statutes', usesSubContentNodes: false, jurisdictionLevel: 'state' },
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
];

export const MiscJurisdictionOptions: Jurisdiction[] = [
  {id: '1', name: 'Vitalia Wiki', abbreviation: 'vitalia', corpusTitle: 'Vitalia Wiki Documentation', usesSubContentNodes: false, jurisdictionLevel: 'misc' },
];

export const ChatOptions: Option[] = [
  // { id: 0, name: 'Include US Federal Jurisdiction', selected: false },
  { id: 0, name: 'Skip Clarifying Questions', selected: false }
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
  id: string;
  node_type: string;
  top_level_title: string;
  parent_node: string;
  child_nodes: string[];
  sibling_nodes: string[];
  internal_references: string[];
  external_references: string[];
  node_text: string;
  citation: string;
  similarity: number;
  link?: string;
};
// Type for master partitioned table primary key
export type node_key = {
  id: string;
  top_level_title: string;
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
// Topic Generation Types
export interface SubTopic {
  sub_topic: string;
  section_citations: string[];
}
export interface GeneralTopic {
  general_topic: string;
  sub_topics: SubTopic[];
}
export interface TopicResponses {
  general_topics: GeneralTopic[];
}
// Partial Answer Types
export interface PartialAnswer {
  major_topic: string;
  sub_topic: string;
  section_citations: string[];
  answer: string;
}
// Grouped Rows Types
export interface GroupedRows {
  [parent: string]: {
    rows: node_as_row[];
    section_text: string[];
    citation: string;
    link: string;
    jurisdiction: Jurisdiction;
  };
}
// Citation Types
export type text_citation_pair = {
  section_citation: string;
  text: string;
  document: string;
};

export type questionJurisdictions = {
  mode: string;
  state: Jurisdiction | undefined;
  federal: Jurisdiction | undefined;
  misc: Jurisdiction | undefined;
};