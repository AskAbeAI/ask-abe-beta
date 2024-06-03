// /components/Node.tsx
import React from 'react';
import { NodeProps } from '@/lib/utils/forceSimulation';
import { Sphere } from '@react-three/drei';

export const Node: React.FC<NodeProps> = (props) => {
	return (
		<Sphere 
		
		>
			<meshStandardMaterial color={chooseArgs(props.level_classifier!).nodeColor}/>
		</Sphere>

	);
};
export interface nodeArgs {
	nodeColor: string;
	nodeRadius: number;
	linkDistance: number;
}

export function getRadius(node: NodeProps): number {
	switch(node.level_classifier!) {
	case "CORPUS":
		return 0.4;
	case "title":
		return  0.35;
	case "subtitle":
		return 0.3;
	case "chapter":
		return 0.25;
	case "subchapter":
		return 0.2;
	case "part":
		return 0.15;
	case "subpart":
		return 0.1;
	default:
		return 0.05;
	}
}
export function getColor(node: NodeProps): string{
	switch(node.level_classifier!) {
	case "CORPUS":
		return "purple";
	case "title":
		return  "hotpink";
	case "subtitle":
		return "red";
	case "chapter":
		return "orange";
	case "subchapter":
		return "yellow";
	case "part":
		return "green";
	case "subpart":
		return "blue";
	default:
		return "gray";
	}
}
export function chooseArgs(level_classifier: string): nodeArgs {
    switch(level_classifier) {
        case "CORPUS":
            return { nodeColor: "purple", nodeRadius: 0.4, linkDistance: 30 };
        case "title":
            return { nodeColor: "hotpink", nodeRadius: 0.35, linkDistance: 25 };
        case "subtitle":
            return { nodeColor: "red", nodeRadius: 0.3, linkDistance: 20 };
        case "chapter":
            return { nodeColor: "orange", nodeRadius: 0.25, linkDistance: 17 };
        case "subchapter":
            return { nodeColor: "yellow", nodeRadius: 0.2, linkDistance: 14 };
        case "part":
            return { nodeColor: "green", nodeRadius: 0.15, linkDistance: 10 };
        case "subpart":
            return { nodeColor: "blue", nodeRadius: 0.1, linkDistance: 8 };
        default:
            return { nodeColor: "gray", nodeRadius: 0.05, linkDistance: 6 };
    }
}