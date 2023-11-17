import React from "react";

export default function Blog() {
  return (
    <div className="bg-[#FEFDF9] flex w-full flex-col px-20 py-12 max-md:max-w-full max-md:px-5">
      <div className="items-stretch self-center flex w-[768px] max-w-full flex-col mt-16 pt-6 max-md:mt-10">
        <div className="text-black text-4xl font-courierp font-bold leading-10 max-md:max-w-full">
          Relaunching Ask Abe Beta v0.2: A New Era of Digital Interaction
        </div>
        <div className="text-black font-opensans text-md leading-6 mt-6 max-md:max-w-full">
          In the heart of our transformative journey, a pivotal moment has arrived: the relaunch of Ask Abe Beta v0.2.
          This milestone represents more than just an update; it's a leap forward in how our users interact with Abe.
          Our team has dedicated countless hours to refining Ask Abe, ensuring it not only meets but surpasses user expectations.
        </div>
        <div className="text-black text-md font-opensans leading-6 mt-4 max-md:max-w-full">
          We aimed to modify Abe, so that not only was it more responsive but also more intuitive and engaging.
          Our goal was to transcend the traditional boundaries of AI communication, offering our users an experience that felt genuinely conversational.
        </div>
        <div className="items-stretch flex flex-col mt-16 max-md:max-w-full max-md:mt-10">
          <img
            loading="lazy"
            srcSet="/devlogimages/firstdevlog.png"
            className="aspect-[1.92] object-contain object-center w-full overflow-hidden max-md:max-w-full"
          />

        </div>
        <div className="text-black text-2xl font-courierp font-bold leading-7 mt-16 max-md:max-w-full max-md:mt-10">
          Creating Value

        </div>
        <div className="text-black text-md font-opensans leading-6 mt-4 max-md:max-w-full">
          As part of our broader website redesign, integrating Ask Abe Beta v0.2 has been a critical focus.
          We have ensured that Abe seamlessly blends with the new aesthetic and functionality of our site, offering a cohesive and enhanced user experience.
        </div>
        <div className="text-black text-2xl font-courierp font-bold leading-7 mt-16 max-md:max-w-full max-md:mt-10">
          New Features

        </div>
        <div className="text-black text-md leading-6 mt-4 max-md:max-w-full">
          <h1 className="font-bold font-opensans">🔍  Expandable Citations: Personalized Information Access</h1>
          <p className="pt-4 font-opensans">In our pursuit of enhancing user experience, Ask Abe Beta v0.2 introduces Expandable Citations.
            This feature allows you to view citations in a format that suits your preference - either collapsed for a concise view or expanded for detailed insights.
            It's all about giving you control over how you receive and process information.
          </p>
          <h1 className="font-bold pt-12 font-opensans">🔄 Clarification Question Answer Options: Streamlining Communication</h1>
          <p className="pt-4 font-opensans">We understand the value of your time and clarity in communication.
            That's why Ask Abe Beta v0.2 offers Clarification Question Answer Options. This new feature presents multiple-choice responses to clarifying questions, enabling you to quickly navigate towards the most accurate answer.
            If a question doesn't apply, simply select 'not applicable' or provide a custom response to guide Abe in the right direction.
          </p>
          <h1 className="font-bold pt-12 font-opensans">⚙️ Chat Options & Jurisdictions: Tailored Interaction</h1>
          <p className="pt-4 font-opensans"> We recognize that every user has unique needs. With this in mind, Ask Abe Beta v0.2 includes Chat Options & Jurisdictions.
            You now have the option to skip clarifications if you prefer a more direct interaction. Additionally, you can select from various jurisdictions for Abe to focus on, ensuring that the answers you receive are relevant to your specific context.
            We're continually expanding our jurisdictional coverage to cater to a broader audience. Currently, we only offer California, however be on the look out for more jurisdictions soon!
          </p>
          <h1 className="font-bold pt-12 font-opensans">🔄 Ask a Follow-Up Question: Continuous Engagement</h1>
          <p className="pt-4 font-opensans">Your curiosity shouldn't end with just one answer.
            With the launch of Ask Abe Beta v0.2, we introduce the ability to Ask a Follow-Up Question.
            This feature ensures that if you have additional queries stemming from Abe's initial response, your quest for knowledge continues seamlessly. It's a commitment to providing a comprehensive and engaging conversational experience.
          </p>
        </div>
        <div className="text-black text-md leading-6 mt-9 max-md:max-w-full text-xl font-opensans">
          We celebrate the launch of Ask Abe Beta v0.2, but our journey is far from over.
          We are committed to continuous improvement, leveraging user feedback and technological advancements to keep evolving.
          Our vision is to make Ask Abe an indispensable tool for our users, a symbol of our dedication to innovation and exceptional customer experience.
        </div>

        {/* <div className="items-stretch bg-white bg-opacity-0 flex justify-between gap-5 mt-14 max-md:max-w-full max-md:flex-wrap max-md:mt-10">
          <div className="bg-black flex w-0.5 shrink-0 h-[84px] flex-col" />
          <div className="text-black text-xl italic leading-7 grow shrink basis-auto max-md:max-w-full">
            &quot;&quot;
          </div>
        </div>
        <div className="text-black text-md leading-6 mt-9 max-md:max-w-full">

        </div> */}




        <div className="bg-black self-center flex w-[768px] shrink-0 h-px flex-col mt-12 max-md:max-w-full max-md:mt-10" />
        <div className="items-stretch flex w-[249px] max-w-full gap-4 ml-64 mt-12 mb-10 max-md:ml-2.5 max-md:mt-10">

          <div className="items-stretch self-center flex grow basis-[0%] flex-col my-auto">
            <div className="text-black text-md font-semibold leading-6 whitespace-nowrap">
              Madeline
            </div>
            <div className="text-black text-md leading-6 whitespace-nowrap">
              Developer, Ask Abe AI
            </div>
          </div>
        </div>
      </div >
    </div>
  );
}