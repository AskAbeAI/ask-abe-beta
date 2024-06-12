
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import PageFooter from '@/components/pageFooter';

export default function MissionPage() {
  return (
    <div className="bg-[#FEFDF9] flex flex-col items-stretch">

      <div className="flex-col items-center overflow-hidden relative flex min-h-[300px] px-20 max-md:px-5">
        <Image
          src="/mission/lincolnmem.jpg"
          alt="Empowering Image"
          width={1500}
          height={299}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative top-5/6 text-[#FEFDF9] text-center text-5xl font-raleway font-bold leading-[80px] max-w-screen-md mt-28 max-md:max-w-full max-md:mt-10">
          OUR MISSION
        </div>

      </div>
      <div className="items-center bg-[#FCF9F0] shadow-inner w-screen flex flex-col">
        <div className="text-[#2F3F3D] text-center text-6xl font-imfell font-medium leading-[67px] px-20 mt-28 max-md:max-w-full max-md:text-4xl max-md:leading-[54px] max-md:mt-10">
          Democratizing Legal Knowledge For All, One Question At a Time
        </div>
        <div className="items-center bg-[#FCF9F0] flex flex-col px-20 mt-16 mb-16 max-md:px-5 shadow-inner">
          <div className="text-black text-center text-xl font-raleway leading-24 max-w-screen-md mt-6 mb-6max-md:max-w-full max-md:mb-10">
            Our dream is to revolutionize the legal landscape, making legal literacy a common asset, not a privilege. This dream is rooted in our mission to empower every individual with accessible, comprehensible legal knowledge through Ask Abe. This includes our commitment to keeping this invaluable tool free forever, and our ambition to expand its benefits globally. We envision a future where every citizen, regardless of background or location, is equipped with the tools to navigate the legal world confidently, contributing to a more just, informed, and equitable society.
          </div>
        </div>
        <div className="text-black text-center font-raleway text-lg w-5/6 leading-7 max-w-screen-lg mt-6  max-md:max-w-full max-md:mb-10">
          {" "}
        </div>
      </div>
      <div className="items-stretch bg-[#FCF9F0] flex flex-col px-44 max-md:px-5">
        <Image

          width={1000}
          height={650}
          src="/mission/mission.jpg"
          alt="Company Story"
          className="aspect-[1.78] object-contain object-center w-full overflow-hidden mt-8 mb-20 max-md:max-w-full max-md:my-10"
        />
      </div>


     
      
      <PageFooter />
    </div>

  );
}
