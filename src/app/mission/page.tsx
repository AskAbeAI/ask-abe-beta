import Link from 'next/link';
import Image from 'next/image';

export default function MissionPage() {
  return (
    <div className="bg-[#FAF5E6] flex flex-col items-stretch">
      
      <div className="flex-col items-center overflow-hidden relative flex min-h-[382px] px-20 max-md:px-5">
        <img loading="lazy" src="/empowering.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Empowering Image" />
        
        <div className="relative text-[#FEFDF9] text-center text-5xl font-bold leading-[80px] max-w-screen-md mt-28 max-md:max-w-full max-md:mt-10">
          OUR MISSION
        </div>
        
      </div>
      <div className="items-center bg-[#FAF5E6] flex w-full flex-col px-5 py-12 max-md:max-w-full">
        <div className="flex w-full max-w-[1312px] justify-between gap-5 mt-16 mb-10 max-md:max-w-full max-md:flex-wrap max-md:mt-10">
          <div className="text-6xl text-[#2f3f3d] font-bold leading-24 grow shrink basis-auto max-md:max-w-full">
         Empowering regular people to better understand primary source legislation.

          </div>
          
        </div>
      </div>
      <div className="relative flex flex-col items-stretch overflow-hidden min-h-[433px] w-full px-16 py-12 md:max-w-full md:px-5">
        <img loading="lazy" src="/lib.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Empowering Image" />
        
        <div className="absolute  top-1/2 text-[#FAF5E6] text-9xl font-bold font-montserrat leading-10">
          
        </div>
        
      </div>
    </div>
  );
}
