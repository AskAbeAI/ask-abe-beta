import React from 'react';
import { Node } from '@/lib/threejs/types';

// Props type definition, if using TypeScript
interface NodeCountProps {
    nodes: Node[];
}

const NodeCountComponent: React.FC<NodeCountProps> = ({ nodes }) => {
    return (
        <div className=" z-50 max-w-md p-4 bg-gray-100">
            <h3>Number of Nodes: {nodes.length}</h3>
        </div>
    );
};

export default NodeCountComponent;