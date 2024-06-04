
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
	node_name?: string,
	status?: string,
	level_classifier?: string,
	value?: number
}
export type Node = BaseNodeObject<NodeProps>;
export type PerformanceNode = BaseNodeObject<PerformanceNodeProps>;

export interface Link {
	source: string;
	target: string;
}


export function getColor(node: Node): string{
	if (node.status && node.status != "definitions") {
		return "gray";
	}
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
		return "white";
	}
}
export function getRadius(node: Node): number {
	//console.log(node.level_classifier)
	switch(node.level_classifier!) {
	case "CORPUS":
		return 10000;
	case "title":
		return  500;
	case "subtitle":
		return 100;
	case "chapter":
		return 20;
	case "subchapter":
		return 10;
	case "part":
		return 5;
	case "subpart":
		return 2;
	default:
		console.log(JSON.stringify(node))
		return 1;
	}
}
export function getOpacity(node: Node): number {
	if (node.status && node.status != "definitions") {
		return 0;
	} else {
		return 1;
	}
}