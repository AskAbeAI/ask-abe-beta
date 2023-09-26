import { APIKeyInput } from '../components/APIKeyInput';
import { CodeBlock } from '../components/CodeBlock';
import { DatasetSelect } from '../components/DatasetSelect';
import { TextBlock } from '../components/TextBlock';
import { Dataset, AnswerBody } from '../types/types';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import type { NextRequest } from 'next/server'
import { QuestionInput } from '../components/QuestionInput'

export default function Home() {

  // const [inputLanguage, setInputLanguage] = useState<string>('JavaScript');
  // const [outputLanguage, setOutputLanguage] = useState<string>('Python');
  const [question, setQuestion] = useState<string>('');
  const [finalAnswer, setFinalAnswer] = useState<string>('');
  const [citations, setCitations] = useState<string>('');
  // 'California Code' | 'Federal Regulation' | 'MICA Regulations'
  const [dataset, setDataset] = useState<Dataset>('California Code');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  const handleQuestion = async () => {
    const maxQuestionLength = 100

    if (!apiKey) {
      alert('Please enter an API key.');
      return;
    }
    if (question.length > maxQuestionLength) {
      alert(
        `Please enter code less than ${maxQuestionLength} characters. You are currently at ${question.length} characters.`,
      );
      return;
    }

    setLoading(true);
    setCitations('');
    setFinalAnswer('');

    const controller = new AbortController();

    const body: AnswerBody = {
      question,
      dataset,
      apiKey,
    };

    // CALL CREATE ABE HERE
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    // RECEIVE RESPONSE HERE
    if (!response.ok) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let answer = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      answer += chunkValue;
      
      
      setFinalAnswer((prevCode) => prevCode + chunkValue);
    }
    setCitations(finalAnswer)
    setLoading(false);
    setHasAnswered(true);
    copyToClipboard(finalAnswer);
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
        <title>Ask Abe</title>
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
          <div className="h-100 flex flex-col justify-center space-y-2 sm:w-2/4">
            <div className="text-center text-xl font-bold">Abe's Answer</div>
            <TextBlock
              text={finalAnswer}
              editable={!loading}
              onChange={(value) => {
                setFinalAnswer(value);
                setHasAnswered(false);
              }}
            />
            </div>
          <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
            <div className="text-center text-xl font-bold">Legal Citations</div>
            <TextBlock text={citations} />
          </div>
        </div>
      </div>
    </>
  );
}