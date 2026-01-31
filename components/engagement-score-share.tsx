'use client'

import { Download, Share2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEngagementScoreSharing } from '@/hooks/use-engagement-score-sharing'
import { useTopSupporters, generateShareText } from '@/hooks/use-share-card'
import type { NeynarUser, NeynarCast } from '@/lib/neynar'
import { useState } from 'react'

interface EngagementScoreShareProps {
  score: number
  user: NeynarUser | undefined
  casts: NeynarCast[]
  tier: {
    tier: string
    color: string
    description: string
  }
}

export function EngagementScoreShare({ score, user, casts, tier }: EngagementScoreShareProps) {
  const { cardRef, isDownloading, downloadCardImage, shareToFarcaster } =
    useEngagementScoreSharing()
  const topSupporters = useTopSupporters(casts)
  const [isSharing, setIsSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareText = generateShareText(score, topSupporters)

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const imageData = await downloadCardImage()
      await shareToFarcaster(shareText, imageData)
    } catch (error) {
      console.error('[v0] Sharing error:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('[v0] Copy error:', error)
    }
  }

  const handleDownload = async () => {
    const imageData = await downloadCardImage()
    if (!imageData) return

    const link = document.createElement('a')
    link.href = imageData
    link.download = `engagement-score-${score}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="hidden" ref={cardRef}>
        {/* Hidden card for image generation */}
        <EngagementScoreCard score={score} tier={tier} user={user} supporters={topSupporters} />
      </div>

      {/* Share buttons */}
      <div className="flex gap-2 w-full">
        <Button
          onClick={handleShare}
          disabled={isSharing}
          className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Share2 className="w-4 h-4 mr-2" />
          {isSharing ? 'Sharing...' : 'Share Score'}
        </Button>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          variant="outline"
          className="flex-1 border-slate-600 hover:bg-slate-800 text-slate-200 rounded-lg font-semibold transition-all duration-300 bg-transparent"
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? 'Generating...' : 'Download'}
        </Button>
      </div>

      {/* Copy share text button */}
      <Button
        onClick={handleCopyText}
        variant="outline"
        className="w-full border-slate-600 hover:bg-slate-800 text-slate-200 rounded-lg font-semibold transition-all duration-300 bg-transparent text-sm"
      >
        {copied ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
            Share text copied!
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 mr-2" />
            Copy share text
          </>
        )}
      </Button>

      {/* Share text preview */}
      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <p className="text-xs font-semibold text-slate-400 mb-2">Share text:</p>
        <p className="text-xs text-slate-300 whitespace-pre-wrap line-clamp-3">{shareText}</p>
      </div>
    </div>
  )
}

function EngagementScoreCard({
  score,
  tier,
  user,
  supporters,
}: {
  score: number
  tier: { tier: string; color: string; description: string }
  user: NeynarUser | undefined
  supporters: Array<{ username: string; profileImage: string }>
}) {
  return (
    <div className="w-96 p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl">
      {/* Score circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={`url(#scoreGradient)`}
              strokeWidth="6"
              strokeDasharray={`${(score / 100) * 283} 283`}
              className="transition-all duration-500"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{score}</div>
              <div className="text-xs text-slate-400">/100</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier info */}
      <div className="text-center mb-6">
        <h3 className={`text-2xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-2`}>
          {tier.tier}
        </h3>
        <p className="text-sm text-slate-400">{tier.description}</p>
      </div>

      {/* Top supporters */}
      {supporters.length > 0 && (
        <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <p className="text-xs font-semibold text-slate-400 mb-3">Top supporters:</p>
          <div className="flex gap-2">
            {supporters.map((supporter) => (
              <div
                key={supporter.username}
                className="flex flex-col items-center gap-2"
              >
                <img
                  src={supporter.profileImage || '/placeholder-user.jpg'}
                  alt={supporter.username}
                  className="w-10 h-10 rounded-full border border-slate-600"
                />
                <p className="text-xs text-slate-400 truncate w-12 text-center">@{supporter.username}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User info */}
      {user && (
        <div className="text-center pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-400">@{user.username}</p>
          <p className="text-xs text-slate-500 mt-2">Built on Base 💙</p>
        </div>
      )}
    </div>
  )
}
