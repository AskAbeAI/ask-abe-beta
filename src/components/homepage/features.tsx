
import * as React from "react";
import Image from "next/image";

const FeaturesSection: React.FC = () => {
  return (


    <main className="items-center bg-[#FAF5E6] flex w-full flex-col px-16 py-12 max-md:max-w-full max-md:px-5">
      <header className="text-black text-center text-base font-semibold leading-6 self-center whitespace-nowrap mt-16 max-md:mt-10">

      </header>
      <section className="items-stretch self-center flex w-[768px] max-w-full flex-col mt-4">
        <h1 className="text-black text-center text-5xl font-bold leading-[58px] max-md:max-w-full max-md:text-4xl max-md:leading-[54px]">
          Ask Abe's Features
        </h1>
        <p className="text-black text-center text-lg leading-7 mt-6 max-md:max-w-full">

        </p>
      </section>
      <section className="self-stretch mt-20 pl-8 pr-8 max-md:max-w-full max-md:mt-10 max-md:px-5">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
          <div className="flex flex-col items-stretch w-[22%] max-md:w-full max-md:ml-0">
            <div className="items-center flex flex-col mt-2.5 max-md:mt-10">

              <div className="items-stretch self-stretch flex flex-col mt-6">
                <h2 className="text-black text-center text-2xl font-bold leading-9">
                  Expandable Citations
                </h2>
                <p className="text-black text-center text-base leading-6 mt-4">
                  View citations collapsed or expanded. Whichever suits your preference.
                </p>
              </div>

              <div className="items-stretch self-stretch flex flex-col mt-6 pt-96">
                <h2 className="text-black text-center text-2xl font-bold leading-9">
                  Clarification Question Answer Options
                </h2>
                <p className="text-black text-center text-base leading-6 mt-4">
                  With multiple choice options, you can focus more on getting the answer fast. If the clarifying question doesn't apply, click 'not applicable', or if none of the answers suit your needs -- write your own custom response.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-stretch w-[56%] ml-5 max-md:w-full max-md:ml-0">
            <img
              loading="lazy"
              src="/feature.png" alt="Image 3"
            />
          </div>
          <div className="flex flex-col items-stretch w-[22%] ml-5 max-md:w-full max-md:ml-0">
            <div className="items-center flex flex-col mt-2.5 max-md:mt-10">

              <div className="items-stretch self-stretch flex flex-col mt-6">
                <h2 className="text-black text-center text-2xl font-bold leading-9">
                  Chat Options & Jurisdictions
                </h2>
                <p className="text-black text-center text-base leading-6 mt-4">
                  Don't feel like getting asked clarifying questions, check skip clarifications to turn this off.
                  Also, select from which jurisdiction you would like Abe to focus his answer. (More jurisdictions coming soon)
                </p>
              </div>

              <div className="items-stretch self-stretch flex flex-col mt-6 pt-96">
                <h2 className="text-black text-center text-2xl font-bold leading-9">
                  Ask a follow-up question
                </h2>
                <p className="text-black text-center text-base leading-6 mt-4">
                  When Abe gives you an answer to your original query, but you're left with more questions, ask a follow-up question.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
export default FeaturesSection;