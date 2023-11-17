import dataset from './dataset.json';

export type Dataset = (typeof dataset)[number];



// Generic Content Block Types, Props, and Interfaces
export enum ContentType {
  Question,
  Welcome,
  Answer,
  Clarification,
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
export interface WelcomeBlockProps {
  content: string;
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
  id: string;
  name: string;
}

export interface OptionsListProps {
  options: Option[];
  onSelectionChange: (selectedIds: string[]) => void;
}


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
  };
}
// Citation Types
export type text_citation_pair = {
  section_citation: string;
  text: string;
};

