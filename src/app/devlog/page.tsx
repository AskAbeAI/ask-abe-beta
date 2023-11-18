import React from 'react';
import Link from 'next/link';


export default function DevPage() {
  return (

    <div className="h-screen w-full bg-[#FEFDF9]">
    <div className="flex-col justify-center px-16">
      <div className="text-black text-center text-base font-montserrat font-semibold leading-6 self-center whitespace-nowrap mt-16 max-md:mt-10">
        Ask Abe
      </div>
      <div className="items-center self-center flex  max-w-full flex-col mt-4">
        <div className="text-black text-center text-6xl font-imfell font-bold leading-[67px] max-md:max-w-full max-md:text-4xl max-md:leading-[54px]">
          DevLog
        </div>
        <div className="text-black text-center text-lg leading-7 mt-6 max-md:max-w-full">

        </div>
      </div>


      <div className="flex flex-col mt-16 mb-10 ">
        <div className="">
          <div className="gap-5 flex justify-center">
            <div className="flex flex-col items-center justify-center w-[20%] max-md:w-full max-md:ml-0">
              <div className="items-stretch flex grow flex-col max-md:mt-8">
                <img
                  loading="lazy"
                  srcSet="/devlogimages/firstdevlog.png"
                  className="aspect-[1.39] object-contain object-center w-full overflow-hidden"
                />

                <Link href="/devlogblog" className="text-black text-2xl font-montserrat font-bold leading-8 mt-2">
                Relaunching Ask Abe Beta 0.2
                </Link>
                <div className="text-black text-base leading-6 mt-2">
                  
                </div>
                <div className="items-stretch flex justify-between gap-4 mt-6">

                  <div className="items-stretch flex grow basis-[0%] flex-col">
                    <div className="text-black text-sm font-semibold leading-5">
                      Madeline
                    </div>
                    <div className="items-stretch flex justify-between gap-5 max-md:justify-center">
                      <div className="text-black text-sm leading-5 self-center my-auto">
                        15 Nov 2023
                      </div>

                      <div className="text-black text-sm leading-5 self-center whitespace-nowrap my-auto">
                        5 min read
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="flex flex-col items-stretch w-[20%] ml-5 max-md:w-full max-md:ml-0">
              <div className="items-stretch flex grow flex-col max-md:mt-8">
                <img
                  loading="lazy"
                  srcSet="/devlogimages/firstdevlog.png"
                  className="aspect-[1.39] object-contain object-center w-full overflow-hidden"
                />
             
                <Link href="/devlogblog" className="text-black text-2xl font-bold leading-8 mt-2">
                  Website Redesign and Conversation AI Integration
                </Link>
                <div className="text-black text-base leading-6 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse varius enim in eros.
                </div>
                <div className="items-stretch flex justify-between gap-4 mt-6">

                  <div className="items-stretch flex grow basis-[0%] flex-col">
                    <div className="text-black text-sm font-semibold leading-5">
                      Madeline
                    </div>
                    <div className="items-stretch flex justify-between gap-5 max-md:justify-center">
                      <div className="text-black text-sm leading-5 self-center my-auto">
                        15 Nov 2023
                      </div>

                      <div className="text-black text-sm leading-5 self-center whitespace-nowrap my-auto">
                        5 min read
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[20%] ml-5 max-md:w-full max-md:ml-0">
              <div className="items-stretch flex grow flex-col max-md:mt-8">
                <img
                  loading="lazy"
                  srcSet="/devlogimages/firstdevlog.png"
                  className="aspect-[1.39] object-contain object-center w-full overflow-hidden"
                />
             
                <Link href="/devlogblog" className="text-black text-2xl font-bold leading-8 mt-2">
                  Website Redesign and Conversation AI Integration
                </Link>
                <div className="text-black text-base leading-6 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse varius enim in eros.
                </div>
                <div className="items-stretch flex justify-between gap-4 mt-6">

                  <div className="items-stretch flex grow basis-[0%] flex-col">
                    <div className="text-black text-sm font-semibold leading-5">
                      Madeline
                    </div>
                    <div className="items-stretch flex justify-between gap-5 max-md:justify-center">
                      <div className="text-black text-sm leading-5 self-center my-auto">
                        15 Nov 2023
                      </div>

                      <div className="text-black text-sm leading-5 self-center whitespace-nowrap my-auto">
                        5 min read
                      </div> 
          </div>
        </div>
      </div> 
          </div>
</div>  */}
          </div >
        </div >
        {/* <div className="mt-16 max-md:max-w-full max-md:mt-10">
          <div className="gap-5 flex justify-center">
            <div className="flex flex-col items-stretch w-[20%] max-md:w-full max-md:ml-0">
              <div className="items-stretch flex grow flex-col max-md:mt-8">
                <img
                  loading="lazy"
                  srcSet="/devlogimages/firstdevlog.png"
                  className="aspect-[1.39] object-contain object-center w-full overflow-hidden"
                />
               
                <Link href="/devlogblog" className="text-black text-2xl font-bold leading-8 mt-2">
                  Website Redesign and Conversation AI Integration
                </Link>
                <div className="text-black text-base leading-6 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse varius enim in eros.
                </div>
                <div className="items-stretch flex justify-between gap-4 mt-6">

                  <div className="items-stretch flex grow basis-[0%] flex-col">
                    <div className="text-black text-sm font-semibold leading-5">
                      Madeline
                    </div>
                    <div className="items-stretch flex justify-between gap-5 max-md:justify-center">
                      <div className="text-black text-sm leading-5 self-center my-auto">
                        15 Nov 2023
                      </div>

                      <div className="text-black text-sm leading-5 self-center whitespace-nowrap my-auto">
                        5 min read
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[20%] ml-5 max-md:w-full max-md:ml-0">
              <div className="items-stretch flex grow flex-col max-md:mt-8">
                <img
                  loading="lazy"
                  srcSet="/devlogimages/firstdevlog.png"
                  className="aspect-[1.39] object-contain object-center w-full overflow-hidden"
                />
                
                <Link href="/devlogblog" className="text-black text-2xl font-bold leading-8 mt-2">
                  Website Redesign and Conversation AI Integration
                </Link>
                <div className="text-black text-base leading-6 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse varius enim in eros.
                </div>
                <div className="items-stretch flex justify-between gap-4 mt-6">

                  <div className="items-stretch flex grow basis-[0%] flex-col">
                    <div className="text-black text-sm font-semibold leading-5">
                      Madeline
                    </div>
                    <div className="items-stretch flex justify-between gap-5 max-md:justify-center">
                      <div className="text-black text-sm leading-5 self-center my-auto">
                        15 Nov 2023
                      </div>

                      <div className="text-black text-sm leading-5 self-center whitespace-nowrap my-auto">
                        5 min read
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[20%] ml-5 max-md:w-full max-md:ml-0">
              <div className="items-stretch flex grow flex-col max-md:mt-8">
                <img
                  loading="lazy"
                  srcSet="/devlogimages/firstdevlog.png"
                  className="aspect-[1.39] object-contain object-center w-full overflow-hidden"
                />
               
                <Link href="/devlogblog" className="text-black text-2xl font-bold leading-8 mt-2">
                  Website Redesign and Conversation AI Integration
                </Link>
                <div className="text-black text-base leading-6 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse varius enim in eros.
                </div>
                <div className="items-stretch flex justify-between gap-4 mt-6">

                  <div className="items-stretch flex grow basis-[0%] flex-col">
                    <div className="text-black text-sm font-semibold leading-5">
                      Madeline
                    </div>
                    <div className="items-stretch flex justify-between gap-5 max-md:justify-center">
                      <div className="text-black text-sm leading-5 self-center my-auto">
                        15 Nov 2023
                      </div>

                      <div className="text-black text-sm leading-5 self-center whitespace-nowrap my-auto">
                        5 min read
                      </div>
                    </div>
                  </div> */}
        {/* </div>
              </div>
            </div>
          </div>
        </div> */}
      </div >
    </div >
  </div >


  );
}
