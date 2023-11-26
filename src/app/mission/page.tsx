"use client";
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import PageFooter from '@/components/pageFooter';

export default function MissionPage() {
  return (
    <div className="bg-[#FAF5E6] flex flex-col items-stretch">

      <div className="flex-col items-center overflow-hidden relative flex min-h-[382px] px-20 max-md:px-5">
        <Image
          src="/empowering.jpg"
          alt="Empowering Image"
          width={4800}
          height={2812}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative top-1/2 text-[#FEFDF9] text-center text-5xl font-raleway font-bold leading-[80px] max-w-screen-md mt-28 max-md:max-w-full max-md:mt-10">
          OUR MISSION
        </div>

      </div>
      <div className="bg-[#FAF5E6] flex w-full flex-col px-16 py-5">
        <div className="text-[#2F3F3D] text-6xl text-center font-cinzel font-semibold leading-[58px] mt-16 mb-2 max-md:max-w-full max-md:text-4xl max-md:leading-[54px] max-md:mt-10">
          Empowering regular citizens to better understand primary source legislation

        </div>
        <div className="items-stretch bg-[#FAF5E6] flex flex-col px-44 max-md:px-5">

          <Image
            src="/lib2.jpg"
            alt="library2"
            width={5184}
            height={3888}
            className="aspect-[1.78] object-contain object-center w-full overflow-hidden mt-20 max-md:max-w-full max-md:my-10"
          />
        </div>
      </div>
      <div className="items-center bg-[#FCF9F0] flex flex-col px-5 shadow-inner">
        <div className="items-stretch flex w-full max-w-[1312px] justify-between gap-5 mt-28 mb-24 max-md:max-w-full max-md:flex-wrap max-md:my-10">
          <div className="flex justify-center text-[#2F3F3D] text-4xl font-cinzel leading-10 grow shrink basis-auto max-md:max-w-full">
            How can AI help?
          </div>
          <div className="text-black text-lg font-raleway leading-7 grow shrink basis-auto self-start w-7/12 max-md:max-w-full">
            By using AI, we can effectively cut out time-consuming traditional methods of accessing legal information.
            Ask Abe is specifically crafted to enable users to swiftly and accurately access the information they need.
            This AI tool not only delivers facts from cited legal code, but it transforms them into easily digestible, relevant knowledge, tailored for everyday citizens.
          </div>
        </div>
      </div>

      <div className="items-center bg-[#FAF5E6] flex flex-col px-5">
        <div className="w-full max-w-[1312px] mt-28 mb-24 max-md:max-w-full max-md:my-10">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-6/12 max-md:w-full max-md:ml-0">
              <div className="items-stretch flex flex-col max-md:max-w-full max-md:mt-10">
                <div className="text-[#2F3F3D] text-5xl font-cinzel leading-[58px] max-md:max-w-full max-md:text-4xl max-md:leading-[54px]">
                  Who does this benefit?
                </div>
                <div className="text-black text-base font-raleway leading-6 mt-6 max-md:max-w-full">
                  In short, everyone. </div>
                <div className="text-black text-base font-raleway leading-6 mt-4 max-md:max-w-full">
                  Understanding the laws that shape our society is empowering for every individual.
                  It enables people to navigate daily life with greater confidence, knowing their rights and responsibilities.
                  This knowledge can transform ordinary citizens into informed members of their community, capable of making better decisions and contributing positively to society.

                </div>
                <div className="text-black text-base font-raleway leading-6 mt-4 max-md:max-w-full">
                  Providing legal education to every citizen benefits not only the individuals but also the society at large.
                  It creates a more informed, engaged, and just community, where the rule of law is understood, respected, and upheld by all.
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-6/12 ml-5 max-md:w-full max-md:ml-0">
              <Image
                src="/people2.jpg"
                alt="People Image"
                width={4373}
                height={2452}
                className="aspect-[1.76] object-contain object-center w-full overflow-hidden grow max-md:max-w-full max-md:mt-2"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="items-center bg-[#FCF9F0] flex flex-col px-20 max-md:px-5 shadow-inner">
        <div className="text-[#2F3F3D] text-center text-4xl font-cinzel leading-10 max-w-screen-md mt-28 max-md:max-w-full max-md:mt-10">
          THE DREAM
        </div>
        <div className="text-black text-center text-lg font-raleway leading-6 max-w-screen-md mt-6 mb-24 max-md:max-w-full max-md:mb-10">
          To simplify legal jargon, making the legal system more accessible and less intimidating for all.        </div>
      </div>

      <div className="items-stretch bg-[#FAF5E6] flex flex-col px-16 max-md:px-5">
        <div className="mt-28 max-md:max-w-full max-md:mt-10">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-6/12 max-md:w-full max-md:ml-0">
              <div className="self-stretch text-[#2F3F3D] text-4xl font-cinzel leading-10 max-md:max-w-full max-md:mt-10">
                Longterm Goals & Impact
              </div>
            </div>
            <div className="flex flex-col items-stretch w-6/12 ml-5 max-md:w-full max-md:ml-0">
              <div className="self-stretch text-black text-lg font-raleway leading-7 max-md:max-w-full max-md:mt-10">
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20 mb-24 max-md:max-w-full max-md:my-10">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-[33%] max-md:w-full max-md:ml-0">
              <div className="flex grow justify-between gap-5 max-md:mt-10">
                <div className="self-stretch flex grow basis-[0%] flex-col">
                  <div className="self-stretch text-black text-2xl font-raleway font-bold leading-9">Keep Ask Abe free, forever</div>
                  <div className="self-stretch text-black text-base font-raleway leading-6 mt-4">
                    We believe in creating a level playing field for all individuals to benefit from our service.
                  </div>

                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0">
              <div className="flex grow justify-between gap-5 max-md:mt-10">
                <div className="self-stretch flex grow basis-[0%] flex-col">
                  <div className="self-stretch text-black text-2xl font-raleway font-bold leading-9">Expand Globally</div>
                  <div className="self-stretch text-black text-base font-raleway leading-6 mt-4">
                    Our hope is to expand globally and make this service accessible to all.
                  </div>

                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0">
              <div className="flex grow justify-between gap-5 max-md:mt-10">
                <div className="self-stretch flex grow basis-[0%] flex-col">
                  <div className="self-stretch text-black text-2xl font-raleway font-bold leading-9">Fundraising Challenges</div>
                  <div className="self-stretch text-black text-base font-raleway leading-6 mt-4">
                    Fundraising presents significant challenges</div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Examples of Ask Abe in Use Section */}


      {/* <div className="items-stretch bg-[#FAF5E6] flex flex-col px-16 max-md:px-5">
        <div className="self-center text-center text-[#2F3F3D] text-5xl font-cinzel leading-[58px] max-w-screen-md mt-28 max-md:max-w-full max-md:text-4xl max-md:leading-[54px] max-md:mt-10">
          Ask Abe in Action
        </div>
        <div className="self-center text-black font-raleway text-center text-lg leading-7 max-w-screen-md mt-6 max-md:max-w-full">
          Example questions answered by Abe:
        </div>
        <div className="mt-20 mb-24 max-md:max-w-full max-md:my-10">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-6/12 max-md:w-full max-md:ml-0">
              <div className="items-stretch flex grow flex-col max-md:max-w-full max-md:mt-8">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/75649c69-0d9f-4c91-88a6-25bbba0b6e84?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/75649c69-0d9f-4c91-88a6-25bbba0b6e84?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/75649c69-0d9f-4c91-88a6-25bbba0b6e84?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/75649c69-0d9f-4c91-88a6-25bbba0b6e84?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/75649c69-0d9f-4c91-88a6-25bbba0b6e84?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/75649c69-0d9f-4c91-88a6-25bbba0b6e84?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/75649c69-0d9f-4c91-88a6-25bbba0b6e84?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/75649c69-0d9f-4c91-88a6-25bbba0b6e84?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&" className="aspect-square object-contain object-center w-full overflow-hidden max-md:max-w-full"
                />
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/d6defca7-d309-4c3f-a05d-2e57611878d7?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6defca7-d309-4c3f-a05d-2e57611878d7?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6defca7-d309-4c3f-a05d-2e57611878d7?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6defca7-d309-4c3f-a05d-2e57611878d7?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6defca7-d309-4c3f-a05d-2e57611878d7?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6defca7-d309-4c3f-a05d-2e57611878d7?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6defca7-d309-4c3f-a05d-2e57611878d7?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/d6defca7-d309-4c3f-a05d-2e57611878d7?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&" className="aspect-[1.5] object-contain object-center w-full overflow-hidden mt-8 max-md:max-w-full"
                />
              </div>
            </div>
            <div className="flex flex-col items-stretch w-6/12 ml-5 max-md:w-full max-md:ml-0">
              <div className="items-stretch flex flex-col max-md:max-w-full max-md:mt-8">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4cc1fdf9-7ea1-4e4b-b13c-6841222297e9?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4cc1fdf9-7ea1-4e4b-b13c-6841222297e9?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4cc1fdf9-7ea1-4e4b-b13c-6841222297e9?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4cc1fdf9-7ea1-4e4b-b13c-6841222297e9?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4cc1fdf9-7ea1-4e4b-b13c-6841222297e9?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4cc1fdf9-7ea1-4e4b-b13c-6841222297e9?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4cc1fdf9-7ea1-4e4b-b13c-6841222297e9?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4cc1fdf9-7ea1-4e4b-b13c-6841222297e9?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&" className="aspect-[1.5] object-contain object-center w-full overflow-hidden max-md:max-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <PageFooter />
    </div>

  );
}
