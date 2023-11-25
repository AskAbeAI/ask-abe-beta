"use client";
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

export default function MissionPage() {
  return (
    <div className="bg-[#FAF5E6] flex flex-col items-stretch">
      
      <div className="flex-col items-center overflow-hidden relative flex min-h-[382px] px-20 max-md:px-5">
        <img loading="lazy" src="/empowering.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Empowering Image" />
        
        <div className="relative text-[#FEFDF9] text-center text-5xl font-cinzel font-bold leading-[80px] max-w-screen-md mt-28 max-md:max-w-full max-md:mt-10">
          OUR MISSION
        </div>
        
      </div>
      <div className="bg-[#FAF5E6] flex w-full flex-col  px-16 py-6 ">
      <div className="text-[#2F3F3D] text-7xl font-cinzel leading-[58px] mt-16 max-md:max-w-full max-md:text-4xl max-md:leading-[54px] max-md:mt-10">
        Informed Empowerment <br />
        <div className="text-5xl pt-5">
           Making Law Understandable for Everyone.
           </div>
      </div>
      <div className="text-black text-base font-fauna leading-6 mt-6 max-md:max-w-full">
        Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus id
        scelerisque est ultricies ultricies. Duis est sit sed leo nisl, blandit
        elit sagittis. Quisque tristique consequat quam sed. Nisl at scelerisque
        amet nulla purus habitasse.
      </div>
      <div className="text-black text-base font-fauna leading-6 mt-4 max-md:max-w-full">
        Nunc sed faucibus bibendum feugiat sed interdum. Ipsum egestas
        condimentum mi massa. In tincidunt pharetra consectetur sed duis
        facilisis metus. Etiam egestas in nec sed et. Quis lobortis at sit
        dictum eget nibh tortor commodo cursus.
      </div>
      <div className="text-black text-base font-fauna leading-6 mt-2 max-md:max-w-full">
        Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce aliquet.
        Nam elementum urna nisi aliquet erat dolor enim. Ornare id morbi eget
        ipsum. Aliquam senectus neque ut id eget consectetur dictum. Donec
        posuere pharetra odio consequat scelerisque et, nunc tortor. Nulla
        adipiscing erat a erat. Condimentum lorem posuere gravida enim posuere
        cursus diam.
      </div>
      <img
        loading="lazy"
        srcSet="/lib.jpg"className="aspect-[1.78] object-contain object-center w-full overflow-hidden mt-24 mb-10 max-md:max-w-full max-md:mt-10"
      />
    </div>
      
    </div>
  );
}
