"use client";
// Import React dependencies
import React, { useState, useEffect } from "react";
// Import UI components
import BottomBar from "@/components/bottomBar";
import ContentQueue from "@/components/contentQueue";
import {
  DisclaimerModal,
  JurisdictionModal,
} from "@/components/disclaimermodal";
// Import data types
import {
  ContentType,
  ContentBlock,
  ContentBlockParams,
  CitationBlockProps,
  Clarification,
} from "@/lib/types";
import { node_as_row, ClarificationChoices } from "@/lib/types";

import CitationBar from "@/components/citationBar";
import OptionsList from "@/components/optionsFilter";
import {
  Option,
  Jurisdiction,
  questionJurisdictions,
  PipelineModel,
} from "@/lib/types";

import {
  StateJurisdictionOptions,
  FederalJurisdictionOptions,
  MiscJurisdictionOptions,
} from "@/lib/types";
import { UiState, Short, Long, History, AbeMemory } from "@/lib/types";

// Helper functions
import {
  constructPromptQuery,
  constructPromptQueryMisc,
  constructPromptQueryBoth,
  createNewMemory,
} from "@/lib/utilities";

import { useMediaQuery } from "react-responsive";
// Import Request, Response types from APIs
import {
  QueryScoringRequest,
  QueryScoringResponse,
  QueryExpansionRequest,
  QueryExpansionResponse,
  SimilaritySearchRequest,
  SimilaritySearchResponse,
  QueryClarificationRequest,
  QueryClarificationResponse,
  DirectAnsweringRequest,
  DirectAnsweringResponse,
} from "@/lib/api_types";

