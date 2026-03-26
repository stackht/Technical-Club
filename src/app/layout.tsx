import type { Metadata } from "next"
import { Cinzel, Orbitron, Space_Grotesk } from "next/font/google"
import "./globals.css"
import ReduxProvider from "../components/providers/ReduxProvider"
import PreloadModels from "../components/PreloadModels"

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
  title: "Branch Bliss | Technical Club",
  description: "Branch Bliss: Build. Break. Innovate.",
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
      <body className="min-h-full bg-ink text-white">
        <ReduxProvider>
          <PreloadModels />
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
