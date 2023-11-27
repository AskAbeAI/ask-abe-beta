'use client';

import Link from 'next/link';
import Image from 'next/image';
import PageFooter from '@/components/pageFooter';



export default function HomePage() {
  return (
    <div className="h-screen w-full bg-[#FAF5E6]">
      <div className="flex justify-center items-center">

      </div>

      {/* Landing Section */}
      <section className="items-center bg-[#FAF5E6] shadow-inner flex w-full flex-col pb-12 pt-8">
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
                  A Conversational AI Legal Education Assistant
                </p>
              </div>
              <div className="items-fit flex  max-w-full justify-between mt-10">
                <Link href="/playground"
                      className="text-lg font-raleway rounded-sm font-bold px-6 py-3 leading-none text-white border focus:outline-none focus:shadow-outline bg-gradient-to-b hover:text-[#4A4643] hover:from-green-300 from-[#4A4643] to-[#4A4643]">
                      Enter Abe&apos;s Law Library
            
       
                  {/* <button className="button1">
                    <span className="font-raleway">Enter Abe&apos;s Law Library</span>
                    <div className="top"></div>
                    <div className="left"></div>
                    <div className="bottom"></div>
                    <div className="right"></div>
                  </button> */}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="items-center bg-[#FCF8EE] shadow-inner flex flex-col px-5">
        <div className="w-full max-w-[1312px] mt-16 mb-16 max-md:max-w-full max-md:my-10">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-6/12 max-md:w-full max-md:ml-0">
              <div className="items-stretch flex flex-col max-md:max-w-full max-md:mt-10">

                <div className="text-black text-4xl font-imfell leading-24 mt-6 max-md:max-w-full">
                  Ask Abe is an educational tool that leverages artificial intelligence to navigate complex legal frameworks.
                  Abe has many user friendly and interactive elements, including when Abe asks clarifying questions to better understand and accurately respond to user&apos;s legal inquiries.
                </div>

              </div>
            </div>
            <div className="flex flex-col items-stretch w-6/12 ml-5 max-md:w-full max-md:ml-0">
              <Image
                src="/lib3.jpg"
                alt="People Image"
                width={2000}
                height={1200}
                className="aspect-[1.76] object-contain object-center w-full overflow-hidden grow max-md:max-w-full max-md:mt-2"
              />
            </div>
          </div>
        </div>
      </div>




      {/* Second Section */}
      <section className="items-center shadow-inner bg-[#FAF5E6] flex w-full flex-col px-2 py-12 max-md:max-w-full max-md:py-24">
        <div className="mb-0 w-full max-w-[1312px] max-md:max-w-full max-md:mb-2.5">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-6/12 max-md:w-full max-md:ml-0">
              <Image
                src="/abemem3.jpg" className="aspect-[0.96] object-contain object-center w-full overflow-hidden max-md:max-w-full max-md:mt-10"
                alt="Legal Research Image"
                width={500}
                height={500}
              />
            </div>
            <div className="flex flex-col items-stretch w-6/12 ml-5 max-md:w-full max-md:ml-0">
              <div className="flex flex-col my-auto max-md:max-w-full max-md:mt-10">
                {/* <h2 className="text-black text-center font-raleway text-base font-semibold leading-6 self-stretch whitespace-nowrap max-md:max-w-full">
                Innovative
              </h2> */}
                <div className="items-stretch self-stretch flex flex-col mt-4 max-md:max-w-full">
                  <h1 className="text-[#2F3F3D] text-5xl font-imfell font-semibold leading-[57.6px] max-md:max-w-full max-md:text-4xl">
                    Democratizing Legal Knowledge For All, One Question At a Time
                  </h1>
                  <p className="text-black text-xl font-raleway font-light leading-7 mt-6 max-md:max-w-full">
                    Our dream is to revolutionize the legal landscape, making legal literacy a common asset, not a privilege. This dream is rooted in our mission to empower every individual with accessible, comprehensible legal knowledge through Ask Abe. This includes our commitment to keeping this invaluable tool free forever, and our ambition to expand its benefits globally. We envision a future where every citizen, regardless of background or location, is equipped with the tools to navigate the legal world confidently, contributing to a more just, informed, and equitable society.
                  </p>
                </div>
                <div className="items-stretch flex max-w-full gap-4 mt-10 self-start">
                  <a href="/mission" className="text-black font-raleway font-raleway text-base leading-6 whitespace-nowrap justify-center items-center border grow px-5 py-3 border-solid border-[#2F3F3D]">
                    Our Mission
                  </a>
                </div>
                {/* <div className="items-stretch flex w-60 max-w-full justify-between gap-5 mt-10">
                <a href="#" className="text-black font-raleway text-base leading-6 whitespace-nowrap justify-center items-center border grow px-5 py-3 border-solid border-[#2F3F3D]">
                  Learn More
                </a>
                {/* <div className="justify-center items-stretch self-center flex gap-2 my-auto">
                  <div className="text-black font-raleway text-base leading-6">Sign Up</div>
                </div> */}
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="flex-col items-center overflow-hidden relative flex min-h-[400px] px-20 max-md:px-5">
          <Image
            src="/mon2.jpg"
            alt="Empowering Image"
            width={4800}
            height={2812}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative top-5/6 text-[#FEFDF9] text-center text-5xl font-raleway font-bold leading-[80px] max-w-screen-md mt-40 max-md:max-w-full max-md:mt-10">
            Ask Abe&apos;s Features
          </div>


        </div>
      </section>

      {/* Feature Section */}
      <section className="items-center bg-[#FCF8EE] shadow-inner flex flex-col px-56 max-md:px-5">
        <div className="items-center bg-[#FCF8EE] flex flex-col px-16 max-md:px-5">
          <div className="self-center text-black text-center text-lg leading-7 max-w-screen-md mt-6 max-md:max-w-full">

          </div>

          <div className="border bg-[#FCF9F3] self-stretch mt-10 mb-10 pl-8 pr-8 border-solid border-8 border-[#FEFDF9] shadow-inner max-md:max-w-full max-md:my-10 max-md:pl-5">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[46%] max-md:w-full max-md:ml-0">
                <div className="justify-center items-start self-stretch flex flex-col my-auto max-md:max-w-full max-md:mt-10">
                  <div className="self-stretch text-black text-4xl font-raleway font-bold leading-10 mt-2 max-md:max-w-full">
                    Expandable Citations
                  </div>
                  <div className="self-stretch text-black font-raleway text-base leading-6 mt-6 max-md:max-w-full">
                    View citations collapsed or expanded. Whichever suits your preference.
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch w-[54%] ml-5 max-md:w-full max-md:ml-0">
                <Image
                  src="/howto/citation.png"
                  alt="library2"
                  width={5184}
                  height={3888}
                  className="aspect-[1.03] object-contain object-center w-full self-stretch overflow-hidden grow max-md:max-w-full max-md:mt-10"
                />
              </div>
            </div>
          </div>

          <div className="border bg-[#FCF9F3] self-stretch mt-10 mb-10 pl-8 pr-8 border-solid border-8 border-[#FEFDF9] shadow-inner max-md:max-w-full max-md:my-10 max-md:pl-5">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[52%] max-md:w-full max-md:ml-0">
                <Image
                  src="/howto/calrifying.png"
                  alt="library2"
                  width={5184}
                  height={3888}
                  className="aspect-[1.03] object-contain object-center w-full self-stretch overflow-hidden grow max-md:max-w-full max-md:mt-10"
                />
              </div>
              <div className="flex flex-col items-stretch w-[48%] ml-5 max-md:w-full max-md:ml-0">
                <div className="justify-center items-start self-stretch flex flex-col my-auto max-md:max-w-full max-md:mt-10">
                  <div className="self-stretch text-black text-4xl font-raleway font-bold leading-10 mt-2 max-md:max-w-full">
                    Clarification Question Answer Options
                  </div>
                  <div className="self-stretch text-black font-raleway text-base leading-6 mt-6 max-md:max-w-full">
                    With multiple choice options, you can focus more on getting the answer fast. If the clarifying question doesn&apos;t apply, click &apos;not applicable&apos;, or if none of the answers suit your needs -- write your own custom response.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border bg-[#FCF9F3] self-stretch mt-10 mb-10 pl-8 pr-8 border-solid border-8 border-[#FEFDF9] shadow-inner max-md:max-w-full max-md:my-10 max-md:pl-5">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[46%] max-md:w-full max-md:ml-0">
                <div className="justify-center items-start self-stretch flex flex-col my-auto max-md:max-w-full max-md:mt-10">
                  <div className="self-stretch text-black text-4xl font-raleway font-bold leading-10 mt-2 max-md:max-w-full">
                    Chat Options & Jurisdictions
                  </div>
                  <div className="self-stretch text-black font-raleway text-base leading-6 mt-6 max-md:max-w-full">
                    Don&apos;t feel like getting asked clarifying questions, check skip clarifications to turn this off.
                    Also, select from which jurisdiction you would like Abe to focus his answer. (More jurisdictions coming soon)
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch w-[54%] ml-5 max-md:w-full max-md:ml-0">
                <Image
                  src="/howto/selectJurisdiction.png"
                  alt="library2"
                  width={5184}
                  height={3888}
                  className="aspect-[1.03] object-contain object-center w-full self-stretch overflow-hidden grow max-md:max-w-full max-md:mt-10"
                />
              </div>
            </div>
          </div>

          <div className="border bg-[#FCF9F3] self-stretch mt-10 mb-10 pl-8 pr-8 border-solid border-8 border-[#FEFDF9] shadow-inner max-md:max-w-full max-md:my-10 max-md:pl-5">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[52%] max-md:w-full max-md:ml-0">
                <Image
                  src="/followup.png"
                  alt="library2"
                  width={5184}
                  height={3888}
                  className="aspect-[1.03] object-contain object-center w-full self-stretch overflow-hidden grow max-md:max-w-full max-md:mt-10"
                />
              </div>
              <div className="flex flex-col items-stretch w-[48%] ml-5 max-md:w-full max-md:ml-0">
                <div className="justify-center items-start self-stretch flex flex-col my-auto max-md:max-w-full max-md:mt-10">
                  <div className="self-stretch text-black text-4xl font-raleway font-bold leading-10 mt-2 max-md:max-w-full">
                    Ask a follow-up question
                  </div>
                  <div className="self-stretch text-black font-raleway text-base leading-6 mt-6 max-md:max-w-full">
                    When Abe gives you an answer to your original query, but you&apos;re left with more questions, ask a follow-up question.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Team Section */}
      <section className="items-center bg-[#FCF8EE] flex flex-col px-5 shadow-inner ">
        <div className="flex w-[768px] max-w-full flex-col items-stretch mt-16 mb-16 max-md:my-10">
          <h1 className="text-[#2F3F3D] text-center font-imfell text-5xl font-semibold leading-[58px] max-md:max-w-full max-md:text-5xl max-md:leading-[54px]">
            Our Team
          </h1>
          <div className="self-center w-[640px] max-w-full mt-10 max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-6/12 max-md:w-full max-md:ml-0">
                <div className="items-center flex grow flex-col max-md:mt-8">
                  <img
                    loading="lazy"
                    srcSet="/will.jpg" className="rounded-full w-32 h-32 object-cover"
                    alt="Will Diamond"
                  />
                  <h2 className="self-stretch text-black text-center text-xl font-raleway font-semibold leading-8 mt-6">
                    Will Diamond
                  </h2>
                  <p className="self-stretch text-black text-center font-raleway text-lg leading-7">
                    Co-Founder
                  </p>
                  <div className="items-stretch flex w-[100px] max-w-full gap-3.5 mt-6 max-md:justify-center">
                    <a
                      href="https://github.com/spartypkp"
                      className="aspect-square object-contain object-center w-full overflow-hidden shrink-0 flex-1"
                    >
                      <svg viewBox="0 0 17 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g fill="#161614">
                            <path d="M8.20003216,0 C3.67186256,0 0,3.67233045 0,8.2025137 C0,11.8266603 2.34955472,14.9012922 5.60770169,15.9859115 C6.01749428,16.0618219 6.16798309,15.8079721 6.16798309,15.5913056 C6.16798309,15.3957396 6.16033003,14.7495356 6.15685721,14.064154 C3.87553694,14.5603383 3.3941657,13.0963596 3.3941657,13.0963596 C3.02115925,12.1482506 2.48370842,11.896202 2.48370842,11.896202 C1.7397535,11.3870871 2.53978801,11.3975087 2.53978801,11.3975087 C3.36323189,11.4554066 3.79681972,12.242817 3.79681972,12.242817 C4.52816959,13.4968196 5.71510182,13.1342505 6.18303197,12.9247247 C6.25660428,12.3945093 6.46915364,12.0327122 6.70363321,11.8278826 C4.88233278,11.6204154 2.96765212,10.9170854 2.96765212,7.77413412 C2.96765212,6.87864774 3.28798748,6.14688355 3.81257603,5.57247278 C3.72742766,5.36584187 3.44677247,4.53159853 3.89200067,3.40175461 C3.89200067,3.40175461 4.58058343,3.18129256 6.14759636,4.24255971 C6.80164386,4.06076054 7.50315322,3.96966796 8.20003216,3.96658007 C8.89691109,3.96966796 9.59893494,4.06076054 10.2542687,4.24255971 C11.8194166,3.18129256 12.5070347,3.40175461 12.5070347,3.40175461 C12.9533562,4.53159853 12.6725723,5.36584187 12.587424,5.57247278 C13.1131701,6.14688355 13.4313189,6.87858341 13.4313189,7.77413412 C13.4313189,10.9245478 11.5130368,11.6182925 9.68710595,11.8213208 C9.98120223,12.0758783 10.2432714,12.5750862 10.2432714,13.3403025 C10.2432714,14.4377879 10.2337533,15.3211158 10.2337533,15.5913056 C10.2337533,15.8095804 10.3813481,16.0653602 10.7970574,15.9848178 C14.0534036,14.8989763 16.4,11.825438 16.4,8.2025137 C16.4,3.67233045 12.7286519,0 8.20003216,0"></path>
                            <path d="M3.07518929,11.6824029 C3.05731167,11.723257 2.99359073,11.7355197 2.93568001,11.7075092 C2.87662002,11.6806603 2.84341872,11.6248974 2.86257332,11.5838496 C2.88013169,11.5417693 2.94385264,11.5300229 3.00278493,11.5582916 C3.06197262,11.5850759 3.09568471,11.6413552 3.07518929,11.6824029 M3.47564797,12.0435714 C3.436828,12.0799722 3.36091196,12.0630626 3.30938611,12.0055571 C3.25613634,11.9481806 3.24617596,11.8715065 3.28557057,11.8345248 C3.32560367,11.7981885 3.39922115,11.8151627 3.45259861,11.8726037 C3.50584838,11.9306256 3.51619186,12.0068479 3.47558413,12.0436359 M3.75038868,12.5056811 C3.70045904,12.5407266 3.61886048,12.5078755 3.5684839,12.4346866 C3.51861811,12.3615623 3.51861811,12.2737872 3.56956933,12.2386127 C3.62013745,12.2034381 3.70045904,12.235063 3.75153796,12.307671 C3.8013399,12.3820861 3.8013399,12.4698612 3.75032483,12.5057457 M4.2149514,13.0409152 C4.1703212,13.0906114 4.07531442,13.0773161 4.0057194,13.0094195 C3.93459201,12.9430719 3.91473508,12.8489074 3.95949298,12.7991467 C4.00463397,12.7493214 4.10021539,12.7633267 4.1703212,12.8306424 C4.24100164,12.8968609 4.26258248,12.9917354 4.21501525,13.0409152 M4.81538402,13.2216286 C4.79578249,13.2860399 4.70422354,13.3153413 4.6120261,13.2879762 C4.51995636,13.259772 4.45968324,13.1842596 4.4782632,13.1191383 C4.49741779,13.0542751 4.58935983,13.0237475 4.68225961,13.0530489 C4.77420165,13.081124 4.83460247,13.1560554 4.81544787,13.2216286 M5.49881989,13.2982381 C5.50111844,13.3661347 5.42290385,13.422414 5.32610931,13.4236402 C5.22874013,13.4257701 5.15001476,13.3708461 5.14899318,13.3041113 C5.14899318,13.2355693 5.22542,13.1798063 5.32272533,13.1781928 C5.41951987,13.1762566 5.49881989,13.2307933 5.49881989,13.2982381 M6.17012451,13.2722283 C6.18174496,13.3384468 6.11444849,13.4064725 6.01835628,13.4245438 C5.92386029,13.4419697 5.83638766,13.4011156 5.82432026,13.3354779 C5.81257211,13.2675814 5.88114555,13.1996203 5.97545,13.1820007 C6.07173375,13.1650911 6.15786557,13.2049126 6.17012451,13.2722283" fillRule="nonzero"></path>
                          </g>
                        </g>
                      </svg>
                    </a>
                    <a
                      href="https://twitter.com/itsreallywillyd"
                      className="aspect-square object-contain object-center w-full overflow-hidden shrink-0 flex-1"
                    >
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/c2293d9a-2962-47d9-8f74-a0da3c091d93?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&"
                        alt="Image 2"
                      />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/will-diamond-b1724520b/"
                      className="aspect-square object-contain object-center w-full overflow-hidden shrink-0 flex-1"
                    >
                      <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.6313333,13.6346667 L11.262,13.6346667 L11.262,9.922 C11.262,9.03666667 11.244,7.89733333 10.0273333,7.89733333 C8.792,7.89733333 8.60333333,8.86066667 8.60333333,9.85666667 L8.60333333,13.6346667 L6.234,13.6346667 L6.234,6 L8.51,6 L8.51,7.04066667 L8.54066667,7.04066667 C8.85866667,6.44066667 9.632,5.80733333 10.7873333,5.80733333 C13.188,5.80733333 13.632,7.38733333 13.632,9.444 L13.632,13.6346667 L13.6313333,13.6346667 Z M3.558,4.95533333 C2.79533333,4.95533333 2.18266667,4.338 2.18266667,3.57866667 C2.18266667,2.82 2.796,2.20333333 3.558,2.20333333 C4.318,2.20333333 4.934,2.82 4.934,3.57866667 C4.934,4.338 4.31733333,4.95533333 3.558,4.95533333 Z M4.746,13.6346667 L2.37,13.6346667 L2.37,6 L4.746,6 L4.746,13.6346667 Z M14.8166667,0 L1.18066667,0 C0.528,0 0,0.516 0,1.15266667 L0,14.8473333 C0,15.4846667 0.528,16 1.18066667,16 L14.8146667,16 C15.4666667,16 16,15.4846667 16,14.8473333 L16,1.15266667 C16,0.516 15.4666667,0 14.8146667,0 L14.8166667,0 Z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch w-6/12 ml-5 max-md:w-full max-md:ml-0">
                <div className="items-center flex grow flex-col max-md:mt-8">
                  <img
                    loading="lazy"
                    srcSet="/madeline.jpg" className="rounded-full w-32 h-32 object-cover"
                    alt="Will Diamond"
                  />
                  <h2 className="self-stretch text-black text-center text-xl font-raleway font-semibold leading-8 mt-6">
                    Madeline Kaufman
                  </h2>
                  <p className="self-stretch text-black text-center font-raleway text-lg leading-7">
                    Co-Founder
                  </p>
                  <div className="items-stretch flex w-[100px] max-w-full gap-3.5 mt-6 max-md:justify-center">
                    <a
                      href="https://github.com/datbihmad"
                      className="aspect-square object-contain object-center w-full overflow-hidden shrink-0 flex-1"
                    >
                      <svg viewBox="0 0 17 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g fill="#161614">
                            <path d="M8.20003216,0 C3.67186256,0 0,3.67233045 0,8.2025137 C0,11.8266603 2.34955472,14.9012922 5.60770169,15.9859115 C6.01749428,16.0618219 6.16798309,15.8079721 6.16798309,15.5913056 C6.16798309,15.3957396 6.16033003,14.7495356 6.15685721,14.064154 C3.87553694,14.5603383 3.3941657,13.0963596 3.3941657,13.0963596 C3.02115925,12.1482506 2.48370842,11.896202 2.48370842,11.896202 C1.7397535,11.3870871 2.53978801,11.3975087 2.53978801,11.3975087 C3.36323189,11.4554066 3.79681972,12.242817 3.79681972,12.242817 C4.52816959,13.4968196 5.71510182,13.1342505 6.18303197,12.9247247 C6.25660428,12.3945093 6.46915364,12.0327122 6.70363321,11.8278826 C4.88233278,11.6204154 2.96765212,10.9170854 2.96765212,7.77413412 C2.96765212,6.87864774 3.28798748,6.14688355 3.81257603,5.57247278 C3.72742766,5.36584187 3.44677247,4.53159853 3.89200067,3.40175461 C3.89200067,3.40175461 4.58058343,3.18129256 6.14759636,4.24255971 C6.80164386,4.06076054 7.50315322,3.96966796 8.20003216,3.96658007 C8.89691109,3.96966796 9.59893494,4.06076054 10.2542687,4.24255971 C11.8194166,3.18129256 12.5070347,3.40175461 12.5070347,3.40175461 C12.9533562,4.53159853 12.6725723,5.36584187 12.587424,5.57247278 C13.1131701,6.14688355 13.4313189,6.87858341 13.4313189,7.77413412 C13.4313189,10.9245478 11.5130368,11.6182925 9.68710595,11.8213208 C9.98120223,12.0758783 10.2432714,12.5750862 10.2432714,13.3403025 C10.2432714,14.4377879 10.2337533,15.3211158 10.2337533,15.5913056 C10.2337533,15.8095804 10.3813481,16.0653602 10.7970574,15.9848178 C14.0534036,14.8989763 16.4,11.825438 16.4,8.2025137 C16.4,3.67233045 12.7286519,0 8.20003216,0"></path>
                            <path d="M3.07518929,11.6824029 C3.05731167,11.723257 2.99359073,11.7355197 2.93568001,11.7075092 C2.87662002,11.6806603 2.84341872,11.6248974 2.86257332,11.5838496 C2.88013169,11.5417693 2.94385264,11.5300229 3.00278493,11.5582916 C3.06197262,11.5850759 3.09568471,11.6413552 3.07518929,11.6824029 M3.47564797,12.0435714 C3.436828,12.0799722 3.36091196,12.0630626 3.30938611,12.0055571 C3.25613634,11.9481806 3.24617596,11.8715065 3.28557057,11.8345248 C3.32560367,11.7981885 3.39922115,11.8151627 3.45259861,11.8726037 C3.50584838,11.9306256 3.51619186,12.0068479 3.47558413,12.0436359 M3.75038868,12.5056811 C3.70045904,12.5407266 3.61886048,12.5078755 3.5684839,12.4346866 C3.51861811,12.3615623 3.51861811,12.2737872 3.56956933,12.2386127 C3.62013745,12.2034381 3.70045904,12.235063 3.75153796,12.307671 C3.8013399,12.3820861 3.8013399,12.4698612 3.75032483,12.5057457 M4.2149514,13.0409152 C4.1703212,13.0906114 4.07531442,13.0773161 4.0057194,13.0094195 C3.93459201,12.9430719 3.91473508,12.8489074 3.95949298,12.7991467 C4.00463397,12.7493214 4.10021539,12.7633267 4.1703212,12.8306424 C4.24100164,12.8968609 4.26258248,12.9917354 4.21501525,13.0409152 M4.81538402,13.2216286 C4.79578249,13.2860399 4.70422354,13.3153413 4.6120261,13.2879762 C4.51995636,13.259772 4.45968324,13.1842596 4.4782632,13.1191383 C4.49741779,13.0542751 4.58935983,13.0237475 4.68225961,13.0530489 C4.77420165,13.081124 4.83460247,13.1560554 4.81544787,13.2216286 M5.49881989,13.2982381 C5.50111844,13.3661347 5.42290385,13.422414 5.32610931,13.4236402 C5.22874013,13.4257701 5.15001476,13.3708461 5.14899318,13.3041113 C5.14899318,13.2355693 5.22542,13.1798063 5.32272533,13.1781928 C5.41951987,13.1762566 5.49881989,13.2307933 5.49881989,13.2982381 M6.17012451,13.2722283 C6.18174496,13.3384468 6.11444849,13.4064725 6.01835628,13.4245438 C5.92386029,13.4419697 5.83638766,13.4011156 5.82432026,13.3354779 C5.81257211,13.2675814 5.88114555,13.1996203 5.97545,13.1820007 C6.07173375,13.1650911 6.15786557,13.2049126 6.17012451,13.2722283" fillRule="nonzero"></path>
                          </g>
                        </g>
                      </svg>
                    </a>
                    <a
                      href="https://twitter.com/datbihmad"
                      className="aspect-square object-contain object-center w-full overflow-hidden shrink-0 flex-1"
                    >
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/90939acd-546f-4610-b920-e5b0c4e65857?apiKey=0444d2d78e064e0ba018ac2a58ee83fe&"
                        alt="Image 5"
                      />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/madeline-kaufman-309644195"
                      className="aspect-square object-contain object-center w-full overflow-hidden shrink-0 flex-1"
                    >
                      <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.6313333,13.6346667 L11.262,13.6346667 L11.262,9.922 C11.262,9.03666667 11.244,7.89733333 10.0273333,7.89733333 C8.792,7.89733333 8.60333333,8.86066667 8.60333333,9.85666667 L8.60333333,13.6346667 L6.234,13.6346667 L6.234,6 L8.51,6 L8.51,7.04066667 L8.54066667,7.04066667 C8.85866667,6.44066667 9.632,5.80733333 10.7873333,5.80733333 C13.188,5.80733333 13.632,7.38733333 13.632,9.444 L13.632,13.6346667 L13.6313333,13.6346667 Z M3.558,4.95533333 C2.79533333,4.95533333 2.18266667,4.338 2.18266667,3.57866667 C2.18266667,2.82 2.796,2.20333333 3.558,2.20333333 C4.318,2.20333333 4.934,2.82 4.934,3.57866667 C4.934,4.338 4.31733333,4.95533333 3.558,4.95533333 Z M4.746,13.6346667 L2.37,13.6346667 L2.37,6 L4.746,6 L4.746,13.6346667 Z M14.8166667,0 L1.18066667,0 C0.528,0 0,0.516 0,1.15266667 L0,14.8473333 C0,15.4846667 0.528,16 1.18066667,16 L14.8146667,16 C15.4666667,16 16,15.4846667 16,14.8473333 L16,1.15266667 C16,0.516 15.4666667,0 14.8146667,0 L14.8166667,0 Z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <PageFooter />
    </div>


  );
}
