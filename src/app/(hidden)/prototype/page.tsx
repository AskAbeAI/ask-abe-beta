"use client";
// Import React dependencies
import React, { useState, useEffect } from "react";
// Import UI components
import NavBar from "@/components/pnavBar";
import BottomBar from "@/components/pbottombar";
import ContentQueue from "@/components/pcontentQueue";
import DynamicDropdown from "@/components/sectionDropdown";
import { TreeNode } from "@/lib/types";
import LegislationTreeView from '@/components/legislationTreeView';
import legislationData from '../../../../public/treedata/title1.json'; // Adjust the path as necessary


import {
  DisclaimerModal,
  JurisdictionModal,
} from "@/components/disclaimermodal";
// Import data types
import { ContentType, ContentBlock, ContentBlockParams, CitationBlockProps, Clarification, Node, AnswerChunk } from "@/lib/types";
import {  node_as_row, ClarificationChoices} from '@/lib/types';

import CitationBar from '@/components/citationBar';
import OptionsList from '@/components/optionsFilter';
import { Option, Jurisdiction, questionJurisdictions, PipelineModel } from '@/lib/types';

import { StateJurisdictionOptions, FederalJurisdictionOptions, MiscJurisdictionOptions, ChatOptions } from '@/lib/types';
import { UiState, Short, Long, History, AbeMemory } from '@/lib/types';


// Helper functions
import {
  constructPromptQuery,
  constructPromptQueryMisc,
  constructPromptQueryBoth,
  createNewMemory,
} from "@/lib/utils";

import { useMediaQuery } from "react-responsive";
// Import Request, Response types from APIs
import { QueryScoringRequest, QueryScoringResponse, QueryExpansionRequest, QueryExpansionResponse, SimilaritySearchRequest, SimilaritySearchResponse, QueryClarificationRequest, QueryClarificationResponse, SearchSimilarContentRequest, SearchSimilarContentResponse, AnswerNewQuestionRequest, AnswerNewQuestionResponse } from '@/lib/api_types';


