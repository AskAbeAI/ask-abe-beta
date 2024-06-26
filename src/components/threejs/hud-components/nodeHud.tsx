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

interface NodeHUDProps {
	node: Node | null;
}

const NodeHUD: React.FC<NodeHUDProps> = ({ node }) => {
	if (!node) return <div>No Node selected!</div>;
	return (
		<Card className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
			<CardHeader>
				<CardTitle>{node.node_name}</CardTitle>
				<CardDescription>
					Citation: {node.citation || "Not available"}
				</CardDescription>
			</CardHeader>
			<CardContent className="text-gray-700">
				<div>
				<strong>Link to Primary Source:</strong>{" "}
					<a
						href={node.link}
						className="text-blue-500 hover:text-blue-700"
						target="_blank"
						rel="noopener noreferrer"
					>
						View
					</a>
					
				</div>
				<div>
				<strong>ID:</strong> {node.id}
					
				</div>
				<div>
					<strong>Status:</strong> {node.status || "Normal"}
				</div>
				<div>
					<strong>Type:</strong> {node.node_type}
				</div>
				<div>
					<strong>Level Classifier:</strong> {node.level_classifier}
				</div>
				<div>
					<strong>Number:</strong> {node.number}
				</div>
				<div>
					<strong>Parent:</strong> {node.parent}
				</div>
				<div>
					<strong>Text Available:</strong>{" "}
					{node.node_text ? "Yes" : "No"}
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
export default NodeHUD;
