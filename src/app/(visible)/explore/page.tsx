"use client";
// /app/explore/page.tsx
import React, {useEffect, useState} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Node } from '@/components/threejs/node';
import { Link } from '@/components/threejs/link';

import { calculateNodePositions, NodeProps, LinkProps  } from '@/lib/utils/forceSimulation';
import { fetchRootNodes, fetchChildNodes } from '@/lib/utils/dynamicGraph';
import * as d3 from "d3-force-3d";

const GraphPage: React.FC = () => {
	const [nodeData, setNodeData] = useState<NodeProps[]>([]);
	const [linkData, setLinkData] = useState<LinkProps[]>([]); 
  
	useEffect(() => {
	  const initializeNodes = async () => {
		const rootNodes = await fetchRootNodes();
		setNodeData(rootNodes);
	  };
  
	  initializeNodes();
	}, []);
  
	useEffect(() => {
	  if (nodeData.length > 0) {
		const positionedNodes = calculateNodePositions(nodeData, linkData);
		setNodeData([...positionedNodes]);
	  }
	}, [nodeData, linkData]);
  
	const handleNodeClick = async (nodeId: string) => {
	  const childNodes = await fetchChildNodes(nodeId);
	  setNodeData(prevNodeData => [...prevNodeData, ...childNodes]);
  
	  const newLinks: LinkProps[] = childNodes.map(child => ({ source: nodeId, target: child.node_id }));
	  setLinkData(prevLinkData => [...prevLinkData, ...newLinks]);
	};
  
	return (
	  <div style={{ height: '100vh' }}>
		<Canvas>
		  <OrbitControls />
		  <ambientLight />
		  <pointLight position={[10, 10, 10]} />
		  {nodeData.map(node => (
			<Node
			  
			  onClick={() => handleNodeClick(node.node_id)} // Handle click to load children
			/>
		  ))}
		  {linkData.map(link => (
			<Link key={`${link.source}-${link.target}`} source={link.source} target={link.target} nodes={nodeData} />
		  ))}
		</Canvas>
	  </div>
	);
  };
  
  export default GraphPage;