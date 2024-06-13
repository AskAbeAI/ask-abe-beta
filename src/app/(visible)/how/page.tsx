
import React from 'react';
import Image from 'next/image';
import PageFooter from '@/components/pageFooter';


export default function HowToPage() {
	return (

		<div className="h-screen w-full bg-mainbg">
			<section>
				<div className="flex-col items-center overflow-hidden relative flex min-h-[200px] px-12 max-md:px-5">
					<Image
						src="/home/mon2.jpg"
						alt="Empowering Image"
						width={4800}
						height={2812}
						className="absolute inset-0 w-full h-full object-cover"
					/>
					<div className="relative top-2/6 text-extralightbg text-center text-5xl font-raleway font-bold leading-[80px] max-w-screen-md mt-16 max-md:max-w-full max-md:mt-10">
						How to Use Ask Abe
					</div>


				</div>
			</section>

			{/* Feature Section */}
			<section className="items-center bg-lightbg shadow-inner flex flex-col px-56 max-md:px-5">
				<div className="items-center bg-lightbg flex flex-col px-16 max-md:px-5">
					<div className="self-center text-black text-center text-lg leading-7 max-w-screen-md mt-6 max-md:max-w-full">

					</div>

					<div className="bg-[#FCF9F3] self-stretch mt-4 mb-4 pl-8 pr-8 border-solid border-8 border-extralightbg shadow-inner max-md:max-w-full max-md:my-10 max-md:pl-5">
						<div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
							<div className="flex flex-col items-stretch w-[46%] max-md:w-full max-md:ml-0">
								<div className="justify-center items-start self-stretch flex flex-col my-auto max-md:max-w-full max-md:mt-10">
									<div className="self-stretch text-black text-2xl font-raleway font-bold leading-10 mt-2 max-md:max-w-full">
										Step 1: Choose a Legal Jurisdiction:
									</div>
									<div className="self-stretch text-black font-raleway text-base leading-6 mt-6 max-md:max-w-full">
										Navigate to the playground page and choose a state, federal, or miscellaneous jurisdiction from the dropdown menus on the right hand side. Mix and match compatible federal, state, and local jurisdictions to tailor legal information to your geography.

									</div>
								</div>
							</div>
							<div className="flex flex-col items-stretch w-[54%] ml-2 max-md:w-full max-md:ml-0">
								<Image
									src="/home/select.png"
									alt="library2"
									width={5184}
									height={3888}
									className="aspect-[1.03] object-contain object-center w-full self-stretch overflow-hidden grow max-md:max-w-full max-md:mt-10"
								/>
							</div>
						</div>
					</div>

					<div className="bg-[#FCF9F3] self-stretch mt-4 mb-4 pl-8 pr-8 border-solid border-8 border-extralightbg shadow-inner max-md:max-w-full max-md:my-10 max-md:pl-5">
						<div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
							<div className="flex flex-col items-stretch w-[52%] max-md:w-full max-md:ml-0">
								<Image
									src="/howto/ask.png"
									alt="library2"
									width={5184}
									height={3888}
									className="aspect-[1.03] object-contain object-center w-full self-stretch overflow-hidden grow max-md:max-w-full max-md:mt-10"
								/>
							</div>
							<div className="flex flex-col items-stretch w-[48%] ml-2 max-md:w-full max-md:ml-0">
								<div className="justify-center items-start self-stretch flex flex-col my-auto max-md:max-w-full max-md:mt-10">
									<div className="self-stretch text-black text-2xl font-raleway font-bold leading-10 mt-2 max-md:max-w-full">
										Step 2: Ask a Question:
									</div>
									<div className="self-stretch text-black font-raleway text-base leading-6 mt-6 max-md:max-w-full">
										Navigate to the playground page and enter your question in the provided space.                  </div>
								</div>
							</div>
						</div>
					</div>

					{/* <div className="bg-[#FCF9F3] self-stretch mt-4 mb-4 pl-8 pr-8 border-solid border-8 border-extralightbg shadow-inner max-md:max-w-full max-md:my-10 max-md:pl-5">
						<div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
							<div className="flex flex-col items-stretch w-[46%] max-md:w-full max-md:ml-0">
								<div className="justify-center items-start self-stretch flex flex-col my-auto max-md:max-w-full max-md:mt-10">
									<div className="self-stretch text-black text-2xl font-raleway font-bold leading-10 mt-2 max-md:max-w-full">
										Step 3: Asnwer Abe&apos;s Clarifying Questions:
									</div>
									<div className="self-stretch text-black font-raleway text-base leading-6 mt-6 max-md:max-w-full">
										Abe&apos;s first response provides follow up questions which will include multiple different answers or suggestions. Review these answers to see if any of them fit your question.
										If one of the provided answers fits your query, click on it. If none of the answers are suitable but you have a different answer in mind, click on the &apos;Other&apos; option and type your response to Abe&apos;s question. You may also select &apos;Not Applicable&apos; if the follow up question does not fit your original query.

									</div>
								</div>
							</div>
							<div className="flex flex-col items-stretch w-[54%] ml-2 max-md:w-full max-md:ml-0">
								<Image
									src="/howto/calrifying.png"
									alt="library2"
									width={5184}
									height={3888}
									className="aspect-[1.03] object-contain object-center w-full self-stretch overflow-hidden grow max-md:max-w-full max-md:mt-10"
								/>
							</div>
						</div>
					</div> */}

					<div className="bg-[#FCF9F3] self-stretch mt-4 mb-4 pl-8 pr-8 border-solid border-8 border-extralightbg shadow-inner max-md:max-w-full max-md:my-10 max-md:pl-5">
						<div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
							<div className="flex flex-col items-stretch w-[52%] max-md:w-full max-md:ml-0">
								<Image
									src="/howto/wait.png"
									alt="library2"
									width={5184}
									height={3888}
									className="aspect-[1.03] object-contain object-center w-full self-stretch overflow-hidden grow max-md:max-w-full max-md:mt-10"
								/>
							</div>
							<div className="flex flex-col items-stretch w-[48%] ml-2 max-md:w-full max-md:ml-0">
								<div className="justify-center items-start self-stretch flex flex-col my-auto max-md:max-w-full max-md:mt-10">
									<div className="self-stretch text-black text-2xl font-raleway font-bold leading-10 mt-2 max-md:max-w-full">
										Step 3: Wait for Abe to do research:
									</div>
									<div className="self-stretch text-black font-raleway text-base leading-6 mt-6 max-md:max-w-full">
										After submitting all your questions, wait for a response from Abe. This may take a moment so please wait patiently.

									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-[#FCF9F3] self-stretch mt-4 mb-4 pl-8 pr-8 border-solid border-8 border-extralightbg shadow-inner max-md:max-w-full max-md:my-10 max-md:pl-5">
						<div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
							<div className="flex flex-col items-stretch w-[46%] max-md:w-full max-md:ml-0">
								<div className="justify-center items-start self-stretch flex flex-col my-auto max-md:max-w-full max-md:mt-10">
									<div className="self-stretch text-black text-2xl font-raleway font-bold leading-10 mt-2 max-md:max-w-full">
										Step 4: Review Full Answer and Legal Citations:
									</div>
									<div className="self-stretch text-black font-raleway text-base leading-6 mt-6 max-md:max-w-full">
										Abe will provide you with a detailed answer with embedded citations. Citations for the information provided are displayed on the left side of the screen. These citations link to the sources of the information used in Abe&apos;s responses.
										To view a citation in full, you can either click on the citation button to open it in full screen or click on each individual citation to pop it out for detailed viewing.

									</div>
								</div>
							</div>
							<div className="flex flex-col items-stretch w-[54%] ml-2 max-md:w-full max-md:ml-0">
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
				</div>
			</section>






			<PageFooter />
		</div>


	);
}
