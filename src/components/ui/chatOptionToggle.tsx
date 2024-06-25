import React from "react";

interface ChatOptionToggleProps {
	optionLabel: string;
	isToggled: boolean;
	onToggle: (isToggled: boolean) => void;
}
const ChatOptionToggle: React.FC<ChatOptionToggleProps> = ({
	optionLabel,
	isToggled,
	onToggle,
}) => {
	// You can customize the styles as needed

	return (
		<div className="flex-none p-4 w-30">
			<div className="relative flex flex-col min-h-screen overflow-hidden">
				<div className="flex">
					<label className="inline-flex relative items-center mr-5 cursor-pointer">
						<input
							type="checkbox"
							className="sr-only peer"
							checked={isToggled}
							readOnly
						/>
						<div
							onClick={() => {
								onToggle(!isToggled);
							}}
							className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
						></div>
						<span className="ml-2 text-sm font-medium text-gray-900">
							ON
						</span>
					</label>
				</div>
			</div>
		</div>
	);
};

export default ChatOptionToggle;
