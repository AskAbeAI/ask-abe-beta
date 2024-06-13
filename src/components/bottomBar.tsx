// BottomBar.tsx

import React, { use, useState, useEffect } from 'react';
import ChatOptionToggle from './ui/chatOptionToggle';

interface BottomBarProps {
  inputMode: string;
  handleSubmit: (question: string) => void;
  handleSubmitFollowup: (question: string) => void;

}

const BottomBar: React.FC<BottomBarProps> = ({
  inputMode,
  handleSubmit,
  handleSubmitFollowup,

}) => {
  const [question, setQuestion] = useState('');
  const [inputLength, setInputLength] = useState(0);
  const maxLimit = 300;
  const [showWarning, setShowWarning] = useState(true);
  const [inputMessage, setInputMessage] = useState('Ask a legal question');

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputMode === 'followup');
    if (inputMode === 'followup') {

      handleSubmitFollowup(question);
    } else {
      handleSubmit(question);
    }

  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const length = value.length;
    if (length <= maxLimit) {
      setQuestion(value);
      setInputLength(length);

      // Logic to resize the textarea
      const textarea = e.target;
      textarea.style.height = 'auto'; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleFormSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };



  useEffect(() => {
    if (inputMode === 'followup') {
      setInputMessage('Ask a follow-up question');
    } else if (inputMode === 'vitalia') {
      setInputMessage('Ask a question');
    }
  }, [inputMode]);

  return (
    <div className="inset-x-0 bottom-0">
      <div className="container resize-y mx-auto p-4 flex justify-center items-center">

        {/* Form and input group with transparent background */}
        <form className="flex flex-grow justify-center items-center relative w-full max-w-5xl" onSubmit={handleFormSubmit}>
          <textarea
            value={question}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={inputMessage}
            maxLength={maxLimit}
            className="w-full h-auto pl-4 pr-24 py-2 whitespace-normal font-montserrat rounded border-2 border-olivebrown focus:outline-none bg-white"
            rows={1}
            style={{ overflowY: 'hidden' }}
          ></textarea>

          <button
            type="submit"
            className="absolute right-0 bg-olivebrown text-white rounded px-6 py-2 font-montserrat text-xl"
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


