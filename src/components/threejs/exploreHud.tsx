// components/threejs/NodeHUD.tsx
import React from "react";
import { Node } from "@/lib/threejs/types"; // Ensure you import your correct type definitions
import NodeHUD from "./nodeHud";
import NodeTextHUD from "./textHud";
import Image from "next/image";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SideBar from "./sideBar";
import { Separator } from "../ui/separator";

interface ExploreHUDProps {
	node: Node | null;
	isHUDOpen: boolean;
	setIsHUDOpen: (state: boolean) => void;
	children: React.ReactNode;
}

const ExploreHUD: React.FC<ExploreHUDProps> = ({
	node,
	isHUDOpen,
	setIsHUDOpen,
	children,
}) => {
	if (!node) return null; // Don't render if no node is selected

	return (
		<div className="flex h-screen w-full overflow-hidden">
			{/* Sidebar navigation */}
			<div className="flex flex-col h-full w-64 bg-card text-card-foreground p-4 justify-between border-r border-black">
				<div>
					<Link
						href="/"
						className="flex items-center justify-center space-x-2 p-2"
					>
						<Image
							src="/home/ASKABELOGO.png"
							alt="Logo"
							width={40}
							height={40}
							className="rounded-full"
						/>
						<span className="font-bold text-lg">Ask Abe</span>
					</Link>
					<Separator />
					<SideBar />
				</div>
				<div className="flex flex-col justify-center space-x-2 p-2 space-y-4">
					<Separator />
					<Button>Logout</Button>
				</div>
			</div>

			{/* Header and main content */}
			<div className="flex flex-col flex-1">
				{" "}
				{/* Margin left equal to the sidebar width */}
				<header className="h-16 bg-card text-foreground flex items-center justify-between px-4 top-0 right-0 border-b border-black">
					{" "}
					{/* Ensures header is fixed and items are evenly spaced */}
					<div className="flex items-center space-x-4">
						<div className="text-xl font-semibold">
							Jurisdiction: United States{" "}
							{/* Organization's full name */}
						</div>
					</div>
					<div className="flex items-center space-x-4">
						{" "}
						{/* Center items */}
						<span className="text-sm font-medium">
							Code of Federal Regulations
						</span>
					</div>
					<div className="text-xl font-semibold">
						3D Force Graph {/* Dashboard label */}
					</div>
				</header>
				<div className="overflow-y-auto h-full">
					{" "}
					{/* Padding top equal to the header height */}
					{children} {/* Main content scrolls */}
				</div>
			</div>
		</div>
	);

	// return (
	// 	<Tabs defaultValue="node_details" className="w-full h-full">
	// 		<TabsList className="grid w-full grid-cols-2">
	// 			<TabsTrigger value="node_details">Node Details</TabsTrigger>
	// 			<TabsTrigger value="legislation_text">Legislation Text</TabsTrigger>
	// 		</TabsList>
	// 		<TabsContent value="node_details">
	// 			<Card>
	// 				<CardHeader>
	// 					<CardTitle>Node Details</CardTitle>
	// 					<CardDescription>
	// 						See details on the currently selected node.
	// 					</CardDescription>
	// 				</CardHeader>
	// 				<CardContent className="space-y-2">
	// 					<NodeHUD node={node}></NodeHUD>
	// 				</CardContent>
	// 				<CardFooter>
	// 					<Button
	// 						className="bg-accent text-accent-foreground p-4 rounded-r-lg shadow-md focus:outline-none z-40"
	// 						onClick={() => setIsHUDOpen(!isHUDOpen)}
	// 					>
	// 						{isHUDOpen ? 'Close HUD' : 'Open HUD'}
	// 					</Button>
	// 				</CardFooter>
	// 			</Card>
	// 		</TabsContent>
	// 		<TabsContent value="legislation_text">
	// 			<Card>
	// 				<CardHeader>
	// 					<CardTitle>Legislation Text </CardTitle>
	// 					<CardDescription>
	// 						See exact legislative text.
	// 					</CardDescription>
	// 				</CardHeader>
	// 				<CardContent className="space-y-2">
	// 					<NodeTextHUD node={node}></NodeTextHUD>
	// 				</CardContent>
	// 				<CardFooter>
	// 					<Button
	// 						className="bg-accent text-accent-foreground p-4 rounded-r-lg shadow-md focus:outline-none z-40"
	// 						onClick={() => setIsHUDOpen(!isHUDOpen)}
	// 					>
	// 						{isHUDOpen ? 'Close HUD' : 'Open HUD'}
	// 					</Button>
	// 				</CardFooter>
	// 			</Card>
	// 		</TabsContent>

	// 	</Tabs>
	// );
};

export default ExploreHUD;
