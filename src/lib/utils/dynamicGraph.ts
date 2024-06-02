// /lib/api.ts
import { createClient } from '@supabase/supabase-js';
import { NodeProps } from './forceSimulation'; // Adjust the import as per your file structure


t

export const fetchChildNodes = async (parentId: string): Promise<NodeProps[]> => {
	const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
	const { data, error } = await supabase
		.from('us_federal_ecfr')
		.select('*')
		.eq('parent', parentId); // Fetch child nodes for the given parent

	if (error) {
		console.error(`Error fetching child nodes for parent ${parentId}:`, error);
		return [];
	}

	return data.map(node => ({
		...node,
		position: [0, 0, 0], // Initial position (can be adjusted later)
	}));
};
