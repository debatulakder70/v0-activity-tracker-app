"use client"

import { Card } from "@/components/ui/card"
import { Lightbulb, CheckCircle2, Circle, Target, Zap, ThumbsUp, Loader2 } from "lucide-react"
import { useFarcasterUser, useFarcasterCasts, calculateEngagementStats, formatNumber } from "@/hooks/use-farcaster"

interface GuideSectionProps {
  username: string
}

export function GuideSection({ username }: GuideSectionProps) {
  const { user, isLoading: userLoading } = useFarcasterUser(username)
  const { casts, isLoading: castsLoading } = useFarcasterCasts(user?.fid ?? null)
  const engagementStats = calculateEngagementStats(casts)

  const isLoading = userLoading || castsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] md:min-h-[300px]">
        <div className="text-center space-y-3">
          <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-sky-500 mx-auto" />
          <p className="text-slate-500 font-medium text-xs md:text-sm">Loading guide...</p>
        </div>
      </div>
    )
  }

  const followers = user?.follower_count || 0
  const percentile = Math.max(1, Math.min(99, Math.round(100 - (followers / 10000) * 100)))

  const socialTips = [
    {
      task: "Post 3x daily",
      progress: Math.min(Math.round((engagementStats.weeklyPosts / 21) * 100), 100),
      done: engagementStats.weeklyPosts >= 21,
    },
    {
      task: `Reach ${formatNumber(Math.ceil(followers / 1000) * 1000 + 1000)} followers`,
      progress: Math.round((followers / (Math.ceil(followers / 1000) * 1000 + 1000)) * 100),
      done: false,
    },
    {
      task: "Maintain 5%+ engagement",
      progress: Math.min(Math.round((engagementStats.engagementRate / 5) * 100), 100),
      done: engagementStats.engagementRate >= 5,
    },
    {
      task: `Get ${formatNumber(engagementStats.totalLikes + 500)} total likes`,
      progress: Math.min(Math.round((engagementStats.totalLikes / (engagementStats.totalLikes + 500)) * 100), 99),
      done: false,
    },
  ]

  const completedTasks = socialTips.filter((t) => t.done).length

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative">
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Lightbulb className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-base md:text-xl font-bold text-slate-800">Improve Your Activity</h1>
          <p className="text-slate-500 text-xs md:text-sm">Tips for @{user?.username || username}</p>
        </div>
      </div>

      {/* Success banner - more compact */}
      <Card className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 border-0 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-2 md:gap-4">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-md shrink-0">
            <ThumbsUp className="w-5 h-5 md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-sm md:text-xl font-bold">Great job, {user?.display_name || username}!</h2>
            <p className="text-emerald-100 text-xs md:text-base">
              {"You're"} in the top {percentile}% of active users.
            </p>
          </div>
        </div>
      </Card>

      {/* Tips grid - single column mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
        <Card className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white border-0 shadow-[0_4px_20px_rgb(0,0,0,0.04)] card-3d">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h3 className="text-sm md:text-base font-bold text-slate-800">Social Tips</h3>
          </div>

          <div className="space-y-2 md:space-y-3">
            {socialTips.map((tip, i) => (
              <div key={i} className="flex items-center gap-2">
                {tip.done ? (
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                  </div>
                ) : (
                  <Circle className="w-4 h-4 md:w-5 md:h-5 text-slate-300 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className={`text-xs font-medium truncate ${tip.done ? "text-slate-400 line-through" : "text-slate-700"}`}
                    >
                      {tip.task}
                    </span>
                    <span className="text-[10px] md:text-xs text-slate-400 font-semibold ml-1">{tip.progress}%</span>
                  </div>
                  <div className="h-1 md:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        tip.progress === 100
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                          : "bg-gradient-to-r from-sky-400 to-indigo-500"
                      }`}
                      style={{ width: `${tip.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
            <span className="text-[10px] md:text-xs text-slate-500 font-medium">{completedTasks} tasks done</span>
          </div>
        </Card>

        <Card className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white border-0 shadow-[0_4px_20px_rgb(0,0,0,0.04)] card-3d">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
              <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h3 className="text-sm md:text-base font-bold text-slate-800">Growth Tips</h3>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            {[
              { task: "Engage with trending topics", status: "active" },
              { task: "Reply to popular casts", status: "pending" },
              { task: "Share valuable insights", status: "pending" },
              { task: "Build consistent presence", status: "done" },
            ].map((tip, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 p-1.5 md:p-2 rounded-lg transition-all ${
                  tip.status === "active"
                    ? "bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100"
                    : "hover:bg-slate-50"
                }`}
              >
                {tip.status === "done" ? (
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                  </div>
                ) : tip.status === "active" ? (
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-violet-500 flex items-center justify-center shrink-0 bg-white">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-violet-500 animate-pulse" />
                  </div>
                ) : (
                  <Circle className="w-4 h-4 md:w-5 md:h-5 text-slate-300 shrink-0" />
                )}
                <span
                  className={`text-xs font-medium flex-1 ${tip.status === "done" ? "text-slate-400 line-through" : "text-slate-700"}`}
                >
                  {tip.task}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 mt-3 pt-2 border-t border-slate-100">
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-[10px] md:text-xs font-semibold">
              3 goals
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-[10px] md:text-xs font-semibold">
              1 done
            </span>
          </div>
        </Card>
      </div>
    </div>
  )
}
