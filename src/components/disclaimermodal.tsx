import { JurisdictionModalProps } from '@/lib/types';
import React, { useState } from 'react';

export const DisclaimerModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true); // Modal is open by default

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center rounded">
                <div className="relative p-4 w-full rounded-lg max-w-2xl">

                    <div className="relative bg-[#FEFDF9] rounded-lg shadow dark:bg-gray-700">
                        <h1 className="text-2xl font-bold font-raleway pt-5 pb-3 px-5 items-center leading-normal text-neutral-800 dark:text-neutral-200">
                            Educational Purpose Disclaimer
                        </h1>
                        <h2 className="text-xl px-5 py-1 pb-4 items-center leading-normal font-raleway text-neutral-800 dark:text-neutral-200">
                            By clicking I accept, I acknowledge that the information provided by Ask Abe AI is for educational purposes only and is not intended as actual legal advice.
                            I understand that this service does not replace professional legal consultation and that any reliance on the material presented is strictly for educational purposes only and at my own risk.
                        </h2>
                        {/* Accept Button */}
                        <div className="flex justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button
                                onClick={handleClose}
                                className="text-white font-raleway bg-[#4A4643] hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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

export const JurisdictionModal: React.FC<JurisdictionModalProps> = ({
    shown,
    setShown
}) => {
    
    return (
        shown && (
            <div className="fixed inset-0 z-50 flex items-center justify-center rounded">
                <div className="relative p-4 w-full rounded-lg max-w-2xl">

                    <div className="relative bg-[#FEFDF9] rounded-lg shadow dark:bg-gray-700">
                        <h1 className="text-2xl font-bold font-raleway pt-5 pb-3 px-5 items-center leading-normal text-neutral-800 dark:text-neutral-200">
                            No Jurisdiction Selected
                        </h1>
                        <h2 className="text-xl px-5 py-1 pb-4 items-center leading-normal font-raleway text-neutral-800 dark:text-neutral-200">
                            Please select a legal jurisdiction from the dropdown menus in the top right corner. In our early stages Abe is currently limited on what primary source legislation he has access to. Please choose an available jurisdiction or valid combination of jurisdictions to continue.
                        </h2>
                        {/* Accept Button */}
                        <div className="flex justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button
                                onClick={setShown}
                                className="text-white font-raleway bg-[#4A4643] hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Okay
                            </button>
                            {/* ... other buttons if necessary */}
                        </div>
                    </div>
                </div>
            </div>

        )
    );
};


