"use client";
// Import React dependencies
import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import CustomIFrame from '@/components/customIFrame';
import { NextResponse } from 'next/server';
// Import UI components
import BottomBar from '@/components/bottomBar';
import ChatContainer from '@/components/chatContainer';
import Frame from 'react-frame-component';

// Import data types
import { ContentType, ContentBlock, ContentBlockParams, Clarification, CitationLinks } from "@/lib/types";
import { node_as_row,  ClarificationChoices} from '@/lib/types';


import { Jurisdiction, GroupedRows, questionJurisdictions } from '@/lib/types';
// Helper functions
import { constructPromptQuery, constructPromptQueryMisc } from '@/lib/utils';


import { generateDirectAnswer, generateEmbedding, generateQueryRefinement, convertGroupedRowsToTextCitationPairs } from '@/lib/helpers';

import OpenAI from "openai";
import { insert_api_debug_log, jurisdiction_similarity_search_all_partitions, aggregateSiblingRows } from '@/lib/database';

const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

export default function EmbedPage() {

  // State variables for UI components
  const [isFormVisible, setIsFormVisible] = useState(true);
  
  const [currentlyStreaming, setCurrentlyStreaming] = useState(false);
  const [streamingQueue, setStreamingQueue] = useState<ContentBlock[]>([]);
  const [showCurrentLoading, setShowCurrentLoading] = useState(false);
  const [inputMode, setInputMode] = useState<string>('vitalia');

  useEffect(() => {
    const handleTailwindLoad = (event: MessageEvent) => {
      if (event.data.tailwindLoaded) {
        // Tailwind CSS has loaded, re-render or update state as necessary
      }
    };
  
    window.addEventListener('message', handleTailwindLoad);
  
    return () => {
      window.removeEventListener('message', handleTailwindLoad);
    };
  }, []);

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
        type: ContentType.WelcomeVitalia,
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


  
  // Generate Unique Sessiond IDs here
  useEffect(() => {
    const sessionID = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log(`Generated new session ID: ${sessionID}`);
    setSessionID(sessionID);

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
      neverLoad: params.neverLoad,
      citationLinks: params.citationLinks
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
    const questionText = question.trim();
    setQuestion(questionText);
    if (!questionText) return;
    setIsFormVisible(false); // Hide the form when a question is submitted
    const embedding = JSON.parse(JSON.stringify(await generateEmbedding(openai, [question])));
     // Create a question block
     let newParams: ContentBlockParams = {
      type: ContentType.Question,
      content: questionText,
      fake_stream: false,
      concurrentStreaming: false
    };
    await addContentBlock(createNewBlock(newParams));
    addNewLoadingBlock(false);
    const rows = await jurisdiction_similarity_search_all_partitions("vitalia", embedding, 0.6, 10, 15, process.env.supabaseUrl!, process.env.supabaseKey!);
    let primary_rows: node_as_row[] = rows;
    const citationLinks: CitationLinks = {};

    primary_rows.forEach(row => {
      if (row.citation && row.link) {
        citationLinks[row.citation] = row.link;
      }
    });
    const jurisdiction: Jurisdiction = {id: '1', name: 'Vitalia Wiki', abbreviation: 'vitalia', corpusTitle: 'Vitalia Wiki Documentation', usesSubContentNodes: false, jurisdictionLevel: 'misc' };
    const combined_parent_nodes: GroupedRows = await aggregateSiblingRows(rows, false, jurisdiction);
    const text_citation_pairs = convertGroupedRowsToTextCitationPairs(combined_parent_nodes);
    const instructions = `The user is looking to receive information about Vitalia 2024, which is a popup city event in the special economic zone of Prospera, on the island of Roatan Honduras. Here are some general facts that may help with answering: Location: Vitalia 2024 will be hosted in Próspera, a Special Economic Zone on the island of Roatan, Honduras.
    Duration: The pop-up city experience will take place from Jan 6th to March 1st 2024, and encourages a minimum stay of 1 month, with a focus on participants willing to spend at least 2 months.
    Cost: Room pricing ranges from $1,000 to $3,000 per month, including accommodation and shared amenities like a gym and shared cars.
    Who's Coming: The resident profile consists of scientists, entrepreneurs, artists, and thinkers specializing in fields like longevity biotechnology, healthcare, and decentralized governance.
    Work Compatibility: Vitalia is not a conference; participants are encouraged to bring their work with them.
    Amenities: The package includes medium-range private suites, free-use facilities like a gym and pool, on-site healthcare, and logistical services like car pooling.
    Additional Services: Childcare services and a variety of wellness activities organized by residents are available.
    Local Community: Roatan has a diverse and friendly local community with many accepting Bitcoin and other cryptocurrencies.
    Acceleration of Longevity Innovation: Vitalia, long-term, aims to eliminate bureaucratic roadblocks to speed up clinical trials and lower costs in the longevity field.
    
    Answer the user's more specific question as best you can. For broad or general questions, it's okay to give a general overview.`
    setAlreadyAnswered(alreadyAnswered => [...alreadyAnswered, question]);
    const direct_answer = await generateDirectAnswer(openai, question, instructions, text_citation_pairs);
    
    const endTime = Date.now();
    const params: ContentBlockParams = {
      type: ContentType.AnswerVitalia,
      content: direct_answer,
      fake_stream: false,
      concurrentStreaming: false,
      citationLinks: citationLinks
    };
    await addContentBlock(createNewBlock(params));
    setIsFormVisible(true);

  };

  const dummyFunction = async () => {
    return;
  }
  
  return (
    <Frame title="Ask Abe Integration" style={{ width: '100%', minHeight: '100vh' }}
      head={
        <>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <link rel="stylesheet" href="/styles.css"></link>
        </>
      }
    
    >
      <div className="flex h-full w-full px-5 py-5 bg-[#FAF5E6]" style={{ minHeight: '100vh' }}>  
        <div className="flex w-full" style={{ minHeight: '100vh' }}>
          <div className="overflow-y-auto w-full" style={{ minHeight: '90vh' }}>
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
