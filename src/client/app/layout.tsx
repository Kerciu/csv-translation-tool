import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import ClientToaster from "@/components/client-toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CSV Translation Tool",
  description: "Translate your CSV files with ease",
    generator: 'v0.dev',
    icons: {
      icon: "/favicon.png"
    }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
          <ClientToaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

