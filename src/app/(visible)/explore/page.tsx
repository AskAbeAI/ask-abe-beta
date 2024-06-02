"use client";
// /app/explore/page.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Node } from '@/components/threejs/node';
import { Link } from '@/components/threejs/link';

import { calculateNodePositions, NodeProps, LinkProps } from '@/lib/utils/forceSimulation';
import { fetchRootNodes, fetchChildNodes } from '@/lib/utils/dynamicGraph';
import * as d3 from "d3-force-3d";

const GraphPage: React.FC = () => {
	const [nodeData, setNodeData] = useState<NodeProps[]>([]);
	const [linkData, setLinkData] = useState<any[]>([]); // Adjusted to any[] for compatibility with links
	const [initialLoad, setInitialLoad] = useState<boolean>(true);
  
	useEffect(() => {
	  const initializeNodes = async () => {
		const rootNodes = await fetchRootNodes();
		setNodeData(rootNodes);
	  };
  
	  initializeNodes();
	}, []);
  
	const positionedNodes = useMemo(() => {
	  if (nodeData.length > 0) {
		return calculateNodePositions(nodeData, linkData);
	  }
	  return nodeData;
	}, [nodeData, linkData]);
  
	useEffect(() => {
	  if (initialLoad && positionedNodes.length > 0) {
		setNodeData(positionedNodes);
		setInitialLoad(false);
	  }
	}, [initialLoad, positionedNodes]);
  
	const handleNodeClick = async (nodeId: string) => {
	  const childNodes = await fetchChildNodes(nodeId);
	  setNodeData(prevNodeData => [...prevNodeData, ...childNodes]);
  
	  const newLinks = childNodes.map(child => ({ source: nodeId, target: child.node_id }));
	  setLinkData(prevLinkData => [...prevLinkData, ...newLinks]);
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
			  onClick={() => handleNodeClick(node.node_id)}
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