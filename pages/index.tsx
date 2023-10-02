import { APIKeyInput } from '../components/APIKeyInput';
import { CodeBlock } from '../components/CodeBlock';
import { DatasetSelect } from '../components/DatasetSelect';
import { TextBlock } from '../components/TextBlock';
import { Dataset, ProcessBody, FinalAnswerBody, AnswerTemplateBody, SearchBody, PartialAnswerBody } from '../types/types';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import type { NextRequest } from 'next/server';
import { QuestionInput } from '../components/QuestionInput';


export default function Home() {
	const [question, setQuestion] = useState<string>('');
	const [finalAnswer, setFinalAnswer] = useState<string>('');
	const [dataset, setDataset] = useState<Dataset>('California Code');
	const [loading, setLoading] = useState<boolean>(false);
	const [hasAnswered, setHasAnswered] = useState<boolean>(false);
	const [apiKey, setApiKey] = useState<string>('');

	const handleQuestion = async () => {
		const maxQuestionLength = 100;
		console.log("In handle question!");
		if (!apiKey) {
			alert('Please enter an API key.');
			return;
		}
		if (question.length < 10) {
			alert(
				`Please enter a valid question!`
			);
			return;
		}
		if (question.length > maxQuestionLength) {
			alert(
				`Please enter code less than ${maxQuestionLength} characters. You are currently at ${question.length} characters.`,
			);
			return;
		}

		// Enter Validation stage: make sure question, dataset, openAIKey are all valid
		const validateBody: ProcessBody = {
			question,
			dataset,
			apiKey,
		};
		console.log("Validation Stage: fetch /api/askAbeValidate");
		const validateResponse = await fetch('/api/askAbeValidate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(validateBody),
		});
		const validateData = await validateResponse.json();
		if (validateData.errorMessage) {
			throw new Error(validateData.errorMessage);
		}
		console.log(`Validate Status:${validateResponse.status}, message: ${validateData.statusMessage}`);
		// Exit Validate Stage

		setLoading(true);
		const element = document.getElementById('citationArea');
		if (element) {
			element.innerHTML = '<p>Loading...</p>';
		}
		let debugLog = "==============================================\n========= Answer Progress - Debugging Log :) ==========\n========== -Full answers can take up to 120s ===========\n==============================================\n\n"
		setFinalAnswer(debugLog);
		debugLog += "Initializing instance of Abe...\n";
		debugLog += "Starting user query processing stage...\n";
		debugLog += " - Generating user query expansion with GPT-4\n";
		debugLog += " - Generating similar queries for similarity search with GPT-3.5-turbo\n";
		setFinalAnswer(debugLog);

		
		// Start Processing Stage: Expand user query and generate similar queries
		let start = performance.now()
		const processBody: ProcessBody = {
			question,
			dataset,
			apiKey,
		};
		console.log("Processing Stage: fetch /api/askAbeProcess");
		const processResponse = await fetch('/api/askAbeProcess', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(processBody),
		});
		const processData = await processResponse.json();
		if (processData.errorMessage) {
			throw new Error(processData.errorMessage);
		}
		console.log(`Process Status:${processResponse.status}, message: ${processData.statusMessage}`);
		let end = performance.now();
		let elapsedTime = (end - start) / 1000;
		debugLog += ` - Time spent in processing stage: ${elapsedTime.toFixed(2)} seconds\n`;
		// Exit Processing Stage

		const templateQuestionList = processData.questionList;
		const similarQueries = processData.similarQueries;
		const templateQuestion = templateQuestionList[2];
		
		debugLog += "Starting embedding similarity search phase...\n";
		debugLog += " - Embedding of expanded similar queries created before search\n"
		debugLog += " - Conducting embedding similarity search on entire CA Legal Code\n";
		setFinalAnswer(debugLog)

		// Start Searching Stage: Conduct embedding similarity search for similar queries
		start = performance.now()
		const searchBody: SearchBody = {
			similarQuery: similarQueries,
			openAiKey: apiKey
		};
		console.log("Searching Stage: fetch /api/askAbeSearch");
		const searchResponse = await fetch('/api/askAbeSearch', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(searchBody),
		});
		const searchData = await searchResponse.json();
		if (searchData.errorMessage) {
			throw new Error(searchData.errorMessage);
		}
		console.log(`Search Status:${searchResponse.status}, message: ${searchData.statusMessage}`);
		end = performance.now();
		elapsedTime = (end - start) / 1000;
		// Exit Searching Stage
		const legalText = searchData.legalText;
		const citationList = searchData.citationList;

		debugLog += " - Retrieved source text for 40 most similar sections\n";
		debugLog += " - Tracking well formatted section citations and source links\n";
		debugLog += ` - Time spent in searching stage: ${elapsedTime.toFixed(2)} seconds\n`;
		debugLog += "Starting partial answering stage...\n";
		debugLog += " - Partially answering user query for all 40 sections, concurrently\n"
		setFinalAnswer(debugLog)

		// Start Partial Answer Stage: For each section of legal text, create a partial answer
		start = performance.now()
		const partialAnswerBody: PartialAnswerBody = {
			legalText: legalText,
  			openAiKey: apiKey,
  			templateQuestion: templateQuestion
		};
		console.log("Partial Answering Stage: fetch /api/askAbePartialAnswer");
		const partialAnswerResponse = await fetch('/api/askAbePartialAnswer', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(partialAnswerBody),
		});
		const partialAnswerData = await partialAnswerResponse.json();
		if (partialAnswerData.errorMessage) {
			throw new Error(partialAnswerData.errorMessage);
		}
		console.log(`Partial Answer Status:${partialAnswerResponse.status}, message: ${partialAnswerData.statusMessage}`);
		end = performance.now();
		elapsedTime = (end - start) / 1000;
		// Exit Partial Answer Stage

		const partialAnswers = partialAnswerData.partialAnswers;
		debugLog += ` - Time spent in partial answering stage: ${elapsedTime.toFixed(2)} seconds\n`;
		debugLog += "Starting answer template stage..."
		debugLog += " - Creating structured answer template from partial answers using GPT 4\n"
		
		setFinalAnswer(debugLog)

		// Enter Answer Template Stage: Create ideal answer template from partial answers of legal text
		start = performance.now()
		const answerTemplateBody: AnswerTemplateBody = {
			userQuery: question,
			openAiKey: apiKey,
			partialAnswers: partialAnswers
		};
		console.log("Templating Stage: fetch /api/askAbeAnswerTemplate");
		const answerTemplateResponse = await fetch('/api/askAbeAnswerTemplate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(answerTemplateBody)
		});
		const answerTemplateData = await answerTemplateResponse.json();
		if (answerTemplateData.errorMessage) {
			throw new Error(answerTemplateData.errorMessage);
		}
		console.log(`Template Status:${answerTemplateResponse.status}, message: ${answerTemplateData.statusMessage}`);
		end = performance.now();
		elapsedTime = (end - start) / 1000;
		// Exit Answer Template Stage

		const summaryTemplate = answerTemplateData.summaryTemplate;
		debugLog += ` - Time spent in answer template stage: ${elapsedTime.toFixed(2)} seconds\n`;
		debugLog += "Starting final answering stage (ALMOST DONE!)..."
		debugLog += " - Filling in answer template with exact source text and citations with GPT 3.5\n"
		debugLog += " - Formatting final answer and citations\n"
		setFinalAnswer(debugLog)

		// Enter Answering Stage: Populate answer template and return final answer
		start = performance.now()
		const finalAnswerBody: FinalAnswerBody = {
			userQuery: question,
			openAiKey: apiKey,
			summaryTemplate,
			partialAnswers

		};
		console.log("Answering Stage: fetch /api/askAbeAnswer");
		const answerResponse = await fetch('/api/askAbeAnswer', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(finalAnswerBody),
		});
		const answerData = await answerResponse.json();
		if (answerData.errorMessage) {
			throw new Error(answerData.errorMessage);
		}
		console.log(`Answer Status:${answerResponse.status}, message: ${answerData.statusMessage}`);
		end = performance.now();
		elapsedTime = (end - start) / 1000;
		debugLog += ` - Time spent in final answering stage: ${elapsedTime.toFixed(2)} seconds\n`;
		// Exit Answer Stage
		setFinalAnswer("Loading Final Answer...")
		let finalAnswer = answerData.finalAnswer;
		console.log(debugLog)
		// Update citations and set all fields :)
		const citations = findSectionsCited(citationList, finalAnswer);
		let index = finalAnswer.indexOf("\n");
		finalAnswer = `# Abes Answer For: ${question}\n` + finalAnswer.slice(index+1);
		setFinalAnswer(finalAnswer);
		const citationElement = document.getElementById('citationArea');
		if (citationElement) {
			citationElement.innerHTML = citations;
		}

		setLoading(false);
		setHasAnswered(true);
		copyToClipboard(finalAnswer);
		return;

	};

	function findSectionsCited(citationList: any[], finalAnswer: string) {
		let citedSections = "<h1>Citations with Source Text:</h1>\n";
		for (const tup of citationList) {
			const citation = tup[0];
			if (!finalAnswer.includes(citation)) {
				continue;
			}
			const content = tup[1];
			const link = tup[2];
			const sectionCitation = `<a href="${link}" target="_blank" id="${citation}">${citation}</a>\n<p>${content}</p>\n`;
			citedSections += sectionCitation;
		}
		return citedSections;
	}

	function linkAnswerToCitations(citationList: any[], finalAnswer: string) {

		for (const tup of citationList) {
			const citation = tup[0];
			if (!finalAnswer.includes(citation)) {
				continue;
			}

			const newCitation = `<a href="#${citation}">${citation}</a>`;
			finalAnswer = finalAnswer.replace(citation, newCitation);
		}

		return finalAnswer;
	}
	const copyToClipboard = (text: string) => {
		const el = document.createElement('textarea');
		el.value = text;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	};

	const handleApiKeyChange = (value: string) => {
		setApiKey(value);

		localStorage.setItem('apiKey', value);
	};

	const handleQuestionChange = (value: string) => {
		setQuestion(value);
	};

	useEffect(() => {
		if (hasAnswered) {
			handleQuestion();
		}
	}, [question]);

	useEffect(() => {
		const openAiKey = localStorage.getItem('openAiKey');

		if (openAiKey) {
			setApiKey(openAiKey);
		}
	}, []);

	return (
		<>
			<Head>
				<title>Ask Abe Beta</title>
				<meta
					name="description"
					content="Ask Abe a legal question and receive an answer with citations"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />

			</Head>

			<div className="flex h-full min-h-screen flex-col items-center bg-[#0E1117] px-4 pb-20 text-neutral-200 sm:px-10">
				<div className="mt-10 flex flex-col items-center justify-center sm:mt-20">
					<div className="text-4xl font-bold">Legal Question Answering</div>
				</div>

				<div className="mt-6 text-center text-sm">
					<APIKeyInput apiKey={apiKey} onChange={handleApiKeyChange} />
				</div>
				<div className="mt-6 text-center text-sm">
					<QuestionInput question={question} onChange={handleQuestionChange} />
				</div>

				<div className="mt-2 flex items-center space-x-2">
					<DatasetSelect dataset={dataset} onChange={(value) => setDataset(value)} />

					<button
						id="answerButton"
						className="w-[140px] cursor-pointer rounded-md bg-violet-500 px-4 py-2 font-bold hover:bg-violet-600 active:bg-violet-700"
						onClick={() => handleQuestion()}
						disabled={loading}
					>
						{loading ? "Answering..." : "Answer"}
					</button>
				</div>

				<div className="mt-2 text-center text-xs">
					{loading
						? 'Answering...'
						: hasAnswered
							? 'Output copied to clipboard!'
							: 'Enter a legal question and click "Answer"'}
				</div>

				<div className="mt-6 flex w-full max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
					<div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
						<div className="text-center text-xl font-bold">Abes Answer</div>
						<TextBlock
							text={finalAnswer}
							editable={false}
							onChange={(value) => {
								setFinalAnswer(value);
	
							}}
						/>
					</div>
					<div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
						<div className="text-center text-xl font-bold">Legal Citations</div>
						<section id="citationArea" className="citation-block"></section>
					</div>
				</div>
			</div>
		</>
	);
}