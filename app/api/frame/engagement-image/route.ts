import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get("username") || "Anonymous"
    const score = searchParams.get("score") || "0"
    const tier = searchParams.get("tier") || "Starter"

    // Determine gradient colors based on tier
    let gradientFrom = "#a78bfa"
    let gradientTo = "#f97316"

    if (tier === "Legendary") {
      gradientFrom = "#fbbf24"
      gradientTo = "#f97316"
    } else if (tier === "Elite") {
      gradientFrom = "#a78bfa"
      gradientTo = "#ec4899"
    } else if (tier === "Pro") {
      gradientFrom = "#60a5fa"
      gradientTo = "#06b6d4"
    }

    const gradient = `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column" as const,
            width: "100%",
            height: "100%",
            background: gradient,
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          {/* Avatar placeholder */}
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              marginBottom: "24px",
              border: "3px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            👤
          </div>

          {/* Username */}
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "white",
              marginBottom: "8px",
            }}
          >
            {username}
          </div>

          {/* Handle */}
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: "32px",
            }}
          >
            @{username.toLowerCase()}
          </div>

          {/* Label */}
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            Avg Engagement Score
          </div>

          {/* Score */}
          <div
            style={{
              fontSize: "96px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1,
              marginBottom: "24px",
              textShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            {score}
          </div>

          {/* Tier badge */}
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.95)",
              background: "rgba(0, 0, 0, 0.1)",
              padding: "12px 24px",
              borderRadius: "12px",
              marginBottom: "24px",
            }}
          >
            {tier}
          </div>

          {/* Footer */}
          <div
            style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.8)",
              fontWeight: 500,
              marginTop: "16px",
            }}
          >
            Built on Base 💙
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error("[v0] OG image generation error:", error)
    return new Response("Failed to generate image", { status: 500 })
  }
}
