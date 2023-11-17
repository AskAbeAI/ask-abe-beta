"use client";
import React, { useState } from 'react';

import Image from 'next/image';

import Link from 'next/link';


export default function HowToPage() {
  return (

    <div className="h-screen w-full bg-[#FAF5E6]">
      <div className="items-center bg-[#FAF5E6] flex w-full flex-col px-16 py-12 max-md:max-w-full max-md:px-5">

        <div className="items-stretch self-center flex w-full max-w-full flex-col mt-4">
          <div className="text-black text-center text-5xl font-bold leading-auto max-md:max-w-full max-md:text-4xl max-md:leading-[54px]">
            How to Use Ask Abe
          </div>
        </div>

      </div>
      <div className="flex flex-col items-center gap-8 p-12 pl-56 pr-56 bg-[#FAF5E6]">
        {/* Step 1 */}
        <div className="bg-[#FEFDF9] rounded shadow-lg grid grid-cols-2 content-center">
          <div className="flex justify-center items-center p-6">
            <div className="text-center">
              <h2 className="text-xl font-cardo font-bold mb-2 ">Step 1: Get Started</h2>
              <p className="font-josefinsans text-gray-600">
                Sign Up or Log In: Start by signing up for an account if you&apos;re a new user, or log in with your existing credentials.
              </p>
            </div>
          </div>
          <div className=" pl-4 pt-4 pb-4">
            <Image
              src="/HowTo.png"
              alt="Legal Research Image"
              width={599.5}
              height={477.64}
            />
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#FEFDF9] rounded shadow-lg grid grid-cols-2 content-center">
          <div className="flex justify-center items-center p-6">
            <div className="text-center">
              <h2 className="text-xl font-cardo font-bold mb-2 ">Step 2: Ask a Question:</h2>
              <p className="font-josefinsans text-gray-600">
                Once logged in, navigate to the section where you can ask a question. Enter your question in the provided space.
              </p>
            </div>
          </div>
          <div className=" pl-4 pt-4 pb-4">
            <Image
              src="/HowTo.png"
              alt="Legal Research Image"
              width={599.5}
              height={477.64}
            />
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#FEFDF9] rounded shadow-lg grid grid-cols-2 content-center">
          <div className="flex justify-center items-center p-6">
            <div className="text-center">
              <h2 className="text-xl font-cardo font-bold mb-2 ">Step 3: Wait for Abe&apos;s Response:
              </h2>
              <p className="font-josefinsans text-gray-600">
                After submitting your question, wait for a response from Abe. This may take a moment so please wait patiently.

              </p>
            </div>
          </div>
          <div className=" pl-4 pt-4 pb-4">
            <Image
              src="/HowTo.png"
              alt="Legal Research Image"
              width={599.5}
              height={477.64}
            />
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-[#FEFDF9] rounded shadow-lg grid grid-cols-2 content-center">
          <div className="flex justify-center items-center p-6">
            <div className="text-center">
              <h2 className="text-xl font-cardo font-bold mb-2 ">Step 4: Review Answers and Select the Best-Fitting Answer or Provide Your Own:
              </h2>
              <p className="font-josefinsans text-gray-600">
                Abe&apos;s first responce provides follow up questions which will include multiple different answers or suggestions. Review these answers to see if any of them fit your question.
                If one of the provided answers fits your query, click on it. If none of the answers are suitable but you have a different answer in mind, click on the &apos;Other&apos; option and type your response to Abe&apos;s question. You may also select &apos;Not Applicable&apos; if the follow up question does not fit your original query.

              </p>
            </div>
          </div>
          <div className=" pl-4 pt-4 pb-4">
            <Image
              src="/HowTo.png"
              alt="Legal Research Image"
              width={599.5}
              height={477.64}
            />
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-[#FEFDF9] rounded shadow-lg grid grid-cols-2 content-center">
          <div className="flex justify-center items-center p-6">
            <div className="text-center">
              <h2 className="text-xl font-cardo font-bold mb-2 ">Step 5: Access and Review Full Citations:</h2>
              <p className="font-josefinsans text-gray-600">
                Citations for the information provided are displayed on the left side of the screen. These citations link to the sources of the information used in Abe&apos;s responses.
                To view a citation in full, you can either click on the citation button to open it in full screen or click on each individual citation to pop it out for detailed viewing.

              </p>
            </div>
          </div>
          <div className=" pl-4 pt-4 pb-4">
            <Image
              src="/HowTo.png"
              alt="Legal Research Image"
              width={599.5}
              height={477.64}
            />
          </div>
        </div>
      </div>
    </div>


  );
}
