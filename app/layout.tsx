import type { Metadata } from "next"
import { Inter } from "next/font/google"
import NextTopLoader from "nextjs-toploader"
// Components
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import AuthProvider from "@/providers/AuthProvider"
// CSS
import "./globals.css"
import ReduxProvider from "./store/ReduxProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Present Academy",
  description: "A management system for Present Academy",
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang='en' suppressHydrationWarning>
        <head />
        <body className={inter.className}>
          <NextTopLoader color='#FF0000' showSpinner={false} />
          <AuthProvider>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
              <ReduxProvider>{children}</ReduxProvider>
              <Toaster richColors closeButton />
            </ThemeProvider>
          </AuthProvider>
        </body>
      </html>
    </>
  )
}
