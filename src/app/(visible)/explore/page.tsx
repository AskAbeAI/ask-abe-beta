"use client";
// /app/explore/page.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Node, LinkProps, getColor } from '@/lib/threejs/types'


import { fetchRootNodes, fetchChildNodes } from '@/lib/utils/dynamicGraph';
import dynamic from 'next/dynamic';
const NoSSRForceGraph3D = dynamic(() => import('@/components/threejs/forceGraph'), {
	ssr: false,
  });


const GraphPage: React.FC = () => {
	const [nodeData, setNodeData] = useState<Node[]>([]);
	const [linkData, setLinkData] = useState<LinkProps[]>([]); // Adjusted to any[] for compatibility with links



	useEffect(() => {
		const initializeNodes = async () => {
			const rootNodes = await fetchRootNodes();
			setNodeData(rootNodes);
		};

		initializeNodes();
	}, []);




	const handleNodeClick = async (node: Node, event: MouseEvent) => {
		// Fetch new child nodes
		const childNodes = await fetchChildNodes(node.node_id!);
		//console.log(node.node_id);
		// Calculate new links
		const childLinks: LinkProps[] = childNodes.map((child, index) => ({
			source: node.node_id!,
			target: child.node_id!,
			key: `${node.node_id!}-${child.node_id!}-${index}`
		}));
		//console.log(childLinks[0])

		const newLinks: LinkProps[] = [...linkData, ...childLinks];

		// Feed combined nodes and links to calculate position
		const newNodes: Node[] = [...nodeData, ...childNodes];
		setNodeData(newNodes);
		setLinkData(newLinks);
	};

	return (
		
			<Canvas>

				<NoSSRForceGraph3D
					graphData={{ nodes: nodeData, links: linkData }}
					nodeId="node_id"
					nodeLabel="node_name"
					nodeColor={getColor}
					onNodeClick={handleNodeClick}
				/>


			</Canvas>
		
	);
};

export default GraphPage;