import Link from 'next/link';
import Image from 'next/image';

export default function MissionPage() {
  return (
    <div className="bg-[#FAF5E6] flex flex-col items-stretch">
      
      <div className="relative flex flex-col items-stretch overflow-hidden min-h-[433px] w-full px-16 py-12 md:max-w-full md:px-5">
        <img loading="lazy" src="/empowering.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Empowering Image" />
        
        <div className="absolute  top-1/2 text-[#FAF5E6] text-9xl font-bold font-montserrat leading-10">
          OUR MISSION
        </div>
        
      </div>
      <div className="items-center bg-[#FAF5E6] flex w-full flex-col px-5 py-12 max-md:max-w-full">
        <div className="flex w-full max-w-[1312px] justify-between gap-5 mt-16 mb-10 max-md:max-w-full max-md:flex-wrap max-md:mt-10">
          <div className="text-black text-4xl font-bold leading-10 grow shrink basis-auto max-md:max-w-full">
            Empowering
          </div>
          <div className="self-stretch text-black text-lg leading-7 grow shrink basis-auto max-md:max-w-full">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
          </div>
        </div>
      </div>
    </div>
  );
}
