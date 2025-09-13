import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Outfit, PT_Serif } from "next/font/google"
import "./globals.css"

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit'
})

const ptSerif = PT_Serif({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-serif'
})

export const metadata: Metadata = {
  title: "Deshmukh Properties",
  description:
    "Trusted land agents and property consultants in Chhattisgarh. We buy, sell, and consult on residential, commercial, agricultural, and industrial properties.",
  icons: {
    icon: '/fav.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${ptSerif.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
  --font-outfit: ${outfit.variable};
  --font-pt-serif: ${ptSerif.variable};
}
        `}</style>
      </head>
      <body className="overflow-x-hidden">{children}</body>
    </html>
  )
}