export default function Playground() {
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });
  const isMobile = useMediaQuery({ maxWidth: 1224 });
  // State variables for jurisdiction, option toggles

  // State variables for UI components
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [citationsOpen, setCitationsOpen] = useState(false);

  const [streamingQueue, setStreamingQueue] = useState<ContentBlock[]>([]);
  const [showCurrentLoading, setShowCurrentLoading] = useState(false);
  const [activeCitationId, setActiveCitationId] = useState<string>("");
  const [inputMode, setInputMode] = useState<string>("Initial");
  const [abeMemory, setAbeMemory] = useState<AbeMemory>();
  const [primaryRows, setPrimaryRows] = useState<node_as_row[]>([]);
  const [secondaryRows, setSecondaryRows] = useState<node_as_row[]>([]);

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

  // State variables for prompt logic
  const [question, setQuestion] = useState("");

  const [clarificationQueue, setClarificationQueue] = useState<
    ContentBlockParams[]
  >([]);
  const [specificQuestions, setSpecificQuestions] = useState<string[]>([]);
  const [clarificationResponses, setClarificationResponses] = useState<
    Clarification[]
  >([]);
  const [alreadyAnswered, setAlreadyAnswered] = useState([""]);

  // State variables for session
  const [sessionId, setSessionId] = useState<string>("");
  const [pipelineModel, setPipelineModel] = useState<PipelineModel>();

  // State variables for options and jurisdictions
  const [selectedFederalJurisdiction, setSelectedFederalJurisdiction] =
    useState<Jurisdiction | undefined>(undefined);
  const [selectedStateJurisdiction, setSelectedStateJurisdiction] = useState<
    Jurisdiction | undefined
  >(undefined);
  const [selectedMiscJurisdiction, setSelectedMiscJurisdiction] = useState<
    Jurisdiction | undefined
  >(undefined);
  const [questionJurisdictions, setQuestionJurisdictions] =
    useState<questionJurisdictions>();

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [askClarifications, setAskClarifications] = useState(false);
  const [showJurisdictionModal, setShowJurisdictionModal] = useState(false);

  useEffect(() => {
    let mode = "state"; // Default mode

    // Determine the mode based on the current jurisdiction selections
    if (selectedFederalJurisdiction && selectedStateJurisdiction) {
      mode = "state_federal";
    } else if (selectedMiscJurisdiction && selectedFederalJurisdiction) {
      mode = "misc_federal";
    } else if (selectedMiscJurisdiction) {
      mode = "misc";
    } else if (selectedFederalJurisdiction) {
      mode = "federal";
    }
    console.log("CLEARING EVERYTHING!");
    setCitationBlocks([]);
    setSpecificQuestions([]);
    setClarificationResponses([]);
    setAlreadyAnswered([]);
    setActiveCitationId("");
    setPrimaryRows([]);
    setSecondaryRows([]);

    setInputMode("Initial");

    setQuestionJurisdictions({
      mode: mode,
      state: selectedStateJurisdiction,
      federal: selectedFederalJurisdiction,
      misc: selectedMiscJurisdiction,
    });
  }, [
    selectedStateJurisdiction,
    selectedFederalJurisdiction,
    selectedMiscJurisdiction,
  ]);
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
  const handleNewQuestion = async (question: string) => {
    // If no jurisdiction is selected, make the user choose one
    if (
      selectedFederalJurisdiction === undefined &&
      selectedStateJurisdiction === undefined &&
      selectedMiscJurisdiction === undefined
    ) {
      setShowJurisdictionModal(true);
      return;
    }
    setIsFormVisible(false); // Hide the form when a question is submitted
    // Add the question to the state variable
    const questionText = question.trim();
    setQuestion(questionText);
    if (!questionText) return;

    const memory: AbeMemory = createNewMemory(
      question,
      sessionId,
      questionJurisdictions!
    );
    memory.short.specificQuestions = [];

    // Create a question block and add it
    let newParams: ContentBlockParams = {
      type: ContentType.Question,
      content: questionText,
      fake_stream: false,
      concurrentStreaming: false,
    };
    await addContentBlock(createNewBlock(newParams));

    let score = 7;
    let message_to_user = "";
    // Only score questions if no misc jurisdiction is selected
    if (selectedMiscJurisdiction === undefined && askClarifications) {
      [score, message_to_user] = await scoreQuestion(memory);
    }

    // Do not ask clarifying questions if skipClarifications is true or if a misc jurisdiction is selected
    if (!askClarifications || selectedMiscJurisdiction !== undefined) {
      similaritySearch(memory);
    } else if (score <= 1) {
      setIsFormVisible(true);
      return;
    }
    // } else {
    //   newParams = {
    //     type: ContentType.Answer,
    //     content: message_to_user,
    //     fake_stream: true,
    //     concurrentStreaming: false
    //   };
    //   addNewLoadingBlock(true);
    //   await addContentBlock(createNewBlock(newParams));
    //   askNewClarification(question_jurisdictions, questionText, "multiple");
    // }
  };

  const scoreQuestion = async (
    memory: AbeMemory
  ): Promise<[number, string]> => {
    const currentQuestion: string = memory.short.currentQuestion!;
    const jurisdictions: questionJurisdictions =
      memory.long.questionJurisdictions!;

    const maskedQuestion: string = constructPromptQuery(
      currentQuestion,
      jurisdictions.state?.corpusTitle || "The Country Of ",
      jurisdictions.federal?.corpusTitle || "USA"
    );

    const requestBody: QueryScoringRequest = {
      base: {
        vendor: "openai",
        model: "gpt-4-turbo-preview",
        callingFunction: "scoreQuestion",
        pipelineModel: memory.history.pipelineModel,
      },
      userQuery: maskedQuestion,
    };
    const response = await fetch("/api/improveQuery/queryScoring", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const result: QueryScoringResponse = await response.json();
    const score: number = result.qualityScore;
    const message_to_user: string = result.messageToUser;
    return [score, message_to_user];
  };

 
  // queryExpansion API handlers
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

  // similaritySearch API handler
  const similaritySearch = async (memory: AbeMemory) => {
    // Expand the query and then return the embedding

    const query_expansion_embedding = await expandQuery(memory);
    addNewLoadingBlock(false);

    const requestBody: SimilaritySearchRequest = {
      base: {
        vendor: "openai",
        model: "gpt-4-turbo-preview",
        callingFunction: "expandQuery",
        pipelineModel: memory.history.pipelineModel,
      },
      jurisdictions: memory.long.questionJurisdictions!,
      query_expansion_embedding: query_expansion_embedding,
    };
    const response = await fetch("/api/searchDatabase/similaritySearch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result: SimilaritySearchResponse = await response.json();
    console.log(result);

    const pimaryRows: node_as_row[] = result.primaryRows;
    const secondaryRows: node_as_row[] = result.secondaryRows;
    setPrimaryRows(pimaryRows);
    setSecondaryRows(secondaryRows);
    //console.log(pimaryRows)

    const jurisdictions: questionJurisdictions =
      memory.long.questionJurisdictions!;

    let primaryJurisdiction;
    let secondaryJurisdiction;
    if (jurisdictions.mode === "misc") {
      primaryJurisdiction = jurisdictions.misc! as Jurisdiction;
    } else if (
      jurisdictions.mode === "state" ||
      jurisdictions.mode === "state_federal"
    ) {
      primaryJurisdiction = jurisdictions.state! as Jurisdiction;
      if (jurisdictions.mode === "state_federal") {
        secondaryJurisdiction = jurisdictions.federal! as Jurisdiction;
      }
    } else {
      primaryJurisdiction = jurisdictions.federal! as Jurisdiction;
    }
    if (jurisdictions.mode === "misc_federal") {
      primaryJurisdiction = jurisdictions.misc! as Jurisdiction;
      secondaryJurisdiction = jurisdictions.federal! as Jurisdiction;
    }

    const all_citation_blocks: ContentBlock[] = [];

    // Create citation blocks for each parent node
    const primary_citation_blocks: ContentBlock[] = [];
    for (const row of pimaryRows) {
      //console.log(row)
      let possible_citation = row.node_citation;
      console.log(possible_citation);
      if (possible_citation === undefined || possible_citation === null) {
        possible_citation = row.node_name;
      }
      if (possible_citation === undefined || possible_citation === null) {
        possible_citation = row.node_id.split("/").pop()!;
      }

      const section_text: string[] = row.node_text;
      const citation: string = possible_citation;
      const link: string = row.node_link;
      //console.log(citation);

      const citationProps: CitationBlockProps = {
        citation: citation,
        jurisdictionName: primaryJurisdiction.corpusTitle,
        link: link,
        section_text: section_text,
        setOpen: setCitationsOpen,
        open: citationsOpen,
      };
      const newParams: ContentBlockParams = {
        type: ContentType.Citation,
        content: "",
        fake_stream: false,
        concurrentStreaming: false,
        citationProps: citationProps,
      };
      const block = createNewBlock(newParams);
      primary_citation_blocks.push(block);
    }
    all_citation_blocks.push(...primary_citation_blocks);

    if (secondaryRows.length > 0) {
      let jurisdictionName = secondaryJurisdiction!.corpusTitle;
      const secondary_citation_blocks: ContentBlock[] = [];
      for (const row of secondaryRows) {
        let possible_citation = row.node_citation;
        console.log(possible_citation);
        if (possible_citation === undefined || possible_citation === null) {
          possible_citation = row.node_name.split(" ")[0];
        }
        const section_text: string[] = row.node_text;
        const citation: string = possible_citation;
        const link: string = row.node_link;
        const citationProps: CitationBlockProps = {
          citation: citation,
          jurisdictionName: jurisdictionName,
          link: link,
          section_text: section_text,
          setOpen: setCitationsOpen,
          open: citationsOpen,
        };
        const newParams: ContentBlockParams = {
          type: ContentType.Citation,
          content: jurisdictionName,
          fake_stream: false,
          concurrentStreaming: false,
          citationProps: citationProps,
        };
        const block = createNewBlock(newParams);
        secondary_citation_blocks.push(block);
      }
      all_citation_blocks.push(...secondary_citation_blocks);
    }

    await addManyContentBlock(all_citation_blocks);

    setAbeMemory(memory);

    await directAnswering(
      memory,
      pimaryRows,
      secondaryRows,
      clarificationResponses,
      jurisdictions
    );
  };

  const directAnswering = async (
    memory: AbeMemory,
    pimaryRows: node_as_row[],
    secondaryRows: node_as_row[],
    combinedClarifications: Clarification[],
    questionJurisdiction: questionJurisdictions
  ) => {
    const refinedQuestion = memory.short.currentRefinedQuestion!;
    const specificQuestions = memory.short.specificQuestions!;
    console.log(questionJurisdictions);

    let user_prompt_query: string = constructPromptQuery(
      refinedQuestion,
      questionJurisdictions?.state?.corpusTitle || "The Country Of ",
      questionJurisdictions!.federal?.corpusTitle || "USA"
    );

    if (questionJurisdictions?.mode === "misc") {
      user_prompt_query = constructPromptQueryMisc(
        refinedQuestion,
        questionJurisdictions?.misc?.corpusTitle || "This Legal Documentation"
      );
    } else if (questionJurisdictions?.mode === "misc_federal") {
      user_prompt_query = constructPromptQueryBoth(
        refinedQuestion,
        questionJurisdictions?.misc?.name!,
        questionJurisdictions?.federal?.name!
      );
    }
    const requestBody: DirectAnsweringRequest = {
      base: {
        vendor: "openai",
        model: "gpt-4-turbo-preview",
        callingFunction: "expandQuery",
        pipelineModel: memory.history.pipelineModel,
      },
      refinedQuestion: refinedQuestion,
      specificQuestions: specificQuestions,
      primaryRows: pimaryRows,
      secondaryRows: secondaryRows,
      alreadyAnswered: alreadyAnswered,
      clarifications: {
        clarifications: combinedClarifications,
      } as ClarificationChoices,
      answerMode: "clarifications",
      questionJurisdictions: questionJurisdiction,
    };
    if (!askClarifications || selectedMiscJurisdiction !== undefined) {
      requestBody.answerMode = "single";
    }

    setAlreadyAnswered((alreadyAnswered) => [
      ...alreadyAnswered,
      refinedQuestion,
    ]);

    const response = await fetch("/api/answerQuery/directAnswering", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result: DirectAnsweringResponse = await response.json();
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

  const handleOptionChange = (options: Option[]) => {
    for (const option of options) {
      console.log(option);
      if (option.name === "Skip Clarifying Questions") {
        console.log(`Setting skip clarifications to ${option.selected}`);
        setAskClarifications(option.selected);
      }
    }
  };

  const scoreNewFollowupQuestion = async (
    question: string
  ): Promise<[number, string]> => {
    let score: number = 7;
    if (questionJurisdictions!.mode !== "misc") {
      const user_prompt_query: string = constructPromptQuery(
        question,
        selectedStateJurisdiction?.corpusTitle || "",
        selectedFederalJurisdiction?.corpusTitle || "USA"
      );

      const requestBody = {
        user_prompt_query: user_prompt_query,
        previous_clarifications: clarificationResponses,
        already_answered: alreadyAnswered,
      };
      const response = await fetch("/api/answerQuery/scoreFollowup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const result = await response.json();
      score = result.do_new_research_score;
    }
    let message_to_user;
    if (score < 2) {
      message_to_user =
        "I am not confident in my ability to answer this question with my current research. Please give me a moment to retrieve more relevant information. I apologize for the inconvenience, but I am committed to providing you with only the most relevant legal information.";
    } else {
      message_to_user = "";
    }
    return [score, message_to_user];
  };

  const handleNewFollowupQuestion = async (question: string) => {
    console.log("NEW QUESTION: " + question);
    setIsFormVisible(false);
    const questionText = question.trim();
    const [score, message_to_user] =
      await scoreNewFollowupQuestion(questionText);
    if (score < 2) {
      // Create new Answer block with message_to_user
      const newParams: ContentBlockParams = {
        type: ContentType.Answer,
        content: message_to_user,
        fake_stream: true,
        concurrentStreaming: false,
      };
      await addContentBlock(createNewBlock(newParams));
      // Start over, reset ALL necessary states
      setCitationBlocks([]);
      setSpecificQuestions([]);
      setClarificationResponses([]);
      setAlreadyAnswered([]);
      setActiveCitationId("");
      setPrimaryRows([]);
      setSecondaryRows([]);
      setInputMode("Initial");
      handleNewQuestion(questionText);
      return;
    }
    setQuestion(questionText);
    if (!questionText) return;

    // Create a question block
    let newParams: ContentBlockParams = {
      type: ContentType.Question,
      content: questionText,
      fake_stream: false,
      concurrentStreaming: false,
    };
    await addContentBlock(createNewBlock(newParams));

    if (!askClarifications || selectedMiscJurisdiction !== undefined) {
      followUpQuestionAnswer(clarificationResponses, questionText);
    } //else {
    //askNewClarification(questionJurisdictions, questionText, "single", { clarifications: clarificationResponses });
    //}
  };

  const followUpQuestionAnswer = async (
    clarifications: Clarification[],
    newQuestion?: string
  ) => {
    addNewLoadingBlock(false);
    const input = newQuestion || question;
    const memory = abeMemory!;
    memory.short.currentRefinedQuestion = input;
    await directAnswering(
      memory,
      primaryRows,
      secondaryRows,
      clarifications,
      questionJurisdictions!
    );
  };

  const setShown = () => {
    setShowJurisdictionModal(false);
  };
  const dummyFunction = async () => {
    return;
  };

  return (
    <div>
      {" "}
      {isDesktopOrLaptop && (
        <div className="flex h-screen w-full px-3 py-3 bg-[#FAF5E6]">
          <JurisdictionModal
            shown={showJurisdictionModal}
            setShown={setShown}
          />

          <DisclaimerModal />
          <div
            className="pr-2"
            style={{ width: citationsOpen ? "100%" : "14%" }}
          >
            <CitationBar
              open={citationsOpen}
              setOpen={setCitationsOpen}
              citationItems={citationBlocks}
              activeCitationId={activeCitationId}
            />
          </div>
          <div
            className={`w-full ${citationsOpen ? "hidden" : ""}`}
            style={{ width: "90%" }}
          >
            <div
              className="overflow-y-auto w-full"
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
            <div className="bottom-0">
              {/* BottomBar */}
              {isFormVisible && (
                <BottomBar
                  inputMode={inputMode}
                  handleSubmit={handleNewQuestion}
                  handleSubmitFollowup={handleNewFollowupQuestion}
                />
              )}
            </div>
          </div>
          <div className=" pl-2" style={{ width: "16%" }}>
            <OptionsList
              stateJurisdictions={StateJurisdictionOptions}
              federalJurisdictions={FederalJurisdictionOptions}
              miscJurisdictions={MiscJurisdictionOptions}
              onOptionChange={handleOptionChange}
              onStateJurisdictionChange={setSelectedStateJurisdiction}
              onFederalJurisdictionChange={setSelectedFederalJurisdiction}
              onMiscJurisdictionChange={setSelectedMiscJurisdiction}
            />
            {/* Other parts of your application */}
          </div>
        </div>
      )}
      {isMobile && (
        <div className="justify-center items-center h-full w-screen">
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
                  handleSubmit={handleNewQuestion}
                  handleSubmitFollowup={handleNewFollowupQuestion}
                />
              )}

              <div className="pr-4">
                <OptionsList
                  stateJurisdictions={StateJurisdictionOptions}
                  federalJurisdictions={FederalJurisdictionOptions}
                  miscJurisdictions={MiscJurisdictionOptions}
                  onOptionChange={handleOptionChange}
                  onStateJurisdictionChange={setSelectedStateJurisdiction}
                  onFederalJurisdictionChange={setSelectedFederalJurisdiction}
                  onMiscJurisdictionChange={setSelectedMiscJurisdiction}
                />
                {/* Other parts of your application */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    // <div className="flex justify-center h-screen  pt-2  bg-[#FAF5E6]">

    //   <JurisdictionModal
    //     shown={showJurisdictionModal}
    //     setShown={setShown}
    //   />

    //   <DisclaimerModal />

    //   <div className={`w-full ${citationsOpen ? 'hidden' : ''}`} style={{ width: '90%' }}>
    //     <div className="overflow-y-auto w-full " style={{ minHeight: '90vh', maxHeight: '90vh' }}>
    //       <ContentQueue
    //         items={contentBlocks}
    //         onSubmitClarificationAnswers={dummyFunction}
    //         onSubmitClarificationVitaliaAnswers={dummyFunction}
    //         onClarificationStreamEnd={dummyFunction}
    //         onStreamEnd={onStreamEnd}
    //         showCurrentLoading={showCurrentLoading}
    //         onFinishAnswerVitalia={dummyFunction}
    //         setActiveCitationId={setActiveCitationId}
    //       />

    //     </div>
    //     <div className="inset-x-0 bottom-0 flex justify-between items-center">
    //       <div className="w-full pr-2" style={{ width: citationsOpen ? '100%' : '10%' }}>

    //         <div className="pr-2" style={{ maxHeight: '90vh' }}>
    //           <CitationBar
    //             open={citationsOpen}
    //             setOpen={setCitationsOpen}
    //             citationItems={citationBlocks}
    //             activeCitationId={activeCitationId}
    //           />
    //         </div>
    //       </div>

    //       {/* BottomBar */}
    //       {isFormVisible && (

    //         <BottomBar
    //           inputMode={inputMode}
    //           handleSubmit={handleNewQuestion}
    //           handleSubmitFollowup={handleNewFollowupQuestion}
    //         />

    //       )}

    //       <div className="pl-2">
    //         <OptionsList
    //           stateJurisdictions={StateJurisdictionOptions}
    //           federalJurisdictions={FederalJurisdictionOptions}
    //           miscJurisdictions={MiscJurisdictionOptions}
    //           options={ChatOptions}
    //           onOptionChange={handleOptionChange}
    //           onStateJurisdictionChange={setSelectedStateJurisdiction}
    //           onFederalJurisdictionChange={setSelectedFederalJurisdiction}
    //           onMiscJurisdictionChange={setSelectedMiscJurisdiction}
    //         />
    //         {/* Other parts of your application */}
    //       </div>
    //     </div>

    //   </div>
    // </div>
  );
}
