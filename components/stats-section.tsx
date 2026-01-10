"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Target, Award, Loader2, Sparkles, Users, MessageCircle, Heart, Repeat2 } from "lucide-react"
import { useFarcasterUser, useFarcasterCasts, calculateEngagementStats, formatNumber } from "@/hooks/use-farcaster"

interface StatsSectionProps {
  username: string
}

export function StatsSection({ username }: StatsSectionProps) {
  const { user, isLoading: userLoading } = useFarcasterUser(username)
  const { casts, isLoading: castsLoading } = useFarcasterCasts(user?.fid ?? null)
  const engagementStats = calculateEngagementStats(casts)

  const isLoading = userLoading || castsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-sky-500 mx-auto" />
          </div>
          <p className="text-slate-500 font-medium text-sm md:text-base">Loading stats...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        <p className="text-slate-500">User not found</p>
      </div>
    )
  }

  const castEngagementData = casts.slice(0, 8).map((cast) => ({
    likes: cast.reactions.likes_count,
    recasts: cast.reactions.recasts_count,
    replies: cast.replies.count,
    total: cast.reactions.likes_count + cast.reactions.recasts_count + cast.replies.count,
  }))

  // Normalize to percentage heights based on max engagement
  const maxEngagement = Math.max(...castEngagementData.map((d) => d.total), 1)
  const chartBars = castEngagementData.map((d, i) => ({
    height: Math.max(10, Math.round((d.total / maxEngagement) * 100)),
    isHighest: d.total === maxEngagement && d.total > 0,
    index: i,
  }))

  // Find the best performing cast index
  const bestCastIndex = chartBars.findIndex((b) => b.isHighest)

  const followRatio = user.following_count > 0 ? user.follower_count / user.following_count : user.follower_count
  const growthRate = Math.round(followRatio * 100)

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-5">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="relative">
            <img
              src={user.pfp_url || "/placeholder.svg?height=56&width=56&query=avatar"}
              alt={user.display_name}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full ring-4 ring-white shadow-xl"
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">Your Stats</h1>
            <p className="text-slate-500 text-sm">
              @{user.username} • FID #{user.fid}
            </p>
          </div>
        </div>
        {user.power_badge && (
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs md:text-sm font-semibold flex items-center gap-1.5 shadow-lg w-fit sm:ml-auto">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            Power User
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          {
            label: "Followers",
            value: formatNumber(user.follower_count),
            change: `FID #${user.fid}`,
            icon: Users,
            color: "from-orange-400 to-rose-500",
            shadow: "shadow-orange-200/50",
          },
          {
            label: "Avg Likes per Cast",
            value: engagementStats.avgLikes.toString(),
            change: `${engagementStats.totalLikes} total`,
            icon: TrendingUp,
            color: "from-sky-400 to-indigo-500",
            shadow: "shadow-sky-200/50",
          },
          {
            label: "Total Recasts",
            value: formatNumber(engagementStats.totalRecasts),
            change: `avg ${engagementStats.avgRecasts}/post`,
            icon: Target,
            color: "from-emerald-400 to-teal-500",
            shadow: "shadow-emerald-200/50",
          },
        ].map((metric) => (
          <Card
            key={metric.label}
            className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 relative overflow-hidden group card-3d"
          >
            <div className="relative">
              <div
                className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-3 md:mb-5 shadow-xl ${metric.shadow}`}
              >
                <metric.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <p className="text-xs md:text-sm text-slate-500 mb-1 md:mb-2 font-medium">{metric.label}</p>
              <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
                <span className="text-2xl md:text-4xl font-bold text-slate-800">{metric.value}</span>
                <span className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-600 text-xs md:text-sm font-semibold">
                  {metric.change}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Success story - using real data */}
      <Card className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="relative">
          <div className="flex items-center justify-center mb-4 md:mb-8">
            <div className="px-4 md:px-5 py-1.5 md:py-2 rounded-full border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm">
              <span className="text-orange-600 font-semibold flex items-center gap-2 text-sm md:text-base">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                Your Growth
              </span>
            </div>
          </div>

          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-center mb-3 text-balance">
            <span className="text-slate-800">Reached </span>
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              {formatNumber(user.follower_count)}
            </span>
            <br />
            <span className="text-slate-800">followers </span>
            <span className="text-slate-400">on Farcaster</span>
          </h2>

          <div className="mt-6 md:mt-10 bg-gradient-to-br from-slate-50 to-white rounded-2xl md:rounded-3xl p-4 md:p-8 border border-slate-100/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm md:text-base font-semibold text-slate-700">Recent Cast Performance</h3>
              <span className="text-xs text-slate-400">Last {casts.length} casts</span>
            </div>
            <div className="relative h-40 md:h-56">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs md:text-sm text-slate-400 font-medium">
                <span>{maxEngagement}</span>
                <span>{Math.round(maxEngagement / 2)}</span>
                <span>0</span>
              </div>

              <div className="ml-10 md:ml-16 h-full flex items-end justify-around relative">
                {chartBars.length > 0 ? (
                  chartBars.map((bar, i) => (
                    <div
                      key={i}
                      className={`w-6 md:w-10 rounded-t-lg md:rounded-t-xl transition-all duration-700 relative overflow-hidden ${
                        bar.isHighest
                          ? "bg-gradient-to-t from-orange-500 via-orange-400 to-amber-400 shadow-xl"
                          : "bg-gradient-to-t from-orange-200 via-orange-100 to-orange-50"
                      }`}
                      style={{ height: `${bar.height}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-black/5" />
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No cast data available</p>
                )}

                {/* Growth badge - shows real follow ratio */}
                <div className="absolute right-0 md:right-4 top-0 md:top-4">
                  <div className="px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 shadow-xl">
                    <span className="text-white font-bold text-sm md:text-xl">{growthRate}%</span>
                    <p className="text-orange-100 text-xs font-medium hidden sm:block">Follow ratio</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-around mt-2 text-xs text-slate-400">
              {castEngagementData.slice(0, 8).map((_, i) => (
                <span key={i}>Cast {i + 1}</span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="relative">
          <div className="flex justify-center mb-4 md:mb-8">
            <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-slate-100 to-indigo-50 text-slate-600 font-semibold border border-slate-200/50 text-sm md:text-base">
              Engagement Breakdown
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
                <Heart className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-slate-800">
                {formatNumber(engagementStats.totalLikes)}
              </p>
              <p className="text-xs md:text-sm text-slate-500">Total Likes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
                <Repeat2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-slate-800">
                {formatNumber(engagementStats.totalRecasts)}
              </p>
              <p className="text-xs md:text-sm text-slate-500">Total Recasts</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
                <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-slate-800">
                {formatNumber(engagementStats.totalReplies)}
              </p>
              <p className="text-xs md:text-sm text-slate-500">Total Replies</p>
            </div>
          </div>

          <h3 className="text-lg md:text-2xl font-bold text-slate-800 mb-2 text-center">
            {engagementStats.engagementRate}% Engagement Rate
          </h3>
          <p className="text-slate-500 text-center text-sm md:text-base">Based on your last {casts.length} casts</p>
        </div>
      </Card>

      {/* Goals - responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {[
          {
            label: "Follower Goal",
            current: user.follower_count,
            target: Math.ceil(user.follower_count / 1000) * 1000 + 1000,
            color: "sky",
          },
          {
            label: "Engagement Goal",
            current: engagementStats.engagementRate,
            target: 10,
            unit: "%",
            color: "emerald",
          },
        ].map((goal) => (
          <Card
            key={goal.label}
            className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 card-3d"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="font-bold text-slate-800 text-base md:text-lg">{goal.label}</h3>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Award className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
              {/* Circular progress - smaller on mobile */}
              <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0">
                <svg className="w-20 h-20 md:w-28 md:h-28 -rotate-90 drop-shadow-lg">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#f1f5f9" strokeWidth="8" className="md:hidden" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke={`url(#gradient-${goal.label})`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min((goal.current / goal.target) * 213.6, 213.6)} 213.6`}
                    className="md:hidden drop-shadow-md"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="10"
                    className="hidden md:block"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke={`url(#gradient-${goal.label})`}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min((goal.current / goal.target) * 301.6, 301.6)} 301.6`}
                    className="hidden md:block drop-shadow-md"
                  />
                  <defs>
                    <linearGradient id={`gradient-${goal.label}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={goal.color === "sky" ? "#0ea5e9" : "#10b981"} />
                      <stop offset="100%" stopColor={goal.color === "sky" ? "#6366f1" : "#14b8a6"} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg md:text-2xl font-bold text-slate-800">
                    {Math.min(Math.round((goal.current / goal.target) * 100), 100)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-2xl md:text-4xl font-bold text-slate-800">
                  {goal.unit === "%" ? goal.current.toFixed(1) : formatNumber(goal.current)}
                  {goal.unit}
                </p>
                <p className="text-slate-400 mt-1 text-sm md:text-base">
                  of {goal.unit === "%" ? goal.target : formatNumber(goal.target)}
                  {goal.unit} target
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
