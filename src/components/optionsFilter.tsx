import React, { useState, useEffect } from 'react';
import { Jurisdiction, Option, OptionsListProps } from '@/lib/types';
import { on } from 'events';
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
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filteredJurisdictions, setFilteredJurisdictions] = useState();
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(options);
  const [selectedState, setSelectedState] = useState<Jurisdiction>();
  const [selectedMisc, setSelectedMisc] = useState<Jurisdiction>();
  const [isFederalIncluded, setIsFederalIncluded] = useState(false);

  // const [isFederalDropdownOpen, setIsFederalDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isMiscDropdownOpen, setIsMiscDropdownOpen] = useState(false);
  const [showBadJurisdictionsPopup, setShowBadJurisdictionsPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [isHovered, setIsHovered] = useState(false);


  const toggleStateDropdown = () => {
    setIsStateDropdownOpen(!isStateDropdownOpen);
  };

  const toggleMiscDropdown = () => {
    setIsMiscDropdownOpen(!isMiscDropdownOpen);
  };


  const handleClearSelection = () => {
    setIsMiscDropdownOpen(false);
    setIsStateDropdownOpen(false);
    setSelectedState(undefined);
    setSelectedMisc(undefined);
    // Set all options "selected" to false
    setSelectedOptions(prevSelected =>
      prevSelected.map(prevOption => ({ ...prevOption, selected: false }))
    );
    setIsFederalIncluded(false);
    onFederalJurisdictionChange(undefined);
    onMiscJurisdictionChange(undefined);
    // DEFAULT Selection
    onStateJurisdictionChange({ id: '5', name: ' California', abbreviation: 'CA', corpusTitle: 'California Statutes', usesSubContentNodes: true, jurisdictionLevel: 'state' });

  };

  const toggleSelection = (index: number) => {
    console.log(selectedOptions);
    console.log(index);
    const option = selectedOptions[index];
    if (option.name === 'Include US Federal Jurisdiction') {
      setIsFederalIncluded(!isFederalIncluded);
    }
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
    if (isFederalIncluded && selectedMisc) {
      setPopupMessage('Currently, miscellaneous jurisdictions cannot be selected at the same time as federal or state jurisdictions. Plans to implement this feature are in the works. Please select only one jurisdiction type at a time. I will de-select the miscellaneous jurisdiction for you.');
      setSelectedMisc(undefined);
      setShowBadJurisdictionsPopup(true);
    } else {
      onFederalJurisdictionChange(federalJurisdictions[0]);
    }
  }, [isFederalIncluded]);
  useEffect(() => {
    if (isFederalIncluded && !selectedState) {
      setIsFederalIncluded(false); // Deselect federal if no state is selected
    }

  }, [selectedState, isFederalIncluded]);

  useEffect(() => {
    if (selectedState) {
      setPopupMessage('Currently, miscellaneous jurisdictions cannot be selected at the same time as federal or state jurisdictions. Plans to implement this feature are in the works. Please select only one jurisdiction type at a time. I will de-select the state jurisdiction for you.');
      setSelectedState(undefined);
      setShowBadJurisdictionsPopup(true);
    }
    if (isFederalIncluded) {
      // Remove the option 'Include US Federal Jurisdiction' from selectedOptions if it is there
      setIsFederalIncluded(false);
      setSelectedOptions(prevSelected =>
        prevSelected.includes(options[0])
          ? prevSelected.filter(lastOption => lastOption != options[0])
          : [...prevSelected]
      );
    }
    onMiscJurisdictionChange(selectedMisc);
    onStateJurisdictionChange(undefined);

  }, [selectedMisc]);

  useEffect(() => {
    if (selectedMisc) {
      setPopupMessage('Currently, miscellaneous jurisdictions cannot be selected at the same time as federal or state jurisdictions. Plans to implement this feature are in the works. Please select only one jurisdiction type at a time. I will de-select the miscellaneous jurisdiction for you.');
      setSelectedMisc(undefined);
      setShowBadJurisdictionsPopup(true);
    } else {
      onStateJurisdictionChange(selectedState);
    }

  }, [selectedState]);


  useEffect(() => {
    onOptionChange(selectedOptions);
  }, [selectedOptions]);

  const closePopup = () => setShowBadJurisdictionsPopup(false);

  return (
    <div className="overflow-y-auto bg-[#FDFCFD] border-4 border-[#E4E0D2] p-2 w-full shadow-inner rounded-md">
      <div className="flex justify-center text-[#4A4643] font-bold font-montserrat pb-2">Chat Options</div>
      <div className="flex justify-center font-montserrat pb-2">
        <div className="overflow-y-auto bg-[#FDFCFD] p-2 w-25 shadow-inner rounded-md">
          <div className="overflow-y-auto w-full" style={{ maxHeight: '45vh' }}>


            {/* State Jurisdiction Button */}
            <button
              id="dropdownRadioBgHoverButton"

              onMouseEnter={() => toggleHover(true)}
              onMouseLeave={() => toggleHover(false)}
              onClick={toggleStateDropdown}
              className="text-white bg-[#4A4643] hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              State Jurisdictions
              <svg className={`w-2.5 h-2.5 ml-3 ${isHovered ? 'text-[#4A4643]' : 'text-green-300'}`}  aria-hidden="true" fill="none" viewBox="0 0 10 6">

                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>

            {/* State Jurisdiction Dropdown Content */}
            {isStateDropdownOpen && (

              <div className="z-10 w-25 bg-white rounded-lg shadow">

                <ul className="p-3 space-y-1 text-sm text-gray-700">
                  {/* Loop through options */}
                  {stateJurisdictions.map((jurisdiction: Jurisdiction) => (
                    <li key={jurisdiction.id}>
                      <div className="flex items-center p-2 rounded hover:bg-gray-100">
                        <input
                          type="radio"
                          value={jurisdiction.id}
                          name="options-radio"
                          onChange={() => setSelectedState(jurisdiction)}
                          checked={selectedState === jurisdiction}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />

                        <label htmlFor={jurisdiction.id} className="w-25 ml-2 text-sm font-medium text-gray-900">

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


          <div className="overflow-y-auto w-5/6 pt-2" style={{ maxHeight: '45vh' }}>


            {/* Misc Jurisdiction Button */}
            <button
              id="dropdownRadioBgHoverButton"
              onMouseEnter={() => toggleHover(true)}
              onMouseLeave={() => toggleHover(false)}
              onClick={toggleMiscDropdown}
              className="text-white bg-[#4A4643] hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              Miscellaneous Jurisdictions
              <svg className={`w-2.5 h-2.5 ml-3 ${isHovered ? 'text-[#4A4643]' : 'text-green-300'}`}  aria-hidden="true" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>

            {/* Misc Jurisdiction Content */}
            {isMiscDropdownOpen && (
              <div className="z-10 w-25 bg-white rounded-lg shadow">
                <ul className="p-3 space-y-1 text-sm text-gray-700">
                  {/* Loop through options */}
                  {miscJurisdictions.map((jurisdiction: Jurisdiction) => (
                    <li key={jurisdiction.id}>
                      <div className="flex items-center p-2 rounded hover:bg-gray-100">
                        <input
                          type="radio"
                          value={jurisdiction.id}
                          name="options-radio"
                          onChange={() => setSelectedMisc(jurisdiction)}
                          checked={selectedMisc === jurisdiction}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor={jurisdiction.id} className="w-25 ml-2 text-sm font-medium text-gray-900">
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


            {/* Rest of the OptionsList content */}
            <div className="h-auto max-h-full ">
              <ul className="list-none pt-4">

                {options.map(option => (
                  <li key={option.id}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedOptions[option.id].selected}
                        onChange={() => toggleSelection(option.id)}
                      />
                      <span>{option.name}</span>
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
                <p className="text-sm text-gray-500">
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

  );
};

export default OptionsList;
