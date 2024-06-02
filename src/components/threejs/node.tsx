// /components/Node.tsx
import React from 'react';
import { NodeProps } from '@/lib/utils/forceSimulation';


export const Node: React.FC<NodeProps> = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={'hotpink'} />
    </mesh>
  );
};
