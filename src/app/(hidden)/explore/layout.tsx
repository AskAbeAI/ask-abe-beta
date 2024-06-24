import ExploreHUD from "@/components/threejs/exploreHud";


export default async function Layout({ children }: {
	children: React.ReactNode,
	
}) {
	
	return (
		<div className="flex h-screen min-h-screen"> {/* Ensure the container fills the viewport height */}
			<ExploreHUD>
			{children} {/* This is where the scrollable content will be */}

			</ExploreHUD>

				
			
		</div>
	);
}
