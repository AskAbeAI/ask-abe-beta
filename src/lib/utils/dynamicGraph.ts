// /lib/api.ts
import { createClient } from '@supabase/supabase-js';
import { PerformanceNode, Node, Link } from '@/lib/threejs/types'; // Adjust the import as per your file structure


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

export const fetchPerformanceNodes = async (
	parentId: string,
	depth: number,
	performanceNodes: PerformanceNode[],
	setPerformanceNodeData: React.Dispatch<React.SetStateAction<PerformanceNode[]>>,
	setLinkData: React.Dispatch<React.SetStateAction<Link[]>>
): Promise<void> => {
	if (depth === 0) return;

	console.log(`=== Entering fetchPerformanceNodes ===`);
	console.log(`parentId: ${parentId}, depth: ${depth}`);
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseKey);

	const { data, error } = await supabase.rpc('fetch_tree_nodes', { parent_id: parentId, max_depth: depth });
	// const { data, error } = await supabase
	//     .from('us_federal_ecfr')
	//     .select(`
	//         id, 
	//         level_classifier, 
	//         parent
	//     `)
	//     .eq('parent', parentId);

	if (error) {
		console.error(`Error fetching nodes for parent ID ${parentId}:`, error);
		return;
	}
	// Get all new nodes for this parentId
	const newNodes: PerformanceNode[] = (data as PerformanceNode[])?.map(node => ({ ...node }));

	let newLinks: Link[] = [];
	for (const node of newNodes) {
		if (node.parent == "us/federal") {
			continue;
		}
		newLinks.push({
			source: node.parent,
			target: node.id as string,
			key: `${parentId}-${node.id}`
		} as Link);
	}


	console.log(`NewLinks: ${JSON.stringify(newLinks)}`);
	setLinkData(prev => [...prev, ...newLinks]);

	console.log(`NewNodes: ${JSON.stringify(newNodes)}`);
	setPerformanceNodeData(prev => [...prev, ...newNodes]);


	// for (const node of newNodes) {
	// 	await fetchPerformanceNodes(node.id as string, depth - 1, newNodes, setPerformanceNodeData, setLinkData);
	// }
	return;
};

export async function fetchCachedNodes(setPerformanceNodeData: React.Dispatch<React.SetStateAction<PerformanceNode[]>>,
	setLinkData: React.Dispatch<React.SetStateAction<Link[]>>) {
	let data: PerformanceNode[] = [];
	let pageIndex = 0;
	let pageSize = 1000;  // Set page size, Supabase default limit is 1000
	let hasMore = true;

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
	const supabase = createClient(supabaseUrl, supabaseKey);

	while (hasMore) {
		const { data: newData, error, count } = await supabase
			.from('us_federal_ecfr_performance')
			.select('*', { count: 'exact' })
			.range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1);


		if (error) {
			console.error('Error fetching data:', error);
			break;
		}
		let newNodes: PerformanceNode[] = (data as PerformanceNode[])?.map(node => ({ ...node }));

		let newLinks: Link[] = [];
		for (const node of newNodes) {
			if (node.parent == "us/federal") {
				continue;
			}
			newLinks.push({
				source: node.parent,
				target: node.id as string,
				key: `${node.parent}-${node.id}`
			} as Link);
		}
		console.log(`NewLinks: ${newLinks.length}`);
		setLinkData(prev => [...prev, ...newLinks]);

		console.log(`NewNodes: ${newNodes.length}`);
		setPerformanceNodeData(prev => [...prev, ...newNodes]);

		data = data.concat(newData as PerformanceNode[]);
		pageIndex++;
		// Check if there's more data to fetch
		hasMore = newData.length === pageSize;
	}

	return data;
}