import react, { useState, useRef, useEffect } from "react";

import { ContentBlock } from "@/lib/types";
import { CitationBlock } from "@/components/ui/chatBlocks";
import { useMediaQuery } from "react-responsive";
import { GoArchive } from "react-icons/go";
import { HiX } from 'react-icons/hi';


interface CitationProps {
  open: boolean;
  citationItems: ContentBlock[];
  setOpen: (setOpen: boolean) => void;
  activeCitationId: string;

}

const CitationBar: React.FC<CitationProps> = ({ open, setOpen, citationItems, activeCitationId }) => {
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });
  const isMobile = useMediaQuery({ maxWidth: 1224 });

  const [showCitationSidebarOpen, setShowCitationSidebarOpen] = useState(false);

  const toggleCitationSidebar = () => {
    setShowCitationSidebarOpen(!showCitationSidebarOpen);
  };


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
    <div>
      {isDesktopOrLaptop &&
        <div className="h-auto max-h-full overflow-y-auto bg-extralightbg border-4 border-bonewhite p-1 sm:p-2  shadow-inner rounded-md">
          <button className="w-full sticky top-0 inline-flex items-center justify-start py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-12 overflow-hidden font-montserrat font-semibold text-seasaltwhite transition-all duration-150 ease-in-out rounded hover:pl-8 sm:hover:pl-10 hover:pr-4 sm:hover:pr-6 bg-olivebrown group"
            onClick={() => setOpen(!open)}>
            <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-green-300 group-hover:h-full"></span>
            <span className="absolute right-0 pr-4 pl-4 duration-200 ease-out group-hover:translate-x-12">
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
                <svg className="w-5 h-5 text-olivebrown" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-olivebrown" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              )}
            </span>
            <span className="relative w-full text-left font-montserrat transition-colors duration-200 ease-in-out group-hover:text-olivebrown">
              {open ? "Back To Chat" : "Citations"}
            </span>
          </button>

          {/* Citation sidebar content */}
          <div className="overflow-y-auto hide-scrollbar h-full w-25 max-h-full" style={{ maxHeight: '90vh' }}>
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
      }


      {isMobile &&
        <div>
          <GoArchive className="cursor-pointer" size={24} onClick={toggleCitationSidebar} />
          {showCitationSidebarOpen && (
            <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center shadow-inner">
              <div className="flex justify-center bg-extralightbg border-4 border-bonewhite font-raleway pb-2">
                <div className=" bg-extralightbg p-2 w-25 shadow-inner rounded-md">
                  <div className=" pt-1 pb-1 flex items-end justify-end">
                    <HiX className="cursor-pointer" size={24} onClick={() => setShowCitationSidebarOpen(false)} />
                  </div>

                  {/* Citation sidebar content */}
                  <div className="h-auto max-h-full overflow-y-auto bg-extralightbg border-4 border-bonewhite p-1 sm:p-2  shadow-inner rounded-md">
                    <div className="sticky top-0 inline-flex items-center justify-start py-2 pl-3 pr-3  font-montserrat font-semibold text-seasaltwhite bg-olivebrown">Citations</div>
                    <div className="overflow-y-auto hide-scrollbar h-full w-25 max-h-full" style={{ maxHeight: '90vh' }}>
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    </div>





  );
};
export default CitationBar;