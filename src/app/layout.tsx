import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	display: "swap",
	variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
	title: "Tab Notifications Demo",
	description:
		"A powerful React hook that changes the tab title and favicon when the user switches to another tab",
	keywords: [
		"React",
		"Hook",
		"Tab Notifications",
		"Browser",
		"Favicon",
		"Title",
		"Visibility",
	],
	authors: [{ name: "Ritesh P" }],
	creator: "Ritesh P",
	publisher: "Ritesh P",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${spaceGrotesk.variable} font-sans antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
