"use client"

import { useRef, useState } from "react"
import { useFarcasterUser, useFarcasterCasts, calculateEngagementStats } from "@/hooks/use-farcaster"
import { ShareableCard } from "./shareable-card"
import { LoadingScreen } from "@/components/ui/activity-loader"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import html2canvas from "html2canvas"

interface CardGeneratorProps {
  username: string
}

export function CardGenerator({ username }: CardGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const { user, isLoading: userLoading } = useFarcasterUser(username)
  const { casts, isLoading: castsLoading } = useFarcasterCasts(user?.fid || null, 100)

  const stats = calculateEngagementStats(casts)

  // Convert engagement rate to a percentage (0-100 scale) for tier calculation
  const engagementPercent = Math.min(stats.engagementRate * 5, 100)

  const calculateTier = (engagement: number) => {
    if (engagement >= 60) return "diamond"
    if (engagement >= 30) return "platinum"
    if (engagement >= 10) return "gold"
    if (engagement >= 5) return "silver"
    return "bronze"
  }

  const tier = calculateTier(engagementPercent)

  const handleDownload = async () => {
    if (!cardRef.current) return

    setIsDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      })

      const link = document.createElement("a")
      link.download = `activity-tracker-${tier}-card-${username}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3000)
    } catch (error) {
      console.error("Error downloading card:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = () => {
    const text = `🎯 I'm ${tier.toUpperCase()} tier on @ActivityTracker! 
Engagement Rate: ${stats.engagementRate.toFixed(1)}% 💪
Followers: ${user?.follower_count || 0}
Casts: ${stats.weeklyPosts} this week

Join now and level up your Farcaster game! 🚀`

    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  if (userLoading || castsLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* Card Preview */}
        <div className="flex justify-center">
          <div ref={cardRef} className="shadow-2xl rounded-3xl overflow-hidden">
            <ShareableCard user={user} stats={stats} tier={tier} engagementPercent={engagementPercent} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download Card"}
          </Button>

          <Button
            onClick={handleShare}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Share2 className="w-4 h-4" />
            Share to Farcaster
          </Button>
        </div>

        {downloadSuccess && (
          <div className="text-center text-green-600 font-medium animate-in fade-in">
            ✓ Card downloaded successfully!
          </div>
        )}

        {/* Card Info */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p className="font-semibold text-gray-900">
            {tier.toUpperCase()} TIER • {engagementPercent.toFixed(1)}% Engagement
          </p>
          <p>Share your achievement and inspire others on Farcaster!</p>
        </div>
      </div>
    </div>
  )
}
