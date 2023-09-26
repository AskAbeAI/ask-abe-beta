interface Props {
  question: string;
  onChange: (question: string) => void;  // Updated the type to include void for better clarity
}

export const QuestionInput: React.FC<Props> = ({ question, onChange }) => {
  return (
    <textarea
      className="mt-1 h-[100px] w-[400px] rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      placeholder="Question For Abe"
      value={question}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};