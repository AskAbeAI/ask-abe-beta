// Define props interface if node has specific types
import { Node } from "@/lib/threejs/types";
interface SimpleLabelProps {
	node: Node | null;
  }
  
  const SimpleLabel: React.FC<SimpleLabelProps> = ({ node }) => {
	if (!node) {
		return;
	}
	return (
	  <div className="bg-white border border-gray-300 p-2 rounded-lg shadow-md text-black">
		<strong>Name:</strong> {node.node_name}<br />
		<strong>Citation:</strong> {node.citation}<br />
	  </div>
	);
  }
  
  export default SimpleLabel;