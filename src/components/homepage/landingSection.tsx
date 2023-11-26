import * as React from "react";
import Image from "next/image";
import Link from "next/link";


const LandingSection: React.FC = () => {
  return (
    <section className="items-center bg-[#FAF5E6] shadow-inner flex w-full flex-col pb-28 pt-8">

      <div className="gap-2 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
        <div className="flex flex-col items-stretch w-8/12 max-md:w-full max-md:ml-0">
          <Image
            src="/ASKABELOGO.png" className="aspect-[0.96] object-contain object-center w-full overflow-hidden max-md:max-w-full max-md:mt-10"
            alt="Legal Research Image"
            width={600}
            height={600}
          />
        </div>
        <div className="flex flex-col container items-stretch w-8/12 ">
          <div className="flex flex-col my-auto max-md:max-w-full max-md:mt-10">
            <div className="items-stretch self-stretch flex flex-col mt-4 max-md:max-w-full">
              <div className="text-black text-9xl font-raleway leading- max-md:max-w-full max-md:text-9xl">
                <Image src="/title1.png"
                  alt="Legal Research Image"
                  width={700}
                  height={500} />
              </div>
              <p className="text-black text-lg pt-1 font-raleway leading-7 mt-6 max-md:max-w-full">
                Your Legal Education Assistant
              </p>
            </div>
            <div className="items-fit flex  max-w-full justify-between mt-10">
              <Link href="/playground">
              <button className="button1">
                <span className="font-raleway">Enter Abe&apos;s Law Library</span>
                <div className="top"></div>
                <div className="left"></div>
                <div className="bottom"></div>
                <div className="right"></div>
              </button>
              </Link>

            </div>

          </div>
        </div>
      </div>

    </section>
  );
}

export default LandingSection;