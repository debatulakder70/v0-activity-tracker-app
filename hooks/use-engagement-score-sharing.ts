'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import type { NeynarUser, NeynarCast } from '@/lib/neynar'
import { calculateEngagementScore } from '@/hooks/use-farcaster'

export interface ShareEngagementScoreProps {
  user: NeynarUser | undefined
  casts: NeynarCast[]
  score: number
  topSupporters: Array<{ username: string; profileImage: string }>
}

export function useEngagementScoreSharing() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const generateShareText = (score: number, supporters: Array<{ username: string }>) => {
    let text = `My Farcaster average engagement score is ${score} 🚀\n`

    if (supporters.length > 0) {
      text += `Shoutout to my most based supporters:\n${supporters.map((s) => `@${s.username}`).join(' ')}\n\n`
    }

    text += `Built on Base 💙`

    return text
  }

  const downloadCardImage = async () => {
    if (!cardRef.current) return null
    setIsDownloading(true)

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        pixelRatio: 2,
      })

      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('[v0] Error generating card image:', error)
      return null
    } finally {
      setIsDownloading(false)
    }
  }

  const shareToFarcaster = async (text: string, score: number, tier: string, username: string) => {
    const isBaseApp = typeof window !== 'undefined' && (window as any).farcaster

    // Generate frame URL
    const frameUrl = `https://activity-tracker.online/api/frame/engagement?username=${encodeURIComponent(username)}&score=${score}&tier=${encodeURIComponent(tier)}`

    if (isBaseApp) {
      // Use Base App Farcaster integration with frame
      try {
        await (window as any).farcaster.requestCastComposer({
          text,
          embeds: [
            {
              url: frameUrl,
            },
          ],
        })
      } catch (error) {
        console.error('[v0] Base App share error:', error)
        fallbackToWarpcast(text)
      }
    } else {
      // Fallback to Warpcast with frame URL in text
      fallbackToWarpcast(`${text}\n\n${frameUrl}`)
    }
  }

  const fallbackToWarpcast = (text: string) => {
    const encodedText = encodeURIComponent(text)
    window.open(
      `https://warpcast.com/~/compose?text=${encodedText}`,
      '_blank',
      'width=600,height=700'
    )
  }

  return {
    cardRef,
    isDownloading,
    generateShareText,
    downloadCardImage,
    shareToFarcaster,
  }
}

// Helper to generate shareable image with engagement score
export async function generateEngagementScoreImage(
  canvasElement: HTMLCanvasElement,
  score: number,
  tier: string
): Promise<Blob> {
  const canvas = await html2canvas(canvasElement, {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: true,
  })

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
    }, 'image/png')
  })
}
