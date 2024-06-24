"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';
import { HomeIcon } from '@heroicons/react/24/solid';
import { Separator } from '../ui/separator';
import { HeartIcon } from '@heroicons/react/24/solid';
import { BuildingLibraryIcon } from '@heroicons/react/24/solid';
import { ScissorsIcon } from '@heroicons/react/24/solid';
import { ChartBarIcon } from '@heroicons/react/24/solid';
import { BookOpenIcon} from '@heroicons/react/24/solid';
import { AcademicCapIcon } from '@heroicons/react/24/solid';
import { CogIcon } from '@heroicons/react/24/solid';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { useState } from 'react';


const SideBar: React.FC<{}> = ({}) => {


	const [activeTab, setActiveTab] = useState("home");

	return (
		<nav className="overflow-y-auto">
			<Button className="flex items-center py-2 pl-2 text-sm hover:bg-accent" onClick={() => setActiveTab("home")}>
				<HomeIcon className="h-5 w-5 mr-2" /> To The Top
				{activeTab === "home" && (
					<span className="ml-2 w-2 h-2 bg-accent rounded-full"></span>
				)}
			</Button>
			{/* Other section components */}
			<DetailsSection
				
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			<TextSection
				
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			<TableOfContentsSection
				
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			<PrimarySourceSection
				
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			<GraphSettingsSection
				
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			
		</nav>
	);
};

const DetailsSection: React.FC<{ activeTab: string, setActiveTab: (tab: string) => void; }> = ({ activeTab, setActiveTab }) => {

	return (
		<div>
			<button className="flex pl-2 items-center w-full py-2 text-sm hover:bg-accent focus:outline-none" onClick={() => setActiveTab("details")}>
				<BookOpenIcon className="h-5 w-5 mr-2" />
				<Button>
					Details
				</Button>
				{activeTab === "details" && (
					<span className="ml-2 w-2 h-2 bg-accent rounded-full"></span>
				)}
			</button>
		</div>
	);
};
const TableOfContentsSection: React.FC<{  activeTab: string, setActiveTab: (tab: string) => void; }> = ({ activeTab, setActiveTab }) => {

	return (
		<div>
			<button className="flex pl-2 items-center w-full py-2 text-sm hover:bg-accent focus:outline-none" onClick={() => setActiveTab("tableOfContents")}>
				<Bars3Icon className="h-5 w-5 mr-2" />
				<Button>
					Table of Contents
				</Button>
				{activeTab === "tableOfContents" && (
					<span className="ml-2 w-2 h-2 bg-accent rounded-full"></span>
				)}
			</button>
		</div>
	);
};


const TextSection: React.FC<{  activeTab: string, setActiveTab: (tab: string) => void; }> = ({ activeTab, setActiveTab }) => {

	return (
		<div>
			<button className="flex pl-2 items-center w-full py-2 text-sm hover:bg-accent focus:outline-none" onClick={() => setActiveTab("text")}>
				<BuildingLibraryIcon className="h-5 w-5 mr-2" />
				<Button>
					View Legislation Text
				</Button>
				{activeTab === "text" && (
					<span className="ml-2 w-2 h-2 bg-accent rounded-full"></span>
				)}
			</button>
		</div>
	);
};




const PrimarySourceSection: React.FC<{  activeTab: string, setActiveTab: (tab: string) => void; }> = ({  activeTab, setActiveTab }) => {
	return (
		<div>
			<button className="flex pl-2 items-center w-full py-2 text-sm hover:bg-accent focus:outline-none" onClick={() => setActiveTab("primarySource")}>
				<ScissorsIcon className="h-5 w-5 mr-2" />
				<Button>
					View Primary Source
				</Button>
				{activeTab === "primarySource" && (
					<span className="ml-2 w-2 h-2 bg-accent rounded-full"></span>
				)}
			</button>
		</div>
	);
};





const GraphSettingsSection: React.FC<{ activeTab: string, setActiveTab: (tab: string) => void; }> = ({  activeTab, setActiveTab }) => {

	return (
		<div>
			<button className="flex pl-2 items-center w-full py-2 text-sm hover:bg-accent focus:outline-none" onClick={() => setActiveTab("graphSettings")}>
				<ChartBarIcon className="h-5 w-5 mr-2" />
				<Button>
				3D Graph Settings
				</Button>
				{activeTab === "graphSettings" && (
					<span className="ml-2 w-2 h-2 bg-accent rounded-full"></span>
				)}
			</button>
		</div>
	);
};





export default SideBar;







