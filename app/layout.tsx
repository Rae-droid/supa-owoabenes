import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Owoabenes POS - Mothercare & Boutique",
  description: "Modern Point of Sale System for Owoabenes Mothercare & Boutique",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/back.jpeg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/back.jpeg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/back.jpeg",
        type: "image/svg+xml",
      },
    ],
    apple: "/back.jpeg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  )
}
