import React, { useState, useEffect } from "react";
import { TreeNode } from "@/lib/types";
import treeData from "/Users/madelinekaufman/VS_Code_Projects/AskAbe-1207/ask-abe-beta/public/data/treeData.json";

interface DynamicDropdownProps {
  key: number; 
  data: TreeNode[];
  level: number;
  onChange: (selectedTreeNode: TreeNode | null, level: number) => void;
}

const DynamicDropdown: React.FC<DynamicDropdownProps> = ({ data, level, onChange }) => {
  const [selectedPath, setSelectedPath] = useState<TreeNode[]>([]);
  const [options, setOptions] = useState<TreeNode[]>([]);
  const backtrackTo = (level: number) => {
    setSelectedPath(currentPath => currentPath.slice(0, level + 1));
  };
  

  useEffect(() => {
    const lastSelectedNode = selectedPath[selectedPath.length - 1];
    setOptions(lastSelectedNode?.children || treeData);
  }, [selectedPath]);
  

  const handleSelect = (selectedNodeId: string) => {
    const selectedNode = options.find(node => node.id === selectedNodeId);
    if (selectedNode) {
      setSelectedPath(currentPath => [...currentPath, selectedNode]);
    } else {
      console.error("Selected node not found in options", selectedNodeId);
    }
  };

  return (
    <select onChange={(e) => handleSelect(e.target.value)} value="">
  <option value="">Select an option...</option>
  {options.map(node => (
    <option key={node.id} value={node.id}>
      {node.name || "unnamed"} 
    </option>
  ))}
</select>
  );
};

export default DynamicDropdown;