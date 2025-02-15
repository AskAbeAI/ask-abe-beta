"use client";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle
} from "@/components/ui/navigationMenu";
import { cn } from "@/lib/utils/cn";
import Link from "next/link"; // Import the Link component from the appropriate library
import React from "react";

const components: { title: string; href: string; description: string; }[] = [
	{
		title: "About Us",
		href: "/about",
		description:
			"An overview of our team and why we're passionate about this project.",
	},
	{
		title: "Privacy Policy",
		href: "/privacy",
		description: "See our privacy terms for using Ask Abe.",
	},
	{
		title: "Terms of Service",
		href: "/tos",
		description: "Our full terms of service.",
	},
	{
		title: "Support Us",
		href: "/support",
		description:
			"Join us in our mission to democratice legal knowoledge for all!",
	},
	{
		title: "Devlog",
		href: "/devlog",
		description: "A log of changes by our developers.",
	},
	{
		title: "Legal",
		href: "/legal",
		description: "Legal information about Ask Abe.",
	},
];

const NavBar = () => {
	return (
		<header className="w-full px-4 py-2 bg-background border-b border-solid flex-none">
			<NavigationMenu className="w-full min-w-full">
				<NavigationMenuList className="w-full min-w-full flex flex-col md:flex-row justify-between items-center">
					<NavigationMenuItem>
						<Link href="/">
							<div className="flex justify-left items-center font-header font-bold text-olivebrown text-2xl">
								ASK ABE
							</div>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/chat" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Chat with Abe
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/explore/graph-only" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Explore Legislation in 3D
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/sources" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Legislation Sources
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					{/* <NavigationMenuItem>
						<NavigationMenuTrigger>Features</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
								<li className="row-span-3">
									<NavigationMenuLink asChild>
										<a
											className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
											href="/features"
										>
											<div className="mb-2 mt-4 text-lg font-medium">
												Legal Education with Abe
											</div>
										</a>
									</NavigationMenuLink>
								</li>
								<ListItem
									href="/chat"
									title="Chat with Abe for accurate legal education and information in plain language."
								></ListItem>
								<ListItem
									href="/sources"
									title="Trust Abe's responses by verifying citations provided directly in the response."
								></ListItem>
								<ListItem
									href="/explore"
									title="Explore 3D Force Graph Visualization of legislation while chatting with Abe "
								></ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem> */}
					<NavigationMenuItem>
						<NavigationMenuTrigger>
							Our Mission
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
								<li className="row-span-3">
									<NavigationMenuLink asChild>
										<a
											className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
											href="/mission#dream"
										>
											<div className="mb-2 mt-4 text-lg font-medium">
												Our Dream
											</div>
											<div className="mb-2 mt-4 text-sm font-medium">
												To Democratize Legal Knowledge for All Using AI
											</div>
										</a>
									</NavigationMenuLink>
								</li>
								<ListItem href="/mission#accesibility" title="The Challenge of Accesibility">
									Access to legal education remains a widespread challenge.
								</ListItem>
								<ListItem href="/mission#ai-help" title="How Can AI Help?">
									AI technology will help us achieve our mission.
								</ListItem>
								<ListItem href="/mission#longterm-goals" title="Our Longterm Goals">
									Expand AI capability, jurisdictions, and impact globally.
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>
							Organization
						</NavigationMenuTrigger>
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

				</NavigationMenuList>
			</NavigationMenu>
		</header>
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
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">
						{title}
					</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
