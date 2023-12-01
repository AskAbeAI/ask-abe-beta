"use client";
// Import React dependencies
import React, { useState, useEffect } from 'react';
import CustomIFrame from '@/components/customIFrame';
// Import UI components
import BottomBar from '@/components/bottomBar';
import ChatContainer from '@/components/chatContainer';
import Frame from 'react-frame-component';

// Import data types
import { ContentType, ContentBlock, ContentBlockParams,  GroupedRows, Clarification } from "@/lib/types";
import { node_as_row,  ClarificationChoices} from '@/lib/types';
import { aggregateSiblingRows } from '@/lib/database';

import { Jurisdiction, questionJurisdictions } from '@/lib/types';
// Helper functions
import { constructPromptQuery, constructPromptQueryMisc } from '@/lib/utils';

export default function EmbedPage() {

  // State variables for UI components
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [citationsOpen, setCitationsOpen] = useState(false);
  const [currentlyStreaming, setCurrentlyStreaming] = useState(false);
  const [streamingQueue, setStreamingQueue] = useState<ContentBlock[]>([]);
  const [showCurrentLoading, setShowCurrentLoading] = useState(false);
  const [inputMode, setInputMode] = useState<string>('Initial');

  // State variables for contentBlocks
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([{
        blockId: `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`,
        type: ContentType.Loading,
        content: "Loading...",
        fakeStream: true,
        concurrentStreaming: false,
        neverLoad: true
      },
      {
        blockId: `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`,
        type: ContentType.Welcome,
        content: "",
        fakeStream: false,
        concurrentStreaming: false,
      }
     ]);
  // State variables for prompt logic
  const [question, setQuestion] = useState('');
  const [clarificationResponses, setClarificationResponses] = useState<Clarification[]>([]);
  const [alreadyAnswered, setAlreadyAnswered] = useState(['']);

  // State variables for session
  const [sessionID, setSessionID] = useState<string>("");

  // State variables for options and jurisdictions
  const [selectedMiscJurisdiction, setSelectedMiscJurisdiction] = useState<Jurisdiction | undefined>({id: '1', name: 'Vitalia Wiki', abbreviation: 'vitalia', corpusTitle: 'Vitalia Wiki Documentation', usesSubContentNodes: false, jurisdictionLevel: 'misc' });
  const [questionJurisdictions, setQuestionJurisdictions] = useState<questionJurisdictions>({mode: "misc", misc: {id: '1', name: 'Vitalia Wiki', abbreviation: 'vitalia', corpusTitle: 'Vitalia Wiki Documentation', usesSubContentNodes: false, jurisdictionLevel: 'misc' }, federal: undefined, state: undefined});

  // Generate Unique Sessiond IDs here
  function generateSessionID() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  useEffect(() => {
    const sessionID = generateSessionID();
    console.log(`Generated new session ID: ${sessionID}`);
    setSessionID(sessionID);
    // Add welcome block
  }, []);

  // UI Component Block Functions
  const addContentBlock = async (newBlock: ContentBlock): Promise<string> => {
    if (newBlock.fakeStream) {
      setCurrentlyStreaming(true);
    }
    setShowCurrentLoading(false);
    setContentBlocks(currentBlocks => [...currentBlocks, newBlock]);
    return newBlock.blockId;
  };

  const addNewLoadingBlock = async (neverLoad: boolean, loadingMessage?: string) => {
    setShowCurrentLoading(true);
    const loadingBlock: ContentBlock = {
      blockId: `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`,
      type: ContentType.Loading,
      content: loadingMessage || "Loading...",
      fakeStream: true,
      concurrentStreaming: false,
      neverLoad: neverLoad
    };
    setContentBlocks(currentBlocks => [...currentBlocks, loadingBlock]);
    return;
  };

  const createNewBlock = (params: ContentBlockParams) => {

    const newBlock = {
      blockId: `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`, // Generate a unique ID for the new block
      type: params.type,
      content: params.content,
      fakeStream: params.fake_stream,
      concurrentStreaming: params.concurrentStreaming,
      userInput: "",
      clarifyingQuestion: params.clarifyingQuestion,
      clarifyingAnswers: params.clarifyingAnswers,
      citationProps: params.citationProps,
      topicResponses: params.topicResponses,
      finalAnswer: params.finalAnswer,
      content_list: params.content_list,
      mode: params.mode,
      neverLoad: params.neverLoad
    };

    return newBlock;
  };

  // UI Streaming Functions
  const onStreamEnd = (concurrentStreaming: boolean) => {
    // console.log("Stream ended!");
    // If there's no line, return
    if (concurrentStreaming) {
      streamingQueue.shift();
    }
    if (streamingQueue.length === 0) {
      setCurrentlyStreaming(false);
    }

    return;
  };

  // Logic for starting question answering process
  const handleNewQuestion = async (question: string) => {
    
    setIsFormVisible(false); // Hide the form when a question is submitted
    const questionText = question.trim();
    setQuestion(questionText);
    if (!questionText) return;

    // Create a question block
    let newParams: ContentBlockParams = {
      type: ContentType.Question,
      content: questionText,
      fake_stream: false,
      concurrentStreaming: false
    };
    await addContentBlock(createNewBlock(newParams));
    const question_jurisdictions = questionJurisdictions!;
    addNewLoadingBlock(false);
    similaritySearch(question_jurisdictions, questionText, []);
  };

  // queryExpansion API handlers
  const queryExpansion = async (user_query: string, specific_questions: string[]): Promise<string> => {
    const requestBody = {
      query: user_query,
      refined_question: user_query,
      specific_questions: specific_questions,
    };
    const response = await fetch('/api/improveQuery/queryExpansion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionID,
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    const embedding = result.embedded_expansion_query;
    return embedding;
  };

  // similaritySearch API handler
  const similaritySearch = async (question_jurisdiction: questionJurisdictions, user_query: string, specific_questions: string[]) => {

    const query_expansion_embedding = await queryExpansion(user_query, specific_questions);
    

    console.log(question_jurisdiction)
    const requestBody = {
      jurisdictions: question_jurisdiction,
      query_expansion_embedding: query_expansion_embedding,
    };
    console.log("  - Sending request to similaritySearch API!");
    const response = await fetch('/api/searchDatabase/similaritySearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionID,
      },
      body: JSON.stringify(requestBody),
    });
    

    const result = await response.json();

    let primary_rows: node_as_row[] = result.primary_rows;
    console.log("Received response from similaritySearch API!")
    console.log(primary_rows)
    const primary_jurisdiction: Jurisdiction = question_jurisdiction.misc!;
    
    
    // Get a set of all unique parent_nodes in combinedRows variable
    const primary_grouped_rows: GroupedRows = await aggregateSiblingRows(primary_rows, false, primary_jurisdiction);
    setQuestionJurisdictions(question_jurisdiction);

    await directAnswering(user_query, specific_questions, primary_grouped_rows, {}, clarificationResponses);
  };

  const directAnswering = async (
    user_query: string,
    specific_questions: string[],
    primary_grouped_rows: GroupedRows,
    secondary_grouped_rows: GroupedRows,
    combinedClarifications: Clarification[],
  ) => {
    console.log(questionJurisdictions);

    let user_prompt_query: string = constructPromptQuery(user_query, questionJurisdictions?.state?.corpusTitle || 'The Country Of ', questionJurisdictions!.federal?.corpusTitle || "USA");

    if (questionJurisdictions?.mode === "misc") {
      user_prompt_query = constructPromptQueryMisc(user_query, questionJurisdictions?.misc?.corpusTitle || 'This Legal Documentation');
    }
    const requestBody = {
      legal_question: user_prompt_query,
      specific_questions: specific_questions,
      primary_grouped_rows: primary_grouped_rows,
      secondary_grouped_rows: secondary_grouped_rows,
      already_answered: alreadyAnswered,
      clarifications: { clarifications: combinedClarifications } as ClarificationChoices,
      mode: "clarifications"
    };
    
    requestBody.mode = "single";
    

    setAlreadyAnswered(alreadyAnswered => [...alreadyAnswered, user_query]);
    console.log("  - Sending request to directAnswering API!");
    const response = await fetch('/api/answerQuery/directAnswering', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionID,
      },
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();
    console.log("Received response from directAnswering API!");

    const direct_answer: string = result.directAnswer;
    console.log(direct_answer);
    const params: ContentBlockParams = {
      type: ContentType.Answer,
      content: direct_answer,
      fake_stream: true,
      concurrentStreaming: false,
    };
    await addContentBlock(createNewBlock(params));
    setIsFormVisible(true);
    setInputMode("followup");
    return direct_answer;
  };
  const dummyFunction = async () => {
    return;
  }

  return (
    <Frame title="Ask Abe Integration" style={{ width: '200vh', height: '100vh' }}
      head={
        <>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          
          
          <script src="https://cdn.tailwindcss.com" async></script>
          
        </>
      }
    
    >
      <div className="flex h-full w-full px-3 py-3 bg-[#FAF5E6]">  
        <div className="flex w-full style={(width: '100%')}">
          <div className="overflow-y-auto w-full" style={{ minHeight: '90vh', maxHeight: '90vh' }}>
            <ChatContainer
              contentBlocks={contentBlocks}
              onSubmitClarificationAnswers={dummyFunction}
              onSubmitTopicChoices={dummyFunction}
              onClarificationStreamEnd={dummyFunction}
              onStreamEnd={onStreamEnd}
              showCurrentLoading={showCurrentLoading}
              setActiveCitationId={dummyFunction}
            />
          </div>
        </div>
        <div>
          {/* BottomBar */}
          {isFormVisible && (
            <BottomBar
              inputMode={inputMode}
              handleSubmit={handleNewQuestion}
              handleSubmitFollowup={dummyFunction}
            />
          )}
        </div>
      </div>
    </Frame>
  );
};
