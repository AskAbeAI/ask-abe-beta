// components/threejs/NodeHUD.tsx
import React from 'react';
import { Node } from '@/lib/threejs/types';  // Ensure you import your correct type definitions
import NodeHUD from './nodeHud';
import NodeTextHUD from './textHud';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


interface ExploreHUDProps {
	node: Node | null;
	isHUDOpen: boolean;
	setIsHUDOpen: (state: boolean) => void;
}

const ExploreHUD: React.FC<ExploreHUDProps> = ({ node, isHUDOpen, setIsHUDOpen }) => {
	if (!node) return null;  // Don't render if no node is selected

	return (
		<Tabs defaultValue="node_details" className="w-[400px]">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="node_details">Node Details</TabsTrigger>
				<TabsTrigger value="legislation_text">Legislation Text</TabsTrigger>
			</TabsList>
			<TabsContent value="node_details">
				<Card>
					<CardHeader>
						<CardTitle>Node Details</CardTitle>
						<CardDescription>
							See details on the currently selected node.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<NodeHUD node={node}></NodeHUD>
					</CardContent>
					<CardFooter>
						<Button
							className="bg-accent text-accent-foreground p-4 rounded-r-lg shadow-md focus:outline-none z-40"
							onClick={() => setIsHUDOpen(!isHUDOpen)}
						>
							{isHUDOpen ? 'Close HUD' : 'Open HUD'}
						</Button>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value="legislation_text">
				<Card>
					<CardHeader>
						<CardTitle>Legislation Text </CardTitle>
						<CardDescription>
							See exact legislative text.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<NodeTextHUD node={node}></NodeTextHUD>
					</CardContent>
					<CardFooter>
						<Button
							className="bg-accent text-accent-foreground p-4 rounded-r-lg shadow-md focus:outline-none z-40"
							onClick={() => setIsHUDOpen(!isHUDOpen)}
						>
							{isHUDOpen ? 'Close HUD' : 'Open HUD'}
						</Button>
					</CardFooter>
				</Card>
			</TabsContent>

		</Tabs>
	);
};

export default ExploreHUD;
