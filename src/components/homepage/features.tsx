
import * as React from "react";
import Image from "next/image";

const FeaturesSection: React.FC = () => {
  return (
    <section className="items-center bg-[#FAF5E6] shadow-inner flex flex-col px-16 max-md:px-5">
    <h1 className="text-black text-center text-5xl font-imfell font-bold leading-[58px] max-w-screen-md mt-28 max-md:max-w-full max-md:text-4xl max-md:leading-[54px] max-md:mt-10">
    Ask Abe&apos;s Features
    </h1>
    <div className="self-stretch mt-20 mb-24 pl-8 pr-8 max-md:max-w-full max-md:my-10 max-md:px-5">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
        <div className="flex flex-col items-stretch w-[22%] max-md:w-full max-md:ml-0">
          <div className="items-stretch flex flex-col mt-2.5 max-md:mt-10">
            <h2 className="text-black text-center font-imfell text-2xl font-bold leading-9">
            Expandable Citations
            </h2>
            <p className="text-black text-center font-montserrat text-base leading-6 mt-4">
            View citations collapsed or expanded. Whichever suits your preference.
            </p>
            <h2 className="text-black text-center font-imfell text-2xl font-bold leading-9 mt-52 max-md:mt-10">
            Clarification Question Answer Options
            </h2>
            <p className="text-black text-center font-montserrat text-base leading-6 mt-4">
            With multiple choice options, you can focus more on getting the answer fast. If the clarifying question doesn&apos;t apply, click &apos;not applicable&apos;, or if none of the answers suit your needs -- write your own custom response.

            </p>
          </div>
        </div>
        <div className="flex flex-col items-stretch w-[56%] ml-5 max-md:w-full max-md:ml-0">
          <img
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/92af1210-1dcf-4ec1-bc1e-2c5ac388ddac?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/92af1210-1dcf-4ec1-bc1e-2c5ac388ddac?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/92af1210-1dcf-4ec1-bc1e-2c5ac388ddac?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/92af1210-1dcf-4ec1-bc1e-2c5ac388ddac?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/92af1210-1dcf-4ec1-bc1e-2c5ac388ddac?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/92af1210-1dcf-4ec1-bc1e-2c5ac388ddac?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/92af1210-1dcf-4ec1-bc1e-2c5ac388ddac?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/92af1210-1dcf-4ec1-bc1e-2c5ac388ddac?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&"className="aspect-[1.13] object-contain object-center w-full overflow-hidden grow max-md:max-w-full max-md:mt-10"
            alt="Feature Image"
          />
        </div>
        <div className="flex flex-col items-stretch w-[22%] ml-5 max-md:w-full max-md:ml-0">
          <div className="items-stretch self-stretch flex grow flex-col max-md:mt-10">
            <h2 className="text-black text-center font-imfell text-2xl font-bold leading-9">
            Chat Options & Jurisdictions
            </h2>
            <p className="text-black text-center font-montserrat text-base leading-6 mt-4">
            Don&apos;t feel like getting asked clarifying questions, check skip clarifications to turn this off.
                  Also, select from which jurisdiction you would like Abe to focus his answer. (More jurisdictions coming soon)
            </p>
            <h2 className="text-black text-center font-imfell text-2xl font-bold leading-9 mt-56 max-md:mt-10">
            Ask a follow-up question
            </h2>
            <p className="text-black text-center font-montserrat text-base leading-6 mt-4">
            When Abe gives you an answer to your original query, but you&apos;re left with more questions, ask a follow-up question.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>


 
  );
}
export default FeaturesSection;