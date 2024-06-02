// /components/Link.tsx
import React from 'react';
import { NodeProps } from '@/lib/utils/forceSimulation';
import { Line } from '@react-three/drei';

export interface LinkPosition {

	sourceNodePos: [number, number, number];
	targetNodePos: [number, number, number];
	key?: string;
}

export const Link: React.FC<LinkPosition> = ({ sourceNodePos, targetNodePos }) => {

	return (

		<Line
			points={[sourceNodePos, targetNodePos]}
			color="black"
			lineWidth={2}
		/>



	);
};
