import { ContentBlock, ContentType, ClarificationChoices, TopicResponses, Clarification } from "../lib/types";
import { QuestionBlock, ClarificationQuestionBlock, WelcomeBlock, TopicsBlock, AnswerBlock, FinalAnswerBlock, ClarificationBlock, StreamingAnswerBlock, ApprovalBlock, AbeIconLabel } from "@/components/ui/chatBlocks";
import React from "react";



// Assuming ContentType and ContentBlock are properly defined in "@/lib/types"

interface ContentQueueProps {
  items: ContentBlock[];
  showCurrentLoading: boolean;
  endOfMessagesRef: React.RefObject<HTMLDivElement>;
  onSubmitClarificationAnswers: (clarification: Clarification, mode: string) => void;
  onSubmitTopicChoices: (topicChoices: TopicResponses) => void;
  onStreamEnd: (concurrentStreaming: boolean) => void; // Optional if no user input is needed
  onClarificationStreamEnd: (clarifyingQuestion: string, clarifyingAnswers: string[], mode: string) => void; // Optional if no user input is needed
  setActiveCitationId: (citationId: string) => void;
}

const ContentQueue: React.FC<ContentQueueProps> = ({
  items,
  showCurrentLoading,
  endOfMessagesRef,
  onSubmitClarificationAnswers,
  onSubmitTopicChoices,
  onStreamEnd,
  onClarificationStreamEnd,
  setActiveCitationId
}) => {



  const renderContentBlock = (item: ContentBlock) => {
    switch (item.type) {
      case ContentType.Loading:
        return (<div className="flex justify-start">
          <AbeIconLabel
            neverLoad={item.neverLoad!}
            showCurrentLoading={showCurrentLoading}
          />
        </div>);

      case ContentType.Question:
        return (<div className="flex justify-end">
          <QuestionBlock content={item.content}

          />
        </div>
        );
      case ContentType.Answer:
        return (
          <div className="flex justify-start w-5/6">
            <AnswerBlock
              content={item.content}
              content_list={item.content_list}
              fakeStream={item.fakeStream}
              concurrentStreaming={item.concurrentStreaming}
              onStreamEnd={() => onStreamEnd(item.concurrentStreaming)}
              setActiveCitationId={setActiveCitationId}
            />
          </div>
        );
      case ContentType.StreamingAnswer:
        return <StreamingAnswerBlock content={item.content} />;
      case ContentType.Approval:
        return (

          <div className="flex justify-start w-5/6">

            <ApprovalBlock
              content={item.content}
              fakeStream={item.fakeStream}
              concurrentStreaming={item.concurrentStreaming}
              onStreamEnd={() => onStreamEnd(item.concurrentStreaming)}
            />
          </div>

        );
      case ContentType.ClarificationQuestion:
        // Ensure that onConfirm and onDismiss are defined before trying to use them

        if (item.clarifyingAnswers && item.clarifyingQuestion && item.mode) {
          return (
            <div className="flex justify-start w-11/12">
              <ClarificationQuestionBlock
                clarifyingAnswers={item.clarifyingAnswers}
                clarifyingQuestion={item.clarifyingQuestion}
                content={item.content}
                mode={item.mode}
                onClarificationStreamEnd={() => onClarificationStreamEnd(item.clarifyingQuestion!, item.clarifyingAnswers!, item.mode!)}
              />
            </div>
          );
        } else {
          throw new Error('Clarification block must have clarifyingAnswers and clarifyingQuestions defined');
        }
      case ContentType.Clarification:
        // Ensure that onConfirm and onDismiss are defined before trying to use them

        if (item.clarifyingAnswers && item.clarifyingQuestion && item.mode) {
          return (
            <div className="flex justify-end">
              <div className="w-4/6">
                <ClarificationBlock
                  clarifyingAnswers={item.clarifyingAnswers}
                  clarifyingQuestion={item.clarifyingQuestion}
                  content={item.content}
                  mode={item.mode}
                  fakeStream={item.fakeStream}
                  concurrentStreaming={item.concurrentStreaming}
                  onSubmitClarificationAnswers={onSubmitClarificationAnswers}
                  onStreamEnd={() => onStreamEnd(item.concurrentStreaming)}
                />
              </div>
            </div>
          );
        } else {
          throw new Error('Clarification block must have clarifyingAnswers and clarifyingQuestions defined');
        }

      case ContentType.Topics:
        if (item.topicResponses) {
          return (
            <div className="flex justify-start w-5/6">
              <TopicsBlock
                topicResponses={item.topicResponses}
                onSubmitTopicChoices={onSubmitTopicChoices}
                content={item.content}
                fakeStream={item.fakeStream}
                concurrentStreaming={item.concurrentStreaming}
                onStreamEnd={() => onStreamEnd(item.concurrentStreaming)}
              />
            </div>
          );
        } else {
          throw new Error('Topics block must have topics defined');
        }
      case ContentType.FinalAnswer:
        if (item.finalAnswer) {
          return (
            <div className="flex justify-start w-5/6">
              <FinalAnswerBlock
                content={""}
                fakeStream={item.fakeStream}
                concurrentStreaming={item.concurrentStreaming}
                onStreamEnd={() => onStreamEnd(item.concurrentStreaming)}
                finalAnswer={item.finalAnswer}
              />
            </div>
          );
        } else {
          throw new Error('Final Answer block must have final answer defined');
        }
      case ContentType.Welcome: {
        return (
          <div className="flex justify-start w-5/6">
            <WelcomeBlock
              content={""}
            />
          </div>
        );
      }
      // handle other types as necessary
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-4 pb-4">
      {items.map((item) => (
        // The key should be here, on the first element inside the map
        <div key={item.blockId}>
          {renderContentBlock(item)}
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ContentQueue;
