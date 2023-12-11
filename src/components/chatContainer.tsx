// ChatContainer.tsx

import React, { useEffect, useState, useRef } from 'react';
import ContentQueue from './contentQueue'; // Adjust import path as necessary

import { ContentBlock, ClarificationChoices, TopicResponses, Clarification, ContentType } from '@/lib/types'; // Adjust import path as necessary
import 'ldrs/hourglass';
import CitationBar from './citationBar';



interface ChatContainerProps {
  contentBlocks: ContentBlock[];
  showCurrentLoading: boolean;
  onSubmitClarificationAnswers: (clarification: Clarification, mode: string) => void;
  onSubmitClarificationVitaliaAnswers: (clarification: Clarification, mode: string) => void;
  onSubmitTopicChoices: (topicChoices: TopicResponses) => void;
  onStreamEnd: (concurrentStreaming: boolean) => void;
  onClarificationStreamEnd: (clarifyingQuestion: string, clarifyingAnswers: string[], mode: string) => void;
  setActiveCitationId: (citationId: string) => void;
  onFinishAnswerVitalia: () => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  contentBlocks,
  showCurrentLoading,
  onSubmitClarificationAnswers,
  onSubmitClarificationVitaliaAnswers,
  onSubmitTopicChoices,
  onClarificationStreamEnd,
  onStreamEnd,
  setActiveCitationId,
  onFinishAnswerVitalia
}) => {
  const [isCitationExpanded, setCitationExpanded] = useState(false);

  useEffect(() => {
    if (isCitationExpanded) {
      // Hide the content queue
    } else {
      // Show the content queue
      // Set the dimensions of citationBar to take over the space of the content queue
    }
  }, [isCitationExpanded]);



  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to the last message whenever contentBlocks updates
  useEffect(() => {
    // Wait for 5 seconds before scrolling to the bottom
    if(contentBlocks.length > 1 && contentBlocks[1].type !== ContentType.WelcomeVitalia) {
      setTimeout(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 3000);
    }
  }, [contentBlocks]);

  return (

    <div className="bg-[#FDFCFD] p-2 sm:p-6 border-4 border-[#E4E0D2] shadow-inner rounded-lg" style={{ minHeight: '90vh' }}>
     


      {/* <div className="p-4 bg-white rounded-lg shadow-inner overflow-auto max-h-full" style={{ minHeight: '70vh' }}> */}
      {!isCitationExpanded && (
        <ContentQueue
          items={contentBlocks}
          showCurrentLoading={showCurrentLoading}
          onSubmitClarificationAnswers={onSubmitClarificationAnswers}
          onSubmitClarificationVitaliaAnswers={onSubmitClarificationVitaliaAnswers}
          onStreamEnd={onStreamEnd}
          onSubmitTopicChoices={onSubmitTopicChoices}
          onClarificationStreamEnd={onClarificationStreamEnd}
          setActiveCitationId={setActiveCitationId}
          onFinishAnswerVitalia={onFinishAnswerVitalia}
          endOfMessagesRef={endOfMessagesRef}
        />
      )}
    </div>
  



  );
};

export default ChatContainer;
