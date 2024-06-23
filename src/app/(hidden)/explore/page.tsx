"use client";
// /app/explore/page.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Node, Link, getColor, getRadius, PerformanceNode, getOpacity, dagIgnore } from '@/lib/threejs/types';

import { fetchNodes, fetchPerformanceNodes, fetchCachedNodes, createNodesFromPath } from '@/lib/utils/dynamicGraph';
import dynamic from 'next/dynamic';
import NodeHUD from '@/components/threejs/hud';
import NodeTextHUD, { NodeText } from '@/components/threejs/textHud';
import NodeCountComponent from '@/components/threejs/nodeCounter';
import SpriteText from 'three-spritetext';

import { Button } from '@/components/ui/button';
import BottomBar from "@/components/bottomBar";
import ContentQueue from "@/components/contentQueue";
import {
	DisclaimerModal,
	JurisdictionModal,
} from "@/components/disclaimermodal";
import CitationBar from "@/components/citationBar";
import OptionsList from "@/components/optionsFilter";
import {
	ContentType,
	ContentBlock,
	ContentBlockParams,
	CitationBlockProps,
	Clarification,
	node_as_row,
	ClarificationChoices,
	Option,
	Jurisdiction,
	questionJurisdictions,
	PipelineModel,
	StateJurisdictionOptions,
	FederalJurisdictionOptions,
	MiscJurisdictionOptions,
	AbeMemory,
} from "@/lib/types";
import {
	constructPromptQuery,
	constructPromptQueryMisc,
	constructPromptQueryBoth,
	createNewMemory,
} from "@/lib/utilities";
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
const NoSSRForceGraph3D = dynamic(() => import('@/components/threejs/forceGraph'), {
	ssr: false,
});
// https://github.com/d3/d3-force
// https://github.com/vasturiano/3d-force-graph/tree/master




