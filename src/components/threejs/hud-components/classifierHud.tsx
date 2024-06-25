import React from 'react';

interface ClassifierHUDProps {
  selectedClassifier: string[];
  setSelectedClassifier: React.Dispatch<React.SetStateAction<string[]>>;
}

const ClassifierHUD: React.FC<ClassifierHUDProps> = ({ selectedClassifier, setSelectedClassifier }) => {
  // Define the classifier colors with Tailwind CSS color values
  const classifiers = [
    { label: 'CORPUS', color: 'bg-purple-500' },
    { label: 'title', color: 'bg-pink-500' },
    { label: 'subtitle', color: 'bg-red-500' },
    { label: 'chapter', color: 'bg-orange-500' },
    { label: 'subchapter', color: 'bg-yellow-500' },
    { label: 'part', color: 'bg-green-500' },
    { label: 'subpart', color: 'bg-blue-500' },
    { label: 'section', color: 'bg-white' },
    { label: 'Other', color: 'bg-gray-400' }
  ];

  // Function to handle click on classifier
  const handleClassifierClick = (label: string) => {
    if (selectedClassifier.includes(label)) {
      setSelectedClassifier(selectedClassifier.filter(item => item !== label));
    } else {
      setSelectedClassifier([...selectedClassifier, label]);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Graph Legend</h3>
      <div>
        {classifiers.map((item, index) => (
          <div
            key={index}
            className={`flex items-center p-4 mb-2 cursor-pointer border rounded-md border-black ${selectedClassifier.includes(item.label) ? 'ring-2 ring-offset-2 ring-indigo-500' : 'hover:bg-gray-200'}`} // Highlight if selected and hover effect
            onClick={() => handleClassifierClick(item.label)}
          >
            <div className={`w-6 h-6 mr-2 rounded-full ring-1 ring-black ${item.color}`}></div>
            <span className={`text-sm ${selectedClassifier.includes(item.label) ? 'font-bold' : 'text-gray-700'}`}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassifierHUD;
