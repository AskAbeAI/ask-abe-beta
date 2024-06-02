// /utils/forceSimulation.ts
import { chooseArgs } from "@/components/threejs/node";
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
	console.log(JSON.stringify(links[0]))
	const simulation = d3.forceSimulation([], 3)
		.force("link", d3.forceLink().id(function (d) { return d.node_id!; }))
		.force("center", d3.forceCenter())
		.force("collide", d3.forceCollide().radius(function (d: NodeProps) { return chooseArgs(d.level_classifier!)[1]; } ));
		

	simulation.nodes(nodes)
	simulation.force("link").links(links).distance(5)
	simulation.tick(1000); // Run the simulation for a few ticks to stabilize


	simulation.stop();
	//console.log(`Node positions calculated!\n${JSON.stringify(nodes, null, 2)}`)
	for (const link of links as any[]) {
		//console.log(JSON.stringify(link.source))
		link.sourceNodePos = getPosition(link.source)
		link.source = link.source.node_id!
		link.targetNodePos = getPosition(link.target)
		link.target = link.target.node_id!
	}
	
	return nodes;
};

export function getPosition(sourceNode: NodeProps): [number, number, number] {
	return [sourceNode.x, sourceNode.y, sourceNode.z];
  }