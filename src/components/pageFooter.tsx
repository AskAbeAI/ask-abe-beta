import React from "react";
import Image from "next/image";

import Link from "next/link";

const PageFooter: React.FC = () => {
	return (
		<section className="flex flex-col justify-between bg-mainbg w-full px-16 py-6 max-md:max-w-full max-md:px-5 shadow-inner">
			<div className="max-md:max-w-full">
				<div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
					<div className="flex flex-col items-stretch w-[69%] max-md:w-full max-md:ml-0">
						<div className="flex flex-col ">
							<div className="flex items-center font-header font-bold text-3xl">
								ASK ABE{" "}
							</div>
							<div className="items-stretch self-stretch flex flex-col mt-5 max-md:max-w-full">
								<div className="flex flex-col ">
									<div className="items-stretch flex grow flex-col">
										<Link
											href="/playground"
											className="text-foreground text-base font-body leading-6"
										>
											Abe&apos;s Law Library
										</Link>
										<Link
											href="/how"
											className="text-foreground text-base font-body leading-6 mt-3"
										>
											How to Use
										</Link>
										<Link
											href="/mission"
											className="text-foreground text-base font-body leading-6 mt-3"
										>
											Our Mission
										</Link>
										{/* <Link href="/devlog" className="text-black text-base font-body leading-6 mt-3">DevLog</Link> */}
									</div>
								</div>
							</div>
						</div>
					</div>

					<a
						href="tel:18001234567"
						className="text-foreground text-sm leading-5 underline mt-1 max-md:max-w-full"
					></a>
					<a
						href="mailto:info@relume.io"
						className="text-foreground text-sm leading-5 underline max-md:max-w-full"
					></a>
				</div>
				<div className="flex flex-col w-full max-w-full gap-3 mt-8 "></div>
			</div>

			<hr className="bg-black flex shrink-0 h-px flex-col mt-7 max-md:max-w-full max-md:mt-10" />
			<div className="justify-between items-stretch flex w-full gap-5 mt-1 max-md:max-w-full max-md:flex-wrap">
				<div className="text-foreground text-sm leading-5">
					© 2024 Ask Abe AI. All rights reserved.
				</div>
				<div className="items-stretch flex justify-between gap-5 max-md:justify-center">
					<Link
						href="/privacy"
						className="text-foreground text-sm leading-5 underline"
					>
						Privacy Policy
					</Link>
					<Link
						href="/tos"
						className="text-foreground text-sm leading-5 underline"
					>
						Terms of Service
					</Link>
					<Link
						href="#"
						className="text-foreground text-sm leading-5 underline whitespace-nowrap"
					>
						Cookies Settings
					</Link>
				</div>
			</div>
		</section>
	);
};
export default PageFooter;
