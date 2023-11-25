import React, { useState, useEffect } from 'react';
import { Jurisdiction, Option, OptionsListProps } from '@/lib/types';
// Define the structure of your options


const OptionsList: React.FC<OptionsListProps> = ({
  stateJurisdictions,
  federalJurisdictions,
  miscJurisdictions,
  options,
  onOptionChange,
  onJurisdictionChange,
}) => {
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filteredJurisdictions, setFilteredJurisdictions] = useState();
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedState, setSelectedState] = useState<Jurisdiction>();
  const [selectedMisc, setSelectedMisc] = useState<Jurisdiction>();

  // const [isFederalDropdownOpen, setIsFederalDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isMiscDropdownOpen, setIsMiscDropdownOpen] = useState(false);


  const toggleStateDropdown = () => {
    setIsStateDropdownOpen(!isStateDropdownOpen);
  };

  const toggleMiscDropdown = () => {
    setIsMiscDropdownOpen(!isMiscDropdownOpen);
  };

  const [isHovered, setIsHovered] = useState(false);

  // Function to toggle the hover state
  const toggleHover = (hoverState: boolean) => {
    setIsHovered(hoverState);
  };





  const handleClearSelection = () => {
    setIsMiscDropdownOpen(false);
    setIsStateDropdownOpen(false);
    setSelectedState(undefined);
    setSelectedMisc(undefined);
    setSelectedOptions([]);

  };

  const toggleSelection = (option: Option) => {

    setSelectedOptions(prevSelected =>
      prevSelected.includes(option)
        ? prevSelected.filter(lastOption => lastOption != option)
        : [...prevSelected, option]
    );
  };

  useEffect(() => {
    if (selectedMisc) {
      onJurisdictionChange(selectedMisc)
    }
  }, [selectedMisc]);

  useEffect(() => {
    if (selectedState) {
      onJurisdictionChange(selectedState)
    }
  }, [selectedState]);


  useEffect(() => {
    if (selectedOptions) {
      onOptionChange(selectedOptions)
    }
  }, [selectedOptions]);

  return (
    <div className="overflow-y-auto bg-[#FDFCFD] border-4 border-[#E4E0D2] p-2 w-full shadow-inner rounded-md">
      <div className="flex justify-center text-[#4A4643] font-bold font-montserrat pb-2">Chat Options</div>
     
        <div className="overflow-y-auto bg-[#FDFCFD] p-2 w-full shadow-inner rounded-md">
          <div className="overflow-y-auto w-full" style={{ maxHeight: '45vh' }}>


            {/* Dropdown Button */}
            <button
              id="dropdownRadioBgHoverButton"
              onMouseEnter={() => toggleHover(true)}
              onMouseLeave={() => toggleHover(false)}
              onClick={toggleStateDropdown}
              className="text-white bg-[#4A4643] hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              State Jurisdictions
              <svg className={`w-2.5 h-2.5 ml-3 ${isHovered ? 'text-[#4A4643]' : 'text-green-300'}`} aria-hidden="true" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>

            {/* Dropdown Content */}
            {isStateDropdownOpen && (
              <div className="z-10 w-48 bg-white rounded-lg shadow">
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
                          className="w-4 h-4 checked-green-300 bg-gray-100 border-gray-300 focus:ring-green-300"
                        />
                        <label htmlFor={jurisdiction.id} className="w-full ml-2 text-sm font-medium text-gray-900">
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

          <div className="pt-2">

            {/* Existing Code ... */}

            {/* Dropdown Button */}
            <button
              id="dropdownRadioBgHoverButton"
              onMouseEnter={() => toggleHover(true)}
              onMouseLeave={() => toggleHover(false)}
              onClick={toggleMiscDropdown}
              className="text-white bg-[#4A4643] hover:bg-green-300 hover:text-[#4A4643] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              Miscellaneous Jurisdictions
              <svg className={`w-2.5 h-2.5 ml-3 ${isHovered ? 'text-[#4A4643]' : 'text-green-300'}`} aria-hidden="true" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>

            {/* Dropdown Content */}
            {isMiscDropdownOpen && (
              <div className="z-10 w-48 bg-white rounded-lg shadow">
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
                          className="w-4 h-4 text-green-300 bg-gray-100 border-gray-300 focus:ring-green-300"
                        />
                        <label htmlFor={jurisdiction.id} className="w-full ml-2 text-sm font-medium text-gray-900">
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


            {/* Rest of the OptionsList content */}
            <div className="h-auto max-h-full">
              <ul className="list-none pt-2">

                {options.map(option => (
                  <li key={option.id}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(option)}
                        onChange={() => toggleSelection(option)}
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
                className="flex justify-end px-1 py-1 rounded shadow-inner text-[#4A4643] hover:bg-[#4A4643] hover:text-white"
                onClick={handleClearSelection}>Clear Options</button>
            </div>
          </div>
        </div>
      </div>
 

  );
};

export default OptionsList;