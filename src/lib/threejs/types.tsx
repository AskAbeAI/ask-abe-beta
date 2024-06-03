
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
	direct_children?: string[];
	siblings?: string[];

}
export type Node = BaseNodeObject<NodeProps>;

export interface LinkProps {
	source: string;
	target: string;
	key?: string;
}

export function getRadius(node: Node): number {
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