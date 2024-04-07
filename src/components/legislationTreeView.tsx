import React, { useState } from 'react';
import { SimpleTreeView, TreeItem, useTreeViewApiRef } from '@mui/x-tree-view';
import { SxProps } from '@mui/system';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { treeItemClasses } from '@mui/x-tree-view/TreeItem';

interface LegislationNode {
    id: string;
    name: string | null;
    children?: LegislationNode[];
}

interface LegislationTreeViewProps {
    legislationData: LegislationNode;
    sx?: SxProps; // Optional sx prop for styling
}
const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      '& .close': {
        opacity: 0.3,
      },
    }
  }));

function CloseSquare(props: SvgIconProps) {
    return (
        <SvgIcon
            className="close"
            fontSize="inherit"
            style={{ width: 14, height: 14 }}
            {...props}
        >
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    maxWidth: '90%', // Adjust based on your content's needs
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2, // Adds rounded corners
    border: '1px solid rgba(0, 0, 0, 0.12)', // Subtle border
    overflow: 'hidden', // Ensures the outline and shadow encompass the entire modal content
};
const contentBoxStyle = {
    overflow: 'auto',
    maxHeight: 300,
    border: '1px solid rgba(0, 0, 0, 0.12)', // Consistent with modal border
    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)', // Soft shadow for depth
    borderRadius: 2, // Rounded corners for the inner content box
    p: 2, // Padding inside the content box
};

// Improved button styling
const openButtonStyle = {
    mb: 2, // Margin bottom for spacing from the button to the modal content
    bgcolor: 'primary.main', // Background color from the theme
    color: 'white', // Text color
    '&:hover': {
        bgcolor: 'primary.dark', // Darken button on hover
    },
    padding: '6px 16px', // Padding for a larger clickable area
    borderRadius: '4px', // Rounded corners for the button
};

const LegislationTreeView: React.FC<LegislationTreeViewProps> = ({ legislationData, sx }) => {
    const apiRef = useTreeViewApiRef();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    const handleItemSelectionToggle = (event: React.SyntheticEvent, itemId: string, isSelected: boolean) => {
      const newSelectedItems = isSelected
          ? [...selectedItems, itemId]
          : selectedItems.filter(id => id !== itemId);
  
      setSelectedItems(newSelectedItems);
    };
  
    const handleItemExpansionToggle = (event: React.SyntheticEvent, itemId: string, isExpanded: boolean) => {
      // This function should now control the expansion/collapse of items.
      // You can use apiRef to programmatically expand or collapse items if needed.
      // Note: Depending on how your apiRef is set up, you might directly call expand/collapse methods here.
    };
  
    const renderTree = (node: LegislationNode) => (
      <CustomTreeItem
        key={node.id}
        itemId={node.id}
        label={node.name || 'Definition Hub'}
        // Pass the selected prop based on selection state
      >
        {Array.isArray(node.children)
          ? node.children
              .sort((a, b) => a.id.localeCompare(b.id))
              .map((childNode) => renderTree(childNode))
          : null}
      </CustomTreeItem>
    );

    return (
        <>
            <Button sx={openButtonStyle} onClick={handleOpen}>
                Select Legislation
            </Button> {/* Styled Trigger button */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Select Legislation
                    </Typography>
                    {/* Apply contentBoxStyle to this Box */}
                    <Box sx={contentBoxStyle}> {/* Replacing the div with a Box and applying contentBoxStyle */}
                        <SimpleTreeView
                            apiRef={apiRef}
                            onItemSelectionToggle={handleItemSelectionToggle}
                            onItemExpansionToggle={handleItemExpansionToggle}
                            selectedItems={selectedItems}
                            multiSelect
                            slots={{
                                expandIcon: AddBoxIcon,
                                collapseIcon: IndeterminateCheckBoxIcon,
                                endIcon: CloseSquare,
                            }}
                            sx={{ flexGrow: 1, maxWidth: '100%' }} // Ensure the tree view is properly styled within the content box
                            
                        >
                            {renderTree(legislationData)}
                        </SimpleTreeView>
                    </Box>
                </Box>
            </Modal>
        </>
    );    
};

export default LegislationTreeView;

