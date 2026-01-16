"use client"

import { Heart, Repeat2, MessageCircle, Download, Share2 } from "lucide-react"
import type { NeynarUser } from "@/lib/neynar"
import { formatNumber } from "@/hooks/use-farcaster"

interface ActivityCardProps {
  user: NeynarUser
  engagementRate: number
  totalLikes: number
  totalRecasts: number
  totalReplies: number
}

export function ActivityCard({ user, engagementRate, totalLikes, totalRecasts, totalReplies }: ActivityCardProps) {
  // Determine tier based on engagement rate
  const getTier = (rate: number) => {
    if (rate >= 40)
      return { name: "DIAMOND", color: "from-purple-600 via-pink-500 to-cyan-400", bg: "from-purple-900 to-gray-900" }
    if (rate >= 20) return { name: "PLATINUM", color: "from-cyan-400 to-blue-500", bg: "from-slate-800 to-slate-900" }
    if (rate >= 10) return { name: "GOLD", color: "from-amber-400 to-orange-500", bg: "from-amber-900 to-slate-900" }
    if (rate >= 5) return { name: "SILVER", color: "from-gray-400 to-gray-300", bg: "from-gray-800 to-slate-900" }
    return { name: "BRONZE", color: "from-amber-700 to-amber-600", bg: "from-amber-950 to-slate-900" }
  }

  const tier = getTier(engagementRate)
  const totalEngagement = totalLikes + totalRecasts + totalReplies

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Card container */}
      <div
        className={`relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video bg-gradient-to-br ${tier.bg} group`}
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-white via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Starfield effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-white text-xl font-bold">Activity Tracker</h2>
              <p className={`text-sm font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                {tier.name}
              </p>
            </div>
            <div className="text-4xl">👑</div>
          </div>

          {/* Stats */}
          <div className="flex items-end justify-between">
            <div>
              {/* User info */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  {user.pfp_url && (
                    <img
                      src={user.pfp_url || "/placeholder.svg"}
                      alt={user.username}
                      className="w-12 h-12 rounded-xl border-2 border-white/30 object-cover"
                    />
                  )}
                  <div>
                    <p className="text-white font-bold">{user.display_name}</p>
                    <p className="text-white/60 text-xs">@{user.username}</p>
                  </div>
                </div>
              </div>

              {/* Engagement stats */}
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-white/80">
                  <Heart className="w-4 h-4" />
                  <span>{formatNumber(totalLikes)} likes</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Repeat2 className="w-4 h-4" />
                  <span>{formatNumber(totalRecasts)} recasts</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <MessageCircle className="w-4 h-4" />
                  <span>{formatNumber(totalReplies)} replies</span>
                </div>
              </div>
            </div>

            {/* Engagement meter */}
            <div className="text-right">
              <p className="text-white/60 text-xs mb-1">Engagement</p>
              <p className={`text-3xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                {engagementRate.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex gap-3">
        <button className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <Download className="w-4 h-4" />
          Download
        </button>
        <button className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  )
}
