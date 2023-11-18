import React, { useState, useEffect } from 'react';
import { Option, OptionsListProps } from '@/lib/types';
// Define the structure of your options


const OptionsList: React.FC<OptionsListProps> = ({ options, onSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    // Filter options based on the search term
    const filtered = options.filter(option =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  // const handleSelectAll = () => {
  //   setSelectedOptions(filteredOptions.map(option => option.id));
  // };

  // const handleClearSelection = () => {
  //   setSelectedOptions([]);
  // };

  const toggleSelection = (optionId: string) => {
    setSelectedOptions(prevSelected =>
      prevSelected.includes(optionId)
        ? prevSelected.filter(id => id !== optionId)
        : [...prevSelected, optionId]
    );
  };

  // Communicate the selected options to the parent component
  useEffect(() => {
    onSelectionChange(selectedOptions);
  }, [selectedOptions, onSelectionChange]);

  return (
    <div className="pl-2">
      <div className="grid-cols-1 flex-none bg-[#FDFCFD] border-4 border-[#E4E0D2] overflow-y-auto p-2 w-fit shadow-inner rounded-md">
        <div className="flex justify-center text-[#4A4643] font-bold font-montserrat pb-2">Chat Options</div>
        <div className="flex justify-center font-montserrat font-bold pb-2">
          <div className="w-fit mx-auto ">
            <input


              type="text"
              placeholder="Search"
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ul className="list-none pt-2">

          {filteredOptions.map(option => (
            <li key={option.id}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => toggleSelection(option.id)}
                />
                <span>{option.name}</span>
              </label>
            </li>

          ))}


        </ul>
        {/* <button onClick={handleSelectAll}>Select All</button>
      <button onClick={handleClearSelection}>Clear</button> */}
      </div >
    </div>
  );
};

export default OptionsList;