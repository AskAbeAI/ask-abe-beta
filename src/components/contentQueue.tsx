import {
	AnswerBlock,
	AnswerVitaliaBlock,
	ClarificationQuestionBlock,
	QuestionBlock,
	WelcomeBlock,
	WelcomeVitaliaBlock
} from "@/components/ui/chatBlocks";
import { cn } from "@/lib/utils/cn";
import React, { useEffect, useRef, useState } from "react";
import { Clarification, ContentBlock, ContentType } from "../lib/types";
import { LoadingState } from "./ui/loading-state";

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

	// Improved scroll behavior
	useEffect(() => {
		if (items.length > 1 && items[1].type !== ContentType.WelcomeVitalia) {
			const timer = setTimeout(() => {
				endOfMessagesRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "end"
				});
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [items]);

	const renderContentBlock = (item: ContentBlock) => {
		const commonClasses = "w-full max-w-3xl mx-auto";

		switch (item.type) {
			case ContentType.Loading:
				return (
					<div className={cn("flex justify-start", commonClasses)}>
						<LoadingState
							message={item.content}
							className={cn(
								"w-full",
								item.neverLoad && "animate-none"
							)}
						/>
					</div>
				);

			case ContentType.Question:
				return (
					<div className={cn("flex justify-end", commonClasses)}>
						<QuestionBlock content={item.content} />
					</div>
				);
			case ContentType.Answer:
				return (
					<div className={cn("flex justify-start w-full", commonClasses)}>
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
					<div className={cn("flex justify-start w-full", commonClasses)}>
						<AnswerVitaliaBlock
							content={item.content}
							citationLinks={item.citationLinks!}
							onFinishAnswerVitalia={onFinishAnswerVitalia}
							waitForStream={item.concurrentStreaming}
						/>
					</div>
				);
			case ContentType.ClarificationQuestion:
				if (!item.clarifyingAnswers || !item.clarifyingQuestion || !item.mode) {
					throw new Error("Missing required clarification properties");
				}
				return (
					<div className={cn("flex justify-start w-11/12", commonClasses)}>
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
			case ContentType.Clarification:

			case ContentType.Welcome: {
				return (
					<div className={cn("flex justify-start w-full", commonClasses)}>
						<WelcomeBlock />
					</div>
				);
			}
			case ContentType.WelcomeVitalia: {
				return (
					<div className={cn("flex justify-start w-full", commonClasses)}>
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
		<div className="flex flex-col space-y-6 p-4 rounded-lg">
			{items.map((item) => (
				<div
					key={item.blockId}
					className={cn(
						"transition-all duration-200 ease-in-out",
						"hover:translate-x-0"
					)}
				>
					{renderContentBlock(item)}
				</div>
			))}
			<div ref={endOfMessagesRef} />
		</div>
	);
};

export default ContentQueue;
