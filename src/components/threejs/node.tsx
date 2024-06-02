// /components/Node.tsx
import React from 'react';
import { NodeProps } from '@/lib/utils/forceSimulation';
import { Sphere } from '@react-three/drei';

export const Node: React.FC<NodeProps> = (props) => {
	return (
		<Sphere 
		position={[props.x, props.y, props.z]} 
		onClick={props.onClick}
		args={[chooseArgs(props.level_classifier!)[1]]}
		>
			<meshStandardMaterial color={chooseArgs(props.level_classifier!)[0]}/>
		</Sphere>

	);
};
export interface nodeArgs {
	nodeColor: string;
	nodeRadius: number;
	linkDistance: number;
}

export function chooseArgs(level_classifier: string): [string, number] {
    switch(level_classifier) {
        case "CORPUS":
            return ["purple", 0.4, 10];
        case "title":
            return ["hotpink", 0.35, 9];
        case "subtitle":
            return ["red", 0.3, 8];
        case "chapter":
            return ["orange", 0.25, 7];
        case "subchapter":
            return ["yellow", 0.2, 6];
        case "part":
            return ["green", 0.15, 5];
        case "subpart":
            return ["blue", 0.10, 4];
        default:
            return ["gray", 0.05, 3];
    }
}