import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Pathway_Gothic_One } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/next"

const pathwayGothic = Pathway_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pathway",
})

export const metadata: Metadata = {
  title: "Nandy's Villa Royal - More Than Homes, A Lifestyle",
  description:
    "Modern living in a gated, secure, and coastal-inspired community. Flexible payment plans and custom home building services.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${pathwayGothic.variable} antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
          {children}
          <Footer />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