export default function Playground() {
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });
  const isMobile = useMediaQuery({ maxWidth: 1224 });
  // State variables for jurisdiction, option toggles

  // State variables for UI components
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [citationsOpen, setCitationsOpen] = useState(false);

  const [streamingQueue, setStreamingQueue] = useState<ContentBlock[]>([]);
  const [showCurrentLoading, setShowCurrentLoading] = useState(false);
  const [activeCitationId, setActiveCitationId] = useState<string>('');
  const [inputMode, setInputMode] = useState<string>('Initial');
 


  // Testing dynamic dropdown
  

  
  // State variables for legal text, database searches
  // State variables for contentBlocks
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    {
      blockId: `id_${new Date().getTime()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      type: ContentType.Loading,
      content: "Loading...",
      fakeStream: true,
      concurrentStreaming: false,
      neverLoad: true,
    },
    {
      blockId: `id_${new Date().getTime()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      type: ContentType.Welcome,
      content: "",
      fakeStream: false,
      concurrentStreaming: false,
    },
  ]);
  const [citationBlocks, setCitationBlocks] = useState<ContentBlock[]>([]);
  const [jurisdiction, setJurisdiction] = useState<questionJurisdictions>();





  // State variables for session
  const [sessionId, setSessionId] = useState<string>("");

  // State variables for options and jurisdictions
  


  const [askClarifications, setAskClarifications] = useState(false);
  const [showJurisdictionModal, setShowJurisdictionModal] = useState(false);



  // Generate Unique Sessiond IDs here
  function generateSessionID() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  useEffect(() => {
    const sessionId = generateSessionID();
    console.log(`Generated new session ID: ${sessionId}`);
    setSessionId(sessionId);
    // Add welcome block
  }, []);

  // UI Component Block Functions
  const addContentBlock = async (newBlock: ContentBlock): Promise<string> => {
    setShowCurrentLoading(false);
    setContentBlocks((currentBlocks) => [...currentBlocks, newBlock]);
    return newBlock.blockId;
  };

  const addManyContentBlock = async (
    newBlocks: ContentBlock[]
  ): Promise<void> => {
    setStreamingQueue(newBlocks);
    //console.log(newBlocks);
    if (newBlocks[0].type === ContentType.Citation) {
      setCitationBlocks((currentBlocks) => [...currentBlocks, ...newBlocks]);
    } else {
      setContentBlocks((currentBlocks) => [...currentBlocks, ...newBlocks]);
    }

    // console.log(currentlyStreaming);
    return;
  };

  const addNewLoadingBlock = async (
    neverLoad: boolean,
    loadingMessage?: string
  ) => {
    setShowCurrentLoading(true);
    const loadingBlock: ContentBlock = {
      blockId: `id_${new Date().getTime()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      type: ContentType.Loading,
      content: loadingMessage || "Loading...",
      fakeStream: true,
      concurrentStreaming: false,
      neverLoad: neverLoad,
    };
    setContentBlocks((currentBlocks) => [...currentBlocks, loadingBlock]);
    return;
  };

  const createNewBlock = (params: ContentBlockParams) => {
    const newBlock = {
      blockId: `id_${new Date().getTime()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`, // Generate a unique ID for the new block
      type: params.type,
      content: params.content,
      fakeStream: params.fake_stream,
      concurrentStreaming: params.concurrentStreaming,
      userInput: "",
      clarifyingQuestion: params.clarifyingQuestion,
      clarifyingAnswers: params.clarifyingAnswers,
      citationProps: params.citationProps,
      content_list: params.content_list,
      mode: params.mode,
      neverLoad: params.neverLoad,
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

    return;
  };

  // Logic for starting question answering process
  const handleNewTextInput = async (textInput: string) => {
    // If no jurisdiction is selected, make the user choose one
    

    setIsFormVisible(false); // Hide the form when a question is submitted
    // Add the question to the state variable
    const text = textInput.trim();
    if (!text) return;

    const ecfrJurisdiction: questionJurisdictions = {
      mode: 'federal',
      state: undefined,
      federal: { id: '1', name: 'US Federal Regulations', abbreviation: 'ecfr', corpusTitle: 'United States Code of Federal Regulations', usesSubContentNodes: false, jurisdictionLevel: 'federal' },
      misc: undefined
    }
    setJurisdiction(ecfrJurisdiction)

    
   

    // Create a question block and add it
    let newParams: ContentBlockParams = {
      type: ContentType.Question,
      content: text,
      fake_stream: false,
      concurrentStreaming: false,
    };
    await addContentBlock(createNewBlock(newParams));

    const memory: AbeMemory = createNewMemory(text, sessionId, ecfrJurisdiction)
    memory.short.currentRefinedQuestion = text;
    let embedding = await expandQuery(memory);
    memory.short.currentEmbedding = embedding;

    await searchDatabase(memory);

    let answer = await answerQuestion(memory);
  };

  const expandQuery = async (memory: AbeMemory): Promise<number[]> => {
    const requestBody: QueryExpansionRequest = {
      base: {
        vendor: "openai",
        model: "gpt-4-turbo-preview",
        callingFunction: "expandQuery",
        pipelineModel: memory.history.pipelineModel,
      },
      refinedQuestion: memory.short.currentRefinedQuestion!,
      specificQuestions: memory.short.specificQuestions!,
    };
    const response = await fetch("/api/improveQuery/queryExpansion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result: QueryExpansionResponse = await response.json();
    const embedding = result.embedding;
    return embedding;
  };

  const searchDatabase = async (memory: AbeMemory) => {
    const query_expansion_embedding = await expandQuery(memory);
    const requestBody: SearchSimilarContentRequest = {
      base: {
        vendor: "openai",
        model: "gpt-4-turbo-preview",
        callingFunction: "expandQuery",
        pipelineModel: memory.history.pipelineModel,
      },
      jurisdictions: memory.long.questionJurisdictions!,
      query_expansion_embedding: query_expansion_embedding,
    };
    const response = await fetch('/api/prototype/search/similarContent', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const result: SearchSimilarContentResponse = await response.json();
    const rows: Node[] = result.primaryRows;
    memory.long.prototypeRows = rows;
    return;
  };

  const answerQuestion = async (
      memory: AbeMemory
    ) => {
      let refinedQuestion: string = constructPromptQuery(memory.short.currentRefinedQuestion!, "Code of Federal Regulations", "United States of America");
  
      const requestBody: AnswerNewQuestionRequest = {
        base: {
          vendor: "openai",
          model: "gpt-4-turbo-preview",
          callingFunction: "expandQuery",
          pipelineModel: memory.history.pipelineModel
        },
        refinedQuestion: refinedQuestion,
        primaryRows: memory.long.prototypeRows!,
        questionJurisdictions: memory.long.questionJurisdictions!
      };
      
  
      
      
    const response = await fetch('/api/prototype/answer/newQuestion', {
        method: 'POST',

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const result: AnswerNewQuestionResponse = await response.json();
      console.log("Received response from directAnswering API!");
  
      const direct_answer: AnswerChunk[] = result.directAnswer;
      const formattedAnswer = formatAnswer(direct_answer);
      console.log(formattedAnswer);


      const params: ContentBlockParams = {

        type: ContentType.Answer,
        content: formattedAnswer,
        fake_stream: true,
        concurrentStreaming: false,
      };
      await addContentBlock(createNewBlock(params));
      setIsFormVisible(true);
      setInputMode("followup");
      return direct_answer;

    };

  
  const setShown = () => {
    setShowJurisdictionModal(false);
  };
  const dummyFunction = async () => {
    return;
  }
  function formatAnswer(chunks: AnswerChunk[]): string {
    return chunks
      .map(chunk => `${chunk.answerTopic}\n${chunk.text}`)
      .join('\n\n');
  }


  return (
    <div>
      {" "}
      {isDesktopOrLaptop && (
        <div className="justify-center items-center h-screen ">
          <NavBar />
          {/* <div className="w-64 h-screen overflow-auto"> 
          <LegislationTreeView legislationData={legislationData} />
      </div> */}
          <JurisdictionModal
            shown={showJurisdictionModal}
            setShown={setShown}
          />

          <DisclaimerModal />

          <div className={`w-full ${citationsOpen ? "hidden" : ""}`}>
            <div
              className="overflow-y-auto w-full "
              style={{ minHeight: "90vh", maxHeight: "90vh" }}
            >
              <ContentQueue
                items={contentBlocks}
                onSubmitClarificationAnswers={dummyFunction}
                onSubmitClarificationVitaliaAnswers={dummyFunction}
                onClarificationStreamEnd={dummyFunction}
                onStreamEnd={onStreamEnd}
                showCurrentLoading={showCurrentLoading}
                onFinishAnswerVitalia={dummyFunction}
                setActiveCitationId={setActiveCitationId}
              />
            </div>
            <div className="inset-x-0 bottom-0 flex justify-between items-center">
              <div
                className="pl-10"
                style={{ width: citationsOpen ? "100%" : "10%" }}
              >
                <div className="" style={{ maxHeight: "90vh" }}>
                  <CitationBar
                    open={citationsOpen}
                    setOpen={setCitationsOpen}
                    citationItems={citationBlocks}
                    activeCitationId={activeCitationId}
                  />
                </div>
              </div>


              {/* BottomBar */}
              {isFormVisible && (
                <BottomBar
                  inputMode={inputMode}
                  handleSubmit={handleNewTextInput}
                  handleSubmitFollowup={handleNewTextInput}
                />
              )}

              <div className="pr-10">
                <OptionsList
                  stateJurisdictions={StateJurisdictionOptions}
                  federalJurisdictions={FederalJurisdictionOptions}
                  miscJurisdictions={MiscJurisdictionOptions}
                  options={ChatOptions}
                  onOptionChange={dummyFunction}
                  onStateJurisdictionChange={dummyFunction}
                  onFederalJurisdictionChange={dummyFunction}
                  onMiscJurisdictionChange={dummyFunction}
                />
                {/* Other parts of your application */}
              </div>
            </div>
          </div>
        </div>

      )}
      {isMobile && (
        <div className="justify-center items-center h-full w-screen">
          <NavBar />
          <JurisdictionModal
            shown={showJurisdictionModal}
            setShown={setShown}
          />

          <DisclaimerModal />

          <div className={`w-full ${citationsOpen ? "hidden" : ""}`}>
            <div
              className="overflow-y-auto w-full "
              style={{ minHeight: "90vh", maxHeight: "90vh" }}
            >
              <ContentQueue
                items={contentBlocks}
                onSubmitClarificationAnswers={dummyFunction}
                onSubmitClarificationVitaliaAnswers={dummyFunction}
                onClarificationStreamEnd={dummyFunction}
                onStreamEnd={onStreamEnd}
                showCurrentLoading={showCurrentLoading}
                onFinishAnswerVitalia={dummyFunction}
                setActiveCitationId={setActiveCitationId}
              />
            </div>
            <div className="inset-x-0 bottom-0 flex justify-between items-center">
              <div
                className="pl-4"
                style={{ width: citationsOpen ? "100%" : "10%" }}
              >
                <div className="" style={{ maxHeight: "90vh" }}>
                  <CitationBar
                    open={citationsOpen}
                    setOpen={setCitationsOpen}
                    citationItems={citationBlocks}
                    activeCitationId={activeCitationId}
                  />
                </div>
              </div>

              {/* BottomBar */}
              {isFormVisible && (
                <BottomBar
                  inputMode={inputMode}
                  handleSubmit={handleNewTextInput}
                  handleSubmitFollowup={handleNewTextInput}
                />
              )}

              <div className="pr-4">
                <OptionsList
                  stateJurisdictions={StateJurisdictionOptions}
                  federalJurisdictions={FederalJurisdictionOptions}
                  miscJurisdictions={MiscJurisdictionOptions}
                  options={ChatOptions}
                  onOptionChange={dummyFunction}
                  onStateJurisdictionChange={dummyFunction}
                  onFederalJurisdictionChange={dummyFunction}
                  onMiscJurisdictionChange={dummyFunction}
                />
                {/* Other parts of your application */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