const GraphPage: React.FC = () => {
	const [performanceNodeData, setPerformanceNodeData] = useState<PerformanceNode[]>([]);
	// Make this a Dictionary/set lmao
	const [linkData, setLinkData] = useState<Link[]>([]);
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);
	const hasFetched = useRef(false);

	useEffect(() => {
		if (!hasFetched.current) {
			hasFetched.current = true;
			const root = "us/federal/ecfr";
			fetchPerformanceNodes(root, 2, performanceNodeData, setPerformanceNodeData, setLinkData, setSelectedNode);
			
			//fetchPerformanceNodes(offsetNode, 4, performanceNodeData, setPerformanceNodeData, setLinkData);

		}

	}, []);

	const handleNodeClick = async (node: PerformanceNode, event: MouseEvent) => {
		if (node.status) { return; }
		setSelectedNode(node);
		// if (performanceNodeData.some(existingNode => existingNode.parent === node.id)) {
		// 	console.log(`Skipping processing click on ${node}`)
		// 	return;
		// }
		await fetchPerformanceNodes(node.id as string, 2, performanceNodeData, setPerformanceNodeData, setLinkData, setSelectedNode);


	};



	const [isFormVisible, setIsFormVisible] = useState(true);
	const [citationsOpen, setCitationsOpen] = useState(false);
	const [streamingQueue, setStreamingQueue] = useState<ContentBlock[]>([]);
	const [showCurrentLoading, setShowCurrentLoading] = useState(false);
	const [activeCitationId, setActiveCitationId] = useState<string>("");
	const [inputMode, setInputMode] = useState<string>("Initial");
	const [abeMemory, setAbeMemory] = useState<AbeMemory>();
	const [primaryRows, setPrimaryRows] = useState<node_as_row[]>([]);
	const [secondaryRows, setSecondaryRows] = useState<node_as_row[]>([]);
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
	const [question, setQuestion] = useState("");
	const [isChatOpen, setIsChatOpen] = useState(true);
	const [isHUDOpen, setIsHUDOpen] = useState(true);

	const [specificQuestions, setSpecificQuestions] = useState<string[]>([]);
	const [clarificationResponses, setClarificationResponses] = useState<Clarification[]>([]);
	const [alreadyAnswered, setAlreadyAnswered] = useState([""]);
	const [sessionId, setSessionId] = useState<string>("");
	const [selectedFederalJurisdiction, setSelectedFederalJurisdiction] = useState<Jurisdiction | undefined>(undefined);
	const [selectedStateJurisdiction, setSelectedStateJurisdiction] = useState<Jurisdiction | undefined>(undefined);
	const [selectedMiscJurisdiction, setSelectedMiscJurisdiction] = useState<Jurisdiction | undefined>(undefined);
	const [questionJurisdictions, setQuestionJurisdictions] = useState<questionJurisdictions>();
	const [askClarifications, setAskClarifications] = useState(false);
	const [showJurisdictionModal, setShowJurisdictionModal] = useState(false);

	useEffect(() => {
		let mode = "state";
		if (selectedFederalJurisdiction && selectedStateJurisdiction) {
			mode = "state_federal";
		} else if (selectedMiscJurisdiction && selectedFederalJurisdiction) {
			mode = "misc_federal";
		} else if (selectedMiscJurisdiction) {
			mode = "misc";
		} else if (selectedFederalJurisdiction) {
			mode = "federal";
		}

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

	function generateSessionID() {
		return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	useEffect(() => {
		const sessionId = generateSessionID();
		setSessionId(sessionId);
	}, []);

	const addContentBlock = async (newBlock: ContentBlock): Promise<string> => {
		setShowCurrentLoading(false);
		setContentBlocks((currentBlocks) => [...currentBlocks, newBlock]);
		return newBlock.blockId;
	};

	const addManyContentBlock = async (
		newBlocks: ContentBlock[]
	): Promise<void> => {
		setStreamingQueue(newBlocks);
		if (newBlocks[0].type === ContentType.Citation) {
			setCitationBlocks((currentBlocks) => [...currentBlocks, ...newBlocks]);
		} else {
			setContentBlocks((currentBlocks) => [...currentBlocks, ...newBlocks]);
		}
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
	};

	const createNewBlock = (params: ContentBlockParams) => {
		const newBlock = {
			blockId: `id_${new Date().getTime()}_${Math.random()
				.toString(36)
				.substr(2, 9)}`,
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

	const onStreamEnd = (concurrentStreaming: boolean) => {
		if (concurrentStreaming) {
			streamingQueue.shift();
		}
	};

	const handleNewQuestion = async (question: string) => {
		if (
			selectedFederalJurisdiction === undefined &&
			selectedStateJurisdiction === undefined &&
			selectedMiscJurisdiction === undefined
		) {
			setShowJurisdictionModal(true);
			return;
		}
		setIsFormVisible(false);
		const questionText = question.trim();
		setQuestion(questionText);
		if (!questionText) return;

		const memory: AbeMemory = createNewMemory(
			question,
			sessionId,
			questionJurisdictions!
		);
		memory.short.specificQuestions = [];

		let newParams: ContentBlockParams = {
			type: ContentType.Question,
			content: questionText,
			fake_stream: false,
			concurrentStreaming: false,
		};
		await addContentBlock(createNewBlock(newParams));

		let score = 7;
		let message_to_user = "";
		if (selectedMiscJurisdiction === undefined && askClarifications) {
			[score, message_to_user] = await scoreQuestion(memory);
		}

		if (!askClarifications || selectedMiscJurisdiction !== undefined) {
			similaritySearch(memory);
		} else if (score <= 1) {
			setIsFormVisible(true);
			return;
		}
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

	const similaritySearch = async (memory: AbeMemory) => {
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
		const pimaryRows: node_as_row[] = result.primaryRows;
		const secondaryRows: node_as_row[] = result.secondaryRows;
		setPrimaryRows(pimaryRows);
		setSecondaryRows(secondaryRows);

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
		const primary_citation_blocks: ContentBlock[] = [];
		for (const row of pimaryRows) {
			let possible_citation = row.node_citation;
			if (possible_citation === undefined || possible_citation === null) {
				possible_citation = row.node_name;
			}
			if (possible_citation === undefined || possible_citation === null) {
				possible_citation = row.node_id.split("/").pop()!;
			}

			const section_text: string[] = row.node_text;
			const citation: string = possible_citation;
			const link: string = row.node_link;

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
		const direct_answer: string = result.directAnswer;
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
			if (option.name === "Skip Clarifying Questions") {
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
		setIsFormVisible(false);
		const questionText = question.trim();
		const [score, message_to_user] =
			await scoreNewFollowupQuestion(questionText);
		if (score < 2) {
			const newParams: ContentBlockParams = {
				type: ContentType.Answer,
				content: message_to_user,
				fake_stream: true,
				concurrentStreaming: false,
			};
			await addContentBlock(createNewBlock(newParams));
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

		let newParams: ContentBlockParams = {
			type: ContentType.Question,
			content: questionText,
			fake_stream: false,
			concurrentStreaming: false,
		};
		await addContentBlock(createNewBlock(newParams));

		if (!askClarifications || selectedMiscJurisdiction !== undefined) {
			followUpQuestionAnswer(clarificationResponses, questionText);
		}
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
		<div className="h-full w-full">
			{/* This is the full page force graph. All following components must be styled with respect to this full page. https://github.com/vasturiano/react-force-graph */}
			<NoSSRForceGraph3D
				graphData={{ nodes: performanceNodeData, links: linkData }}
				nodeRelSize={4}
				nodeLabel="node_name"
				nodeOpacity={0.8}
				nodeColor={getColor}
				onNodeClick={handleNodeClick}
				nodeResolution={10}
				linkColor="color"
				linkDirectionalParticles={2}
				linkDirectionalParticleSpeed={0.001}
				linkWidth="width"
				linkDirectionalParticleColor={getColor}
				showNavInfo={true}
				controlType='orbit'
			/>
			{/* Chat Window Button */}


			{/* Chat Window */}
			<div className={`fixed right-0 top-0 h-full shadow-lg z-20 transform transition-transform duration-300 ease-in-out ${isChatOpen ? 'w-1/4' : 'w-0'}`}>
				{isChatOpen && (
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
				)}
				<div className="fixed right-0 top-0 mb-4 mr-4 z-10 flex items-center justify-center">
					<Button
						className="bg-accent text-accent-foreground p-4 rounded-l-lg shadow-md focus:outline-none z-40"
						onClick={() => setIsChatOpen(!isChatOpen)}
					>
						{isChatOpen ? 'Close Chat' : 'Open Chat'}
					</Button>
				</div>
			</div>



			{/* Node HUD */}
			<div className={`fixed left-0 top-0 h-full shadow-lg z-20 transform transition-transform duration-300 ease-in-out ${isHUDOpen ? 'w-1/5' : 'w-0'}`}>
				{isHUDOpen && (<NodeHUD
					node={selectedNode}
				/>
				)}
				{/* Node HUD Button */}
				<div className="fixed left-0 top-0 h-full z-10 flex items-center justify-center">
					<Button
						className="bg-accent text-accent-foreground p-4 rounded-r-lg shadow-md focus:outline-none z-40"
						onClick={() => setIsHUDOpen(!isHUDOpen)}
					>
						{isHUDOpen ? 'Close HUD' : 'Open HUD'}
					</Button>
				</div>
			</div>

			{/* This is the 'text input' bar for a user to ask a question. This needs to be fixed to the bottom. */}
			{isFormVisible && (
				<div className="fixed bottom-0 left-0 w-full p-4 shadow-inner z-20">
					<BottomBar
						inputMode={inputMode}
						handleSubmit={handleNewQuestion}
						handleSubmitFollowup={handleNewFollowupQuestion}
					/>
				</div>
			)}

			{/* This is a small label which labels the number of nodes. Needs to be styled */}
			<div className="fixed bottom-0 left-0 m-4 bg-background p-2 shadow-md z-30">
				<NodeCountComponent nodes={performanceNodeData} />
			</div>
		</div>
	);

};

export default GraphPage;
