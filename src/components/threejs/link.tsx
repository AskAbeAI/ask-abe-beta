// /components/Link.tsx
import React from 'react';
import { NodeProps } from '@/lib/utils/forceSimulation';


interface LinkProps {
  source: string;
  target: string;
  nodes: NodeProps[];
}

export const Link: React.FC<LinkProps> = ({ source, target, nodes }) => {
  const sourceNode = nodes.find(node => node.node_id === source);
  const targetNode = nodes.find(node => node.node_id === target);

  if (!sourceNode || !targetNode) return null;

  const positions = new Float32Array([
    [sourceNode.x, sourceNode.y, sourceNode.z]
    [targetNode.x, targetNode.y, targetNode.z],
  ]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          itemSize={3}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={'white'} />
    </line>
  );
};
