'use client';

import type { NeynarCast } from "@/lib/neynar"
import { useMemo } from "react"

export interface TopSupporter {
  username: string
  profileImage: string
  engagement: number
  fid: number
}

export function useTopSupporters(casts: NeynarCast[]): TopSupporter[] {
  return useMemo(() => {
    if (!casts.length) return []

    const engagementMap = new Map<
      number,
      {
        username: string
        profileImage: string
        engagement: number
        fid: number
      }
    >()

    // Aggregate engagement by author
    casts.forEach((cast) => {
      const engagement = cast.reactions.likes_count + cast.reactions.recasts_count + cast.replies.count
      const fid = cast.author.fid

      if (engagementMap.has(fid)) {
        const existing = engagementMap.get(fid)!
        existing.engagement += engagement
      } else {
        engagementMap.set(fid, {
          username: cast.author.username,
          profileImage: cast.author.pfp_url,
          engagement,
          fid,
        })
      }
    })

    return Array.from(engagementMap.values())
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3)
  }, [casts])
}

export function generateShareText(
  score: number,
  supporters: TopSupporter[],
): string {
  let text = `My Farcaster average engagement score is ${score}/100 🚀`

  if (supporters.length > 0) {
    text += `\nShoutout to my most based supporters:\n${supporters.map((s) => `@${s.username}`).join(" ")}`
  }

  text += `\n\nBuilt on Base 💙`

  return text
}

export function openBaseAppComposer(text: string, imageUrl?: string) {
  // Check if we're in Base App context
  const isBaseApp =
    typeof window !== "undefined" && (window as any).baseAppComposer

  if (isBaseApp) {
    ;(window as any).baseAppComposer.openCastComposer({
      text,
      embeds: imageUrl ? [{ type: "image", url: imageUrl }] : undefined,
    })
  } else {
    // Fallback to Warpcast
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`
    window.open(warpcastUrl, "_blank")
  }
}
