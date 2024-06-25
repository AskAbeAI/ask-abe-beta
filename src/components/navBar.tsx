"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Import the Link component from the appropriate library
import Image from "next/image"; // Import the Image component from the appropriate library
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

const components: { title: string; href: string; description: string }[] = [
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
		<header
			className={`w-full flex items-center justify-between px-8 py-2 text-base bg-background border-b border-solid `}
		>
			<Link href="/">
				<div className="flex justify-left items-center font-header font-bold text-olivebrown text-2xl">
					ASK ABE
				</div>
			</Link>
			<NavigationMenu className="flex-1">
				<NavigationMenuList className="flex justify-center pl-16 align-bottom">
					<NavigationMenuItem>
						<Link href="/chat" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Chat
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/explore" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Explore in 3D
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
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
									href="/features#1"
									title="Placeholder 1"
								></ListItem>
								<ListItem
									href="/features#2"
									title="Placeholder 2"
								></ListItem>
								<ListItem
									href="/features#3"
									title="Placeholder 3"
								></ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
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
											href="/dashboardFeatures"
										>
											<div className="mb-2 mt-4 text-lg font-medium">
												Democratize Legal Knowledge for
												All
											</div>
										</a>
									</NavigationMenuLink>
								</li>
								<ListItem href="/mission#1" title="Mission 1">
									Mission 1
								</ListItem>
								<ListItem href="/mission#2" title="Mission 2">
									Mission 2
								</ListItem>
								<ListItem href="/mission#3" title="Mission 3">
									Mission 3
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

					<NavigationMenuItem>
						<Link href="/company" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Company
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			<div className="whitespace-nowrap">
				<Button>Login</Button>
			</div>
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
