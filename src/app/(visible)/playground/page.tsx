"use client";
// Import React dependencies
import React, { useState, useEffect } from 'react';
// Import UI components
import BottomBar from '@/components/bottomBar';
import ContentQueue from '@/components/contentQueue';
import { DisclaimerModal, JurisdictionModal } from '@/components/disclaimermodal';
// Import data types
import { ContentType, ContentBlock, ContentBlockParams, CitationBlockProps, Clarification } from "@/lib/types";
import {  node_as_row, ClarificationChoices} from '@/lib/types';

import CitationBar from '@/components/citationBar';
import OptionsList from '@/components/optionsFilter';
import { Option, Jurisdiction, questionJurisdictions } from '@/lib/types';

import { StateJurisdictionOptions, FederalJurisdictionOptions, MiscJurisdictionOptions, ChatOptions } from '@/lib/types';

// Helper functions
import { constructPromptQuery, constructPromptQueryMisc } from '@/lib/utils';

import { useMediaQuery } from 'react-responsive';


// Temporary variables



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
  const [primaryRows, setPrimaryRows] = useState<node_as_row[]>([]);
  const [secondaryRows, setSecondaryRows] = useState<node_as_row[]>([]);

  // State variables for legal text, database searches
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
  const [citationBlocks, setCitationBlocks] = useState<ContentBlock[]>([]);

  // State variables for prompt logic
  const [question, setQuestion] = useState('');

  const [clarificationQueue, setClarificationQueue] = useState<ContentBlockParams[]>([]);
  const [specificQuestions, setSpecificQuestions] = useState<string[]>([]);
  const [clarificationResponses, setClarificationResponses] = useState<Clarification[]>([]);
  const [alreadyAnswered, setAlreadyAnswered] = useState(['']);

  // State variables for session
  const [sessionID, setSessionID] = useState<string>("");

  // State variables for options and jurisdictions
  const [selectedFederalJurisdiction, setSelectedFederalJurisdiction] = useState<Jurisdiction | undefined>(undefined);
  const [selectedStateJurisdiction, setSelectedStateJurisdiction] = useState<Jurisdiction | undefined>(undefined);
  const [selectedMiscJurisdiction, setSelectedMiscJurisdiction] = useState<Jurisdiction | undefined>(undefined);
  const [questionJurisdictions, setQuestionJurisdictions] = useState<questionJurisdictions>();

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [skipClarifications, setSkipClarifications] = useState(false);
  const [showJurisdictionModal, setShowJurisdictionModal] = useState(false);


  useEffect(() => {
    let mode = 'state'; // Default mode

    // Determine the mode based on the current jurisdiction selections
    if (selectedFederalJurisdiction && selectedStateJurisdiction) {
      mode = 'state_federal';
    } else if (selectedMiscJurisdiction) {
      mode = 'misc';
    } else if (selectedFederalJurisdiction) {
      mode = 'federal';
    }
    console.log("CLEARING EVERYTHING!");
    setCitationBlocks([]);
    setSpecificQuestions([]);
    setClarificationResponses([]);
    setAlreadyAnswered([]);
    setActiveCitationId('');
    setPrimaryRows([]);
    setSecondaryRows([]);
    
    setInputMode("Initial");

    setQuestionJurisdictions({
      mode: mode,
      state: selectedStateJurisdiction,
      federal: selectedFederalJurisdiction,
      misc: selectedMiscJurisdiction
    });

  }, [selectedStateJurisdiction, selectedFederalJurisdiction, selectedMiscJurisdiction]);
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
    
    setShowCurrentLoading(false);
    setContentBlocks(currentBlocks => [...currentBlocks, newBlock]);
    return newBlock.blockId;
  };

  const addManyContentBlock = async (newBlocks: ContentBlock[]): Promise<void> => {
    setStreamingQueue(newBlocks);
    //console.log(newBlocks);
    if (newBlocks[0].type === ContentType.Citation) {
      setCitationBlocks(currentBlocks => [...currentBlocks, ...newBlocks]);
    } else {
      setContentBlocks(currentBlocks => [...currentBlocks, ...newBlocks]);
    }

    // console.log(currentlyStreaming);
    return;
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

    return;
  };

  // Logic for starting question answering process
  const handleNewQuestion = async (question: string) => {

    if (selectedFederalJurisdiction === undefined && selectedStateJurisdiction === undefined && selectedMiscJurisdiction === undefined) {
      setShowJurisdictionModal(true);
      return;
    }
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
    console.log("HERE@");
    console.log(questionJurisdictions);

    const question_jurisdictions = questionJurisdictions!;
    let score = 7;
    let message_to_user = "";
    // Only score questions if no misc jurisdiction is selected
    if (selectedMiscJurisdiction === undefined && !skipClarifications) {
      [score, message_to_user] = await scoreQuestion(question_jurisdictions, questionText);
    }



    // Do not ask clarifying questions if skipClarifications is true or if a misc jurisdiction is selected
    if (skipClarifications || selectedMiscJurisdiction !== undefined) {
      addNewLoadingBlock(false);
      similaritySearch(question_jurisdictions, questionText, []);
    } else if (score <= 1) {
      setIsFormVisible(true);
      return;
    } else {
      newParams = {
        type: ContentType.Answer,
        content: message_to_user,
        fake_stream: true,
        concurrentStreaming: false
      };
      addNewLoadingBlock(true);
      await addContentBlock(createNewBlock(newParams));
      askNewClarification(question_jurisdictions, questionText, "multiple");
    }
  };

  const scoreQuestion = async (question_jurisdictions: questionJurisdictions, question: string): Promise<[number, string]> => {

    const user_prompt_query: string = constructPromptQuery(question, question_jurisdictions.state?.corpusTitle || 'The Country Of ', question_jurisdictions.federal?.corpusTitle || "USA");

    console.log(user_prompt_query);
    const requestBody = {
      user_prompt_query: user_prompt_query,
    };
    const response = await fetch('/api/improveQuery/queryScoring', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionID,
      },
      body: JSON.stringify(requestBody),

    });
    const result = await response.json();
    const score: number = result.quality_score;
    const message_to_user: string = result.message_to_user;
    return [score, message_to_user];
  };

  // queryClarification API handlers
  const askNewClarification = async (question_jurisdictions: any, questionText: string, mode: string, previous_clarifications?: ClarificationChoices) => {
    const state_jurisdiction: string = question_jurisdictions.state?.corpusTitle || "";
    const federal_jurisdiction: string = question_jurisdictions.federal?.corpusTitle || "USA";
    const user_prompt_query: string = constructPromptQuery(questionText, state_jurisdiction, federal_jurisdiction);
    addNewLoadingBlock(false);
    if (clarificationQueue.length > 0) {
      const newClarificationBlock = clarificationQueue[0];
      await addContentBlock(createNewBlock(newClarificationBlock));
      // Remove the first element from the queue
      setClarificationQueue(clarificationQueue.slice(1));
      return;
    }
    let requestBody;
    if (mode === "single") {
      requestBody = {
        user_prompt_query: user_prompt_query,
        previous_clarifications: previous_clarifications,
        mode: mode,
      };
    } else {
      requestBody = {
        user_prompt_query: user_prompt_query,
        mode: mode,
      };
    }

    const response = await fetch('/api/improveQuery/queryClarification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionID,
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (mode === "single") {
      const clarification_content: string = result.messages_to_customers[0];
      const clarification: Clarification = result.clarifications[0];

      const clarifyingQuestion: string = clarification.question;
      const clarifyingAnswers: string[] = clarification.multiple_choice_answers;
      console.log("Creating new ClarificationQuestionBlock!");
      const params: ContentBlockParams = {
        type: ContentType.ClarificationQuestion,
        content: clarification_content,
        fake_stream: true,
        concurrentStreaming: false,
        clarifyingQuestion: clarifyingQuestion,
        clarifyingAnswers: clarifyingAnswers,
        mode: mode
      };
      await addContentBlock(createNewBlock(params));
    } else {
      const clarification_content: string[] = result.messages_to_customer;
      const clarifications: Clarification[] = result.clarifications;

      let firstResult: ContentBlockParams;
      const results: ContentBlockParams[] = [];
      for (let i = 0; i < clarifications.length; i++) {
        const clarification = clarifications[i];

        const clarifyingQuestion: string = clarification.question;
        const clarifyingAnswers: string[] = clarification.multiple_choice_answers;

        const params: ContentBlockParams = {
          type: ContentType.ClarificationQuestion,
          content: clarification_content[i],
          fake_stream: true,
          concurrentStreaming: false,
          clarifyingQuestion: clarifyingQuestion,
          clarifyingAnswers: clarifyingAnswers,
          mode: mode
        };
        if (i === 0) {
          firstResult = params;
        } else {
          results.push(params);
        }

      }
      await addContentBlock(createNewBlock(firstResult!));
      setClarificationQueue(results);
    }

  };

  const handleClarificationQuestionDone = async (clarifyingQuestion: string, clarifyingAnswers: string[], mode: string) => {
    console.log("Clarification question done! Adding new clarification block!");
    const params: ContentBlockParams = {
      type: ContentType.Clarification,
      content: "",
      fake_stream: false,
      concurrentStreaming: false,
      clarifyingQuestion: clarifyingQuestion,
      clarifyingAnswers: clarifyingAnswers,
      mode: mode
    };
    await addContentBlock(createNewBlock(params));
  };

  // queryRefinement API handlers
  const handleQuestionRefinement = async (clarifications: Clarification[]) => {
    // Get clarifying questions as string[] from all (non dismissed) clarification blocks
    addNewLoadingBlock(false);
    const clarificationChoices: ClarificationChoices = {
      clarifications: clarifications
    };
    if (!clarificationChoices) {
      throw new Error("Clarification choices not found!");
    }
    let clarifyingQuestions: string[] = [];
    let clarifyingAnswers: string[] = [];

    for (const clarification of clarificationChoices.clarifications) {
      const answer = clarification.response;
      if (answer !== "Prefer Not To Respond") {
        clarifyingQuestions.push(clarification.question);
        clarifyingAnswers.push(clarification.response);
      }
    }
    //console.log(clarifyingQuestions);

    const requestBody = {
      original_question: question,
      clarifyingQuestions: clarifyingQuestions,
      clarifyingAnswers: clarifyingAnswers
    };

    const response = await fetch('/api/improveQuery/queryRefinement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionID,
      },
      body: JSON.stringify(requestBody),
    });

    // After the streaming is finished, extract the question from result (question is surrounded by " ")
    const result = await response.json();
    const refined_question = result.refined_question;
    const specific_questions = result.specific_questions;
    setSpecificQuestions(specific_questions);
    const customer_message: string[] = result.customer_messages;
    customer_message.push("I will now start my in-depth legal research process. Please be patient, as this may take a little time to ensure accuracy and thoroughness.");
    console.log(result);
    setQuestion(refined_question);

    // Create an approval block
    const newParams: ContentBlockParams = {
      type: ContentType.Answer,
      content: "Thank you for your responses.",
      content_list: customer_message,
      fake_stream: true,
      concurrentStreaming: false
    };
    await addContentBlock(createNewBlock(newParams));
    similaritySearch(questionJurisdictions!, refined_question, specific_questions);
  };

  const handleClarificationAnswer = (response: Clarification, mode: string) => {
    // Append the response to the clarificationResponses state
    console.log("Handling clarification answer!");
    const clarifications: Clarification[] = clarificationResponses;
    clarifications.push(response);
    setClarificationResponses(clarifications);

    // Move to the next clarification or proceed if done
    if (clarificationQueue.length > 0) {
      askNewClarification(questionJurisdictions, question, "multiple");
    } else {
      if (mode === "multiple") {
        handleQuestionRefinement(clarifications);
      } else {
        followUpQuestionAnswer(clarifications);
      }
    }
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
    addNewLoadingBlock(false);
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
    console.log("Received response from similaritySearch API!")
    const primary_rows: node_as_row[] = result.primary_rows;
    const secondary_rows: node_as_row[] = result.secondary_rows;
    console.log(primary_rows)
    


   


    let primaryJurisdiction;
    let secondaryJurisdiction;
    if (question_jurisdiction.mode === "misc") {
      primaryJurisdiction = question_jurisdiction.misc! as Jurisdiction;
    } else if (question_jurisdiction.mode === "state" || question_jurisdiction.mode === "state_federal") {

      primaryJurisdiction = question_jurisdiction.state! as Jurisdiction;
      if (question_jurisdiction.mode === "state_federal") {
        secondaryJurisdiction = question_jurisdiction.federal! as Jurisdiction;
      }
    } else {
      primaryJurisdiction = question_jurisdiction.federal! as Jurisdiction;
    }

    const all_citation_blocks: ContentBlock[] = [];

    // Create citation blocks for each parent node
    const primary_citation_blocks: ContentBlock[] = [];
    for (const row of primary_rows) {
      console.log(row)
      const section_text: string[] = row.node_text;
      const citation: string = row.node_citation;
      const link: string = row.node_link;
      //console.log(citation);


      const citationProps: CitationBlockProps = {
        citation: citation,
        jurisdictionName: primaryJurisdiction.corpusTitle,
        link: link,
        section_text: section_text,
        setOpen: setCitationsOpen,
        open: citationsOpen
      };
      const newParams: ContentBlockParams = {
        type: ContentType.Citation,
        content: "",
        fake_stream: false,
        concurrentStreaming: false,
        citationProps: citationProps
      };
      const block = createNewBlock(newParams);
      primary_citation_blocks.push(block);
    }
    all_citation_blocks.push(...primary_citation_blocks);

    if (secondary_rows.length > 0) {
      let jurisdictionName = secondaryJurisdiction!.corpusTitle;
      const secondary_citation_blocks: ContentBlock[] = [];
      for (const row of  secondary_rows) {
        const section_text: string[] = row.node_text;
        const citation: string = row.node_citation;
        const link: string = row.node_link;
        const citationProps: CitationBlockProps = {
          citation: citation,
          jurisdictionName: jurisdictionName,
          link: link,
          section_text: section_text,
          setOpen: setCitationsOpen,
          open: citationsOpen
        };
        const newParams: ContentBlockParams = {
          type: ContentType.Citation,
          content: jurisdictionName,
          fake_stream: false,
          concurrentStreaming: false,
          citationProps: citationProps
        };
        const block = createNewBlock(newParams);
        secondary_citation_blocks.push(block);
      }
      all_citation_blocks.push(...secondary_citation_blocks);
    }

    
    
    await addManyContentBlock(all_citation_blocks);
    //const general_topics: string[] = await blindTopics(user_query, "CA", "USA", specific_questions);
    setQuestionJurisdictions(question_jurisdiction);

    await directAnswering(user_query, specific_questions, primary_rows, secondary_rows, clarificationResponses, question_jurisdiction);

    //await topicsBySection(user_query, general_topics, "CA", "USA", combined_parent_nodes, []);

  };

  const directAnswering = async (
    user_query: string,
    specific_questions: string[],
    primary_rows: node_as_row[],
    secondary_rows: node_as_row[],
    combinedClarifications: Clarification[],
    question_jurisdiction: questionJurisdictions
  ) => {
    console.log(questionJurisdictions);

    let user_prompt_query: string = constructPromptQuery(user_query, questionJurisdictions?.state?.corpusTitle || 'The Country Of ', questionJurisdictions!.federal?.corpusTitle || "USA");

    if (questionJurisdictions?.mode === "misc") {
      user_prompt_query = constructPromptQueryMisc(user_query, questionJurisdictions?.misc?.corpusTitle || 'This Legal Documentation');
    }
    const requestBody = {
      legal_question: user_prompt_query,
      specific_questions: specific_questions,
      primary_grouped_rows: primary_rows,
      secondary_grouped_rows: secondary_rows,
      already_answered: alreadyAnswered,
      clarifications: { clarifications: combinedClarifications } as ClarificationChoices,
      mode: "clarifications",
      question_jurisdiction: question_jurisdiction
    };
    if (skipClarifications || selectedMiscJurisdiction !== undefined) {
      requestBody.mode = "single";
    }

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

  const handleOptionChange = (options: Option[]) => {
    for (const option of options) {
      console.log(option);
      if (option.name === "Skip Clarifying Questions") {
        console.log(`Setting skip clarifications to ${option.selected}`);
        setSkipClarifications(option.selected);
      }
    }
  };

  const scoreNewFollowupQuestion = async (question: string): Promise<[number, string]> => {
    let score: number = 7;
    if (questionJurisdictions!.mode !== "misc") {


      const user_prompt_query: string = constructPromptQuery(question, selectedStateJurisdiction?.corpusTitle || "", selectedFederalJurisdiction?.corpusTitle || "USA");

      const requestBody = {
        user_prompt_query: user_prompt_query,
        previous_clarifications: clarificationResponses,
        already_answered: alreadyAnswered

      };
      const response = await fetch('/api/answerQuery/scoreFollowup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionID,
        },
        body: JSON.stringify(requestBody),

      });
      const result = await response.json();
      score = result.do_new_research_score;
    }
    let message_to_user;
    if (score < 2) {
      message_to_user = "I am not confident in my ability to answer this question with my current research. Please give me a moment to retrieve more relevant information. I apologize for the inconvenience, but I am committed to providing you with only the most relevant legal information.";
    } else {
      message_to_user = "";
    }
    return [score, message_to_user];
  };

  const handleNewFollowupQuestion = async (question: string) => {
    console.log("NEW QUESTION: " + question);
    setIsFormVisible(false);
    const questionText = question.trim();
    const [score, message_to_user] = await scoreNewFollowupQuestion(questionText);
    if (score < 2) {
      // Create new Answer block with message_to_user
      const newParams: ContentBlockParams = {
        type: ContentType.Answer,
        content: message_to_user,
        fake_stream: true,
        concurrentStreaming: false
      };
      await addContentBlock(createNewBlock(newParams));
      // Start over, reset ALL necessary states
      setCitationBlocks([]);
      setSpecificQuestions([]);
      setClarificationResponses([]);
      setAlreadyAnswered([]);
      setActiveCitationId('');
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
      concurrentStreaming: false
    };
    await addContentBlock(createNewBlock(newParams));



    if (skipClarifications || selectedMiscJurisdiction !== undefined) {
      followUpQuestionAnswer(clarificationResponses, questionText);
    } else {
      askNewClarification(questionJurisdictions, questionText, "single", { clarifications: clarificationResponses });
    }
  };

  const followUpQuestionAnswer = async (clarifications: Clarification[], newQuestion?: string) => {
    addNewLoadingBlock(false);
    const input = newQuestion || question;
    await directAnswering(input, specificQuestions, primaryRows, secondaryRows, clarifications, questionJurisdictions!);
  };
  
  const setShown = () => {
    setShowJurisdictionModal(false);
  }
  const dummyFunction = async () => {
    return;
  }

  return (

    <div> {isDesktopOrLaptop &&


      <div className="flex h-screen w-full px-3 py-3 bg-[#FAF5E6]">

        <JurisdictionModal
          shown={showJurisdictionModal}
          setShown={setShown}
        />

        <DisclaimerModal />
        <div className="pr-2" style={{ width: citationsOpen ? '100%' : '14%' }}>
          <CitationBar
            open={citationsOpen}
            setOpen={setCitationsOpen}
            citationItems={citationBlocks}
            activeCitationId={activeCitationId}
          />
        </div>
        <div className={`w-full ${citationsOpen ? 'hidden' : ''}`} style={{ width: '90%' }}>
          <div className="overflow-y-auto w-full" style={{ minHeight: '90vh', maxHeight: '90vh' }}>
            <ContentQueue
              items={contentBlocks}
              onSubmitClarificationAnswers={handleClarificationAnswer}
              onSubmitClarificationVitaliaAnswers={dummyFunction}
              onClarificationStreamEnd={handleClarificationQuestionDone}
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
        <div className=" pl-2" style={({ width: '16%' })} >
          <OptionsList
            stateJurisdictions={StateJurisdictionOptions}
            federalJurisdictions={FederalJurisdictionOptions}
            miscJurisdictions={MiscJurisdictionOptions}
            options={ChatOptions}
            onOptionChange={handleOptionChange}
            onStateJurisdictionChange={setSelectedStateJurisdiction}
            onFederalJurisdictionChange={setSelectedFederalJurisdiction}
            onMiscJurisdictionChange={setSelectedMiscJurisdiction}
          />
          {/* Other parts of your application */}
        </div>

      </div>
    }


      {isMobile &&

        <div className="flex justify-center h-screen  pt-2  bg-[#FAF5E6]">

          <JurisdictionModal
            shown={showJurisdictionModal}
            setShown={setShown}
          />

          <DisclaimerModal />


          
          <div className={`w-full ${citationsOpen ? 'hidden' : ''}`} style={{ width: '70%' }}>
            <div className="overflow-y-auto w-full " style={{ minHeight: '90vh', maxHeight: '90vh' }}>
              <ContentQueue
                items={contentBlocks}
                onSubmitClarificationAnswers={handleClarificationAnswer}
                onSubmitClarificationVitaliaAnswers={dummyFunction}
                onClarificationStreamEnd={handleClarificationQuestionDone}
                onStreamEnd={onStreamEnd}
                showCurrentLoading={showCurrentLoading}
                onFinishAnswerVitalia={dummyFunction}
                setActiveCitationId={setActiveCitationId}
              />

            </div>
            <div className="inset-x-0 bottom-0 flex justify-between items-center pt-2">
              <div className="w-full pr-2" style={{ width: citationsOpen ? '100%' : '10%' }}>

                <div className="pr-2" style={{ maxHeight: '90vh' }}>
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


              <div className="pl-2">
                <OptionsList
                  stateJurisdictions={StateJurisdictionOptions}
                  federalJurisdictions={FederalJurisdictionOptions}
                  miscJurisdictions={MiscJurisdictionOptions}
                  options={ChatOptions}
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

      }

    </div>



  );
};


