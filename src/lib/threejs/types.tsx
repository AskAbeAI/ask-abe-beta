import { NodeObject as BaseNodeObject } from "react-force-graph-3d";
import { NodeText } from "../types";

export interface NodeProps {
	parent?: string;
	node_name?: string;
	status?: string;
	level_classifier?: string;
	value?: number;
	node_id?: string;
	citation?: string;
	link?: string;
	node_type?: string;
	top_level_title?: string;
	number?: string;
	node_text?: NodeText;
	definitions?: JSON;
	core_metadata?: JSON;
	processing?: JSON;
	addendum?: JSON;
}

export type Node = BaseNodeObject<NodeProps>;

export interface Link {
	source: string;
	target: string;
}
export function getNodeLabel(node: Node) {
    return `
        <div class="node-label" style="background-color: white; border: 1px solid #ccc; padding: 8px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); color: black;">
            <strong>Name:</strong> ${node.node_name}<br>
            <strong>Citation:</strong> ${node.citation}<br>
        </div>
    `;
}

export function getColor(node: Node, selectedClassifier: string[]): string {
	if(selectedClassifier && !selectedClassifier.includes(node.level_classifier!)) {
		return "gray";
	}
	if (node.status && node.status != "definitions") {
		return "gray";
	}
	switch (node.level_classifier!) {
		case "CORPUS":
			return "purple";
		case "title":
			return "hotpink";
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
	switch (node.level_classifier!) {
		case "CORPUS":
			return 10;
		case "title":
			return 5;
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
	switch (node.level_classifier!) {
		case "CORPUS":
			return true;
		case "title":
			return false;
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
