// /components/Link.tsx
import React from 'react';

interface Node {
  id: number;
  position: [number, number, number];
}

interface LinkProps {
  source: number;
  target: number;
  nodes: Node[];
}

export const Link: React.FC<LinkProps> = ({ source, target, nodes }) => {
  const sourceNode = nodes.find(node => node.id === source);
  const targetNode = nodes.find(node => node.id === target);

  if (!sourceNode || !targetNode) return null;

  const positions = new Float32Array([
    ...sourceNode.position,
    ...targetNode.position,
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
