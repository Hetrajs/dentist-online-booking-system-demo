import type React from "react"
import type { Metadata } from "next"
import { Poppins, Inter, Noto_Sans_Devanagari } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button" // Import WhatsAppButton

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
})

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-devanagari",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Dr. Priya Sharma's Dental Wellness Studio",
  description: "Transform Your Smile. India's Premier Dental Wellness Studio in Connaught Place, New Delhi.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} ${notoSansDevanagari.variable} antialiased`}>
      <body suppressHydrationWarning={true}>
        <Header />
        {children}
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  )
}
