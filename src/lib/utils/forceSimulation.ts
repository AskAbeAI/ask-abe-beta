// /utils/forceSimulation.ts
import * as d3 from "d3-force-3d";

export interface NodeProps extends d3.Node {
	node_id: string,
	citation?: string,
	link?: string,
	status?: string,
	node_type: string,
	top_level_title?: string,
	level_classifier?: string,
	number?: string,
	node_name: string,
	node_text?: JSON,
	definitions?: JSON,
	core_metadata?: JSON,
	processing?: JSON,
	addendum?: JSON,
	parent?: string,
	direct_children?: string[];
	siblings?: string[];
	onClick?: () => void;
}
export interface LinkProps {
	source: string;
	target: string;
	sourceNodePos?: [number, number, number];
	targetNodePos?: [number, number, number];
	key?: string;
}


export const calculateNodePositions = (nodes: NodeProps[], links: LinkProps[]) => {
	const simulation = d3.forceSimulation(nodes, 3)
		.force("link", d3.forceLink(links).id(function (d) { return d.node_id!; }))
		.force("center", d3.forceCenter());


	simulation.tick(300); // Run the simulation for a few ticks to stabilize


	simulation.stop();
	//console.log(`Node positions calculated!\n${JSON.stringify(nodes, null, 2)}`)
	return nodes;
};

export function getPosition(sourceNode: NodeProps): [number, number, number] {
	return [sourceNode.x, sourceNode.y, sourceNode.z];
  }