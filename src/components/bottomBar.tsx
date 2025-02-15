// BottomBar.tsx

import { cn } from "@/lib/utils/cn";
import { AlertTriangle, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface BottomBarProps {
	inputMode: string;
	handleSubmit: (question: string) => void;
	handleSubmitFollowup: (question: string) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
	inputMode,
	handleSubmit,
	handleSubmitFollowup,
}) => {
	const [question, setQuestion] = useState("");
	const [inputLength, setInputLength] = useState(0);
	const maxLimit = 300;
	const [showWarning, setShowWarning] = useState(true);
	const [inputMessage, setInputMessage] = useState("Ask a legal question");

	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(inputMode === "followup");
		if (inputMode === "followup") {
			handleSubmitFollowup(question);
		} else {
			handleSubmit(question);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		const length = value.length;
		if (length <= maxLimit) {
			setQuestion(value);
			setInputLength(length);

			// Logic to resize the textarea
			const textarea = e.target;
			textarea.style.height = "auto"; // Reset the height
			textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleFormSubmit(
				event as unknown as React.FormEvent<HTMLFormElement>,
			);
		}
	};

	useEffect(() => {
		if (inputMode === "followup") {
			setInputMessage("Ask a follow-up question");
		} else if (inputMode === "vitalia") {
			setInputMessage("Ask a question");
		}
	}, [inputMode]);

	return (
		<div className="w-full">
			<div className="container mx-auto p-4 max-w-4xl">
				<form
					className="relative flex items-center gap-2"
					onSubmit={handleFormSubmit}
				>
					{/* Improved textarea with consistent spacing */}
					<div className="relative flex-1">
						<textarea
							value={question}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							placeholder={inputMessage}
							maxLength={maxLimit}
							className={cn(
								"w-full min-h-[44px] max-h-[200px] resize-none",
								"px-4 py-3 pr-[100px]",
								"rounded-md border border-input",
								"bg-background text-foreground",
								"focus:outline-none focus:ring-2 focus:ring-primary",
								"placeholder:text-muted-foreground",
								"transition-all duration-200"
							)}
							rows={1}
							style={{ overflowY: "hidden" }}
						/>

						{/* Character count indicator */}
						<div className="absolute right-24 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
							{inputLength}/{maxLimit}
						</div>
					</div>

					{/* Improved submit button */}
					<button
						type="submit"
						className={cn(
							"absolute right-2 top-1/2 -translate-y-1/2",
							"px-4 py-2 h-[34px]",
							"bg-primary text-primary-foreground",
							"rounded-md font-medium",
							"hover:bg-primary/90",
							"focus:outline-none focus:ring-2 focus:ring-primary",
							"transition-colors duration-200",
							"disabled:opacity-50 disabled:cursor-not-allowed"
						)}
						disabled={inputLength === 0}
					>
						Ask
					</button>
				</form>

				{/* Improved character limit warning */}
				{inputLength > maxLimit * 0.9 && showWarning && (
					<div className="absolute bottom-full left-0 mb-2 p-2 bg-warning text-warning-foreground rounded-md text-sm">
						<div className="flex items-center gap-2">
							<AlertTriangle className="w-4 h-4" />
							<span>Approaching character limit</span>
							<button
								onClick={() => setShowWarning(false)}
								className="ml-2 hover:text-warning-foreground/80"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default BottomBar;
