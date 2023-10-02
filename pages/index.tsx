import { APIKeyInput } from '../components/APIKeyInput';
import { CodeBlock } from '../components/CodeBlock';
import { DatasetSelect } from '../components/DatasetSelect';
import { TextBlock } from '../components/TextBlock';
import { Dataset, AnswerBody, FinalAnswerBody, TemplateBody } from '../types/types';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import type { NextRequest } from 'next/server'
import { QuestionInput } from '../components/QuestionInput'


export default function Home() {

  // const [inputLanguage, setInputLanguage] = useState<string>('JavaScript');
  // const [outputLanguage, setOutputLanguage] = useState<string>('Python');
  const [question, setQuestion] = useState<string>('');
  const [finalAnswer, setFinalAnswer] = useState<string>('');
  // 'California Code' | 'Federal Regulation' | 'MICA Regulations'
  const [dataset, setDataset] = useState<Dataset>('California Code');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  



  const handleQuestion = async () => {
    const maxQuestionLength = 100
    console.log("In handle question!")
    if (!apiKey) {
      alert('Please enter an API key.');
      return;
    }
    if (question.length < 10) {
      alert(
        `Please enter a valid question!`
      );
      return
    }
    if (question.length > maxQuestionLength) {
      alert(
        `Please enter code less than ${maxQuestionLength} characters. You are currently at ${question.length} characters.`,
      );
      return;
    }

    const answerBody: AnswerBody = {
      question,
      dataset,
      apiKey,
    };
    console.log(answerBody)

    // Check if everything okay to intialize abe
    console.log("Validation Stage: fetch /api/askAbeValidate")
    const validateResponse = await fetch('/api/askAbeValidate', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(answerBody),
    });
    const validateData = await validateResponse.json()
    if (validateData.errorMessage) {
      throw new Error(validateData.errorMessage);
    }
    console.log(`Validate Status:${validateResponse.status}, message: ${validateData.statusMessage}`)

    setLoading(true);
    const element = document.getElementById('citationArea');
    if (element) {
      element.innerHTML = '<p>Loading...</p>';
    }
    setFinalAnswer('Loading...');

    // Process question in askAbeProcess.ts
    const processBody: AnswerBody = {
      question,
      dataset,
      apiKey,
    };
    console.log("Processing Stage: fetch /api/askAbeProcess")
    const processResponse = await fetch('/api/askAbeProcess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(processBody),
    });
    const processData = await processResponse.json()
    if (processData.errorMessage) {
      throw new Error(processData.errorMessage);
    }
    console.log(`Process Status:${processResponse.status}, message: ${processData.statusMessage}`)

    const partialAnswers = processData.partialAnswers;
    const citationList = processData.citationList;
    // Create ideal answer template from partial answers
    const templateBody: TemplateBody = {
      userQuery: question,
      openAiKey: apiKey,
      partialAnswers: partialAnswers
    }
    console.log("Templating Stage: fetch /api/askAbeTemplate")
    const templateResponse = await fetch('/api/askAbeTemplate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateBody)
    })
    const templateData = await templateResponse.json();
    if (templateData.errorMessage) {
      throw new Error(templateData.errorMessage)
    }
    console.log(`Template Status:${templateResponse.status}, message: ${templateData.statusMessage}`)
    const summaryTemplate = templateData.summaryTemplate;
    // Populate answer template and return final answer
    const finalAnswerBody: FinalAnswerBody = {
      userQuery: question,
      openAiKey: apiKey,
      summaryTemplate,
      partialAnswers

    }
    console.log("Answering Stage: fetch /api/askAbeAnswer")
    const answerResponse = await fetch('/api/askAbeAnswer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalAnswerBody),
    });
    const answerData = await answerResponse.json()
    if (answerData.errorMessage) {
      throw new Error(answerData.errorMessage);
    }
    console.log(`Answer Status:${answerResponse.status}, message: ${answerData.statusMessage}`)
    const finalAnswer = answerData.finalAnswer;

    // Update citations and set all fields :)
    const citations = findSectionsCited(citationList, finalAnswer)
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
          <QuestionInput question ={question} onChange={handleQuestionChange} />
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
                setHasAnswered(true);
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