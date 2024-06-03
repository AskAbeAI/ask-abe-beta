// components/threejs/NodeHUD.tsx
import React from 'react';
import { NodeProps } from '@/lib/threejs/types';  // Ensure you import your correct type definitions

interface NodeHUDProps {
  node: NodeProps | null;
}

const NodeHUD: React.FC<NodeHUDProps> = ({ node }) => {
  if (!node) return null; // Don't render if no node is selected

  return (
    <div style={{
      position: 'absolute',
      top: '10%',
      right: '10%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: '20px',
      borderRadius: '8px',
      zIndex: 1000,  // Ensure it is above all canvas elements
      maxWidth: '300px',
      overflow: 'hidden'
    }}>
      <h3>Node Details</h3>
      <p><strong>ID:</strong> {node.node_id}</p>
      <p><strong>Citation:</strong> {node.citation}</p>
      <p><strong>Link:</strong> <a href={node.link} target="_blank" rel="noopener noreferrer">View</a></p>
      <p><strong>Status:</strong> {node.status || 'Normal'}</p>
      <p><strong>Type:</strong> {node.node_type}</p>
      <p><strong>Top Level Title:</strong> {node.top_level_title}</p>
      <p><strong>Level Classifier:</strong> {node.level_classifier}</p>
      <p><strong>Number:</strong> {node.number}</p>
      <p><strong>Name:</strong> {node.node_name}</p>
      <p><strong>Text:</strong> Placeholder</p>
      <p><strong>Parent:</strong> {node.parent}</p>
    </div>
  );
};

export default NodeHUD;
