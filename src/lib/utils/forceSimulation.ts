// /utils/forceSimulation.ts
import * as d3 from "d3";

export interface NodeProps extends d3.SimulationNodeDatum {
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
    direct_children?: string[]
    siblings?: string[]
	position?: [x: number, y: number, z: number];
}

interface Link {
  source: string;
  target: string;
}
const d3nodes: d3.SimulationNodeDatum = {

}

export const calculateNodePositions = (nodes: NodeProps[], links: Link[]) => {
	const simulation = d3.forceSimulation(nodes)
	  .force('link', d3.forceLink(links).id((d: any) => d.id).distance(50))
	  .force('charge', d3.forceManyBody().strength(-200))
	  .force('center', d3.forceCenter(0, 0))
	  .force('collision', d3.forceCollide().radius(10));
  
	simulation.tick(300); // Run the simulation for a few ticks to stabilize
  
	nodes.forEach(node => {
	  node.position = [node.x || 0, node.y || 0, 0]; // Assign calculated positions
	});
  
	simulation.stop();
  
	return nodes;
  };
