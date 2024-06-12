import React from 'react';
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
          className="aspect-[1.78] object-contain object-center w-full overflow-hidden mt-28 mb-28 max-md:max-w-full max-md:my-10"
        />
      </div>
      <div className="items-center bg-[#FAF5E6] flex flex-col px-5">
        <div className="w-full max-w-[1312px] mt-16 mb-24 max-md:max-w-full max-md:my-10">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-6/12 max-md:w-full max-md:ml-0">
              <div className="items-stretch flex flex-col max-md:max-w-full max-md:mt-10">
                <div className="flex justify-center text-center text-[#2F3F3D] text-5xl font-cinzel leading-[58px] max-md:max-w-full max-md:text-4xl max-md:leading-[54px]">
                  Confronting the Challenges of Accessibility
                </div>
                <div className="text-black text-lg font-raleway leading-24 mt-6 max-md:max-w-full">
                The lack of legal knowledge disproportionately affects marginalized communities, leading to vulnerability and injustice. Society's reliance on paid legal services for basic understanding perpetuates inequities. Empowering everyone with essential legal knowledge is key to a more just and equitable society.
                </div>

              </div>
            </div>
            <div className="flex flex-col items-stretch w-6/12 ml-5 max-md:w-full max-md:ml-0">
              <Image
                src="/mission/just1.jpg"
                alt="People Image"
                width={634}
                height={423}
                className="aspect-[1.76] object-contain object-center w-full overflow-hidden grow max-md:max-w-full max-md:mt-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="items-center bg-[#FCF9F0] flex flex-col px-5 shadow-inner">
        <div className="items-stretch flex w-full max-w-[1312px] justify-between gap-5 mt-28 mb-24 max-md:max-w-full max-md:flex-wrap max-md:my-10">
          <div className="flex justify-center text-center text-[#2F3F3D] text-4xl font-cinzel leading-10 grow shrink basis-auto max-md:max-w-full">
            How can AI help?
          </div>
          <div className="text-black text-lg font-raleway leading-24 grow shrink basis-auto self-start w-7/12 max-md:max-w-full">
          Traditional methods of accessing legal information are time-consuming and complex. Ask Abe revolutionizes this by using AI to provide an interactive, dynamic guide. It engages users in conversations, asking intuitive questions to clarify and refine legal queries. This ensures that the information provided is accurate and tailored to each user's needs. Ask Abe simplifies the legal research process and enhances understanding, making legal knowledge accessible and personalized. By democratizing legal understanding, Ask Abe empowers individuals and fosters a more informed society, revolutionizing the way we interact with the legal world
          </div>
        </div>
      </div>

      <div className="items-center bg-[#FAF5E6] flex flex-col px-5">
        <div className="w-full max-w-[1312px] mt-16 mb-16 max-md:max-w-full max-md:my-10">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-6/12 mr-5 max-md:w-full max-md:ml-0">
              <Image
                src="/mission/people.jpg"
                alt="People Image"
                width={638}
                height={432}
                className="aspect-[1.76] object-contain object-center w-full overflow-hidden grow max-md:max-w-full max-md:mt-2"
              />
            </div>
            <div className="flex flex-col items-stretch w-6/12 max-md:w-full max-md:ml-0">
              <div className="items-stretch flex flex-col max-md:max-w-full max-md:mt-10">
                <div className="text-[#2F3F3D] text-5xl font-cinzel leading-[58px] max-md:max-w-full max-md:text-4xl max-md:leading-[54px]">
                  Who does this benefit?
                </div>
                <div className="text-black text-lg font-raleway leading-6 mt-6 max-md:max-w-full">
                  In short, everyone. </div>
                <div className="text-black text-lg font-raleway leading-24 mt-4 max-md:max-w-full">
                Ask Abe, our AI tool, plays a key role in this empowerment. For individuals, legal knowledge from Ask Abe means navigating daily life with confidence, understanding rights and responsibilities in scenarios like signing a lease or knowing workplace rights. This clarity fosters security and proactive engagement in legal matters.

Marginalized and underrepresented communities also gain from this accessible legal information. Ask Abe bridges the knowledge gap, helping these groups assert their rights and protect their interests. By democratizing legal knowledge, Ask Abe promotes social justice and levels the playing field.



                  <div className="text-black text-lg font-raleway leading-6 mt-6 max-md:max-w-full">
                  An informed society with knowledgeable citizens contributes positively, makes informed decisions, and actively participates in the democratic process. This fosters a culture of legal awareness and civic responsibility, strengthening the foundation of our society.
                    
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>


      <div className="items-stretch bg-[#FAF5E6] shadow-inner flex flex-col px-16 max-md:px-5">
        <div className="mt-16 max-md:max-w-full max-md:mt-10">
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
                  We believe legal information is a fundamental right, not a luxury. By keeping Ask Abe free, we ensure everyone, regardless of economic status, has access to legal knowledge and empowerment. This commitment nurtures a more informed and fair society.
                  </div>

                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0">
              <div className="flex grow justify-between gap-5 max-md:mt-10">
                <div className="self-stretch flex grow basis-[0%] flex-col">
                  <div className="self-stretch text-black text-2xl font-raleway font-bold leading-9">Expand Globally</div>
                  <div className="self-stretch text-black text-base font-raleway leading-6 mt-4">
                  We envision Ask Abe serving citizens worldwide, adapting to diverse legal systems and languages. By expanding globally, we aim to create a community where legal understanding is a shared resource, bringing informed legal knowledge to every corner of the world.
                  </div>

                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0">
              <div className="flex grow justify-between gap-5 max-md:mt-10">
                <div className="self-stretch flex grow basis-[0%] flex-col">
                  <div className="self-stretch text-black text-2xl font-raleway font-bold leading-9">Fundraising Challenges</div>
                  <div className="self-stretch text-black text-base font-raleway leading-6 mt-4">
                   Balancing free access with expansion presents financial hurdles. We seek supporters who share our vision of universal legal empowerment. Your support is an investment in making legal knowledge accessible to everyone, everywhere.
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <PageFooter />

    </div>
  );
};


