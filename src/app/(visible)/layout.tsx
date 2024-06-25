import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import NavBar from "@/components/navBar";

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

		<html lang="en">
			<body className={inter.className}>
				<NavBar />

				{children}
				{/* <PageFooter /> */}
			</body>
			<Analytics />
		</html>
		// </ClerkProvider>
	);
}
