import { APIKeyInput } from '../components/APIKeyInput';
import { DatasetSelect } from '../components/DatasetSelect';
import { TextBlock } from '../components/TextBlock';
import { Dataset, ProcessBody, FinalAnswerBody, AnswerTemplateBody, SearchBody, PartialAnswerBody } from '../types/types';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { QuestionInput } from '../components/QuestionInput';
import {CustomFooter } from '../components/CustomFooter';
import Image from 'next/image';
import { createClient } from "@supabase/supabase-js";




interface CitationBlock {
	citation: string;
	source: string;
	sectionContent: string;
	answerCitation: string;
}


export default function Home() {
	
	const [question, setQuestion] = useState<string>('');
	const [finalAnswer, setFinalAnswer] = useState<string>('');
	const [dataset, setDataset] = useState<Dataset>('California Code');
	const [loading, setLoading] = useState<boolean>(false);
	const [hasAnswered, setHasAnswered] = useState<boolean>(false);
	const [apiKey, setApiKey] = useState<string>('');
	
	
	
	const handleQuestion = async () => {
		//require('dotenv').config()
		
		console.log(dataset)
		
		try {
			const maxQuestionLength = 300;
			console.log("In handle question!");
			if (!apiKey) {
				alert('Please enter an API key.');
				return;
			}
			if (question.length < 10) {
				alert(
					`Please enter a longer question!`
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
			console.log(`Initial user query: ${question}`)
			const validateBody: ProcessBody = {
				question,
				dataset,
				apiKey			
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
			const progressContainer = document.getElementById('progressContainer');
			if (progressContainer) {
				const progressBarHTML = `<div class="mb-8 absolute h-6 w-full max-w-[1200px] rounded-full bg-white border-2 border-white">
				<div 
					id="progressDiv" 
					class="striped-gradient absolute top-0 left-0 h-full rounded-full transition-all duration-2000"
					style="width: 0%;"
				>
				</div>
				<span id="progressLabel" class="absolute inset-0 flex items-center justify-center text-lg font-medium text-white">
					0%
				</span>
			</div>`;
				progressContainer.innerHTML = progressBarHTML;
			}
			const progressDiv = document.getElementById('progressDiv');
			const progressText = document.getElementById('progressLabel');
			if (progressDiv && progressText) {
				progressDiv.style.width = `0%`;
				progressText.innerText = `0%`;
			}



			let debugLog = "==============================================\n========= Answer Progress - Debugging Log :) ==========\n========== -Full answers can take up to 180s ===========\n========== Temporary Logs - Beta only ===========\n==============================================\n\n";
			debugLog += "Initializing instance of Abe...\n";
			debugLog += ` - Scope of search: ${dataset}\n`;
			debugLog += "Starting user query processing stage...\n";
			debugLog += " - Generating user query expansion with GPT-4\n";
			debugLog += " - Generating similar queries for similarity search with GPT-3.5-turbo\n";
			setFinalAnswer(debugLog);
			if (progressDiv && progressText) {
				progressDiv.style.width = `15%`;
				progressText.innerText = `15%`;
			}


			// Start Processing Stage: Expand user query and generate similar queries
			let start = performance.now();
			let totalStart = performance.now();
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
			debugLog += " - Embedding of expanded similar queries created before search\n";
			debugLog += " - Conducting embedding similarity search on entire CA Legal Code\n";
			setFinalAnswer(debugLog);
			if (progressDiv && progressText) {
				progressDiv.style.width = `25%`;
				progressText.innerText = `25%`;
			}

			// Start Searching Stage: Conduct embedding similarity search for similar queries
			start = performance.now();
			const searchBody: SearchBody = {
				similarQuery: similarQueries,
				openAiKey: apiKey,
				jurisdiction: dataset,
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
			const citationExample = citationList[0][0];
			console.log(`Example Citation: ${citationExample}`)

			debugLog += " - Retrieved source text for 40 most similar sections\n";
			debugLog += " - Tracking well formatted section citations and source links\n";
			debugLog += ` - Time spent in searching stage: ${elapsedTime.toFixed(2)} seconds\n`;
			debugLog += "Starting partial answering stage...\n";
			debugLog += " - Partially answering user query for all 40 sections, concurrently\n";
			setFinalAnswer(debugLog);
			if (progressDiv && progressText) {
				progressDiv.style.width = `50%`;
				progressText.innerText = `50%`;
			}

			// Start Partial Answer Stage: For each section of legal text, create a partial answer
			start = performance.now();
			const partialAnswerBody: PartialAnswerBody = {
				legalText: legalText,
				openAiKey: apiKey,
				templateQuestion: templateQuestion,
				citationExample: citationExample
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
			console.log(partialAnswers)
			debugLog += ` - Time spent in partial answering stage: ${elapsedTime.toFixed(2)} seconds\n`;
			debugLog += "Starting answer template stage...\n";
			debugLog += " - Creating structured answer template from partial answers using GPT 4\n";

			setFinalAnswer(debugLog);
			if (progressDiv && progressText) {
				progressDiv.style.width = `65%`;
				progressText.innerText = `65%`;
			}

			// Enter Answer Template Stage: Create ideal answer template from partial answers of legal text
			start = performance.now();
			const answerTemplateBody: AnswerTemplateBody = {
				userQuery: question,
				openAiKey: apiKey,
				partialAnswers: partialAnswers,
				exampleCitation: citationExample
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
			console.log(summaryTemplate)
			//console.log(`Summary template: ${summaryTemplate}`);
			debugLog += ` - Time spent in answer template stage: ${elapsedTime.toFixed(2)} seconds\n`;
			debugLog += "Starting final answering stage (ALMOST DONE!)...\n";
			debugLog += " - Filling in answer template with exact source text and citations with GPT 3.5\n";
			debugLog += " - Formatting final answer and citations\n";
			setFinalAnswer(debugLog);
			if (progressDiv && progressText) {
				progressDiv.style.width = `85%`;
				progressText.innerText = `85%`;
			}

			// Enter Answering Stage: Populate answer template and return final answer
			start = performance.now();
			const finalAnswerBody: FinalAnswerBody = {
				userQuery: question,
				openAiKey: apiKey,
				summaryTemplate,
				partialAnswers,
				exampleCitation: citationExample

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
			setFinalAnswer("Loading Final Answer...");
			if (progressDiv && progressText) {
				progressDiv.style.width = `100%`;
				progressText.innerText = `100%`;
			}
			
			
			// Update citations and set all fields :)
			let { citations, finalAnswerFormatted } = findSectionsCited(citationList, answerData.finalAnswer);
			console.log(citations.length)
			//console.log(finalAnswerFormatted);
			let index = finalAnswerFormatted.indexOf("\n");
			
			finalAnswerFormatted = `# Abes Answer For: ${question}\n` + finalAnswerFormatted.slice(index + 1);
			setFinalAnswer(finalAnswerFormatted);
			console.log(finalAnswerFormatted)

			const citationElement = document.getElementById('citationArea');
			if (citationElement) {
				citationElement.innerHTML = "";
			}
			
			citations.forEach(({ citation, source, sectionContent, answerCitation }) => {
				const sectionCitation = `<details id="${citation}" style="white-space: pre-wrap;"><summary><strong>${citation}</strong></summary>Official Government Source:${source}\n${sectionContent}</details>`;
				if (!citationElement) {
					throw new Error("Couldn't find citation element!")
				}
				console.log(`Adding citation to citationArea: ${citation}`)
				citationElement.innerHTML += sectionCitation;
				//console.log(citationElement.innerHTML)
				

			});
			

			let totalEnd = performance.now();
			let totalElapsedTime = (totalEnd - totalStart) / 1000;
			insertData({user_query: question, final_answer: finalAnswer, dataset: dataset, did_finish: true, similar_queries: similarQueries, partial_answers: partialAnswers, summary_template: summaryTemplate, runTime: totalElapsedTime})
			
			console.log(`Total Time Elapsed: ${totalElapsedTime}`)
			//console.log(`Full debug log: ${debugLog}`)
			setLoading(false);
			setHasAnswered(false);
			copyToClipboard(finalAnswer);
			if (progressContainer) {
				progressContainer.innerHTML = ``;
			}
			return;
		} catch(error) {

			insertData({user_query: question, final_answer: finalAnswer, dataset: dataset})
			
			console.log(`A critical error occured! My bad G. Error: ${error}`)
			alert(`A critical error occured! My bad G. Error: ${error}`);
			const progressDiv = document.getElementById('progressDiv');
			const progressText = document.getElementById('progressLabel');
			if (progressDiv && progressText) {
				progressDiv.style.width = `0%`;
				progressText.innerText = `0%`;
			}

			setHasAnswered(false);
			setFinalAnswer('');
			const citationElement = document.getElementById('citationArea');
			if (citationElement) {
				citationElement.innerHTML = "";
			}
			setLoading(false)
			return;
		}
	};
	
	

	function findSectionsCited(citationList: any[], finalAnswerFormatted: string) {
		let citedSections: CitationBlock[] = [];
		for (const tup of citationList) {
			let citation = tup[0].replace(/</g, "");
			citation = citation.replace(/>/g, "");
			const answerCitation = `<a href="#${citation}"style=" color: rgb(0, 204, 255);text-decoration: underline;">[${citation}]</a>`;
			finalAnswerFormatted = replaceAllOccurrences(finalAnswerFormatted, citation, answerCitation);
			if (!finalAnswerFormatted.includes(citation)) {
				continue;
			}
			const content = tup[1];
			const link = tup[2];
			const sourceLink = `<a href="${link}"target="_blank"style=" color: rgb(0, 204, 255);text-decoration: underline;">[${citation}]</a>`;
			citedSections.push({ citation: citation, source: sourceLink, sectionContent: content, answerCitation: answerCitation});
		}
		return { citations: citedSections, finalAnswerFormatted: finalAnswerFormatted };
	}

	function replaceAllOccurrences(inputStr: string, search: string, replacement: string): string {
		// Escape any special characters in the search string
		let safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		
		// Create a regex with the global flag to replace all occurrences
		let regex = new RegExp(safeSearch, 'g');
	
		return inputStr.replace(regex, replacement);
	}

	interface Data {
		user_query?: string;
		dataset?: string;
		runTime?: number;
		did_finish?: boolean;
		similar_queries?: string;
		raw_legal_text?: string;
		partial_answers?: string;
		summary_template?: string;
		final_answer?: string;
	}
	const insertData = async (data: Data) => {
		// Define defaults and overwrite them with provided data
		const supabase = createClient('https://jwscgsmkadanioyopaef.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3c2Nnc21rYWRhbmlveW9wYWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzE1MTgsImV4cCI6MjAxMTI0NzUxOH0.1QwW9IV1TrMT72xyq2LQcmDr92tmLOEQg07mOPRLDO0');

		const defaults: Data = {
			user_query: 'NULL',
			dataset: 'NULL',
			runTime: -1,
			did_finish: false,
			similar_queries: 'NULL',
			raw_legal_text: 'NULL',
			partial_answers: 'NULL',
			summary_template: 'NULL',
			final_answer: 'NULL',
		};
	
		const rowData = { ...defaults, ...data };
	
		const { error } = await supabase
			.from('betaLogs')
			.insert([rowData]);
	
		if (error) {
			console.error('Error inserting data: ', error);
			throw error;  // propagate the error to the caller function
		}
	
		console.log('Data inserted successfully!');
	};


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
					<div className="text-4xl font-bold">Trustworthy Legal Question Answering</div>
					<div className="imageContainer">
						<Image
							src="/abeLogo.png"
							alt="Ask Abe Banner"
							width={746}  // Original width
							height={224}  // Original height
						/>
					</div>
				</div>

				<div className="mt-6 text-center text-sm">
					<APIKeyInput apiKey={apiKey} onChange={handleApiKeyChange} />
				</div>
				<div className="mt-6 text-center text-sm">
					<details>
						<summary>How to Use Ask Abe</summary>
						<a href="#how-to"className="underline text-blue-500 hover:text-blue-700">Instructions</a><br/>
						<a href="#question-optimization"className="underline text-blue-500 hover:text-blue-700">Question Optimization</a><br/>
						<a href="#security"className="underline text-blue-500 hover:text-blue-700">Security Policy</a><br/>
					</details>
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

				<div className="mb-8 mt-2 text-center text-m">
					{loading
						? 'Answering...'
						: hasAnswered
							? 'Output copied to clipboard!'
							: 'Enter a legal question and click "Answer"'}
				</div>
				<div id="progressContainer"className="mb-8 relative h-6 w-full max-w-[1200px]"></div>
					


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




				<CustomFooter/>
			</div>
		</>
	);
}