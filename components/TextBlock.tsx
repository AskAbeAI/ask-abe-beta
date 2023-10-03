interface Props {
  text: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

export const TextBlock: React.FC<Props> = ({
  text,
  editable = false,
  onChange = () => {},
}) => {
  
  // Handle the click event within the React component
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;

    // Check if the clicked element is an 'a' tag and has href attribute
    if (target.tagName === 'A' && target.getAttribute('href')) {
      const citationId = target.innerText;

      const detailsElement = document.getElementById(citationId) as HTMLDetailsElement;
      const summaryElement = detailsElement?.querySelector('summary');

      // Check if both elements are found, and if so, toggle the 'open' state and 'highlight' class
      if (detailsElement && summaryElement) {
        // const pingEffect = document.getElementById(`ping-${citationId}`);
        // if (!pingEffect) {
        //   throw new Error ("Error attempting to access ping effect!")
        // }
        detailsElement.open = true;
        // pingEffect.classList.remove('opacity-0');
        // setTimeout(() => {
        //   pingEffect.classList.remove('opacity-0');
        // }, 2000);

        // // Optional: Add an event listener for the 'toggle' event to handle removal of the highlight
        // detailsElement.addEventListener('toggle', () => {
        //   if (!detailsElement.open) {
        //     // When details are opened, add the animation class.
        //     pingEffect.classList.remove('opacity-0');
            
        //   }
        // });
      }
    }
  };

  return (
    <div
      style={{ whiteSpace: 'pre-wrap' }} // Added the style here
      className="min-h-[500px] w-full bg-[#1A1B26] p-4 text-[15px] text-neutral-200 focus:outline-none"
      contentEditable={editable}
      onInput={(e) => onChange(e.currentTarget.textContent || "")}
      suppressContentEditableWarning={true}
      id="finalAnswerContainer"
      dangerouslySetInnerHTML={{ __html: text }}
      onClick={handleClick} 
    >
      
    </div>
  );
};
