"use client";
// /app/explore/page.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Node, Link, getColor, getRadius } from '@/lib/threejs/types';

import { fetchNodes } from '@/lib/utils/dynamicGraph';
import dynamic from 'next/dynamic';
import NodeHUD from '@/components/threejs/hud';
import NodeTextHUD, { NodeText} from '@/components/threejs/textHud';

const NoSSRForceGraph3D = dynamic(() => import('@/components/threejs/forceGraph'), {
	ssr: false,
});
// https://github.com/d3/d3-force
// https://github.com/vasturiano/3d-force-graph/tree/master
// https://github.com/vasturiano/react-force-graph

const GraphPage: React.FC = () => {
	const [nodeData, setNodeData] = useState<Node[]>([]);
	const [linkData, setLinkData] = useState<Link[]>([]);
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);

	useEffect(() => {
		const initializeNodes = async () => {
			const depth: number = 2;
			const root: string = "us/federal";
			const result = await fetchNodes(root, depth); // fetchNodes now returns an object
			console.log(`Succesfully returned ${result.nodes.length} nodes, with ${result.links.length} links!`);
			setSelectedNode(result.nodes[0]);
			setNodeData(result.nodes);
			setLinkData(result.links);
		};

		initializeNodes();
	}, []);

	const handleNodeClick = async (node: Node, event: MouseEvent) => {
		// Fetch new child nodes
		setSelectedNode(node)
		if (node.node_text) {
			return;
		}
		const result = await fetchNodes(node.node_id!, 1); // Assuming you want to fetch children of the clicked node at depth 1
		console.log(`Succesfully returned ${result.nodes.length} nodes, with ${result.links.length} links!`);
		const childNodes = result.nodes;
		const childLinks = result.links;

		// Calculate new links
		const newLinks: Link[] = [...linkData, ...childLinks];

		// Feed combined nodes and links to calculate position
		const newNodes: Node[] = [...nodeData, ...childNodes];
		setNodeData(newNodes);
		setLinkData(newLinks);
	};
	return (
		<>
			<NoSSRForceGraph3D
				graphData={{ nodes: nodeData, links: linkData }}
				nodeVal={getRadius}
				nodeId="node_id"
				nodeLabel="node_name"
				nodeColor={getColor}
				onNodeClick={handleNodeClick}
				linkDirectionalParticles={5}
				linkDirectionalParticleSpeed={0.0005}
				linkDirectionalParticleColor={getColor}
				showNavInfo={true}

			/>
			<NodeHUD
				node={selectedNode}
			/>
			<NodeTextHUD
				node_text={selectedNode ? selectedNode.node_text as unknown as NodeText : null}
			/>
		</>








	);
};

export default GraphPage;
