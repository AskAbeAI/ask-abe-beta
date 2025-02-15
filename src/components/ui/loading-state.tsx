import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
	message?: string;
	className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
	message = "Loading...",
	className
}) => {
	return (
		<div className={cn(
			"flex items-center gap-2 text-muted-foreground",
			"p-4 rounded-lg bg-muted/50",
			className
		)}>
			<Loader2 className="w-4 h-4 animate-spin" />
			<span>{message}</span>
		</div>
	);
}; 