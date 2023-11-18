// BottomBar.tsx

import React, { use, useState, useEffect } from 'react';
import ChatOptionToggle from './ui/chatOptionToggle';

interface BottomBarProps {
  inputMode: string;
  handleSubmit: (question: string) => void;
  handleSubmitFollowup: (question: string) => void;
  skipClarifications: boolean;
  setSkipClarifications: (skip: boolean) => void;
  generateSuggestions: boolean;
  setGenerateSuggestions: (generate: boolean) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  inputMode,
  handleSubmit,
  handleSubmitFollowup,
  skipClarifications,
  setSkipClarifications,
  generateSuggestions,
  setGenerateSuggestions,
}) => {
  const [question, setQuestion] = useState('');
  const [inputLength, setInputLength] = useState(0);
  const maxLimit = 300;
  const [showWarning, setShowWarning] = useState(true);
  const [inputMessage, setInputMessage] = useState('Ask a legal question');

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMode === 'followup') {
      handleSubmitFollowup(question);
    } else {
      handleSubmit(question);
    }

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const length = e.target.value.length;
    if (length <= maxLimit) {
      setQuestion(e.target.value);
      setInputLength(length);
    }
  };

  useEffect(() => {
    if (inputMode === 'followup') {
      setInputMessage('Ask a follow-up question');
    }
  }, [inputMode]);

  return (
    <div className="fixed inset-x-0 bottom-0 shadow-md">
      <div className="container mx-auto p-4 flex justify-center items-center">


        {/* Form and input group with transparent background */}
        <form className="flex justify-center items-center relative w-full max-w-2xl" onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={question}
            onChange={handleChange}
            placeholder={inputMessage}
            maxLength={maxLimit}
            className="w-full pl-4 pr-16 py-2 font-montserrat rounded border-2 border-[#4A4643] focus:outline-none  bg-white"
          />
          <button
            type="submit"
            className="absolute right-0 bg-[#4A4643] text-white rounded px-6 py-2 font-montserrat text-xl"
          >
            Ask
          </button>
        </form>
        {/* Toast notification for character limit */}
        {inputLength > maxLimit * 0.9 && showWarning ? (
          <div id="toast-warning" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
            {/* Toast content */}
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-yellow-500 bg-yellow-100 rounded-lg dark:bg-yellow-800 dark:text-yellow-200">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
              <span className="sr-only">Warning icon</span>
            </div>
            <div className="ml-3 text-sm font-montserrat">You are close to reaching the maximum character limit.</div>
            <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 items-center justify-center dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-warning" aria-label="Close"
              onClick={() => setShowWarning(false)}>
              <span className="sr-only">Close</span>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
            {/* ... */}
          </div>
        ) : null}
      </div>
    </div>


  );
};

export default BottomBar;


{/* <ChatOptionToggle
          optionLabel="Skip Clarifications"
          isToggled={skipClarifications}
          onToggle={setSkipClarifications}
        />
        <ChatOptionToggle
          optionLabel="Generate Suggestions"
          isToggled={generateSuggestions}
          onToggle={setGenerateSuggestions}
        /> */}