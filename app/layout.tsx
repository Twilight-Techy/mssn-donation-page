import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// Metadata needs to be exported from a server component, but we're making this client-side for preview
const metadata = {
  title: "MSSN LASU Epe Chapter - Donation Page",
  description:
    "Support Islamic Education & Community through the Muslim Students' Society of Nigeria, LASU Epe Chapter",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
