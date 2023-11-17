'use client';

import Link from 'next/link';

import Image from 'next/image';
import LegalResearchComponent from '@/components/homepage/homeSection1'
import LandingSection from '@/components/homepage/landingSection';
import PageFooter from '@/components/pageFooter';
import FeaturesSection from '@/components/homepage/features';



export default function HomePage() {
  return (
    <div className="h-screen w-full bg-[#FAF5E6]">

      {/* <div className="bg-[#FAF5E6] p-0 flex justify-center flex-center h-[700px]">
        <div className="relative">
          {/* <div className="flex justify-between p-10">

            <p className="text-[#2B303A] text-[200px] font-lucien font-Bold drop-shadow-2xl">ASK </p>  */}

      {/* <Image width={1000} height={1000} src="/ASK.png" alt="Abe" /> */}

      {/* <p className="text-[#2B303A] text-[200px] font-lucien font-Bold drop-shadow-2xl">ABE</p> */}
      {/* </div> */}



      {/* <div className="inset-0 flex flex-col justify-center items-center">
            {/* <p className="text-[#2B303A] text-[200px] font-lucien font-Bold drop-shadow-2xl">ASK ABE</p> */}

      {/* <div className="flex mt-0">
              <div className="relative justify-center group">
                <div
                  className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#404E5C] via-[#404E5C] to-[#404E5C] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                </div>
                <a href="/playground" title="Get quote now"
                  className="relative inline-flex items-center justify-center px-8 py-4 text-xl font-robotoBold text-[#1A1B26] transition-all duration-200 bg-[#FAF5E6] font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  role="button"> Enter the Playground
                </a>
              </div> */}

      {/* </div> */}
      <LandingSection />
      <LegalResearchComponent />
      <FeaturesSection />


      <PageFooter />
    </div>


  );
}
