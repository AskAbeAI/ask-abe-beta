import * as React from "react";
import Image from "next/image";

const LegalResearchComponent: React.FC = () => {
  return (
    <section className="items-center shadow-inner bg-[#FEFDF9] flex w-full flex-col px-2 py-28 max-md:max-w-full max-md:py-24">
      <div className="mb-0 w-full max-w-[1312px] max-md:max-w-full max-md:mb-2.5">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
          <div className="flex flex-col items-stretch w-6/12 max-md:w-full max-md:ml-0">
            <Image
              src="/books.png" className="aspect-[0.96] object-contain object-center w-full overflow-hidden max-md:max-w-full max-md:mt-10"
              alt="Legal Research Image"
              width={500}
              height={500}
            />
          </div>
          <div className="flex flex-col items-stretch w-6/12 ml-5 max-md:w-full max-md:ml-0">
            <div className="flex flex-col my-auto max-md:max-w-full max-md:mt-10">
              {/* <h2 className="text-black text-center text-base font-semibold leading-6 self-stretch whitespace-nowrap max-md:max-w-full">
                Innovative
              </h2> */}
              <div className="items-stretch self-stretch flex flex-col mt-4 max-md:max-w-full">
                <h1 className="text-[#2F3F3D] text-5xl font-cinzel font-semibold leading-[57.6px] max-md:max-w-full max-md:text-4xl">
                  Transforming Legal Education with Conversational AI
                </h1>
                <p className="text-black text-xl font-raleway font-light leading-7 mt-6 max-md:max-w-full">
                Our conversational AI offers a groundbreaking approach to understanding laws and rights, tailored for everyday citizens. 
                Designed for education and simplification, it allows for quick, accurate retrieval of necessary information, bypassing complex traditional methods. 
                 Embrace a user-friendly experience that enhances your understanding of the legalities that affect your life. 
                 Say goodbye to the hassle of navigating intricate legal texts and welcome a new era of informed empowerment.
                </p>
              </div>
              <div className="items-stretch flex max-w-full gap-4 mt-10 self-start">

                <a href="/how" className="text-black font-raleway text-base leading-6 whitespace-nowrap justify-center items-center border grow px-5 py-3 border-solid border-black">
                  How to Use
                </a>
              </div>

              {/* <div className="items-stretch flex w-60 max-w-full justify-between gap-5 mt-10">
                <a href="#" className="text-black text-base leading-6 whitespace-nowrap justify-center items-center border grow px-5 py-3 border-solid border-black">
                  Learn More
                </a>
                {/* <div className="justify-center items-stretch self-center flex gap-2 my-auto">
                  <div className="text-black text-base leading-6">Sign Up</div>
                </div> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </section >
  );
}

export default LegalResearchComponent;