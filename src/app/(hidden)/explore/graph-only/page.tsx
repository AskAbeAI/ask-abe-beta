"use client";
// /app/explore/page.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Node, Link, getColor, getRadius, getOpacity, dagIgnore } from '@/lib/threejs/types';

import { fetchNodes, createNodesFromPath, BreadcrumbItemData, parseNodeIdToBreadcrumbs } from '@/lib/utils/dynamicGraph';
import dynamic from 'next/dynamic';
import NodeHUD from '@/components/threejs/hud-components/nodeHud';
import NodeTextHUD from '@/components/threejs/hud-components/textHud';
import NodeCountComponent from '@/components/threejs/hud-components/nodeCounter';
import SpriteText from 'three-spritetext';
import ExploreHUD from '@/components/threejs/exploreHud';
import ClassifierHUD from '@/components/threejs/hud-components/classifierHud';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import NodeBreadcrumbs from '@/components/threejs/hud-components/nodeBreadcrumbs';
import Image from "next/image";
import GraphSideBar from '@/components/threejs/graphSideBar';

const NoSSRForceGraph3D = dynamic(() => import('@/components/threejs/forceGraph'), {
	ssr: false,
});
// https://github.com/d3/d3-force
// https://github.com/vasturiano/3d-force-graph/tree/master




const GraphOnlyPage: React.FC = () => {
	const [nodeData, setNodeData] = useState<Node[]>([]);
	// Make this a Dictionary/set lmao
	const [linkData, setLinkData] = useState<Link[]>([]);
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);
	const [selectedClassifier, setSelectedClassifier] = useState<string[]>(["CORPUS", "title", "subtitle", "chapter", "subchapter", "part", "subpart", "section", "other"]);
	const hasFetched = useRef(false);
	const [breadcrumbData, setBreadcrumbData] = useState<BreadcrumbItemData[]>([]);

	useEffect(() => {
		if (!hasFetched.current) {
			hasFetched.current = true;
			const root = "us/federal/ecfr";
			fetchNodes(root, 2, nodeData, setNodeData, setLinkData, setSelectedNode);
		}

	}, []);
	const dummyFunction = () => {
		console.log(`Dummy function called!`);
	};

	useEffect(() => {
		if (!selectedNode || selectedNode.id === "us/federal/ecfr") {
			return;
		}
		console.log(selectedNode);
		const breadcrumb: BreadcrumbItemData[] = parseNodeIdToBreadcrumbs(selectedNode.id as string);
		setBreadcrumbData(breadcrumb);
	}, [selectedNode]);

	const handleNodeClick = async (node: Node, event: MouseEvent) => {
		if (node.status) { return; }
		setSelectedNode(node);

		// if (performanceNodeData.some(existingNode => existingNode.parent === node.id)) {
		// 	console.log(`Skipping processing click on ${node}`)
		// 	return;
		// }
		await fetchNodes(node.id as string, 3, nodeData, setNodeData, setLinkData, setSelectedNode);


	};
	const getColorWrapped = (node: Node) => {
		return getColor(node, selectedClassifier);
	};

	const handleBreadcrumbClick = (nodeId: string) => {
		if (nodeId === selectedNode!.id) {
			return;
		}
		for (const node of nodeData) {
			if (node.id as string === nodeId) {
				setSelectedNode(node);
				break;
			}
		}
	};



	return (

		<div className="relative h-full w-full">
			{/* This is the full page force graph. All following components must be styled with respect to this full page. https://github.com/vasturiano/react-force-graph */}
			<NoSSRForceGraph3D
				graphData={{ nodes: nodeData, links: linkData }}
				nodeRelSize={4}
				nodeLabel="node_name"
				nodeOpacity={0.8}
				nodeColor={getColorWrapped}
				onNodeClick={handleNodeClick}
				nodeResolution={10}
				linkColor={getColorWrapped}
				linkDirectionalParticles={2}
				linkDirectionalParticleSpeed={0.001}
				linkWidth="width"
				linkDirectionalParticleColor={getColorWrapped}
				showNavInfo={true}
				controlType="orbit"
			/>
			{/* Header */}
			<div className="absolute inset-0 flex flex-row pointer-events-none">

				<div className="flex h-screen min-h-screen w-full ">
					<div className="flex flex-col h-full pt-16 w-64 bg-card text-card-foreground p-4 justify-between border-r border-black">
						
							<GraphSideBar 
								selectedClassifier={selectedClassifier}
								setSelectedClassifier={setSelectedClassifier}
								selectedNode={selectedNode}
							/>
						
					</div>
					<div className="flex flex-col flex-1">
						<header className="h-16 min-w-screen bg-card text-foreground flex items-center justify-between px-4 top-0 right-0 border-b border-black">

							{/* Ensures header is fixed and items are evenly spaced */}
							<div className="flex items-center space-x-4 pointer-events-auto">
								<NodeBreadcrumbs
									nodeId={selectedNode?.id as string || ''}
									onBreadcrumbClick={handleBreadcrumbClick}
								/>
							</div>
							<div className="flex items-center space-x-4">
								<div className="text-xl font-semibold">
									United States Code of Federal Regulations
									{/* Organization's full name */}
								</div>

								{/* Center items */}

							</div>
							<div className="text-xl font-semibold">
								3D Force Graph {/* Dashboard label */}
							</div>
						</header>

					</div>

				</div>
			</div>
			{/* <div className="absolute top-16 left-0 pointer-events-auto">
				<ClassifierHUD
					selectedClassifier={selectedClassifier}
					setSelectedClassifier={setSelectedClassifier}

				/>
			</div> */}
			
			<div className="absolute bottom-0 right-0">
				<NodeCountComponent nodes={nodeData}></NodeCountComponent>
			</div>
		</div>
	);
};

export default GraphOnlyPage;