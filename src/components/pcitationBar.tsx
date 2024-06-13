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