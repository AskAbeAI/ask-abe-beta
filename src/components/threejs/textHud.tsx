import React from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Node } from '@/lib/threejs/types';


interface NodeTextHUDProps {
	node: Node | null;
}

const NodeTextHUD: React.FC<NodeTextHUDProps> = ({ node }) => {
	if (!node) {
		return <div>This node is null!</div>;
	}
	if (!node.node_text) {
		return <div>This node does not have legislative text!</div>;
	}


	const paragraphsArray = Object.entries(node.node_text.paragraphs).map(([id, paragraph]) => ({
		id,
		...paragraph
	}));

	// Sort paragraphs by their index
	paragraphsArray.sort((a, b) => a.index - b.index);

	return (
		<div className="absolute top-10 left-1 z-50 max-w-md p-4 bg-gray-100">

			<Card className="bg-white shadow-lg rounded-lg overflow-hidden my-2">
				<CardHeader>
					<CardTitle>{node.node_name}</CardTitle>
				</CardHeader>
				<CardContent className="text-gray-700">
					{paragraphsArray.map(({ id, text }) => (
						<p key={id}>{text}</p>
					))}
				</CardContent>
			</Card>

		</div>
	);
};

export default NodeTextHUD;