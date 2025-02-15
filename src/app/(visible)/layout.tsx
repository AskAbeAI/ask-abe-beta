import NavBar from "@/components/navBar";
import { cn } from "@/lib/utils/cn";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Ask Abe",
	description:
		"AI Powered Legal Education and Research. Ask Abe is a legal research and education tool that uses AI to help you better understand the complexities of the law.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		// <ClerkProvider>

		<html lang="en" className="h-full">
			<body className={cn(inter.className, "h-full flex flex-col")}>
				<NavBar />
				<main className="flex-1 overflow-hidden">
					{children}
				</main>
				{/* <PageFooter /> */}
				<Analytics />
			</body>
		</html>
		// </ClerkProvider>
	);
}
