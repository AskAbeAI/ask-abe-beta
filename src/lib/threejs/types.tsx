
import { NodeObject as BaseNodeObject } from 'react-force-graph-3d';


export interface NodeProps {
	node_id?: string,
	citation?: string,
	link?: string,
	status?: string,
	node_type?: string,
	top_level_title?: string,
	level_classifier?: string,
	number?: string,
	node_name?: string,
	node_text?: JSON,
	definitions?: JSON,
	core_metadata?: JSON,
	processing?: JSON,
	addendum?: JSON,
	parent?: string,
	// direct_children?: string[];
	// siblings?: string[];

}
export interface PerformanceNodeProps {
	parent?: string,
	level_classifier?: string,
	depth?: string
}
export type Node = BaseNodeObject<NodeProps>;
export type PerformanceNode = BaseNodeObject<PerformanceNodeProps>;

export interface Link {
	source: string;
	target: string;
	key?: string;
}


export function getColor(node: Node): string{
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
export function getRadius(node: Node): number {
	switch(node.level_classifier!) {
	case "CORPUS":
		return 10;
	case "title":
		return  8;
	case "subtitle":
		return 6;
	case "chapter":
		return 5;
	case "subchapter":
		return 4;
	case "part":
		return 3;
	case "subpart":
		return 2;
	default:
		return 1;
	}
}