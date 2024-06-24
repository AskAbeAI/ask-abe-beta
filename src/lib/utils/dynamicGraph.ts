// /lib/api.ts
import { createClient } from '@supabase/supabase-js';
import {  Node, Link, getRadius, getColor } from '@/lib/threejs/types'; // Adjust the import as per your file structure
import { NodeText, Paragraph, ReferenceHub, Reference } from '@/lib/types';

// 

export const fetchNodes = async (
	parentId: string,
	depth: number,
	Nodes: Node[],
	setNodeData: React.Dispatch<React.SetStateAction<Node[]>>,
	setLinkData: React.Dispatch<React.SetStateAction<Link[]>>,
	setSelectedNode: React.Dispatch<React.SetStateAction<Node>>
): Promise<void> => {
	if (depth === 0) return;

	console.log(`=== Entering fetchNodes ===`);
	console.log(`parentId: ${parentId}, depth: ${depth}`);
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseKey);


	let newLinks: Link[] = [];
	let newNodes: Node[] = [];

	const { data, error } = await supabase.rpc('recursive_fetch', { parent_id: parentId, max_depth: depth });
	//console.log(JSON.stringify(data))


	if (error) {
		console.error(`Error fetching nodes for parent ID ${parentId}:`, error);
		return;
	}
	// Get all new nodes for this parentId

	//console.log(JSON.stringify(data))

	for (let node of data as Node[]) {
		if (node.level_classifier == "hub") {
			//console.log(JSON.stringify(node, null, 2))
			node.node_name = `Definitions Hub for ${node.parent}`
		}
		//node.value = getRadius(node)
		newNodes.push(node);
		if(node.id == parentId) {
			setSelectedNode(node)
		}
		if (node.parent == "us/federal") {
			continue;
		}
		newLinks.push({
			source: node.parent,
			target: node.id as string,
			key: `${parentId}-${node.id}`,
			color: getColor(node),
			width: getRadius(node)
		} as Link);
	}





	//console.log(`NewLinks: ${JSON.stringify(newLinks)}`);
	setLinkData(prev => [...prev, ...newLinks]);

	//console.log(`NewNodes: ${JSON.stringify(newNodes)}`);
	setNodeData(prev => [...prev, ...newNodes]);


	return;
};




// ID: us/federal/ecfr/title=38/chapter=I/part=19/subpart=B/section=19.35
export function createNodesFromPath(leafNodeID: string): { nodes: Node[], links: Link[] } {
    const nodes: Node[] = [];
    const links: Link[] = [];
    const parts = leafNodeID.split('/').filter(part => part.trim() !== '');
    
    let currentNodeID = "";
    let parentID = "";

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
		
        
        if (i > 0) { // Root does not have a parent
            parentID = currentNodeID;
        }

        if (currentNodeID !== "") {
            currentNodeID += "/";
        }
        currentNodeID += part;

        let node_name = part;
        if (part == "us" || part == "federal") {
			continue;
            
        } 
		let [key, value] = part.split('=');
            node_name = value;
        
		const link: Link = {
			source: parentID,
			target: currentNodeID
		};
		const node: Node = {
            id: currentNodeID,
            parent: parentID,
            node_name: `${key} ${value}`,
			level_classifier: key,
        };
		if (part == "ecfr") {
			link.source = currentNodeID;
			node.node_name = "Code of Federal Regulations"
			node.level_classifier = "CORPUS"
			
		}
		
		nodes.push(node);
		links.push(link);
        
    }

    return { nodes, links };
}