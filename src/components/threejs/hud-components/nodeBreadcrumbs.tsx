import React from 'react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { parseNodeIdToBreadcrumbs } from '@/lib/utils/dynamicGraph';

interface NodeBreadcrumbsProps {
	nodeId: string;
	onBreadcrumbClick: (id: string) => void;  // Function to handle clicks
}

const NodeBreadcrumbs: React.FC<NodeBreadcrumbsProps> = ({ nodeId, onBreadcrumbClick }) => {
	const breadcrumbData = parseNodeIdToBreadcrumbs(nodeId);

	// Function to generate the breadcrumb path for each item
	const generateBreadcrumbId = (index: number): string => {
		// Combine all levels up to the selected index and prepend the root path
		const path = breadcrumbData.slice(0, index + 1)
			.map(item => `${item.level}=${item.number}`)
			.join('/');
		return `us/federal/ecfr/${path}`;
	};

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Button
							variant="link"
							className="bg-card text-foreground"
							onClick={() => onBreadcrumbClick("us/federal/ecfr")}
						>
							CFR
						</Button>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				{breadcrumbData.map((item, index) => (
					<React.Fragment key={index}>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Button
									variant="link"
									className="bg-card text-foreground"
									onClick={() => onBreadcrumbClick(generateBreadcrumbId(index))}
								>
									{item.level} {item.number}
								</Button>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{index < breadcrumbData.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default NodeBreadcrumbs;
