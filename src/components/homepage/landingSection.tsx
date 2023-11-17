import * as React from "react";
import Image from "next/image";


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
              <div className="text-black text-9xl font-quicksand leading- max-md:max-w-full max-md:text-9xl">
                <Image src="/title1.png"
                  alt="Legal Research Image"
                  width={700}
                  height={500} />
              </div>
              <p className="text-black text-lg pt-1 font-font-family: 'Fira Sans', sans-serif leading-7 mt-6 max-md:max-w-full">
                Your Legal Research Assistant
              </p>
            </div>
            <div className="items-stretch flex w-60 max-w-full justify-between mt-10">
              <a href="/playground" className="box-border relative z-30 inline-flex items-center justify-center w-auto px-10 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-zinc-600 rounded-md cursor-pointer group ring-offset-2 ring-1 ring-zinc-300 ring-offset-zinc-200 hover:ring-offset-zinc-500 ease focus:outline-none">
                <div className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></div>
                <div className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></div>
                <div className="relative z-20 flex items-center font-quicksand text-sm">

                  Enter the Playground
                </div>
              </a>

            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

export default LandingSection;