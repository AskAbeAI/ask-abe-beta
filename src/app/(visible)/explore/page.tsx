"use client";
// /app/explore/page.tsx
import React, {useEffect, useState} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Node } from '@/components/threejs/node';
import { Link } from '@/components/threejs/link';
import { calculateNodePositions } from '@/lib/utils/forceSimulation';
import { NodeProps } from '@react-three/fiber';

const GraphPage: React.FC = () => {
	const [nodeData, setNodeData] = useState<NodeProps[]>(initialNodeData);
	const [linkData, setLinkData] = useState<NodeProps[]>(initialLinkData);
  
	useEffect(() => {
	  const positionedNodes = calculateNodePositions(nodeData, linkData);
	  setNodeData([...positionedNodes]);
	}, []);
  
	return (
	  <div style={{ height: '100vh' }}>
		<Canvas>
		  <OrbitControls />
		  <ambientLight />
		  <pointLight position={[10, 10, 10]} />
		  {nodeData.map(node => (
			<Node key={node.id} id={node.id} position={node.position} type={node.type} text={node.text} />
		  ))}
		  {linkData.map(link => (
			<Link key={`${link.source}-${link.target}`} source={link.source} target={link.target} nodes={nodeData} />
		  ))}
		</Canvas>
	  </div>
	);
  };