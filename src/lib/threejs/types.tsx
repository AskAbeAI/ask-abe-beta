
import { NodeObject as BaseNodeObject } from 'react-force-graph-3d';
import { NodeText } from '../types';


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
export interface TextNodeProps {
	parent?: string,
	node_name?: string,
	status?: string,
	node_text: NodeText,
	level_classifier?: string,
	value?: number
}
export type Node = BaseNodeObject<NodeProps>;
export type PerformanceNode = BaseNodeObject<PerformanceNodeProps>;

export type TextNode = BaseNodeObject<TextNodeProps>;

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
		return 10;
	case "title":
		return  5;
	case "subtitle":
		return 4;
	case "chapter":
		return 3;
	case "subchapter":
		return 3;
	case "part":
		return 2;
	case "subpart":
		return 1;
	default:
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
export function dagIgnore(node: Node): boolean {
	switch(node.level_classifier!) {
		case "CORPUS":
			return true;
		case "title":
			return  false;
		case "subtitle":
			return false;
		case "chapter":
			return false;
		case "subchapter":
			return false;
		case "part":
			return false;
		case "subpart":
			return false;
		case "hub":
			return true;
		default:
			
			return false;
		}
}