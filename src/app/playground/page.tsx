"use client";
// Import React dependencies
import React, { useState, FormEvent, useEffect } from 'react';
// Import UI components
import BottomBar from '@/components/bottomBar';
import ChatContainer from '@/components/chatContainer';


// Import data types
import { ContentType, ContentBlock, ContentBlockParams, CitationBlockProps, GroupedRows, Clarification } from "@/lib/types";
import { node_as_row, node_key, SubTopic, GeneralTopic, TopicResponses, ClarificationChoices, PartialAnswer } from '@/lib/types';
import { aggregateSiblingRows } from '@/lib/database';
import CitationBar from '@/components/citationBar';
import OptionsList from '@/components/optionsFilter';
import { Option, OptionsListProps } from '@/lib/types';


// Helper functions
import { constructPromptQuery } from '@/lib/utils';






// Temporary variables
const stateJurisdiction = "ca";
const federalJurisdiction = "USA";

export default function Playground() {

  // State variables for jurisdiction, option toggles
  const [skipClarifications, setSkipClarifications] = useState(false);
  const [generateSuggestions, setGenerateSuggestions] = useState(true);

  // State variables for UI components
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [citationsOpen, setCitationsOpen] = useState(false);
  const [currentlyStreaming, setCurrentlyStreaming] = useState(false);
  const [streamingQueue, setStreamingQueue] = useState<ContentBlock[]>([]);
  const [showCurrentLoading, setShowCurrentLoading] = useState(false);
  const [activeCitationId, setActiveCitationId] = useState<string>('');
  const [inputMode, setInputMode] = useState<string>('Initial');

  // State variables for legal text, database search
  const [groupedRows, setGroupedRows] = useState<GroupedRows>({});

  // State variables for contentBlocks
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [citationBlocks, setCitationBlocks] = useState<ContentBlock[]>([]);

  // State variables for prompt logic
  const [question, setQuestion] = useState('');

  const [clarificationQueue, setClarificationQueue] = useState<ContentBlockParams[]>([]);
  const [specificQuestions, setSpecificQuestions] = useState<string[]>([]);
  const [finalTopicTemplate, setFinalTopicTemplate] = useState<TopicResponses>();
  const [clarificationResponses, setClarificationResponses] = useState<Clarification[]>([]);
  const [alreadyAnswered, setAlreadyAnswered] = useState(['']);

  // State variables for session
  const [sessionID, setSessionID] = useState<string>("");

  function generateSessionID() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  useEffect(() => {
    const sessionID = generateSessionID();
    console.log(`Generated new session ID: ${sessionID}`)
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

  const addManyContentBlock = async (newBlocks: ContentBlock[]): Promise<void> => {
    setCurrentlyStreaming(true);
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
    //addNewLoadingBlock();

    const [score, message_to_user] = await scoreQuestion(questionText);
    setIsFormVisible(false);

    newParams = {
      type: ContentType.Answer,
      content: message_to_user,
      fake_stream: true,
      concurrentStreaming: false
    };
    addNewLoadingBlock(true);
    await addContentBlock(createNewBlock(newParams));

    if (skipClarifications) {
      similaritySearch(questionText, []);
    } else if (score <= 1) {
      setIsFormVisible(true);
      return;
    } else {
      askNewClarification(questionText, "multiple");
    }
  };

  const scoreQuestion = async (question: string): Promise<[number, string]> => {
    const user_prompt_query: string = constructPromptQuery(question, stateJurisdiction, federalJurisdiction);
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
  const askNewClarification = async (questionText: string, mode: string, previous_clarifications?: ClarificationChoices) => {
    const user_prompt_query: string = constructPromptQuery(questionText, stateJurisdiction, federalJurisdiction);
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
      const clarification_content: string = result.message_to_customer;
      const clarification: Clarification = result.clarification;

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
      const clarification_content: string[] = result.message_to_customer;
      const clarifications: Clarification[] = result.clarification;

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
      console.log(firstResult!);
      console.log(results);
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
    addNewLoadingBlock(false);
    similaritySearch(refined_question, specific_questions);
  };

  const handleClarificationAnswer = (response: Clarification, mode: string) => {
    // Append the response to the clarificationResponses state
    console.log("Handling clarification answer!");
    const clarifications: Clarification[] = clarificationResponses;
    clarifications.push(response);
    setClarificationResponses(clarifications);

    // Move to the next clarification or proceed if done
    if (clarificationQueue.length > 0) {
      askNewClarification(question, "multiple");
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
  const similaritySearch = async (user_query: string, specific_questions: string[]) => {

    const query_expansion_embedding = await queryExpansion(user_query, specific_questions);

    const requestBody = {
      jurisdictions: { "state": "ca", "federal": "USA" },
      query_expansion_embedding: query_expansion_embedding,
    };
    const response = await fetch('/api/searchDatabase/similaritySearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionID,
      },
      body: JSON.stringify(requestBody),
    });



    const result = await response.json();

    const rows: node_as_row[] = result.state_rows;
    // Returns many rows from the database, 
    //console.log(rows);

    // Get a set of all sibling nodes in rows (including original)
    const sibling_node_keys: node_key[] = [];

    for (const row of rows) {
      const original_node: node_key = { "id": row.id, "top_level_title": row.top_level_title };
      if (sibling_node_keys.includes(original_node)) {
        continue;
      }
      sibling_node_keys.push(original_node);

      for (const sibling_id of row.sibling_nodes) {
        const sibling_node: node_key = { "id": sibling_id, "top_level_title": row.top_level_title };
        if (sibling_node_keys.includes(sibling_node)) {
          continue;
        }
        sibling_node_keys.push(sibling_node);
      }
    }


    // Given a list of sibling_node keys, retrieve all actual rows from the database
    const combined_rows: node_as_row[] = await getSiblingRows(sibling_node_keys);

    // Get a set of all unique parent_nodes in combinedRows variable
    const combined_parent_nodes: GroupedRows = await aggregateSiblingRows(combined_rows);
    setGroupedRows(combined_parent_nodes);

    // TOPIC GENERATION CUT OFF POINT


    //console.log(combined_parent_nodes);
    const all_citation_blocks: ContentBlock[] = [];

    // Create citation blocks for each parent node
    for (const parent_node in combined_parent_nodes) {
      const section_text: string[] = combined_parent_nodes[parent_node].section_text;
      const citation: string = combined_parent_nodes[parent_node].citation;
      const link: string = combined_parent_nodes[parent_node].link;
      //console.log(citation);


      const citationProps: CitationBlockProps = {
        citation: citation,
        link: link,
        section_text: section_text,
        setOpen: setCitationsOpen,
        open: citationsOpen
      };
      //console.log(citationProps);
      const newParams: ContentBlockParams = {
        type: ContentType.Citation,
        content: "",
        fake_stream: false,
        concurrentStreaming: false,
        citationProps: citationProps
      };
      const block = createNewBlock(newParams);
      all_citation_blocks.push(block);
    }
    await addManyContentBlock(all_citation_blocks);
    //const general_topics: string[] = await blindTopics(user_query, "CA", "USA", specific_questions);

    directAnswering(user_query, specific_questions, combined_parent_nodes, clarificationResponses);
    //await topicsBySection(user_query, general_topics, "CA", "USA", combined_parent_nodes, []);

  };

  // combineSiblingRows API handler
  const getSiblingRows = async (node_keys: node_key[]): Promise<node_as_row[]> => {
    const requestBody = {
      jurisdictions: { "state": "ca", "federal": "USA" },
      node_keys: node_keys,
    };

    const response = await fetch('/api/searchDatabase/getSiblingRows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionID,
      },
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();

    const combined_rows: node_as_row[] = result.all_rows;
    // Print type of combined_rows
    //console.log(typeof combined_rows);


    return combined_rows;
  };

  const blindTopics = async (
    legal_question: string,
    state_legal_document: string,
    federal_legal_document: string,
    specific_questions: string[],
  ) => {
    //console.log(specific_questions);
    const requestBody = {
      main_question: legal_question,
      specific_questions: specific_questions,
      state_legal_document: state_legal_document,
      federal_legal_document: federal_legal_document,
    };
    console.log("  - Sending request to blindTopics API!");
    const response = await fetch('/api/topicGeneration/blindTopics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionID,
      },
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();
    console.log("Received response from blindTopics API!");
    const general_topics: string[] = result.general_topics;
    //console.log(`general_topics: \n${general_topics}`);
    return general_topics;
  };

  const partialAnswering = async (
    topics: TopicResponses,
    rows: GroupedRows,

  ) => {

    const requestBody = {
      topics: topics,
      legal_question: question,
      groupedRows: rows
    };
    console.log("  - Sending request to partialAnswering API!");
    const response = await fetch('/api/answerQuery/partialAnswering', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionID,
      },
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();
    console.log("Received response from partialAnswering API!");
    const final_answers: PartialAnswer[] = result.partialAnswers;
    console.log(final_answers);
    const clarifications: ClarificationChoices = {
      clarifications: clarificationResponses
    };
    const detailClarifications: ClarificationChoices = {
      clarifications: []
    };
    // const direct_answer = await directAnswering(final_answers, clarifications!, detailClarifications!);

    const params: ContentBlockParams = {
      type: ContentType.FinalAnswer,
      content: "I have created a more structured, detailed, and comprehensive answer to your question below. If you would like to understand further, feel free to expand the below sections.",
      fake_stream: true,
      concurrentStreaming: false,
      finalAnswer: final_answers

    };
    await addContentBlock(createNewBlock(params));


  };

  const directAnswering = async (
    user_query: string,
    specific_questions: string[],
    legal_texts: GroupedRows,
    combinedClarifications: Clarification[],
  ) => {


    const requestBody = {
      legal_question: user_query,
      specific_questions: specific_questions,
      legal_texts: legal_texts,
      already_answered: alreadyAnswered,
      clarifications: { clarifications: combinedClarifications } as ClarificationChoices,
    };

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

  const [options] = useState<Option[]>([
    { id: '1', name: ' California' },
    { id: '2', name: 'Skip Clarifications' },
    // ... other options
  ]);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleTopicChoice = async (topicChoices: TopicResponses) => {
    console.log("Handling topic choice!");
    console.log(topicChoices);
    setFinalTopicTemplate(topicChoices);
    partialAnswering(topicChoices, groupedRows);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedOptions(selectedIds);
  };

  const scoreNewFollowupQuestion = async (question: string): Promise<[number, string]> => {
    const user_prompt_query: string = constructPromptQuery(question, stateJurisdiction, federalJurisdiction);
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
    const score: number = result.do_new_research_score;
    let message_to_user;
    if (score < 2) {
      message_to_user = "I am not confident in my ability to answer this question with my current research, as well as ask some more clarifying questions. I apologize for the inconvenience, but I am committed to providing you with only the most relevant legal research.";
    } else {
      message_to_user = "";
    }
    return [score, message_to_user];
  };
  const handleNewFollowupQuestion = async (question: string) => {
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
      setAlreadyAnswered(['']);
      setActiveCitationId('');
      setGroupedRows({});
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



    if (skipClarifications) {
      followUpQuestionAnswer(clarificationResponses);
    } else {
      askNewClarification(questionText, "single", { clarifications: clarificationResponses });
    }
  };
  const followUpQuestionAnswer = async (clarifications: Clarification[]) => {
    addNewLoadingBlock(true);
    directAnswering(question, specificQuestions, groupedRows, clarifications);
  };

  return (



    <div className="flex h-screen w-full px-3 py-3 bg-[#FAF5E6]">
      {/* <div className="flex justify-center"> */}
      {/* Adjust CitationBar width based on citationsOpen */}
      {/* <div className="App h-screen flex flex-col items-center justify-center bg-purple-200">
          <Modal />
        </div> */}



      <div className="pr-2" style={{ width: citationsOpen ? '100%' : 'initial' }}>
        <CitationBar
          open={citationsOpen}
          setOpen={setCitationsOpen}
          citationItems={citationBlocks}
          activeCitationId={activeCitationId}
        />
      </div>

      {/* Main content area */}
      {/* Hide ChatContainer when citationsOpen */}

      <div className={`flex flex-grow ${citationsOpen ? 'hidden' : ''}`}>
        <div className="overflow-y-auto w-full justify-center" style={{ minHeight: '90vh', maxHeight: '90vh' }}>
          <ChatContainer
            contentBlocks={contentBlocks}
            onSubmitClarificationAnswers={handleClarificationAnswer}
            onSubmitTopicChoices={handleTopicChoice}
            onClarificationStreamEnd={handleClarificationQuestionDone}
            onStreamEnd={onStreamEnd}
            showCurrentLoading={showCurrentLoading}
            setActiveCitationId={setActiveCitationId}
          />

        </div>

        {/* BottomBar */}
        {isFormVisible && (
          <BottomBar
            inputMode={inputMode}
            handleSubmit={handleNewQuestion}
            handleSubmitFollowup={handleNewFollowupQuestion}
            skipClarifications={skipClarifications}
            setSkipClarifications={setSkipClarifications}
            generateSuggestions={generateSuggestions}
            setGenerateSuggestions={setGenerateSuggestions}
          />
        )}
      </div>
      <div>
        <OptionsList options={options} onSelectionChange={handleSelectionChange} />
        {/* Other parts of your application */}
      </div>
    </div>





  );
};





// // topicsBySection API handler
// const topicsBySection = async (
//   legal_question: string,
//   general_topics: string[],
//   state_legal_document: string,
//   federal_legal_document: string,
//   state_rows: GroupedRows,
//   federal_rows: node_as_row[]
// ) => {

//   const requestBody = {
//     legal_question: legal_question,
//     general_topics: general_topics,
//     state_legal_document: state_legal_document,
//     federal_legal_document: federal_legal_document,
//     state_rows: state_rows,
//     federal_rows: federal_rows,
//     row_limit: 20,
//   };
//   console.log("  - Sending request to topicsBySection API!");
//   const response = await fetch('/api/topicGeneration/topicsBySection', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(requestBody),
//   });
//   const result = await response.json();
//   console.log("Received response from topicsBySection API!");
//   const combinedResponse: TopicResponses = result.combinedResponse;
//   //console.log(combinedResponse);

//   await topicCombination(combinedResponse, legal_question);

// };

// const topicCombination = async (
//   combinedResponse: TopicResponses,
//   main_question: string
// ) => {
//   const requestBody = {
//     main_question: main_question,
//     state_jurisdiction: "CA",
//     federal_jurisdiction: "USA",
//     combinedResponse: combinedResponse,
//   };
//   console.log("  - Sending request to topicCombination API!");
//   const response = await fetch('/api/topicGeneration/topicCombination', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(requestBody),
//   });
//   const result = await response.json();
//   console.log("Received response from topicCombination API!");
//   const finalTopics: TopicResponses = result.final_topics;
//   console.log(finalTopics);
//   setFinalTopicTemplate(finalTopics);
//   // Create topic block, clarification block for now.
//   // const params: ContentBlockParams = {
//   //   type: ContentType.Topics,
//   //   content: "Here are some topics that I think are relevant to your question. Please select the topics that you would like to learn more about.",
//   //   fake_stream: true,
//   //   concurrentStreaming: false,
//   //   topicResponses: finalTopics
//   // };
//   // await addContentBlock(createNewBlock(params));
//   //partialAnswering(finalTopics, groupedRows);
// };
