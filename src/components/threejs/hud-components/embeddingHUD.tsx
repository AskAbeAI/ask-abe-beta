import React from "react";
import { Node } from "@/lib/threejs/types"; // Ensure you import your correct type definitions
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface EmbeddingHUDProps {
}

const EmbeddingHUD: React.FC<EmbeddingHUDProps> = ({}) => {
	// if (!node) return <div>No Node selected!</div>;
	return (
		<Card className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
			<CardHeader>
				<CardTitle>Embedding Space Visualization</CardTitle>
				<CardDescription>
					Configure settings here!
				</CardDescription>
			</CardHeader>
			<CardContent className="text-gray-700">
				<div>
					<h1> Here you can configure embedding settings. </h1>
				</div>
			</CardContent>
			<CardFooter>
				<p className="text-sm text-gray-600">
					Click on other nodes to see more details
				</p>
			</CardFooter>
		</Card>
	);
};
export default EmbeddingHUD;
