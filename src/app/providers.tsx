// provider file for next-theme enabled theme switchers
"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProviders({ children }: { children: ReactNode }) {
	return <ThemeProvider>{children}</ThemeProvider>;
}
