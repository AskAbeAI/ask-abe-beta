import React, { useState, useEffect } from 'react';
import { Jurisdiction, Option, OptionsListProps } from '@/lib/types';
import { on } from 'events';
import { useMediaQuery } from 'react-responsive';
import { HiOutlineCog, HiX } from 'react-icons/hi';
// Define the structure of your options






const OptionsList: React.FC<OptionsListProps> = ({
  stateJurisdictions,
  federalJurisdictions,
  miscJurisdictions,
  onOptionChange,
  onStateJurisdictionChange,
  onFederalJurisdictionChange,
  onMiscJurisdictionChange,
}) => {


  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });
  const isMobile = useMediaQuery({ maxWidth: 1224 });

  const [showOptionSidebarOpen, setShowOptionSidebarOpen] = useState(false);

  const toggleOptionSidebar = () => {
    setShowOptionSidebarOpen(!showOptionSidebarOpen);
  };
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filteredJurisdictions, setFilteredJurisdictions] = useState();

  const [selectedFederal, setSelectedFederal] = useState<Jurisdiction>();
  const [selectedState, setSelectedState] = useState<Jurisdiction>();
  const [selectedMisc, setSelectedMisc] = useState<Jurisdiction>();

  const [isFederalDropdownOpen, setIsFederalDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isMiscDropdownOpen, setIsMiscDropdownOpen] = useState(false);
  const [showBadJurisdictionsPopup, setShowBadJurisdictionsPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [isHovered, setIsHovered] = useState(false);




  const toggleFederalDropdown = () => {
    setIsFederalDropdownOpen(!isFederalDropdownOpen);
  };

  const toggleStateDropdown = () => {
    setIsStateDropdownOpen(!isStateDropdownOpen);
  };

  const toggleMiscDropdown = () => {
    setIsMiscDropdownOpen(!isMiscDropdownOpen);
  };


  const handleClearSelection = () => {
    // Close all dropdowns
    setIsFederalDropdownOpen(false);
    setIsStateDropdownOpen(false);
    setIsMiscDropdownOpen(false);
    // Unselect all jurisdictions
    setSelectedFederal(undefined);
    setSelectedState(undefined);
    setSelectedMisc(undefined);
    // Set all options "selected" to false


    onFederalJurisdictionChange(undefined);
    onStateJurisdictionChange(undefined);
    onMiscJurisdictionChange(undefined);
  };

  

  // Function to toggle the hover state
  const toggleHover = (hoverState: boolean) => {
    setIsHovered(hoverState);
  };


  useEffect(() => {
    
    if (selectedFederal) {
      onFederalJurisdictionChange(selectedFederal);
    }
    if (selectedState) {
      onStateJurisdictionChange(selectedState);
    }
    if (selectedMisc) {
      onMiscJurisdictionChange(selectedMisc);
    }

  }, [selectedFederal, selectedState, selectedMisc]);


 
  const closePopup = () => setShowBadJurisdictionsPopup(false);

  return (
    <div>
    <HiOutlineCog className="cursor-pointer" size={25} onClick={toggleOptionSidebar} />
    {showOptionSidebarOpen && (
      <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center shadow-inner">
        <div className="bg-[#FDFCFD] border-4 border-[#E4E0D2] font-raleway p-4 rounded-md shadow-inner">
          <div className="flex justify-end mb-4">
            <HiX className="cursor-pointer" size={24} onClick={() => setShowOptionSidebarOpen(false)} />
          </div>
          <div className="text-center text-[#4A4643] font-bold text-lg font-raleway mb-4">Jurisdiction Options</div>
          <div className="space-y-4" style={{ maxHeight: '45vh', overflowY: 'auto' }}>
            <div>
              <button
                onClick={toggleFederalDropdown}
                className="w-full text-white bg-[#4A4643] font-raleway hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-md px-5 py-2.5 inline-flex items-center justify-center"
              >
                Federal
                <svg className={`w-2.5 h-2.5 ml-3 ${isHovered ? 'text-[#4A4643]' : 'text-green-300'}`} aria-hidden="true" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
              {isFederalDropdownOpen && (
                <div className="bg-white py-2 rounded-lg shadow mt-2">
                  <ul className="space-y-1 text-md text-gray-700">
                    {federalJurisdictions.map((jurisdiction) => (
                      <li key={jurisdiction.id}>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100">
                          <input
                            type="radio"
                            value={jurisdiction.id}
                            name="options-radio-federal"
                            onChange={() => setSelectedFederal(jurisdiction)}
                            checked={selectedFederal === jurisdiction}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor={jurisdiction.id} className="ml-2 text-md font-medium text-gray-900">
                            {jurisdiction.name}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={toggleStateDropdown}
                className="w-full text-white bg-[#4A4643] font-raleway hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-md px-5 py-2.5 inline-flex items-center justify-center"
              >
                State
                <svg className={`w-2.5 h-2.5 ml-3 ${isHovered ? 'text-[#4A4643]' : 'text-green-300'}`} aria-hidden="true" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
              {isStateDropdownOpen && (
                <div className="bg-white py-2 rounded-lg shadow mt-2">
                  <ul className="space-y-1 text-md text-gray-700">
                    {stateJurisdictions.map((jurisdiction) => (
                      <li key={jurisdiction.id}>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100">
                          <input
                            type="radio"
                            value={jurisdiction.id}
                            name="options-radio-state"
                            onChange={() => setSelectedState(jurisdiction)}
                            checked={selectedState === jurisdiction}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor={jurisdiction.id} className="ml-2 text-md font-medium text-gray-900">
                            {jurisdiction.name}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={toggleMiscDropdown}
                className="w-full text-white bg-[#4A4643] font-raleway hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-md px-5 py-2.5 inline-flex items-center justify-center"
              >
                Special
                <svg className={`w-2.5 h-2.5 ml-3 ${isHovered ? 'text-[#4A4643]' : 'text-green-300'}`} aria-hidden="true" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
              {isMiscDropdownOpen && (
                <div className="bg-white py-2 rounded-lg shadow mt-2">
                  <ul className="space-y-1 text-md text-gray-700">
                    {miscJurisdictions.map((jurisdiction) => (
                      <li key={jurisdiction.id}>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100">
                          <input
                            type="radio"
                            value={jurisdiction.id}
                            name="options-radio-misc"
                            onChange={() => setSelectedMisc(jurisdiction)}
                            checked={selectedMisc === jurisdiction}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor={jurisdiction.id} className="ml-2 text-md font-medium text-gray-900">
                            {jurisdiction.name}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-center pt-4">
              <button
                className="px-4 py-1 rounded bg-gray-100 shadow-inner text-[#4A4643] hover:bg-[#4A4643] hover:text-white"
                onClick={handleClearSelection}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>

  );
};

export default OptionsList;
