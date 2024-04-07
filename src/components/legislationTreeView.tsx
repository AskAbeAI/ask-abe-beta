import React, { useState } from 'react';
import { SimpleTreeView, TreeItem, useTreeViewApiRef } from '@mui/x-tree-view';
import { SxProps } from '@mui/system';

interface LegislationNode {
  id: string;
  name: string;
  children?: LegislationNode[];
}

interface LegislationTreeViewProps {
  legislationData: LegislationNode;
  sx?: SxProps; // Optional sx prop for styling
}

const LegislationTreeView: React.FC<LegislationTreeViewProps> = ({ legislationData, sx }) => {
  const apiRef = useTreeViewApiRef();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleItemSelectionToggle = (event: React.SyntheticEvent, itemId: string, isSelected: boolean) => {
    const newSelectedItems = isSelected
      ? [...selectedItems, itemId]
      : selectedItems.filter(id => id !== itemId);

    setSelectedItems(newSelectedItems);
    // Optionally use apiRef to manipulate the Tree View, e.g., to set item expansion
  };

  const renderTree = (node: LegislationNode) => (
    <TreeItem
      key={node.id}
      itemId={node.id}
      label={node.name}
    >
      {Array.isArray(node.children) ? node.children.map((childNode) => renderTree(childNode)) : null}
    </TreeItem>
  );

  return (
    <SimpleTreeView
      apiRef={apiRef}
      onItemSelectionToggle={handleItemSelectionToggle}
      selectedItems={selectedItems}
      multiSelect
      sx={sx}
    >
      {renderTree(legislationData)}
    </SimpleTreeView>
  );
};

export default LegislationTreeView;
