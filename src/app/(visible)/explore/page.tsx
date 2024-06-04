"use client";
// /app/explore/page.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Node, Link, getColor, getRadius, PerformanceNode, getOpacity } from '@/lib/threejs/types';

import { fetchNodes, fetchPerformanceNodes, fetchCachedNodes } from '@/lib/utils/dynamicGraph';
import dynamic from 'next/dynamic';
import NodeHUD from '@/components/threejs/hud';
import NodeTextHUD, { NodeText } from '@/components/threejs/textHud';
import NodeCountComponent from '@/components/threejs/nodeCounter';
import SpriteText from 'three-spritetext';
const NoSSRForceGraph3D = dynamic(() => import('@/components/threejs/forceGraph'), {
	ssr: false,
});
// https://github.com/d3/d3-force
// https://github.com/vasturiano/3d-force-graph/tree/master




const GraphPage: React.FC = () => {
	const [performanceNodeData, setPerformanceNodeData] = useState<PerformanceNode[]>([]);
	const [linkData, setLinkData] = useState<Link[]>([]);
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);
	const hasFetched = useRef(false);

	useEffect(() => {
		if (!hasFetched.current) {
			hasFetched.current = true;
			const root = "us/federal";
			const offsetNode = "us/federal/ecfr/title=40"
			//fetchCachedNodes(setPerformanceNodeData, setLinkData)
			fetchPerformanceNodes(root, 3, performanceNodeData, setPerformanceNodeData, setLinkData);
			//fetchPerformanceNodes(offsetNode, 4, performanceNodeData, setPerformanceNodeData, setLinkData);

		}
		
	}, []);

	const handleNodeClick = async (node: PerformanceNode, event: MouseEvent) => {
		if (node.status) { return; }
		setSelectedNode(node)
		if (performanceNodeData.some(existingNode => existingNode.parent === node.id)) {
			console.log(`Skipping processing click on ${node}`)
			return;
		}
		await fetchPerformanceNodes(node.id as string, 3, performanceNodeData, setPerformanceNodeData, setLinkData);

	};
	return (
		<>
			{/* https://github.com/vasturiano/react-force-graph */}
			<NoSSRForceGraph3D
				graphData={{ nodes: performanceNodeData, links: linkData }}
				nodeRelSize={4}
				nodeVal="value"
				nodeLabel="node_name"
				nodeOpacity={0.8}
				// nodeThreeObject={node => {
				// 	const sprite = new SpriteText(node.node_name);
				// 	sprite.color = getColor(node);
				// 	sprite.textHeight = 8;
				// 	return sprite;
				//   }}
				nodeColor={getColor}
				onNodeClick={handleNodeClick}
				nodeResolution={10}
				dagMode="radialin"
				
				linkDirectionalParticles={5}
				linkDirectionalParticleSpeed={0.0005}
				linkDirectionalParticleColor={getColor}
				showNavInfo={true}
				controlType='orbit'


			/>
			<NodeCountComponent nodes={performanceNodeData} />
			<NodeHUD
				node={selectedNode}
			/>
			{/* <NodeHUD
				node={selectedNode}
			/>
			<NodeTextHUD
				node_text={selectedNode ? selectedNode.node_text as unknown as NodeText : null}
			/> */}
		</>








	);
};

export default GraphPage;
