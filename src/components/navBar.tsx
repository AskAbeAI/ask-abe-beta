"use client";
import React from 'react';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';
import { HiMenuAlt3 } from 'react-icons/hi';
import Image from 'next/image';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigationMenu";
import { cn } from "@/lib/utils/cn";

const components: { title: string; href: string; description: string; }[] = [
	{
		title: "Choose a Jurisdiction",
		href: "/how#jurisdiction",
		description:
			"Choose a state, federal, or miscellaneous jurisdiction",
	},
	{
		title: "Request Legal Information",
		href: "/how#request",
		description:
			"Navigate to the playground page and enter your question in the provided space.",
	},
	{
		title: "Clarifying Questions",
		href: "/how#clarifying",
		description:
			"Answer Abe's Clarifying Questions",
	},
	{
		title: "Wait for Research",
		href: "/how#research",
		description: "Wait for Abe to conduct extensive research.",
	},
	{
		title: "Review Response",
		href: "/how#review",
		description:
			"Review Abe's response with inline citations.",
	},
	{
		title: "Verify with Citations",
		href: "/how#verify",
		description:
			"Review Abe's response using the provided primary source legislation citations.",
	},
];

const NavBar: React.FC = () => {


	return (
		<div>

			<nav className="justify-center items-center bg-[#FAF5E6] flex flex-col px-10 border-b border-solid">
				<div className="justify-between items-stretch flex w-full max-w-full gap-5 my-3 max-md:max-w-full max-md:flex-wrap max-md:justify-center">
					<div className="flex justify-left items-center font-imfell font-bold text-[#4A4643] text-2xl">ASK ABE</div>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link href="/playground" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>
										Demo
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger>How to Use</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
										{components.map((component) => (
											<ListItem
												key={component.title}
												title={component.title}
												href={component.href}
											>
												{component.description}
											</ListItem>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>


							<NavigationMenuItem>
								<NavigationMenuTrigger>Our Mission</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
										<li className="row-span-3">
											<NavigationMenuLink asChild>
												<a
													className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
													href="/dashboardFeatures"
												>
													<div className="mb-2 mt-4 text-lg font-medium">
														Democratizing Legal Knowledge for All
													</div>
													<p className="text-sm leading-tight text-muted-foreground"></p>
													<p className="text-sm leading-tight text-muted-foreground"></p>
												</a>
											</NavigationMenuLink>
										</li>
										<ListItem
											href="/mission#accessibility"
											title="Accessibility"
										>
											Accessable for everyone.
										</ListItem>
										<ListItem
											href="/mission#honesty"
											title="Honesty"
										>
											Honest legal information and education.
										</ListItem>
										<ListItem
											href="/mission#improvement"
											title="Improvement"
										>
											Improvement idk why this is here.
										</ListItem>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>


							<NavigationMenuItem>
								<Link href="/about" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>
										About
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/documentation" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>
										Documentation
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
					<p>Fake Signin</p>

					{/* <button
          className="text-white text-base leading-6 whitespace-nowrap justify-center items-stretch border bg-zinc-500 rounded-full px-5 py-2 border-solid border-black"
          type="button"
        >
          Sign In
        </button> */}
				</div>
			</nav>


		</div>

	);
};

export default NavBar;

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
