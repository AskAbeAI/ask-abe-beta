"use client";
// Import React dependencies
import React, { useState, useEffect } from 'react';
// Import UI components
import BottomBar from '@/components/bottomBar';
import ChatContainer from '@/components/chatContainer';
import Frame from 'react-frame-component';

// Import data types
import { ContentType, ContentBlock, ContentBlockParams, Clarification, CitationLinks } from "@/lib/types";

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
    let newParams: ContentBlockParams = {
      type: ContentType.Question,
      content: questionText,
      fake_stream: false,
      concurrentStreaming: false
    };
    await addContentBlock(createNewBlock(newParams));
    addNewLoadingBlock(false);
    const telegram_api_key = 'ak_EjMsYGPJpLHcb48r4uCfP2ZYyrjwL'
    const vitalia_api_key = 'ak_jTMkA0rfIrMhu0WBkiHzy4YEZiVq82ym';
    const request = {
      api_key: vitalia_api_key, // The one I provided for the telegram bot
      question: question,   // A plain text question to be answered
      already_answered: alreadyAnswered,  // A list of questions that have already been answered
    }
    console.log("Sending request to Quarantined API")
    const response = await fetch("/api/externalAPI/vitalia", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    console.log("Received response from Quarantined API")
    const response_json = await response.json();
    console.log(response_json);
    const answer = response_json.answer;
    const citationLinks: CitationLinks = response_json.citationLinks;
    const already_answered = response_json.already_answered;

    setAlreadyAnswered(already_answered);
    
    const endTime = Date.now();
    const params: ContentBlockParams = {
      type: ContentType.AnswerVitalia,
      content: answer,
      fake_stream: false,
      concurrentStreaming: true,
      citationLinks: citationLinks
    };
    await addContentBlock(createNewBlock(params));
    
    
  };

  const addFeedbackBlocks = async () => {
    const clarqparams: ContentBlockParams = {
      type: ContentType.ClarificationQuestion,
      content: "We care about your feedback!",
      fake_stream: false,
      concurrentStreaming: false,
      clarifyingQuestion: "Did this answer your question?",
      clarifyingAnswers: ["Yes","No",'No, Reach Out to An Organizer'],
      mode: 'Single'
    };
    await addContentBlock(createNewBlock(clarqparams));
    const clarparams: ContentBlockParams = {
      type: ContentType.ClarificationVitalia,
      content: "We care about your feedback!",
      fake_stream: false,
      concurrentStreaming: false,
      clarifyingQuestion: "Did this answer your question?",
      clarifyingAnswers: ["Yes","No",'No, Reach Out to An Organizer'],
      mode: 'Single'
    };
    await addContentBlock(createNewBlock(clarparams));
    setIsFormVisible(true);
  }

  const handleClarificationVitaliaAnswer = async (response: Clarification, mode: string) => {
    // Append the response to the clarificationResponses state
    let params = {};
    
    console.log("Handling clarification answer!");
    if(response.response === "No, Reach Out to An Organizer") {
      const citationLinks: CitationLinks = {}
      citationLinks["Organizer"] = "https://t.me/tailsph"
      const params: ContentBlockParams = {
        type: ContentType.AnswerVitalia,
        content: "I'm sorry I couldn't help you find what you're looking for. I have provided the contact information for one of the organizers of Vitalia below. Please reach out to them for further assistance. ###Organizer###",
        fake_stream: true,
        concurrentStreaming: false,
        citationLinks: citationLinks
      };
      await addContentBlock(createNewBlock(params));
      
    } else if (response.response === "Yes") {
      const citationLinks: CitationLinks = {}
      citationLinks["Vitalia Wiki"] = "https://wiki.vitalia.city/"
      const params: ContentBlockParams = {
          type: ContentType.AnswerVitalia,
          content: "Great! Glad I could help! Check out the ###Vitalia Wiki###. I can help answer a followup question or a completely new question.",
          fake_stream: true,
          concurrentStreaming: false,
          citationLinks: citationLinks
      };
      await addContentBlock(createNewBlock(params));
    } else if (response.response === "No"){
      const citationLinks: CitationLinks = {}
      citationLinks["Vitalia Wiki"] = "https://wiki.vitalia.city/"
      const params: ContentBlockParams = {
        type: ContentType.AnswerVitalia,
        content: "I'm sorry I couldn't help you find what you're looking for. The ###Vitalia Wiki### has a lot of information that might be helpful.",
        fake_stream: true,
        concurrentStreaming: false,
        citationLinks: citationLinks
      };
      await addContentBlock(createNewBlock(params));
    }
    return;
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
        <div className="w-full" style={{ minHeight: '100vh' }}>
          <div className="overflow-y-auto w-full" style={{ minHeight: '90vh' }}>
            <ChatContainer
              contentBlocks={contentBlocks}
              onSubmitClarificationAnswers={dummyFunction}
              onSubmitClarificationVitaliaAnswers={handleClarificationVitaliaAnswer}
              onSubmitTopicChoices={dummyFunction}
              onClarificationStreamEnd={dummyFunction}
              onStreamEnd={onStreamEnd}
              showCurrentLoading={showCurrentLoading}
              setActiveCitationId={dummyFunction}
              onFinishAnswerVitalia={addFeedbackBlocks}
            />
          </div>
          <div className="bottom-0">
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
       
      </div>
    </Frame>
  );
};
