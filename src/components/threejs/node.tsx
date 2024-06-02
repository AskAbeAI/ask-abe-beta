// /components/Node.tsx
import React from 'react';
import { NodeProps } from '@/lib/utils/forceSimulation';


export const Node: React.FC<NodeProps> = (props) => {
  return (
    <mesh position={[props.x, props.y, props.z]} onClick={props.onClick}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={'hotpink'} />
    </mesh>
  );
};
