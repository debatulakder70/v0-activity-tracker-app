"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [username, setUsername] = useState<string | null>(null)

  if (username) {
    return <Dashboard username={username} onLogout={() => setUsername(null)} />
  }

  return <HeroSection onSubmit={setUsername} />
}
