import { ContentBlock, ContentType, Clarification } from "../lib/types";
import {
	QuestionBlock,
	AnswerVitaliaBlock,
	ClarificationQuestionBlock,
	ClarificationVitaliaBlock,
	WelcomeBlock,
	WelcomeVitaliaBlock,
	AnswerBlock,
	ClarificationBlock,
	AbeIconLabel,
} from "@/components/ui/chatBlocks";
import React, { useEffect, useState, useRef } from "react";

// Assuming ContentType and ContentBlock are properly defined in "@/lib/types"

interface ContentQueueProps {
	items: ContentBlock[];
	showCurrentLoading: boolean;
	onSubmitClarificationAnswers: (
		clarification: Clarification,
		mode: string,
	) => void;
	onSubmitClarificationVitaliaAnswers: (
		clarification: Clarification,
		mode: string,
	) => void;
	onStreamEnd: (concurrentStreaming: boolean) => void; // Optional if no user input is needed
	onClarificationStreamEnd: (
		clarifyingQuestion: string,
		clarifyingAnswers: string[],
		mode: string,
	) => void; // Optional if no user input is needed
	setActiveCitationId: (citationId: string) => void;
	onFinishAnswerVitalia: () => void;
}

const ContentQueue: React.FC<ContentQueueProps> = ({
	items,
	showCurrentLoading,
	onSubmitClarificationAnswers,
	onSubmitClarificationVitaliaAnswers,
	onStreamEnd,
	onClarificationStreamEnd,
	setActiveCitationId,
	onFinishAnswerVitalia,
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
		if (items.length > 1 && items[1].type !== ContentType.WelcomeVitalia) {
			setTimeout(() => {
				endOfMessagesRef.current?.scrollIntoView({
					behavior: "smooth",
				});
			}, 3000);
		}
	}, [items]);

	const renderContentBlock = (item: ContentBlock) => {
		switch (item.type) {
			case ContentType.Loading:
				return (
					<div className="flex justify-start">
						<AbeIconLabel
							neverLoad={item.neverLoad!}
							showCurrentLoading={showCurrentLoading}
						/>
					</div>
				);

			case ContentType.Question:
				return (
					<div className="flex justify-end">
						<QuestionBlock content={item.content} />
					</div>
				);
			case ContentType.Answer:
				return (
					<div className="flex justify-start w-full">
						<AnswerBlock
							content={item.content}
							content_list={item.content_list}
							fakeStream={item.fakeStream}
							concurrentStreaming={item.concurrentStreaming}
							onStreamEnd={() =>
								onStreamEnd(item.concurrentStreaming)
							}
							setActiveCitationId={setActiveCitationId}
						/>
					</div>
				);
			case ContentType.AnswerVitalia:
				return (
					<div className="flex justify-start w-full">
						<AnswerVitaliaBlock
							content={item.content}
							citationLinks={item.citationLinks!}
							onFinishAnswerVitalia={onFinishAnswerVitalia}
							waitForStream={item.concurrentStreaming}
						/>
					</div>
				);
			case ContentType.ClarificationQuestion:
				// Ensure that onConfirm and onDismiss are defined before trying to use them

				if (
					item.clarifyingAnswers &&
					item.clarifyingQuestion &&
					item.mode
				) {
					return (
						<div className="flex justify-start w-11/12">
							<ClarificationQuestionBlock
								clarifyingAnswers={item.clarifyingAnswers}
								clarifyingQuestion={item.clarifyingQuestion}
								content={item.content}
								mode={item.mode}
								onClarificationStreamEnd={() =>
									onClarificationStreamEnd(
										item.clarifyingQuestion!,
										item.clarifyingAnswers!,
										item.mode!,
									)
								}
							/>
						</div>
					);
				} else {
					throw new Error(
						"Clarification block must have clarifyingAnswers and clarifyingQuestions defined",
					);
				}
			case ContentType.Clarification:
				// Ensure that onConfirm and onDismiss are defined before trying to use them

				if (
					item.clarifyingAnswers &&
					item.clarifyingQuestion &&
					item.mode
				) {
					return (
						<div className="flex justify-end">
							<div className="w-full">
								<ClarificationBlock
									clarifyingAnswers={item.clarifyingAnswers}
									clarifyingQuestion={item.clarifyingQuestion}
									content={item.content}
									mode={item.mode}
									fakeStream={item.fakeStream}
									concurrentStreaming={
										item.concurrentStreaming
									}
									onSubmitClarificationAnswers={
										onSubmitClarificationAnswers
									}
									onStreamEnd={() =>
										onStreamEnd(item.concurrentStreaming)
									}
								/>
							</div>
						</div>
					);
				} else {
					throw new Error(
						"Clarification block must have clarifyingAnswers and clarifyingQuestions defined",
					);
				}
			case ContentType.ClarificationVitalia:
				// Ensure that onConfirm and onDismiss are defined before trying to use them

				if (
					item.clarifyingAnswers &&
					item.clarifyingQuestion &&
					item.mode
				) {
					return (
						<div className="flex justify-end">
							<div className="w-full">
								<ClarificationVitaliaBlock
									clarifyingAnswers={item.clarifyingAnswers}
									clarifyingQuestion={item.clarifyingQuestion}
									content={item.content}
									mode={item.mode}
									fakeStream={item.fakeStream}
									concurrentStreaming={
										item.concurrentStreaming
									}
									onSubmitClarificationVitaliaAnswers={
										onSubmitClarificationVitaliaAnswers
									}
									onStreamEnd={() =>
										onStreamEnd(item.concurrentStreaming)
									}
								/>
							</div>
						</div>
					);
				} else {
					throw new Error(
						"Clarification block must have clarifyingAnswers and clarifyingQuestions defined",
					);
				}

			case ContentType.Welcome: {
				return (
					<div className="flex justify-start w-full">
						<WelcomeBlock />
					</div>
				);
			}
			case ContentType.WelcomeVitalia: {
				return (
					<div className="flex justify-start w-full">
						<WelcomeVitaliaBlock />
					</div>
				);
			}
			// handle other types as necessary
			default:
				return null;
		}
	};

	return (
		<div className="p-4 rounded-lg shadow-inner overflow-auto max-h-full h-full">
			{!isCitationExpanded && (
				<div className="w-full space-y-4 pb-4">
					{items.map((item) => (
						// The key should be here, on the first element inside the map
						<div key={item.blockId}>{renderContentBlock(item)}</div>
					))}
					<div ref={endOfMessagesRef} />
				</div>
			)}
		</div>
	);
};

export default ContentQueue;
