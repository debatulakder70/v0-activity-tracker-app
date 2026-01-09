import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const fcFrameEmbed = JSON.stringify({
  version: "next",
  imageUrl: "https://v0-activity-tracker-app-lime.vercel.app/og-image.jpg",
  button: {
    title: "Track Activity",
    action: {
      type: "launch_miniapp",
      name: "Activity Tracker",
      url: "https://v0-activity-tracker-app-lime.vercel.app/",
      splashImageUrl: "https://v0-activity-tracker-app-lime.vercel.app/splash.jpg",
      splashBackgroundColor: "#f0f9ff",
    },
  },
})

export const metadata: Metadata = {
  title: "Activity Tracker | Track Your Farcaster & Base Activity",
  description:
    "Track your Farcaster social activity and Base wallet transactions without needing to log in. Get personalized tips to improve your engagement.",
  generator: "v0.app",
  openGraph: {
    title: "Activity Tracker | Track Your Farcaster Activity",
    description:
      "Track your Farcaster social activity without needing to log in. Get personalized tips to improve your engagement.",
    url: "https://v0-activity-tracker-app-lime.vercel.app/",
    siteName: "Activity Tracker",
    images: [
      {
        url: "https://v0-activity-tracker-app-lime.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Activity Tracker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Activity Tracker | Track Your Farcaster Activity",
    description: "Track your Farcaster social activity without needing to log in.",
    images: ["https://v0-activity-tracker-app-lime.vercel.app/og-image.jpg"],
  },
  other: {
    "base:app_id": "6961559cb8395f034ac22002",
    "fc:frame": fcFrameEmbed,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.jpg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
