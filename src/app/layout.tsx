import type { Metadata } from "next"
import { Cinzel, Orbitron, Space_Grotesk } from "next/font/google"
import "./globals.css"
import ReduxProvider from "../components/providers/ReduxProvider"
import PreloadModels from "../components/PreloadModels"
import ConsoleSilencer from "../components/ConsoleSilencer"
import PerformanceBoot from "../components/PerformanceBoot"

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Code Medium | Technical Club",
  description: "Code Medium: Build. Break. Innovate.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${space.variable} ${cinzel.variable} h-full antialiased`}
    >
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="min-h-full bg-ink text-white">
        <ReduxProvider>
          <ConsoleSilencer />
          <PerformanceBoot />
          <PreloadModels />
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
