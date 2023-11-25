import react, { useState, useRef, useEffect } from "react";

import { ContentBlock } from "@/lib/types";
import { CitationBlock } from "@/components/ui/chatBlocks";


interface CitationProps {
  open: boolean;
  citationItems: ContentBlock[];
  setOpen: (setOpen: boolean) => void;
  activeCitationId: string;

}

const CitationBar: React.FC<CitationProps> = ({ open, setOpen, citationItems, activeCitationId }) => {




  const renderContentBlock = (item: ContentBlock) => {
    //console.log(item.citationProps);
    if (item.citationProps) {
      return (
        <CitationBlock
          citation={item.citationProps.citation}
          jurisdictionName={item.citationProps.jurisdictionName}
          link={item.citationProps.link}
          section_text={item.citationProps.section_text}
          setOpen={setOpen}
          open={open}
        />
      );
    } else {
      throw new Error("Citation props not defined");
    }

  };

  useEffect(() => {
    if (activeCitationId && activeCitationId !== "") {
      // Open the details element with activeCitationId
      const element = document.getElementById(activeCitationId) as HTMLDetailsElement;
      if (element) {
        element.open = true;
        setOpen(true);
      }
    }
  }, [activeCitationId]);

  type GroupedCitations = { [jurisdiction: string]: ContentBlock[] };

  const groupByJurisdiction = (items: ContentBlock[]): GroupedCitations => {
    return items.reduce((groups, item) => {
      const jurisdiction = item.citationProps!.jurisdictionName;
      if (!groups[jurisdiction]) {
        groups[jurisdiction] = [];
      }
      groups[jurisdiction].push(item);
      return groups;
    }, {} as GroupedCitations);
  };

  // Grouping citation items
  const groupedCitations = groupByJurisdiction(citationItems);

  return (
    <div className="h-auto max-h-full overflow-y-auto bg-[#FDFCFD] border-4 border-[#E4E0D2] p-2 w-full shadow-inner rounded-md">
      {/* Button to toggle citation view*/}

      <button className="sticky top-0 inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-montserrat font-semibold text-[#F8F8FA] transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-[#4A4643] group"
        onClick={() => setOpen(!open)}>
        <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-green-300 group-hover:h-full"></span>
        <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
          {/* Conditional SVG Rendering for Right Arrow */}
          {open ? (
            <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          )}
        </span>
        <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
          {/* Conditional SVG Rendering for Left Arrow */}
          {open ? (
            <svg className="w-5 h-5 text-[#4A4643]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-[#4A4643]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          )}
        </span>
        <span className="relative w-full text-left font-montserrat transition-colors duration-200 ease-in-out group-hover:text-[#4A4643]">
          {open ? "Back To Chat" : "Citations"}
        </span>
      </button>

      {/* Citation sidebar content */}
      <div className="overflow-y-auto scrollbar h-full w-25 max-h-full">
      {Object.keys(groupedCitations).map((jurisdiction) => (
        <div key={jurisdiction}>
          <div className="pt-2 font-bold">{jurisdiction}</div>
          {groupedCitations[jurisdiction].map((item) => (
            <div key={item.blockId} className="pt-2">
              {renderContentBlock(item)}
            </div>
          ))}
        </div>
      ))}
    </div>
    </div >



  );
};
export default CitationBar;