import React from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Node } from '@/lib/threejs/types';
import { renderHTML } from '@/lib/utilities';

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


	const htmlContent = renderHTML(node.node_text);

	return (


		<Card className="bg-white shadow-lg rounded-lg my-2">
			<CardHeader>
				<CardTitle>{node.node_name}</CardTitle>
			</CardHeader>
			<CardContent className="text-gray-700 overflow-y-auto"
			 style={{maxHeight: '90vh'}}
			 dangerouslySetInnerHTML={{ __html: htmlContent }}>
			</CardContent>
		</Card>


	);
};

export default NodeTextHUD;