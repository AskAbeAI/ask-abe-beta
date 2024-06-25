import React from "react";
import { useState, useRef } from "react";
import { useEffect } from "react";
import {
	CitationBlockProps,
	AnswerBlockProps,
	AnswerVitaliaBlockProps,
	QuestionBlockProps,
	ClarificationBlockProps,
	ClarificationVitaliaProps,
	ClarificationQuestionBlockProps,
} from "@/lib/types";
import { Clarification } from "@/lib/types";
import Image from "next/image";
import { AbeIconProps } from "@/lib/types";
import dynamic from "next/dynamic";

// Dynamically import the l-bouncy component with SSR disabled

export const AnswerBlock: React.FC<AnswerBlockProps> = ({
	content,
	content_list,
	fakeStream,
	concurrentStreaming,
	onStreamEnd,
	setActiveCitationId,
}) => {
	const [displayedElements, setDisplayedElements] = useState<JSX.Element[]>(
		[],
	);
	const [finalText, setFinalText] = useState("");
	const [displayedContentCount, setDisplayedContentCount] = useState(0);
	const [displayedElementsCount, setDisplayedElementsCount] = useState(0);

	const createTextWithEmbeddedLink = (text: string): JSX.Element[] => {
		// Regular expression to match citations
		// Replace all occurnces of "(#" with just "#"
		text = text.replace(/\n§/g, "§");
		text = text.replace(/\(#/g, "#");
		// Replace all occurrences of "#)" with just "#"
		text = text.replace(/#\)/g, "#");

		const citationPattern = /###(.*?)###/g;

		// Object to hold citation JSX elements, keyed by unique placeholders
		const citations: Record<string, JSX.Element> = {};

		// Replace citations in the text with placeholders and store the citations
		const textWithPlaceholders = text.replace(
			citationPattern,
			(_, citation) => {
				const placeholder = `CITATION_${Object.keys(citations).length}`;
				citations[placeholder] = (
					<a
						href={`#${citation.trim()}`}
						onClick={() => setActiveCitationId(citation.trim())}
						className="text-blue-500 hover:text-blue-700"
					>
						{citation.trim()}
					</a>
				);
				return placeholder;
			},
		);
		//console.log(citations);

		// Split the text into words
		const words = textWithPlaceholders.split(/\s+/);

		// Convert words and placeholders to JSX elements
		return words.map((word, index) => {
			//console.log(word);

			if (word.includes("CITATION_")) {
				// temporarily remove a possible period or comma from the word
				let toAdd = "";
				if (word.includes(".")) {
					toAdd = ". ";
				} else if (word.includes(",")) {
					toAdd = ", ";
				}
				const wordWithoutPunctuation = word.replace(/[.,]/g, "");

				// Replace placeholder with the stored JSX element
				return (
					<React.Fragment key={`citation-${index}`}>
						{citations[wordWithoutPunctuation]}
						{toAdd}
					</React.Fragment>
				);
			} else {
				// Regular word
				return (
					<React.Fragment key={`word-${index}`}>
						{word + " "}
					</React.Fragment>
				);
			}
		});
	};

	const fullContentElements = createTextWithEmbeddedLink(content);

	useEffect(() => {
		if (fakeStream) {
			let wordIndex = 0;

			const intervalId = setInterval(() => {
				setDisplayedElementsCount((count) => count + 1);
				wordIndex++;

				if (wordIndex >= fullContentElements.length) {
					clearInterval(intervalId);
					// onStreamEnd(concurrentStreaming);
					const temp = content_list?.pop();
					if (content_list) {
						content_list.forEach((_, index) => {
							setTimeout(() => {
								setDisplayedContentCount((count) => count + 1);
							}, 250);
						});
						// After stream ends do some UI stuff

						setFinalText(temp || "");
					}
				}
			}, 25); // Adjust interval time as needed

			return () => clearInterval(intervalId);
		} else {
			setDisplayedElementsCount(fullContentElements.length);
			onStreamEnd(concurrentStreaming);
		}
	}, [content, fakeStream]);

	return (
		<div className="flex flex-col items-start">
			<div
				className={`flex flex-col text-lg md:text-lg lg:text-xl p-4 bg-response-color text-black rounded-lg shadow`}
			>
				<div className="text-lg md:text-lg lg:text-xl text-black">
					<p>
						{fullContentElements.slice(0, displayedElementsCount)}
					</p>
					{content_list &&
						content_list
							.slice(0, displayedContentCount)
							.map((answer, index) => (
								<li key={index} className="text-black">
									{answer}
								</li>
							))}
					<p className=""> {finalText || ""}</p>
				</div>
			</div>
		</div>
	);
};

export const AnswerVitaliaBlock: React.FC<AnswerVitaliaBlockProps> = ({
	content,
	citationLinks,
	onFinishAnswerVitalia,
	waitForStream,
}) => {
	const [displayedElementsCount, setDisplayedElementsCount] = useState(0);

	const createTextWithEmbeddedLink = (text: string): JSX.Element[] => {
		text = text.replace(/\n/g, " <br/> ");
		// Regular expression to match citations
		// Replace all occurnces of "(#" with just "#"
		text = text.replace(/\(#/g, "#");
		// Replace all occurrences of "#)" with just "#"
		text = text.replace(/#\)/g, "#");

		const citationPattern = /###(.*?)###/g;

		// Object to hold citation JSX elements, keyed by unique placeholders
		const citations: Record<string, JSX.Element> = {};

		// Replace citations in the text with placeholders and store the citations
		const textWithPlaceholders = text.replace(
			citationPattern,
			(_, citation) => {
				const placeholder = `CITATION_${Object.keys(citations).length}`;
				citations[placeholder] = (
					<a
						href={`${citationLinks[citation.trim()]}`}
						target="_blank"
						className="text-blue-500 hover:text-blue-700"
					>
						[{citation.trim()}]
					</a>
				);
				return placeholder;
			},
		);
		//console.log(citations);

		// Split the text into words
		const words = textWithPlaceholders.split(/\s+/);

		// Convert words and placeholders to JSX elements
		return words.map((word, index) => {
			//console.log(word);

			if (word.includes("CITATION_")) {
				// temporarily remove a possible period or comma from the word
				let toAdd = "";
				if (word.includes(".")) {
					toAdd = ". ";
				} else if (word.includes(",")) {
					toAdd = ", ";
				}
				const wordWithoutPunctuation = word.replace(/[.,]/g, "");

				// Replace placeholder with the stored JSX element
				return (
					<React.Fragment key={`citation-${index}`}>
						{citations[wordWithoutPunctuation]}
						{toAdd}
					</React.Fragment>
				);
			} else {
				// Regular word
				if ("<br/>" === word) {
					return <br key={`word-${index}`}></br>;
				}
				return (
					<React.Fragment key={`word-${index}`}>
						{word + " "}
					</React.Fragment>
				);
			}
		});
	};

	const fullContentElements = createTextWithEmbeddedLink(content);

	useEffect(() => {
		let wordIndex = 0;

		const intervalId = setInterval(() => {
			setDisplayedElementsCount((count) => count + 1);
			wordIndex++;

			if (wordIndex >= fullContentElements.length) {
				clearInterval(intervalId);
				if (waitForStream) {
					onFinishAnswerVitalia();
				}
			}
		}, 25); // Adjust interval time as needed

		return () => clearInterval(intervalId);
	}, [content]);

	return (
		<div className="flex flex-col items-start">
			<div
				className={`flex flex-col text-lg p-4 bg-response-color text-black rounded-lg shadow`}
			>
				<div className="text-lg text-black whitespace-pre-line">
					<p className=" whitespace-pre-line">
						{fullContentElements.slice(0, displayedElementsCount)}
					</p>
				</div>
			</div>
		</div>
	);
};

export const CitationBlock: React.FC<CitationBlockProps> = ({
	citation,
	link,
	section_text,
	open,
	setOpen,
}) => {
	// Sort the text list according to your sorting criteria.
	// Assuming the sorting function is already defined and imported.
	// If not, you can sort the array here as needed.
	const detailsRef = useRef<HTMLDetailsElement>(null);

	useEffect(() => {
		if (!open && detailsRef.current) {
			detailsRef.current.removeAttribute("open");
		}
	}, [open]);

	return (
		<details
			ref={detailsRef}
			id={citation}
			className="p-4 bg-seasaltwhite rounded-lg shadow space-y-2"
			onClick={() => setOpen(true)}
		>
			<summary className="text-black cursor-pointer">{citation}</summary>
			<a href={link} target="_blank" rel="noopener noreferrer">
				Link
			</a>
			<ul className="list-inside list-decimal">
				{section_text.map((text, index) => (
					<ul key={index} className="text-gray-700">
						{text}
					</ul>
				))}
			</ul>
		</details>
	);
};
interface CitationLinkerProps {
	text: string;
}

const CitationLinker: React.FC<CitationLinkerProps> = ({ text }) => {
	// This function replaces the masked citations with link components
	const replaceCitationsWithLinks = (text: string) => {
		const citationPattern = /### ###/g;
		const parts = text.split(citationPattern);
		const components = [];

		for (let i = 0; i < parts.length; i++) {
			components.push(parts[i]);
			if (i < parts.length - 1) {
				components.push(
					<a href="#targetComponent" className="citation-link">
						[Citation]
					</a>,
				);
			}
		}

		return components;
	};

	return <div>{replaceCitationsWithLinks(text)}</div>;
};
// ClarificationBlock.tsx
export const ClarificationBlock: React.FC<ClarificationBlockProps> = ({
	clarifyingQuestion,
	clarifyingAnswers,
	content,
	mode,
	fakeStream,
	concurrentStreaming,
	onStreamEnd,
	onSubmitClarificationAnswers, // Assume this prop is passed in with the content to the user
	// ... other props
}) => {
	const [displayedText, setDisplayedText] = useState("");
	const [clarificationResponse, setClarificationResponse] = useState("");
	const [otherInput, setOtherInput] = useState("");
	const [isOtherInputVisible, setIsOtherInputVisible] = useState(false);
	const [streamingFinished, setStreamingFinished] = useState(false);
	const [inputsLocked, setInputsLocked] = useState(false);
	const [selectedAnswer, setSelectedAnswer] = useState("");
	const [clickedButton, setClickedButton] = useState("");

	// Tracks visibility of "Other" input fields

	const handleAnswerChange = (answer: string) => {
		if (inputsLocked) {
			return;
		}
		// Show input field if "Other" is selected
		//console.log(`Updating answer for question ${index} to ${answer}`);
		if (answer === "Custom Response") {
			setIsOtherInputVisible(true);
			setClarificationResponse(answer);
			//console.log(`New answer for question ${index} is Other: ${answer}`);
		} else {
			if (isOtherInputVisible && !clarifyingAnswers.includes(answer)) {
				//console.log("Other submit case");

				setClarificationResponse("Custom Response: " + answer);
				setIsOtherInputVisible(false);
			} else {
				//console.log("Switching form other!");
				setIsOtherInputVisible(false);
				setClarificationResponse(answer);
			}
			setClickedButton(answer);
			setTimeout(() => {
				setSelectedAnswer(answer); // Transition to text after a delay
			}, 1500); // Adjust delay as needed for your animation timing
		}
	};

	const handleOtherInputChange = (text: string) => {
		if (inputsLocked) {
			return;
		}
		setOtherInput(text);
	};

	useEffect(() => {
		// After any state update, check if all clarificationResponses are not empty
		//console.log(clarificationResponses);
		const allResponsesSubmitted =
			clarificationResponse !== "" &&
			clarificationResponse !== "Custom Response";
		//console.log(`All responses submitted: ${allResponsesSubmitted}`);
		if (allResponsesSubmitted) {
			// create a new ClarificationResponse object with the updated responses
			//console.log("Trying to submit clarification answers");

			const obj: Clarification = {
				question: clarifyingQuestion,
				multiple_choice_answers: clarifyingAnswers,
				response: clarificationResponse,
			};
			onSubmitClarificationAnswers(obj, mode);
			setInputsLocked(true);
		}
	}, [clarificationResponse]); // Dependency array ensures this only runs when clarificationChoices changes

	return (
		<div className="flex flex-col items-end">
			<UserIconLabel />
			<div className="flex flex-wrap justify-start p-4 bg-user-color text-black rounded-lg">
				{selectedAnswer !== "" ? (
					<p
						className="text-black"
						style={{ wordBreak: "break-word" }}
					>
						{selectedAnswer}
					</p>
				) : (
					clarifyingAnswers.map((answer) => (
						<button
							key={answer}
							onClick={() => handleAnswerChange(answer)}
							className={`flex-grow truncate p-1 rounded-lg m-2 text-black border border-black border-1 
            ${clickedButton === "" || clickedButton === answer ? "" : "transition-opacity ease-linear duration-1000 opacity-0"}
            ${
				answer === "The Question Is Not Applicable" ||
				answer === "I Would Prefer Not to Respond"
					? "bg-red-300 hover:bg-red-500 hover:outline-red-700"
					: answer.includes("Custom Response")
						? "bg-orange-300 hover:bg-orange-500 hover:outline-orange-700"
						: "bg-green-300 hover:bg-green-500 hover:outline-green-700"
			}`}
							style={{ minWidth: 0, wordBreak: "break-word" }}
						>
							{answer}
						</button>
					))
				)}

				{/* Originally hidden text input for 'Other' option, expands when other is clicked */}
				{isOtherInputVisible && (
					<div>
						<input
							type="text"
							value={otherInput}
							onChange={(e) =>
								handleOtherInputChange(e.target.value)
							}
							placeholder="Please specify"
							className="w-full p-2 border rounded"
							contentEditable={!inputsLocked}
						/>
						<button
							onClick={() => handleAnswerChange(otherInput)}
							className="p-2 bg-blue-500 text-white rounded mt-2"
						>
							Submit
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export const ClarificationVitaliaBlock: React.FC<ClarificationVitaliaProps> = ({
	clarifyingQuestion,
	clarifyingAnswers,
	content,
	mode,
	fakeStream,
	concurrentStreaming,
	onStreamEnd,
	onSubmitClarificationVitaliaAnswers, // Assume this prop is passed in with the content to the user
	// ... other props
}) => {
	const [clarificationResponse, setClarificationResponse] = useState("");
	const [otherInput, setOtherInput] = useState("");
	const [isOtherInputVisible, setIsOtherInputVisible] = useState(false);
	const [inputsLocked, setInputsLocked] = useState(false);
	const [selectedAnswer, setSelectedAnswer] = useState("");
	const [clickedButton, setClickedButton] = useState("");

	// Tracks visibility of "Other" input fields

	const handleAnswerChange = (answer: string) => {
		if (inputsLocked) {
			return;
		}
		// Show input field if "Other" is selected
		//console.log(`Updating answer for question ${index} to ${answer}`);
		if (answer === "Custom Response") {
			setIsOtherInputVisible(true);
			setClarificationResponse(answer);
			//console.log(`New answer for question ${index} is Other: ${answer}`);
		} else {
			if (isOtherInputVisible && !clarifyingAnswers.includes(answer)) {
				//console.log("Other submit case");

				setClarificationResponse("Custom Response: " + answer);
				setIsOtherInputVisible(false);
			} else {
				//console.log("Switching form other!");
				setIsOtherInputVisible(false);
				setClarificationResponse(answer);
			}
			setClickedButton(answer);
			setTimeout(() => {
				setSelectedAnswer(answer); // Transition to text after a delay
			}, 1500); // Adjust delay as needed for your animation timing
		}
	};

	const handleOtherInputChange = (text: string) => {
		if (inputsLocked) {
			return;
		}
		setOtherInput(text);
	};

	useEffect(() => {
		// After any state update, check if all clarificationResponses are not empty
		//console.log(clarificationResponses);
		const allResponsesSubmitted =
			clarificationResponse !== "" &&
			clarificationResponse !== "Custom Response";
		//console.log(`All responses submitted: ${allResponsesSubmitted}`);
		if (allResponsesSubmitted) {
			// create a new ClarificationResponse object with the updated responses
			//console.log("Trying to submit clarification answers");

			const obj: Clarification = {
				question: clarifyingQuestion,
				multiple_choice_answers: clarifyingAnswers,
				response: clarificationResponse,
			};
			onSubmitClarificationVitaliaAnswers(obj, mode);
			setInputsLocked(true);
		}
	}, [clarificationResponse]); // Dependency array ensures this only runs when clarificationChoices changes

	return (
		<div className="flex flex-col items-end">
			<UserIconLabel />
			<div className="flex flex-wrap justify-start text-lg p-4 bg-user-color text-black rounded-lg">
				{selectedAnswer !== "" ? (
					<p className="text-black">{selectedAnswer}</p>
				) : (
					clarifyingAnswers.map((answer) => (
						<button
							key={answer}
							onClick={() => handleAnswerChange(answer)}
							className={`flex-grow truncate p-2 rounded-lg m-2 text-black border border-black border-1 
              ${clickedButton === "" || clickedButton === answer ? "" : "transition-opacity ease-linear duration-1000 opacity-0"}
              ${
					answer === "No" ||
					answer === "No, Reach Out to An Organizer"
						? "bg-red-300 hover:bg-red-500 hover:outline-red-700"
						: answer.includes("Custom Response")
							? "bg-orange-300 hover:bg-orange-500 hover:outline-orange-700"
							: "bg-green-300 hover:bg-green-500 hover:outline-green-700"
				}`}
						>
							{answer}
						</button>
					))
				)}

				{/* Originally hidden text input for 'Other' option, expands when other is clicked */}
				{isOtherInputVisible && (
					<div>
						<input
							type="text"
							value={otherInput}
							onChange={(e) =>
								handleOtherInputChange(e.target.value)
							}
							placeholder="Please specify"
							className="w-full p-2 border rounded"
							contentEditable={!inputsLocked}
						/>
						<button
							onClick={() => handleAnswerChange(otherInput)}
							className="p-2 bg-blue-500 text-white rounded mt-2"
						>
							Submit
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export const ClarificationQuestionBlock: React.FC<
	ClarificationQuestionBlockProps
> = ({
	clarifyingQuestion,
	clarifyingAnswers,
	mode,
	content,
	onClarificationStreamEnd,
}) => {
	const [displayedText, setDisplayedText] = useState("");
	//Stream the initial message to the user
	useEffect(() => {
		let currentText = "";
		const intervalId = setInterval(() => {
			// Add the next character to the displayed text
			//console.log(currentText);
			currentText += content[currentText.length];
			setDisplayedText(currentText);

			// If the end of the stream text is reached, clear the interval
			if (currentText.length === content.length) {
				clearInterval(intervalId);
				onClarificationStreamEnd(
					clarifyingQuestion,
					clarifyingAnswers,
					mode,
				);
			}
		}, 18); // Adjust the interval time as needed

		// Clear interval on component unmount
		return () => clearInterval(intervalId);
	}, [content]); // Only rerun if stream changes

	return (
		<div className="flex flex-col items-start">
			<div
				className={`flex flex-col text-lg p-4 bg-response-color text-black rounded-lg shadow`}
			>
				<div className="mb-2">
					<p className="font-semibold">{clarifyingQuestion}</p>
				</div>
				<div>
					<p className="pl-4 text-md text-base">
						Note: {displayedText}
					</p>
				</div>
			</div>
		</div>
	);
};

export const QuestionBlock: React.FC<QuestionBlockProps> = ({ content }) => {
	return (
		<div className="flex flex-col items-end">
			<UserIconLabel />
			<div className="p-2 bg-lightblue rounded-lg shadow">
				<h3 className="text-xl text-black">{content}</h3>
			</div>
		</div>
	);
};

export const WelcomeBlock: React.FC = () => {
	return (
		<div className="p-4 bg-seasaltwhite rounded-md shadow">
			<p className="text-lg md:text-lg lg:text-xl font-semibold">
				Hello, I&apos;m Abe! Welcome to my law library.{" "}
			</p>
			<p className="text-lg md:text-xl lg:text-xl">
				Ask me a legal question, and I can guide you through the
				relevant legislation. To get started, choose a jurisdiction in
				the top right and then enter a question at the bottom!
			</p>
		</div>
	);
};

export const WelcomeVitaliaBlock: React.FC = () => {
	return (
		<div className="p-4 bg-gray-200 rounded-md shadow">
			<p className="text-lg font-semibold">
				Hello! I&apos;m Abe, an AI virtual tourguide who can help answer
				any question you have about Vitalia 2024.
			</p>
			<p className="text-lg">Ask me a question!</p>
		</div>
	);
};

export const AbeIconLabel: React.FC<AbeIconProps> = ({
	showCurrentLoading,
	neverLoad,
}) => {
	const [neverLoadAgain, setNeverLoadAgain] = useState(neverLoad);

	useEffect(() => {
		if (showCurrentLoading === false) {
			setNeverLoadAgain(true);
		}
	}, [showCurrentLoading]);
	//console.log(`showCurrentLoading variable: ${showCurrentLoading}, neverLoadAagain variable: ${neverLoadAgain}`);
	//console.log((!neverLoadAgain && showCurrentLoading));
	return (
		<div className="flex flex-col items-start rounded-lg bg-white">
			<div className="flex mb-0">
				<div className="h-8 w-8 rounded-full flex mr-2">
					{/* Placeholder for icon */}
					<span>
						<Image
							src="/home/ASKABELOGO.png"
							alt="Legal Research Image"
							width={40}
							height={50}
						/>
					</span>
				</div>
				<p className="text-xl font-header">Abe </p>
				{!neverLoadAgain && showCurrentLoading && <Bouncy />}
			</div>
		</div>
	);
};
export const UserIconLabel = () => {
	return (
		<div className="flex items-center justify-end mb-2">
			<p className="text-sm mr-2">You</p>
			<div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
				{/* Placeholder for icon */}
				<span>U</span>
			</div>
		</div>
	);
};

export const Bouncy = () => {
	return (
		<div className="flex justify-left items-left">
			<div className="container items-left justify-left">
				<div className="cube">
					<div className="cube__inner"></div>
				</div>
				<div className="cube">
					<div className="cube__inner"></div>
				</div>
				<div className="cube">
					<div className="cube__inner"></div>
				</div>
			</div>

			<style>
				{`
          .container {
            --uib-size: 20px;
            --uib-color: blue;
            --uib-speed: 1.25s;
            display: flex;
            align-items: flex-start;
            padding-bottom: 0%;
            justify-content: space-evenly;
            width: var(--uib-size);
            height: calc(var(--uib-size) * 0.6);
          }
          
          .cube {
            flex-shrink: 0;
            width: calc(var(--uib-size) * 0.2);
            height: calc(var(--uib-size) * 0.2);
            animation: jump var(--uib-speed) ease-in-out infinite;
            margin: 3px;
          }
          
          .cube__inner {
            display: block;
            height: 100%;
            width: 100%;
            border-radius: 25%;
            background-color: var(--uib-color);
            transform-origin: center bottom;
            animation: morph var(--uib-speed) ease-in-out infinite;
            transition: background-color 0.3s ease;
          }
          
          .cube:nth-child(2) {
            animation-delay: calc(var(--uib-speed) * -0.36);
          
            .cube__inner {
              animation-delay: calc(var(--uib-speed) * -0.36);
            }
          }
          .cube:nth-child(3) {
            animation-delay: calc(var(--uib-speed) * -0.2);
          
            .cube__inner {
              animation-delay: calc(var(--uib-speed) * -0.2);
            }
          }
          
          @keyframes jump {
            0% {
              transform: translateY(0px);
            }
        
            30% {
              transform: translateY(0px);
              animation-timing-function: ease-out;
            }
        
            50% {
              transform: translateY(-200%);
              animation-timing-function: ease-in;
            }
        
            75% {
              transform: translateY(0px);
              animation-timing-function: ease-in;
            }
          }
          
          @keyframes morph {
            0% {
              transform: scaleY(1);
            }
        
            10% {
              transform: scaleY(1);
            }
        
            20%,
            25% {
              transform: scaleY(0.6) scaleX(1.3);
              animation-timing-function: ease-in-out;
            }
        
            30% {
              transform: scaleY(1.15) scaleX(0.9);
              animation-timing-function: ease-in-out;
            }
        
            40% {
              transform: scaleY(1);
            }
        
            70%,
            85%,
            100% {
              transform: scaleY(1);
            }
        
            75% {
              transform: scaleY(0.8) scaleX(1.2);
            }
          }
        `}
			</style>
		</div>
	);
};
