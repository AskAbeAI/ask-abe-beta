// /lib/api.ts
import { createClient } from '@supabase/supabase-js';
import { Node } from '@/lib/threejs/types'; // Adjust the import as per your file structure

export const fetchRootNodes = async (): Promise<Node[]> => {
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
		parent, 
		direct_children,
		siblings
	  `)
	  .eq('id', 'us/federal/ecfr');
  
	if (error) {
	  console.error('Error fetching root nodes:', error);
	  return [];
	}
  
	return (data as any[]).map(node => ({
	  node_id: node.id,
	  citation: node.citation,
	  link: node.link,
	  status: node.status,
	  node_type: node.node_type,
	  top_level_title: node.top_level_title,
	  level_classifier: node.level_classifier,
	  number: node.number,
	  node_name: node.node_name,
	  node_text: node.node_text,
	  definitions: node.definitions,
	  core_metadata: node.core_metadata,
	  processing: node.processing,
	  addendum: node.addendum,
	  parent: node.parent,
	  direct_children: node.direct_children,
	  siblings: node.siblings, // You might need to fetch or calculate siblings separately
	} as Node));
  };

export const fetchChildNodes = async (parentId: string): Promise<Node[]> => {
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
		parent, 
		direct_children,
		siblings
	  `)
	  .eq('parent', parentId);
  
	if (error) {
	  console.error('Error fetching root nodes:', error);
	  return [];
	}
  
	return (data as any[]).map(node => ({
	  node_id: node.id,
	  citation: node.citation,
	  link: node.link,
	  status: node.status,
	  node_type: node.node_type,
	  top_level_title: node.top_level_title,
	  level_classifier: node.level_classifier,
	  number: node.number,
	  node_name: node.node_name,
	  node_text: node.node_text,
	  definitions: node.definitions,
	  core_metadata: node.core_metadata,
	  processing: node.processing,
	  addendum: node.addendum,
	  parent: node.parent,
	  direct_children: node.direct_children,
	  siblings: node.siblings, // You might need to fetch or calculate siblings separately
	  
	} as Node));
  };