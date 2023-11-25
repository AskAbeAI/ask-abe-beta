"use client";
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

export default function MissionPage() {
  return (
    <div className="bg-[#FAF5E6] flex flex-col items-stretch">
      
      <div className="flex-col items-center overflow-hidden relative flex min-h-[382px] px-20 max-md:px-5">
        <img loading="lazy" src="/empowering.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Empowering Image" />
        
        <div className="relative top-1/2 text-[#FEFDF9] text-center text-5xl font-raleway font-bold leading-[80px] max-w-screen-md mt-28 max-md:max-w-full max-md:mt-10">
          OUR VISION
        </div>
        
      </div>
      <div className="bg-[#FAF5E6] flex w-full flex-col  px-16 py-6 ">
      <div className="text-[#2F3F3D] text-7xl font-cinzel leading-[58px] mt-16 max-md:max-w-full max-md:text-4xl max-md:leading-[54px] max-md:mt-10">
        Informed Empowerment <br />
        <div className="text-5xl pt-5 font-raleway ">
           Guiding regular citizens to better understand primary source legislation
           </div>
      </div>
      <div className="text-black text-base font-fauna leading-6 mt-6 max-md:max-w-full">
        At Ask Abe, our goal is to offer free legal education to everyone. 
      </div>
      <div className="text-black text-base font-fauna leading-6 mt-4 max-md:max-w-full">
      Say goodbye to the days of feeling overwhelmed by legal complexities. 
      </div>
      <div className="text-black text-base font-fauna leading-6 mt-2 max-md:max-w-full">
      Embrace the power of AI-driven legal education and step into a new era where informed empowerment is not just a possibility, but a reality.  
      
      Welcome to a future where legal knowledge is accessible, understandable, and at your fingertips, helping you better understand the laws that govern you with confidence.


      </div>
      <img
        loading="lazy"
        srcSet="/lib.jpg"className="aspect-[1.78] object-contain object-center w-full overflow-hidden mt-24 mb-10 max-md:max-w-full max-md:mt-10"
      />
    </div>
      
    </div>
  );
}
