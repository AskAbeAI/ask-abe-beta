export const themeConfig = {
	colors: {
		primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		},
		secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		},
		background: "hsl(var(--background))",
		foreground: "hsl(var(--foreground))",
		muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		},
		card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		},
		border: "hsl(var(--border))",
	},
	spacing: {
		xs: "0.25rem",
		sm: "0.5rem",
		md: "1rem",
		lg: "1.5rem",
		xl: "2rem",
	},
	borderRadius: {
		sm: "0.25rem",
		md: "0.5rem",
		lg: "0.75rem",
	},
	typography: {
		fontFamily: {
			sans: ['var(--font-sans)', 'system-ui'],
			mono: ['var(--font-mono)', 'monospace'],
		},
		fontSize: {
			xs: "0.75rem",
			sm: "0.875rem",
			base: "1rem",
			lg: "1.125rem",
			xl: "1.25rem",
		},
	},
}; 