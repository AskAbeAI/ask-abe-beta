// /lib/api.ts
import { createClient } from '@supabase/supabase-js';
import { PerformanceNode, Node, Link, getRadius, getColor, TextNode } from '@/lib/threejs/types'; // Adjust the import as per your file structure
import { NodeText, Paragraph, ReferenceHub, Reference } from '@/lib/types';

export const fetchNodes = async (
	parentId: string,
	depth: number,
	setNodeData: React.Dispatch<React.SetStateAction<Node[]>>,
	setLinkData: React.Dispatch<React.SetStateAction<Link[]>>
): Promise<void> => {
	if (depth === 0) return;

	console.log(`=== Entering fetchNodes ===`);
	console.log(`parentId: ${parentId}, depth: ${depth}`);
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseKey);

	const { data, error } = await supabase
		.from('us_federal_ecfr')
		.select(`
            id, 
            citation, 
            link, 
            status, 
            node_type, 
            top_level_title, 
            level_classifier, 
            number, 
            node_name, 
            node_text, 
            definitions, 
            core_metadata, 
            processing, 
            addendum, 
            parent
        `)

		.eq('parent', parentId);

	if (error) {
		console.error(`Error fetching nodes for parent ID ${parentId}:`, error);
		return;
	}
	// Get all new nodes for this parentId
	const newNodes = data?.map(node => ({ ...node, node_id: node.id }));
	const newLinks = newNodes?.map(node => ({
		source: parentId,
		target: node.node_id,
		key: `${parentId}-${node.node_id}`
	}));
	console.log(`NewNodes: ${JSON.stringify(newNodes)}`);
	console.log(`NewLinks: ${JSON.stringify(newLinks)}`);

	setNodeData(prev => [...prev, ...newNodes]);
	setLinkData(prev => [...prev, ...newLinks]);

	for (const node of newNodes) {
		await fetchNodes(node.node_id, depth - 1, setNodeData, setLinkData);
	}
	return;
};
// export const fetchToRoot = async(parentId: string,
// 	depth: number,
// 	performanceNodes: PerformanceNode[],
// 	setPerformanceNodeData: React.Dispatch<React.SetStateAction<PerformanceNode[]>>,
// 	setLinkData: React.Dispatch<React.SetStateAction<Link[]>>): Promise<void> =>
// 	{


// 	}

export const fetchPerformanceNodes = async (
	parentId: string,
	depth: number,
	performanceNodes: PerformanceNode[],
	setPerformanceNodeData: React.Dispatch<React.SetStateAction<PerformanceNode[]>>,
	setLinkData: React.Dispatch<React.SetStateAction<Link[]>>,
	setSelectedNode: React.Dispatch<React.SetStateAction<PerformanceNode>>
): Promise<void> => {
	if (depth === 0) return;

	console.log(`=== Entering fetchPerformanceNodes ===`);
	console.log(`parentId: ${parentId}, depth: ${depth}`);
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseKey);


	let newLinks: Link[] = [];
	let newNodes: PerformanceNode[] = [];

	const { data, error } = await supabase.rpc('fetch_tree_nodes', { parent_id: parentId, max_depth: depth });
	console.log(JSON.stringify(data))


	if (error) {
		console.error(`Error fetching nodes for parent ID ${parentId}:`, error);
		return;
	}
	// Get all new nodes for this parentId

	//console.log(JSON.stringify(data))

	for (let node of data as PerformanceNode[]) {
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
	setPerformanceNodeData(prev => [...prev, ...newNodes]);


	return;
};

export const fetchTextNodes = async (
	parentId: string,
	depth: number,
	textNodes: TextNode[],
	setTextNodeData: React.Dispatch<React.SetStateAction<TextNode[]>>,
	setLinkData: React.Dispatch<React.SetStateAction<Link[]>>
): Promise<void> => {
	if (depth === 0) return;

	console.log(`=== Entering fetchPerformanceNodes ===`);
	console.log(`parentId: ${parentId}, depth: ${depth}`);
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseKey);


	let newLinks: Link[] = [];
	let newNodes: TextNode[] = [];
	let refLinks: Link[] = [];
	let refNodes: TextNode[] = [];

	const { data, error } = await supabase.rpc('fetch_tree_nodes', { parent_id: parentId, max_depth: depth });
	//console.log(JSON.stringify(data))


	if (error) {
		console.error(`Error fetching nodes for parent ID ${parentId}:`, error);
		return;
	}
	// Get all new nodes for this parentId

	//console.log(JSON.stringify(data))
	

	for (let node of data as TextNode[]) {
		if (node.level_classifier == "hub") {
			//console.log(JSON.stringify(node, null, 2))
			node.node_name = `Definitions Hub for ${node.parent}`
		}

		for (const key in node.node_text.paragraphs) {
			let paragraph = node.node_text.paragraphs[key];
			if (paragraph.references) {
				for (const ref_key in paragraph.references.references) {
					if (paragraph.references.references[ref_key].id) {
						// Implement set/dictionary to check for existence.
					}
				}
			}
		}

		//node.value = getRadius(node)
		newNodes.push(node);
		if (node.parent == "us/federal") {
			continue;
		}
		newLinks.push({
			source: node.parent,
			target: node.id as string,
			key: `${parentId}-${node.id}`,
			
		} as Link);
	}





	//console.log(`NewLinks: ${JSON.stringify(newLinks)}`);
	setLinkData(prev => [...prev, ...newLinks]);

	//console.log(`NewNodes: ${JSON.stringify(newNodes)}`);
	//setPerformanceNodeData(prev => [...prev, ...newNodes]);


	return;
};

export async function fetchCachedNodes(setPerformanceNodeData: React.Dispatch<React.SetStateAction<PerformanceNode[]>>,
	setLinkData: React.Dispatch<React.SetStateAction<Link[]>>) {

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseKey);

	let pageIndex = 0;
	let pageSize = 1000;  // Set page size, Supabase default limit is 1000
	let hasMore = true;
	let newLinks: Link[] = [];
	let newNodes: PerformanceNode[] = [];
	while (hasMore) {
		const { data: newData, error, count } = await supabase
			.from('us_federal_ecfr_performance')
			.select('*', { count: 'exact' })
			.range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1);
		//const { data, error } = await supabase.rpc('fetch_tree_nodes', { parent_id: parentId, max_depth: depth }).range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1);;


		if (error) {
			console.error(`Error fetching nodes for parent ID :`, error);
			return;
		}
		// Get all new nodes for this parentId



		for (const node of newData as PerformanceNode[]) {
			newNodes.push(node);
			if (node.parent == "us/federal") {
				continue;
			}
			newLinks.push({
				source: node.parent,
				target: node.id as string,
				key: `${node.parent}-${node.id}`
			} as Link);
		}

		pageIndex++;
		// Check if there's more data to fetch
		hasMore = newData.length === pageSize;



	}
	//console.log(`NewLinks: ${JSON.stringify(newLinks)}`);
	setLinkData(prev => [...prev, ...newLinks]);

	//console.log(`NewNodes: ${JSON.stringify(newNodes)}`);
	setPerformanceNodeData(prev => [...prev, ...newNodes]);


	return;


}

// ID: us/federal/ecfr/title=38/chapter=I/part=19/subpart=B/section=19.35
export function createNodesFromPath(leafNodeID: string): { nodes: PerformanceNode[], links: Link[] } {
    const nodes: PerformanceNode[] = [];
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
		const node: PerformanceNode = {
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