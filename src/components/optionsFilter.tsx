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
  options,
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
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(options);
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
    setSelectedOptions(prevSelected =>
      prevSelected.map(prevOption => ({ ...prevOption, selected: false }))
    );

    onFederalJurisdictionChange(undefined);
    onStateJurisdictionChange(undefined);
    onMiscJurisdictionChange(undefined);
  };

  const toggleSelection = (index: number) => {
    console.log(selectedOptions);
    console.log(index);
    const option = selectedOptions[index];

    option.selected = !option.selected;

    // Replace the modified option in the selectedOptions array
    setSelectedOptions(prevSelected =>
      prevSelected.map((prevOption, i) => (i === index ? option : prevOption))
    );

  };

  // Function to toggle the hover state
  const toggleHover = (hoverState: boolean) => {
    setIsHovered(hoverState);
  };


  useEffect(() => {
    if (selectedMisc && (selectedFederal || selectedState)) {
      setPopupMessage('Currently, miscellaneous jurisdictions cannot be selected at the same time as federal or state jurisdictions. Plans to implement this feature are in the works. Please select only one jurisdiction type at a time. I will de-select the miscellaneous jurisdiction for you.');
      setSelectedMisc(undefined);
      setShowBadJurisdictionsPopup(true);
    }
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


  useEffect(() => {
    onOptionChange(selectedOptions);
  }, [selectedOptions]);

  const closePopup = () => setShowBadJurisdictionsPopup(false);

  return (
    <div>
      {isDesktopOrLaptop &&
        <div className="bg-[#FDFCFD] border-4 border-[#E4E0D2] w-full shadow-inner rounded-md">
          <div className="flex justify-center font-raleway pb-2">
            <div className="overflow-y-auto bg-[#FDFCFD] w-full p-3 shadow-inner rounded-md">
              <div className="flex justify-center text-[#4A4643] font-bold text-lg font-raleway pb-3">Jurisdiction Options</div>
              <div className="overflow-y-auto w-full" style={{ maxHeight: '45vh' }}>

                {/* Federal Jurisdiction Button */}
                <button
                  id="dropdownRadioBgHoverButtonFederal"
                  onMouseEnter={() => toggleHover(true)}
                  onMouseLeave={() => toggleHover(false)}
                  onClick={toggleFederalDropdown}
                  className="text-white bg-[#4A4643] font-raleway hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center justify-center w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  Federal
                  <svg className={`w-2.5 h-2.5 ml-3 ${isHovered ? 'text-[#4A4643]' : 'text-green-300'}`} aria-hidden="true" fill="none" viewBox="0 0 10 6">

                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                  </svg>
                </button>

                {/* Federal Jurisdiction Dropdown Content */}
                {isFederalDropdownOpen && (

                  <div className="bg-white py-2 rounded-lg shadow">
                    <ul className="space-y-1 text-md text-gray-700">
                      {/* Loop through options */}
                      {federalJurisdictions.map((jurisdiction: Jurisdiction) => (
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
                            <label htmlFor={jurisdiction.id} className="w-25 ml-2 text-md font-medium text-gray-900">
                              {jurisdiction.name}
                            </label>
                          </div>
                        </li>
                      ))}

                    </ul>
                  </div>

                )}

              </div>

              <div className="overflow-y-auto w-full pt-2" style={{ maxHeight: '45vh' }}>
                {/* State Jurisdiction Button */}
                <button
                  id="dropdownRadioBgHoverButtonState"
                  onMouseEnter={() => toggleHover(true)}
                  onMouseLeave={() => toggleHover(false)}
                  onClick={toggleStateDropdown}
                  className="text-white bg-[#4A4643] hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center justify-center w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  State
                  <svg className={`w-2.5 h-2.5 ml-3 ${isHovered ? 'text-[#4A4643]' : 'text-green-300'}`} aria-hidden="true" fill="none" viewBox="0 0 10 6">

                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                  </svg>
                </button>

                {/* State Jurisdiction Dropdown Content */}
                {isStateDropdownOpen && (
                  <div className="bg-white py-2 rounded-lg shadow">
                    <ul className="space-y-1 text-md text-gray-700">
                      {/* Loop through options */}
                      {stateJurisdictions.map((jurisdiction: Jurisdiction) => (
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

                            <label htmlFor={jurisdiction.id} className="w-25 ml-2 text-md font-medium text-gray-900">
                              {jurisdiction.name}
                            </label>
                          </div>
                        </li>
                      ))}

                    </ul>
                  </div>

                )}

              </div>

              <div className="overflow-y-auto w-full pt-2" style={{ maxHeight: '45vh' }}>
                {/* Misc Jurisdiction Button */}
                <button
                  id="dropdownRadioBgHoverButtonMisc"
                  onMouseEnter={() => toggleHover(true)}
                  onMouseLeave={() => toggleHover(false)}
                  onClick={toggleMiscDropdown}
                  className="text-white bg-[#4A4643] hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center justify-center w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  Special
                  <svg className={`w-2.5 h-2.5 ml-3 ${isHovered ? 'text-[#4A4643]' : 'text-green-300'}`} aria-hidden="true" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                  </svg>
                </button>

                {/* Misc Jurisdiction Content */}
                {isMiscDropdownOpen && (
                  <div className="bg-white py-2 rounded-lg shadow-inner">
                    <ul className="space-y-1 text-md text-gray-700">
                      {/* Loop through options */}
                      {miscJurisdictions.map((jurisdiction: Jurisdiction) => (
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
                            <label htmlFor={jurisdiction.id} className="w-25 ml-2 text-md font-medium text-gray-900">
                              {jurisdiction.name}
                            </label>
                          </div>
                        </li>

                      ))}

                      {/* Loop through jurisdictions */}
                      {/* Similar loop for stateJurisdictions, federalJurisdictions, miscJurisdictions */}

                    </ul>
                  </div>

                )}

              </div>

              <div className="flex justify-center text-[#4A4643] font-bold text-lg font-raleway pt-4">Chat Options</div>
              {/* Rest of the OptionsList content */}
              <div className="h-auto max-h-full ">
                <ul className=" pt-4">

                  {options.map(option => (
                    <li key={option.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={selectedOptions[option.id].selected}
                        onChange={() => toggleSelection(option.id)}
                      />
                      <label htmlFor={`checkbox-${option.id}`} className="text-md">
                        {option.name}
                      </label>
                    </li>
                  ))}

                </ul>
              </div>

              {/* <button onClick={handleSelectAll}>Select All</button> */}
              <div className="flex justify-center pt-4">
                <button
                  className="flex justify-end px-4 py-1 rounded bg-gray-100 shadow-inner text-[#4A4643] hover:bg-[#4A4643] hover:text-white" onClick={handleClearSelection}>Clear</button>
              </div >
            </div>
          </div>

          {/* Popup Modal */}
          {showBadJurisdictionsPopup && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Attention</h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-md text-gray-500">
                      {popupMessage}
                    </p>
                  </div>
                  <div className="items-center px-4 py-3">
                    <button
                      id="okButton"
                      className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                      onClick={closePopup}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>

          )}

        </div >
      }

      {isMobile &&
        <div>
          <HiOutlineCog className="cursor-pointer" size={25} onClick={toggleOptionSidebar} />

          {showOptionSidebarOpen && (
            <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center shadow-inner">
              <div className="flex justify-center bg-[#FDFCFD] border-4 border-[#E4E0D2] font-raleway pb-2">
                <div className=" bg-[#FDFCFD] p-2 w-25 shadow-inner rounded-md">
                  <div className=" pt-1 pb-1 flex items-end justify-end">
                    <HiX className="cursor-pointer" size={24} onClick={() => setShowOptionSidebarOpen(false)} />
                  </div>
                  <div className="flex justify-center text-[#4A4643] font-bold text-lg font-raleway pb-3">Jurisdiction Options</div>
                  <div className=" w-full" style={{ maxHeight: '45vh' }}>

                    {/* Federal Jurisdiction Button */}
                    <button
                      id="dropdownRadioBgHoverButtonFederal"
                      onMouseEnter={() => toggleHover(true)}
                      onMouseLeave={() => toggleHover(false)}
                      onClick={toggleFederalDropdown}
                      className="text-white bg-[#4A4643] font-raleway hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center justify-center w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      type="button"
                    >
                      Federal
                      <svg className={`w-2.5 h-2.5 ml-3 ${isHovered ? 'text-[#4A4643]' : 'text-green-300'}`} aria-hidden="true" fill="none" viewBox="0 0 10 6">

                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                      </svg>
                    </button>

                    {/* Federal Jurisdiction Dropdown Content */}
                    {isFederalDropdownOpen && (

                      <div className="bg-white py-2 rounded-lg shadow">
                        <ul className="space-y-1 text-md text-gray-700">
                          {/* Loop through options */}

                          {federalJurisdictions.map((jurisdiction: Jurisdiction) => (
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

                                <label htmlFor={jurisdiction.id} className="w-25 ml-2 text-md font-medium text-gray-900">
                                  {jurisdiction.name}
                                </label>
                              </div>
                            </li>
                          ))}

                        </ul>
                      </div>

                    )}

                  </div>

                  <div className="overflow-y-auto w-full pt-2" style={{ maxHeight: '45vh' }}>
                    {/* State Jurisdiction Button */}
                    <button
                      id="dropdownRadioBgHoverButtonState"
                      onMouseEnter={() => toggleHover(true)}
                      onMouseLeave={() => toggleHover(false)}
                      onClick={toggleStateDropdown}
                      className="text-white bg-[#4A4643] hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center justify-center w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      type="button"
                    >
                      State
                      <svg className={`w-2.5 h-2.5 ml-3 ${isHovered ? 'text-[#4A4643]' : 'text-green-300'}`} aria-hidden="true" fill="none" viewBox="0 0 10 6">

                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                      </svg>
                    </button>

                    {/* State Jurisdiction Dropdown Content */}
                    {isStateDropdownOpen && (

                      <div className="bg-white py-2 rounded-lg shadow">
                        <ul className="space-y-1 text-md text-gray-700">
                          {/* Loop through options */}
                          {stateJurisdictions.map((jurisdiction: Jurisdiction) => (
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

                                <label htmlFor={jurisdiction.id} className="w-25 ml-2 text-md font-medium text-gray-900">
                                  {jurisdiction.name}
                                </label>
                              </div>
                            </li>
                          ))}
                          {/* Loop through jurisdictions */}
                          {/* Similar loop for stateJurisdictions, federalJurisdictions, miscJurisdictions */}
                        </ul>
                      </div>
                    )}
                  </div>


                  <div className="overflow-y-auto w-full pt-2" style={{ maxHeight: '45vh' }}>
                    {/* Misc Jurisdiction Button */}
                    <button
                      id="dropdownRadioBgHoverButtonMisc"
                      onMouseEnter={() => toggleHover(true)}
                      onMouseLeave={() => toggleHover(false)}
                      onClick={toggleMiscDropdown}
                      className="text-white bg-[#4A4643] hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center justify-center w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      type="button"
                    >
                      Special
                      <svg className={`w-2.5 h-2.5 ml-3 ${isHovered ? 'text-[#4A4643]' : 'text-green-300'}`} aria-hidden="true" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                      </svg>
                    </button>

                    {/* Misc Jurisdiction Content */}
                    {isMiscDropdownOpen && (
                      <div className="bg-white py-2 rounded-lg shadow-inner">
                        <ul className="space-y-1 text-md text-gray-700">
                          {/* Loop through options */}
                          {miscJurisdictions.map((jurisdiction: Jurisdiction) => (
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
                                <label htmlFor={jurisdiction.id} className="w-25 ml-2 text-md font-medium text-gray-900">
                                  {jurisdiction.name}
                                </label>
                              </div>
                            </li>
                          ))}
                          {/* Loop through jurisdictions */}
                          {/* Similar loop for stateJurisdictions, federalJurisdictions, miscJurisdictions */}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center text-[#4A4643] font-bold text-lg font-raleway pt-4">Chat Options</div>
                  {/* Rest of the OptionsList content */}
                  <div className="h-auto max-h-full ">
                    <ul className=" pt-4">

                      {options.map(option => (
                        <li key={option.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={selectedOptions[option.id].selected}
                            onChange={() => toggleSelection(option.id)}
                          />
                          <label htmlFor={`checkbox-${option.id}`} className="text-md">
                            {option.name}
                          </label>
                        </li>
                      ))}

                    </ul>
                  </div>
                  {/* <button onClick={handleSelectAll}>Select All</button> */}
                  <div className="flex justify-center pt-4">
                    <button
                      className="flex justify-end px-4 py-1 rounded bg-gray-100 shadow-inner text-[#4A4643] hover:bg-[#4A4643] hover:text-white" onClick={handleClearSelection}>Clear</button>
                  </div >
                </div>
              </div>

              {/* Popup Modal */}
              {showBadJurisdictionsPopup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                  <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div className="mt-3 text-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Attention</h3>
                      <div className="mt-2 px-7 py-3">
                        <p className="text-md text-gray-500">
                          {popupMessage}
                        </p>
                      </div>
                      <div className="items-center px-4 py-3">
                        <button
                          id="okButton"
                          className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                          onClick={closePopup}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              )}

            </div>
          )}

        </div>
      }
    </div>

  );
};

export default OptionsList;
