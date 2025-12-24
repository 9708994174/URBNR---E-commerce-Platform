import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { LocationPrompt } from "@/components/location-prompt"
import { LogoIntro } from "@/components/logo-intro"

const _geist = Geist({ subsets: ["latin"], display: "swap" })
const _geistMono = Geist_Mono({ subsets: ["latin"], display: "swap" })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "URBNR | Premium Menswear & Custom Designs",
  description:
    "URBNR brings premium menswear, sharp essentials, and made-to-order designs. Shop shirts, denim, polos, and customize your fit with fast checkout in India.",
  generator: "URBNR",
  icons: {
    icon: "/icon1.svg",
    apple: "/placeholder-logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <LogoIntro />
        <LocationPrompt />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
