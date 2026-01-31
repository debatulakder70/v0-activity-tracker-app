"use client"

import { EngagementScoreCard } from "@/components/share-card/engagement-score-card"
import { TopSupporters } from "@/components/share-card/top-supporters"
import { useFarcasterUser, useFarcasterCasts, calculateEngagementStats } from "@/hooks/use-farcaster"
import { useState, useRef } from "react"
import { Download, Share2 } from "lucide-react"
import html2canvas from "html2canvas"

interface ShareCardSectionProps {
  username: string
}

export function ShareCardSection({ username }: ShareCardSectionProps) {
  const { user, isLoading: userLoading } = useFarcasterUser(username)
  const { casts, isLoading: castsLoading } = useFarcasterCasts(user?.fid ?? null)
  const engagementStats = calculateEngagementStats(casts)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // Get top engagement supporters (top 3)
  const topSupporters = casts
    .map((cast) => ({
      username: cast.author.username,
      profileImage: cast.author.pfp_url,
      engagement:
        cast.reactions.likes_count + cast.reactions.recasts_count + cast.replies.count,
      fid: cast.author.fid,
    }))
    .filter((v, i, a) => a.findIndex((t) => t.fid === v.fid) === i)
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 3)

  const engagementScore = Math.min(Math.round(engagementStats.engagementRate * 10), 100)

  const handleDownload = async () => {
    if (!cardRef.current) return
    setIsDownloading(true)

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
      })

      const link = document.createElement("a")
      link.href = canvas.toDataURL("image/png")
      link.download = `${username}-engagement-score.png`
      link.click()
    } catch (error) {
      console.error("Failed to download card:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)

    try {
      const supportersMention =
        topSupporters.length > 0
          ? `\nShoutout to my most based supporters:\n${topSupporters.map((s) => `@${s.username}`).join(" ")}`
          : ""

      const shareText = `My Farcaster average engagement score is ${engagementScore}/100 🚀${supportersMention}\n\nBuilt on Base 💙`

      // Check if running in Base App using SDK
      if (typeof window !== "undefined" && (window as any).farcasterFrame) {
        // Use Farcaster Frame POST action
        const frameMessage = {
          type: "notificationToast",
          notificationToast: {
            title: "Sharing to Base...",
            message: shareText,
          },
        }

        // Attempt to open Base App composer
        if ((window as any).baseAppComposer) {
          ;(window as any).baseAppComposer.openCastComposer({
            text: shareText,
            embeds: [
              {
                type: "image",
                url: "https://activity-tracker.online/icon.png",
              },
            ],
          })
          return
        }
      }

      // Fallback to Warpcast
      const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds=["https://activity-tracker.online"]`
      window.open(warpcastUrl, "_blank")
    } catch (error) {
      console.error("Failed to share:", error)
    } finally {
      setIsSharing(false)
    }
  }

  const isLoading = userLoading || castsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading your engagement score...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <p className="text-slate-600 mb-2">User not found</p>
          <p className="text-sm text-slate-500">Please check the username and try again</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Card Preview Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 text-balance">
            Your Engagement Score Card
          </h1>
          <p className="text-lg text-slate-600">
            Based on your Farcaster activity from the last 30 days
          </p>
        </div>

        {/* Frosted Glass Card */}
        <div
          ref={cardRef}
          className="relative mx-auto max-w-sm overflow-hidden rounded-3xl p-8"
          style={{
            background: "linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(224, 242, 254, 0.85) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(191, 219, 254, 0.5)",
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.15)",
          }}
        >
          {/* Top Section - Profile */}
          <div className="space-y-6">
            {/* Purple Glow Background */}
            <div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 blur-3xl pointer-events-none"
              style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}
            />

            {/* Profile */}
            <div className="relative z-10 space-y-4">
              <div className="flex justify-center">
                <div
                  className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-violet-400/50"
                  style={{
                    boxShadow: "0 0 30px rgba(124, 58, 237, 0.4)",
                  }}
                >
                  <img
                    src={user.pfp_url || "/placeholder.svg"}
                    alt={user.display_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">{user.display_name}</h2>
                <p className="text-sm text-slate-600">@{user.username}</p>
              </div>

              {/* Engagement Score - Large and Prominent */}
              <div className="space-y-1 text-center">
                <div
                  className="text-6xl font-bold bg-gradient-to-r from-violet-600 to-violet-500 bg-clip-text text-transparent"
                >
                  {engagementScore}
                </div>
                <p className="text-sm text-slate-600">Average Engagement Score</p>
                <p className="text-xs text-slate-500">Based on last 30 days</p>
              </div>
            </div>

            {/* Daily Activity Stats */}
            <div className="relative z-10 grid grid-cols-3 gap-3">
              <div
                className="rounded-lg p-3 text-center"
                style={{
                  background: "rgba(191, 219, 254, 0.4)",
                }}
              >
                <p className="text-2xl font-bold text-violet-600">{engagementStats.weeklyPosts}</p>
                <p className="text-xs text-slate-600 mt-1">Casts</p>
              </div>
              <div
                className="rounded-lg p-3 text-center"
                style={{
                  background: "rgba(191, 219, 254, 0.4)",
                }}
              >
                <p className="text-2xl font-bold text-violet-600">{engagementStats.totalRecasts}</p>
                <p className="text-xs text-slate-600 mt-1">Recasts</p>
              </div>
              <div
                className="rounded-lg p-3 text-center"
                style={{
                  background: "rgba(191, 219, 254, 0.4)",
                }}
              >
                <p className="text-2xl font-bold text-violet-600">{engagementStats.totalReplies}</p>
                <p className="text-xs text-slate-600 mt-1">Replies</p>
              </div>
            </div>

            {/* Top 3 Supporters */}
            {topSupporters.length > 0 && (
              <div className="relative z-10 space-y-3 pt-4 border-t border-blue-200/50">
                <p className="text-xs font-semibold text-slate-700 text-center">TOP SUPPORTERS</p>
                <div className="space-y-2">
                  {topSupporters.map((supporter, index) => (
                    <div key={supporter.fid} className="flex items-center gap-2">
                      <span className="text-xl">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                      <img
                        src={supporter.profileImage || "/placeholder.svg"}
                        alt={supporter.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          @{supporter.username}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-violet-600">
                        {supporter.engagement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer - Branding */}
            <div className="relative z-10 pt-4 border-t border-blue-200/50 text-center">
              <p className="text-xs text-slate-600">Built on Base 💙</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start max-w-sm">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? "Downloading..." : "Download Image"}
        </button>
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-300"
        >
          <Share2 className="w-4 h-4" />
          {isSharing ? "Sharing..." : "Share Your Card"}
        </button>
      </div>

      {/* Share Text Preview */}
      <div className="max-w-sm bg-slate-50 rounded-lg p-4 border border-slate-200">
        <p className="text-xs font-semibold text-slate-600 mb-2">SHARE TEXT PREVIEW</p>
        <p className="text-sm text-slate-700 leading-relaxed">
          My Farcaster average engagement score is {engagementScore}/100 🚀
          {topSupporters.length > 0 && (
            <>
              <br />
              Shoutout to my most based supporters:
              <br />
              {topSupporters.map((s) => `@${s.username}`).join(" ")}
            </>
          )}
          <br />
          Built on Base 💙
        </p>
      </div>
    </div>
  )
}
