
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import PageFooter from '@/components/pageFooter';

export default function MissionPage() {
  return (
    <div className="bg-[#FEFDF9] flex flex-col items-stretch">

      <div className="flex-col items-center overflow-hidden relative flex min-h-[300px] px-20 max-md:px-5">
        <Image
          src="/lincolnmem.jpg"
          alt="Empowering Image"
          width={4800}
          height={2812}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative top-5/6 text-[#FEFDF9] text-center text-5xl font-raleway font-bold leading-[80px] max-w-screen-md mt-28 max-md:max-w-full max-md:mt-10">
          OUR MISSION
        </div>

      </div>
      <div className="items-center bg-[#FCF9F0] shadow-inner w-screen flex flex-col">
        <div className="text-[#2F3F3D] text-center text-6xl font-imfell font-medium leading-[67px] px-20 mt-28 max-md:max-w-full max-md:text-4xl max-md:leading-[54px] max-md:mt-10">
          Democratizing Legal Knowledge For All, One Question At a Time
        </div>
        <div className="items-center bg-[#FCF9F0] flex flex-col px-20 mt-16 mb-16 max-md:px-5 shadow-inner">
        <div className="text-black text-center text-xl font-raleway leading-24 max-w-screen-md mt-6 mb-6max-md:max-w-full max-md:mb-10">
        Our dream is to revolutionize the legal landscape, making legal literacy a common asset, not a privilege. This dream is rooted in our mission to empower every individual with accessible, comprehensible legal knowledge through Ask Abe. This includes our commitment to keeping this invaluable tool free forever, and our ambition to expand its benefits globally. We envision a future where every citizen, regardless of background or location, is equipped with the tools to navigate the legal world confidently, contributing to a more just, informed, and equitable society.
        </div>
      </div>
        <div className="text-black text-center font-raleway text-lg w-5/6 leading-7 max-w-screen-lg mt-6  max-md:max-w-full max-md:mb-10">
          {" "}
        </div>
      </div>
      <div className="items-stretch bg-[#FCF9F0] flex flex-col px-44 max-md:px-5">
        <Image

          width={2000}
          height={1500}
          src="/mission.jpg"
          alt="Company Story"
          className="aspect-[1.78] object-contain object-center w-full overflow-hidden mt-8 mb-20 max-md:max-w-full max-md:my-10"
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
                <div className="text-black text-lg text-base font-raleway leading-24 mt-6 max-md:max-w-full">
                  In today&apos;s complex legal landscape, a significant challenge lies in the widespread lack of understanding of laws and regulations. This issue disproportionately affects individuals, especially those from historically undereducated, resource-limited, and marginalized communities. For them, the absence of basic legal knowledge often leads to greater vulnerability and injustice, as they lack the means to access legal assistance. On a societal level, the problem runs deeper. The legal system is riddled with artificial and longstanding barriers that hinder the democratization of legal knowledge. A society where citizens are forced to rely on paid legal services for even basic legal understanding is fundamentally flawed. It stifles informed citizenship and perpetuates inequities. Providing every citizen with the tools and capability to grasp essential laws and regulations is not just a matter of individual empowerment, but a cornerstone for a more just, informed, and equitable society.
                </div>

              </div>
            </div>
            <div className="flex flex-col items-stretch w-6/12 ml-5 max-md:w-full max-md:ml-0">
              <Image
                src="/just1.jpg"
                alt="People Image"
                width={4373}
                height={2452}
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
            In the intricate realm of legal knowledge, traditional methods of accessing information have often been time-consuming and fraught with complexities. This is where the transformative power of AI comes into play, and our tool, Ask Abe, is at the forefront of this revolution.

            Ask Abe is not just a passive repository of legal information; it is an interactive guide. It goes beyond merely retrieving legal facts; it engages users in a dynamic conversation. By asking targeted, intuitive questions, Ask Abe helps users clarify and refine their legal queries. This interactive dialogue ensures that the information provided is not only accurate but also precisely tailored to the unique needs of each user.

            This feature of Ask Abe is crucial in simplifying the legal research process. Often, individuals may not fully understand what specific legal information they need. Ask Abe&apos;s ability to ask pertinent questions and interpret responses enables it to guide users through the often complex web of legal terminology and concepts. This not only aids in pinpointing the exact legal information required but also enhances the user&apos;s understanding of their own legal situation.

            In essence, Ask Abe democratizes legal understanding. By making legal knowledge accessible, comprehensible, and personalized, we are not only empowering individuals but also fostering a more legally informed society. This is how AI can not only assist but revolutionize the way we interact with the legal world, breaking down barriers and opening new avenues for legal empowerment and education.
          </div>
        </div>
      </div>

      <div className="items-center bg-[#FAF5E6] flex flex-col px-5">
        <div className="w-full max-w-[1312px] mt-16 mb-16 max-md:max-w-full max-md:my-10">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-6/12 max-md:w-full max-md:ml-0">
              <div className="items-stretch flex flex-col max-md:max-w-full max-md:mt-10">
                <div className="text-[#2F3F3D] text-5xl font-cinzel leading-[58px] max-md:max-w-full max-md:text-4xl max-md:leading-[54px]">
                  Who does this benefit?
                </div>
                <div className="text-black text-lg text-base font-raleway leading-6 mt-6 max-md:max-w-full">
                  In short, everyone. </div>
                <div className="text-black text-lg text-base font-raleway leading-24 mt-4 max-md:max-w-full">
                  The profound impact of understanding the laws that govern our society cannot be overstated. It is a powerful tool that benefits everyone, cutting across various strata of society. Our AI tool, Ask Abe, plays a pivotal role in this process of empowerment.

                  For the individual, the knowledge of laws and regulations provided by Ask Abe is more than just information; it&apos;s a means to navigate daily life with newfound confidence. Knowing one’s rights and responsibilities demystifies the legal aspects of everyday scenarios, from signing a lease to understanding workplace rights. This clarity not only fosters a sense of security but also encourages proactive engagement in legal matters.

                  This benefit extends to marginalized and underrepresented communities as well. Often, these groups are the most impacted by the lack of accessible legal information. Ask Abe serves as a bridge, reducing the knowledge gap and providing these communities with the tools they need to assert their rights and protect their interests. By democratizing legal knowledge, Ask Abe is instrumental in leveling the playing field and promoting social justice.

                  On a broader scale, a society where citizens are informed about their legal environment is a society with a stronger foundation. Knowledgeable citizens are more likely to make informed decisions, contribute positively to their communities, and participate actively in the democratic process. They become advocates not just for themselves but for their community, fostering a culture of legal awareness and civic responsibility.

                </div>

              </div>
            </div>
            <div className="flex flex-col items-stretch w-6/12 ml-5 max-md:w-full max-md:ml-0">
              <Image
                src="/people.jpg"
                alt="People Image"
                width={4373}
                height={2452}
                className="aspect-[1.76] object-contain object-center w-full overflow-hidden grow max-md:max-w-full max-md:mt-2"
              />
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
                  In our vision for a just and equitable future, keeping Ask Abe free forever stands as a cornerstone of our commitment. We believe that access to quality legal information is a fundamental right, not a luxury, and this principle guides our long-term goals and impact strategy. By ensuring that Ask Abe remains a free resource, we are dedicated to upholding the ideal that every individual, regardless of their economic status, has the right to legal knowledge and empowerment. This unwavering dedication to free access is not just about providing a service; it&apos;s about nurturing a more legally informed and fair society where justice and knowledge are universally accessible.
                  </div>

                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0">
              <div className="flex grow justify-between gap-5 max-md:mt-10">
                <div className="self-stretch flex grow basis-[0%] flex-col">
                  <div className="self-stretch text-black text-2xl font-raleway font-bold leading-9">Expand Globally</div>
                  <div className="self-stretch text-black text-base font-raleway leading-6 mt-4">
                  Our vision for Ask Abe transcends borders, envisioning a future where this powerful tool serves citizens across the globe. In our long-term goals, we are committed to expanding Ask Abe&apos;s reach, adapting and customizing it to align with the diverse legal systems and languages of different countries. We understand that the need for accessible legal information is a global one, and our aim is to meet this need by providing a universally accessible platform. By expanding globally, we aspire not only to widen our impact but also to foster a worldwide community where legal understanding is a shared and common resource, bringing the power of informed legal knowledge to every corner of the world.
                  </div>

                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0">
              <div className="flex grow justify-between gap-5 max-md:mt-10">
                <div className="self-stretch flex grow basis-[0%] flex-col">
                  <div className="self-stretch text-black text-2xl font-raleway font-bold leading-9">Fundraising Challenges</div>
                  <div className="self-stretch text-black text-base font-raleway leading-6 mt-4">
                  As we steadfastly commit to keeping Ask Abe free forever, we face the inevitable challenges of funding and resources, especially in our quest to scale this tool globally. Balancing our dedication to free access with the realities of expanding our reach presents a unique set of financial hurdles. We are actively seeking supporters and partners who share our vision of universal legal empowerment and are willing to join us in this journey. Your support is not just a contribution to a project; it&apos;s an investment in a global movement towards making legal knowledge accessible to every individual, regardless of their location or financial status.
                  </div>

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
