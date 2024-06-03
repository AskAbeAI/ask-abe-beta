// /lib/api.ts
import { createClient } from '@supabase/supabase-js';
import { Node, Link } from '@/lib/threejs/types'; // Adjust the import as per your file structure


export const fetchNodes = async (parentId: string = 'us/federal/ecfr', depth: number = 1): Promise<{ nodes: Node[], links: Link[] }> => {
	
	if (depth == 0) {
		const nodes: Node[] = []
		const links: Link[] = []
		return {nodes, links}
	}
	console.log(`=== Entering fetchNodes ===`)
	console.log(`parentId: ${parentId}, depth: ${depth}`)
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
        return { nodes: [], links: [] };
    }
	let nodes: Node[] = [];

    nodes = (data as any[]).map(node => ({
        ...node,
		node_id: node.id
    } as Node))
	console.log(`Nodes: ${JSON.stringify(nodes, null, 2)}`)
	let links: Link[] = [];
	
	if (parentId !== "us/federal") {
		links = nodes.map(node => ({
			source: parentId!,
			target: node.node_id!,
			key: `${parentId}-${node.node_id}`
		} as Link));
	}
	console.log(`Links: ${JSON.stringify(links, null, 2)}`)
	
	for (const node of nodes) {
		const childResult = await fetchNodes(node.node_id!, depth - 1);
		links = links.concat(childResult.links)
		nodes = nodes.concat(childResult.nodes)
		
	}
    

    return { nodes, links };
};
