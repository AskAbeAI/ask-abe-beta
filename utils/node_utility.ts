
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: "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", // defaults to process.env["OPENAI_API_KEY"]
});
const BASE_URL = "DEFINE HERE";
interface node {
    id: string;
    title: string;
    title_classifier: string;
    name: string;
    depth: number;
    link: string;
    parent_node: string;
    content_node_id_range: string;
    hasDirectChildContentNodes: boolean;
    isRedacted: boolean;
    
}



// General functions
async function getEmbedding(text: string) {
    const embedding = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    });

    return embedding;
}
interface attributes {
    node_id: string;
    value: string;
}

// Database functions
async function get_attributes_from_nested_children(jurisdiction: string, section: string, attributes: string[]): Promise<attributes[][]> {
    const attribute_values = [];
    let all_children = await get_depth_first_nodes(section, `${jurisdiction}_node_relationships`);
    let all_children_str:string[] = [];
    if(!all_children || all_children.length===0) {return []}
    for (const child of all_children) {
        all_children_str.push(child["child_node_id"]);
    }
    //console.log(all_children_str)
    for (const attribute of attributes) {
        let results:attributes[] = await fetch_all_id_values_for_attribute(`${jurisdiction}_node_eav`, all_children_str, attribute);
        //console.log(results)
        if(results.length === 0) {
            console.log(`No attribute values found for section: ${section}, attribute: ${attribute}`);
        } else {
            attribute_values.push(results);
        }
        
    }
    return attribute_values;
    
}

async function get_depth_first_nodes(parent_node_id: string, table: string) {
    const supabase = createClient('https://jwscgsmkadanioyopaef.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3c2Nnc21rYWRhbmlveW9wYWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzE1MTgsImV4cCI6MjAxMTI0NzUxOH0.1QwW9IV1TrMT72xyq2LQcmDr92tmLOEQg07mOPRLDO0');
    const { data, error } = await supabase.rpc('get_depth_first_nodes', {
        p_table_name: table,  // replace with your table name
        p_parent_node_id: parent_node_id
    });
    
    if (error) {
        console.error("Error fetching data:", error);
        return null;
    }
    return data;
}

async function fetch_all_id_values_for_attribute(tableName: string, ids: string[], attribute: string): Promise<attributes[]> {
   
    const supabase = createClient('https://jwscgsmkadanioyopaef.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3c2Nnc21rYWRhbmlveW9wYWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzE1MTgsImV4cCI6MjAxMTI0NzUxOH0.1QwW9IV1TrMT72xyq2LQcmDr92tmLOEQg07mOPRLDO0');
    const { data, error } = await supabase.rpc('get_values_by_ids_and_attribute', {
        p_table_name: tableName,
        p_ids: ids,
        p_attribute: attribute
    });
    
    if (error) {
        console.log("Error fetching data:", error);
        return [];
    }

    return data as attributes[];
}

async function get_all_direct_children(tableName: string, parent_id: string) {
    const supabase = createClient('https://jwscgsmkadanioyopaef.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3c2Nnc21rYWRhbmlveW9wYWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzE1MTgsImV4cCI6MjAxMTI0NzUxOH0.1QwW9IV1TrMT72xyq2LQcmDr92tmLOEQg07mOPRLDO0');
    const { data, error } = await supabase.rpc('get_direct_child_nodes', {
        _table_name: tableName,
        _parent_node_id: parent_id
    });

    if (error) {
        console.log(`Error fetching direct child nodes for parent_id: ${parent_id}. Error: `, error);
        return null;
    }
    return data;
}
async function get_parent_node(tableName: string, node_id: string) {

}

async function get_all_sibling_nodes(tableName: string, node_id: string): Promise<string[]> {
    return [];
}




async function asyncQueryDatabase(dropPoint: string, jurisdiction:string): Promise<string[]> {
    const supabase = createClient('https://jwscgsmkadanioyopaef.supabase.co', 'YOUR_SECRET_KEY');
    
    // Simultaneously execute both database queries
    let [attributesFromNestedChildren, allSiblingNodes] = await Promise.all([
        get_attributes_from_nested_children(dropPoint, jurisdiction,["internal_references"]),
        get_all_sibling_nodes(dropPoint, jurisdiction)
    ]);
    let internal_references: attributes[] = attributesFromNestedChildren[0];

    let nodeIDsFromAttributes: string[] = []; // Define here

    if (!attributesFromNestedChildren[0]) {
        attributesFromNestedChildren = [];
    } else {
        nodeIDsFromAttributes = internal_references.flatMap(attribute => {
            // Parse the 'values' string to get the actual array of strings
            const parsedValues = JSON.parse(attribute.value);
            return parsedValues;
        });
    }

    // Combine the results into a single list of node IDs
    const combinedNodeIDs = [...nodeIDsFromAttributes, ...allSiblingNodes];

    return combinedNodeIDs;
}





// Assuming your collect_text_and_tokens function looks something like this:


// Call the function
//updateCaNodeTextEmbeddings();

// CREATE UNIQUE INDEX idx_unique_node_attribute ON ca_node_eav (node_id, attribute);
// ALTER TABLE ca_node_eav ADD PRIMARY KEY USING INDEX idx_unique_node_attribute;
