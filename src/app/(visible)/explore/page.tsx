"use client";
// /app/explore/page.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Node } from '@/components/threejs/node';
import { Link } from '@/components/threejs/link';

import { calculateNodePositions, NodeProps, LinkProps, getPosition } from '@/lib/utils/forceSimulation';
import { fetchRootNodes, fetchChildNodes } from '@/lib/utils/dynamicGraph';
import * as d3 from "d3-force-3d";

const GraphPage: React.FC = () => {
	const [nodeData, setNodeData] = useState<NodeProps[]>([]);
	const [linkData, setLinkData] = useState<LinkProps[]>([]); // Adjusted to any[] for compatibility with links

	

	useEffect(() => {
		const initializeNodes = async () => {
			const rootNodes = await fetchRootNodes();
			const calculatedNodes = await calculateNodePositions(rootNodes, [])
			setNodeData(calculatedNodes);
		};

		initializeNodes();
	}, []);

	
	

	const handleNodeClick = async (node: NodeProps) => {
		// Fetch new child nodes
		const childNodes = await fetchChildNodes(node.node_id);
		// Calculate new links
		const childLinks: LinkProps[] = childNodes.map((child, index) => ({
			source: node.node_id,
			target: child.node_id,
			key: `${node.node_id}-${child.node_id}-${index}` // Ensure uniqueness
		}));
		const newLinks: LinkProps[] = [...linkData, ...childLinks];
		// Feed combined nodes and links to calculate position
		const newNodes = await calculateNodePositions([...nodeData, ...childNodes], newLinks)
		setNodeData(newNodes);
		// Iterate over all newLinks
			// For each newLink, search nodeData for both the target and source positions, which may have updated.
				// Update newLink.sourceNodePos
				// Update newLink.targetNodePos
				
		// Finally update all links
		setLinkData(newLinks);
	};

	return (
		<div style={{ height: '100vh' }}>
			<Canvas>
				<OrbitControls />
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				{positionedNodes.map(node => (
					<Node
						key={node.node_id}
						{...node}
						onClick={() => handleNodeClick(node)}
					/>
				))}
				{linkData.map(link => (
					<Link key={link.key} sourceNodePos={link.sourceNodePos!} targetNodePos={link.targetNodePos!} />
				))}
			</Canvas>
		</div>
	);
};

export default GraphPage;