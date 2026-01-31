"use client"

import { TrendingUp, ChevronRight, Share2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { calculateEngagementScore, getEngagementTier } from "@/hooks/use-farcaster"
import type { NeynarUser, NeynarCast } from "@/lib/neynar"
import { useState } from "react"
import { EngagementScoreShare } from "./engagement-score-share"

interface FrameBannerProps {
  username: string
  user: NeynarUser | undefined
  casts: NeynarCast[]
  previousScore?: number
  onImprove?: () => void
}

export function FrameBanner({ username, user, casts, previousScore = 0, onImprove }: FrameBannerProps) {
  const currentScore = calculateEngagementScore(casts, user)
  const scoreChange = currentScore - previousScore
  const tier = getEngagementTier(currentScore)
  const hasScore = currentScore > 0
  const [showShareModal, setShowShareModal] = useState(false)

  return (
    <>
      <div className="relative w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 overflow-hidden group">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        {/* Content */}
        <div className="relative px-4 md:px-6 py-4 md:py-6">
          {!hasScore ? (
            // No score state
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-semibold text-slate-300">Activity Tracker</p>
                  <p className="text-sm md:text-base font-bold text-white truncate">Check Your Engagement Score</p>
                </div>
              </div>
              <Button
                onClick={() => setShowShareModal(true)}
                className="flex-shrink-0 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg px-3 md:px-4 py-2 transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
              >
                <span className="hidden sm:inline">Check Score</span>
                <span className="sm:hidden">Score</span>
                <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          ) : (
            // Score exists state
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Left: Score display */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Circular score display */}
                <div className="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20">
                  <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(148, 163, 184, 0.2)"
                      strokeWidth="8"
                    />
                    {/* Score circle with gradient */}
                    <defs>
                      <linearGradient id={`scoreGradient-${currentScore}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#9333ea" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={`url(#scoreGradient-${currentScore})`}
                      strokeWidth="8"
                      strokeDasharray={`${(currentScore / 100) * 283} 283`}
                      className="transition-all duration-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-white">{currentScore}</div>
                      <div className="text-xs text-slate-400">/100</div>
                    </div>
                  </div>
                </div>

                {/* Middle: Score details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-lg md:text-xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                      {tier.tier}
                    </h3>
                    {scoreChange !== 0 && (
                      <div
                        className={`flex items-center gap-0.5 text-xs md:text-sm font-semibold px-2 py-1 rounded-full ${
                          scoreChange > 0
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        <TrendingUp
                          className={`w-3 h-3 md:w-4 md:h-4 ${scoreChange < 0 ? "transform rotate-180" : ""}`}
                        />
                        <span>
                          {scoreChange > 0 ? "+" : ""}
                          {scoreChange}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-slate-400">{tier.description}</p>
                  <p className="text-xs text-slate-500 mt-1">Based on last 30 days</p>
                </div>
              </div>

              {/* Right: Action buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={() => setShowShareModal(true)}
                  variant="outline"
                  className="flex-1 sm:flex-none border-slate-600 hover:bg-slate-800 text-slate-200 rounded-lg font-semibold transition-all duration-300 bg-transparent"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Share Score</span>
                  <span className="sm:hidden">Share</span>
                </Button>
                <Button
                  onClick={onImprove}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Improve Today</span>
                  <span className="sm:hidden">Improve</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-white mb-4">Share Your Score</h2>
            <EngagementScoreShare score={currentScore} user={user} casts={casts} tier={tier} />
            <Button
              onClick={() => setShowShareModal(false)}
              variant="outline"
              className="w-full mt-4 border-slate-600 hover:bg-slate-800 text-slate-200 rounded-lg font-semibold transition-all duration-300 bg-transparent"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
