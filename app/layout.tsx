import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
// Components
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/context/AuthProvider";
// CSS
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Present Academy",
	description: "A management system for Present Academy",
};

type RootLayoutProps = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<>
			<html lang="en" suppressHydrationWarning>
				<head />
				<body className={inter.className}>
					 <NextTopLoader color='#2563eb' shadow={false}  />
					<AuthProvider>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
							{children}
						</ThemeProvider>
					</AuthProvider>
				</body>
			</html>
		</>
	);
}
