import React, { useState } from 'react';

const DisclaimerModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true); // Modal is open by default

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="relative p-4 w-full max-w-2xl">
                
                    <div className="relative bg-[#FEFDF9] rounded-lg shadow dark:bg-gray-700">
                    <h1 className="text-2xl font-bold font-raleway py-5 px-5 items-center leading-normal text-neutral-800 dark:text-neutral-200">
                    Educational Purpose Disclaimer
              </h1>
              <h2 className="text-xl px-5 py-1 pb-2 items-center leading-normal font-raleway text-neutral-800 dark:text-neutral-200">
                    I acknowledge that the information provided here is for educational purposes only and is not intended as actual legal advice.
                        I understand that this service does not replace professional legal consultation and that any reliance on the material presented is strictly at my own risk.
                        </h2>
                        {/* Accept Button */}
                        <div className="flex justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button 
                                onClick={handleClose}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                I accept
                            </button>
                            {/* ... other buttons if necessary */}
                        </div>
                    </div>
                </div>
            </div>
            
    )
    );
};

export default DisclaimerModal;
