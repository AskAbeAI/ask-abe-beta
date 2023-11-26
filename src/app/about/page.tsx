"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import PageFooter from '@/components/pageFooter';



export default function aboutPage() {

  return (
    <div>
      <div className="items-center bg-[#FAF5E6] shadow-inner w-screen flex flex-col">
        <div className="text-[#2F3F3D] text-center text-6xl font-imfell font-medium leading-[67px] px-20 mt-28 max-md:max-w-full max-md:text-4xl max-md:leading-[54px] max-md:mt-10">
          Dedicated to making the complexities of law accessible and comprehensible for everyone, at no cost, by utilizing cutting-edge artificial intelligence.
        </div>
        <div className="text-black text-center font-raleway text-lg w-5/6 leading-7 max-w-screen-lg mt-6  max-md:max-w-full max-md:mb-10">
          {" "}
        </div>
      </div>
      <div className="items-stretch bg-[#FAF5E6] flex flex-col px-16 max-md:px-5">
        <Image

          width={2000}
          height={1500}
          src="/about1.jpg"
          alt="Company Story"
          className="aspect-[1.78] object-contain object-center w-full overflow-hidden mt-28 max-md:max-w-full max-md:my-10"
        />
        <div className="mt-28 max-md:max-w-full max-md:mt-10">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-6/12 max-md:w-full max-md:ml-0">
              <div className="self-stretch text-black text-6xl font-raleway font-bold leading-[67px] max-md:max-w-full max-md:text-4xl max-md:leading-[54px] max-md:mt-10">
                Tell the story of how company came about
              </div>
            </div>
            <div className="flex flex-col items-stretch w-6/12 ml-5 max-md:w-full max-md:ml-0">
              <div className="self-stretch text-black font-raleway text-lg leading-7 max-md:max-w-full max-md:mt-10">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="items-center bg-[#FAF5E6] flex flex-col px-44 max-md:px-5">
        <div className="text-black text-5xl font-raleway font-bold leading-[58px] w-[616px] max-w-full mt-28 max-md:text-4xl max-md:leading-[54px] max-md:mt-10">
          Short heading goes here
        </div>
        <div className="text-black text-base leading-6 mt-6 max-md:max-w-full">
          Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus id
          scelerisque est ultricies ultricies. Duis est sit sed leo nisl, blandit
          elit sagittis. Quisque tristique consequat quam sed. Nisl at scelerisque
          amet nulla purus habitasse.
        </div>
        <div className="text-black text-base leading-6 mt-4 max-md:max-w-full">
          Nunc sed faucibus bibendum feugiat sed interdum. Ipsum egestas
          condimentum mi massa. In tincidunt pharetra consectetur sed duis
          facilisis metus. Etiam egestas in nec sed et. Quis lobortis at sit
          dictum eget nibh tortor commodo cursus.
        </div>
        <div className="text-black text-base leading-6 mt-4 mb-24 max-md:max-w-full max-md:mb-10">
          Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce aliquet.
          Nam elementum urna nisi aliquet erat dolor enim. Ornare id morbi eget
          ipsum. Aliquam senectus neque ut id eget consectetur dictum. Donec
          posuere pharetra odio consequat scelerisque et, nunc tortor. Nulla
          adipiscing erat a erat. Condimentum lorem posuere gravida enim posuere
          cursus diam.
        </div>
      </div>
      <PageFooter />

    </div>
  );
};


