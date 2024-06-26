"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { HomeIcon } from "@heroicons/react/24/solid";
import { Separator } from "../ui/separator";
import { HeartIcon } from "@heroicons/react/24/solid";
import { BuildingLibraryIcon } from "@heroicons/react/24/solid";
import { ScissorsIcon } from "@heroicons/react/24/solid";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { CogIcon } from "@heroicons/react/24/solid";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useState } from "react";
import ClassifierHUD from "./hud-components/classifierHud";
import NodeHUD from "./hud-components/nodeHud";
import { Node } from "@/lib/threejs/types";
import NodeTextHUD from "./hud-components/textHud";

interface GraphSideBarProps {
	selectedClassifier: string[];
	setSelectedClassifier: React.Dispatch<React.SetStateAction<string[]>>;
	selectedNode: Node | null;
}

const GraphSideBar: React.FC<GraphSideBarProps> = ({ selectedClassifier, setSelectedClassifier, selectedNode }) => {
	// State to track the active component
	const [activeComponent, setActiveComponent] = useState<string | null>(null);
	const [buttonOffset, setButtonOffset] = useState<number>(0);

	// Button configuration for ease of mapping
	const buttons = [
		{ name: 'Legend', component: 'LegendComponent' },
		{ name: 'Details', component: 'DetailsComponent' },
		{ name: 'View Text', component: 'TextViewComponent' },
		{ name: 'Table of Contents', component: 'TOCComponent' },
		{ name: 'Graph Settings', component: 'SettingsComponent' },
		{ name: 'Embedding Space', component: 'EmbeddingSpaceComponent' },
		{ name: 'AI Chat', component: 'AIChatComponent' }
	];
	const handleButtonClick = (component: string, index: number) => {
		if (component === activeComponent) {
			setActiveComponent('');
			return;
		}
		setActiveComponent(component);
		const buttonHeight = 40; // Adjust this based on your button height including padding and margin
		const topOffset = 64; // This is the top offset of the sidebar, adjust if different
		const calculatedOffset = topOffset + index * buttonHeight;
		setButtonOffset(calculatedOffset);
	};

	return (
		<div className="w-full h-full bg-background shadow-lg pointer-events-auto">
			<nav className="flex flex-col space-y-4">
				{buttons.map((button, index) => (
					<Button
						key={index}
						className="flex items-center space-x-2 p-2 rounded hover:bg-accent"
						onClick={() => handleButtonClick(button.component, index)}
					>
						{/* Placeholder for icons, replace or enhance as necessary */}


						{button.name}

					</Button>
				))}
			</nav>

			{activeComponent == 'LegendComponent' && (
				<div
					style={{
						position: 'absolute',
						top: `${buttonOffset}px`,
						left: '16rem', // Sidebar width + a small gap, adjust as needed
						width: '24rem', // Placeholder component width
						height: '10rem', // Placeholder component height
						backgroundColor: 'white',
						boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
					}}
				>
					<ClassifierHUD
						selectedClassifier={selectedClassifier}
						setSelectedClassifier={setSelectedClassifier}
					/>
				</div>
			)}

			{activeComponent == 'DetailsComponent' && (
				<div
					style={{
						position: 'absolute',
						top: `${buttonOffset}px`,
						left: '16rem', // Sidebar width + a small gap, adjust as needed
						width: '24rem', // Placeholder component width
						height: '10rem', // Placeholder component height
						backgroundColor: 'white',
						boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
					}}
				>
					<NodeHUD node={selectedNode} />
						
					
					
				</div>
			)}
			{activeComponent == 'TextViewComponent' && (
				<div
					style={{
						position: 'absolute',
						top: `${buttonOffset}px`,
						left: '16rem', // Sidebar width + a small gap, adjust as needed
						width: '24rem', // Placeholder component width
						height: '10rem', // Placeholder component height
						backgroundColor: 'white',
						boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
					}}
				>
					<NodeTextHUD node={selectedNode}/>
						
					
					
				</div>
			)}

{activeComponent == 'TOCComponent' && (
				<div
					style={{
						position: 'absolute',
						top: `${buttonOffset}px`,
						left: '16rem', // Sidebar width + a small gap, adjust as needed
						width: '24rem', // Placeholder component width
						height: '10rem', // Placeholder component height
						backgroundColor: 'white',
						boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
					}}
				>
					<p className="rounded-lg">WIP!</p>
						
					
					
				</div>
			)}
			{activeComponent == 'SettingsComponent' && (
				<div
					style={{
						position: 'absolute',
						top: `${buttonOffset}px`,
						left: '16rem', // Sidebar width + a small gap, adjust as needed
						width: '24rem', // Placeholder component width
						height: '10rem', // Placeholder component height
						backgroundColor: 'white',
						boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
					}}
				>
					<p className="rounded-lg">WIP!</p>
						
					
					
				</div>
			)}
			{activeComponent == 'EmbeddingSpaceComponent' && (
				<div
					style={{
						position: 'absolute',
						top: `${buttonOffset}px`,
						left: '16rem', // Sidebar width + a small gap, adjust as needed
						width: '24rem', // Placeholder component width
						height: '10rem', // Placeholder component height
						backgroundColor: 'white',
						boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
					}}
				>
					<p className="rounded-lg">WIP!</p>
						
					
					
				</div>
			)}
			{activeComponent == 'AIChatComponent' && (
				<div
					style={{
						position: 'absolute',
						top: `${buttonOffset}px`,
						left: '16rem', // Sidebar width + a small gap, adjust as needed
						width: '24rem', // Placeholder component width
						height: '10rem', // Placeholder component height
						backgroundColor: 'white',
						boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
					}}
				>
					<p className="rounded-lg">WIP!</p>
						
					
					
				</div>
			)}
		</div>
	);
};






export default GraphSideBar;
