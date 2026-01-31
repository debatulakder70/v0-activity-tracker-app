import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get("username") || "Anonymous"
    const score = searchParams.get("score") || "0"
    const tier = searchParams.get("tier") || "Starter"

    // Generate frame HTML that will be rendered as an image
    const frameHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Engagement Score</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          width: 100%;
          max-width: 600px;
        }
        .card {
          background: linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f97316 100%);
          border-radius: 24px;
          padding: 48px 40px;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          min-height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .profile-section {
          margin-bottom: 40px;
        }
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 36px;
          color: white;
          border: 3px solid rgba(255, 255, 255, 0.3);
        }
        .username {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }
        .handle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 16px;
        }
        .score-label {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 12px;
          font-weight: 600;
        }
        .score {
          font-size: 72px;
          font-weight: 800;
          color: white;
          line-height: 1;
          margin-bottom: 16px;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .tier {
          font-size: 18px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          background: rgba(0, 0, 0, 0.1);
          padding: 8px 16px;
          border-radius: 8px;
          display: inline-block;
          margin-top: 16px;
        }
        .footer {
          margin-top: 40px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="profile-section">
            <div class="avatar">👤</div>
            <div class="username">${username}</div>
            <div class="handle">@${username.toLowerCase()}</div>
          </div>
          <div class="score-label">Avg Engagement Score</div>
          <div class="score">${score}</div>
          <div class="tier">${tier}</div>
          <div class="footer">Built on Base 💙</div>
        </div>
      </div>
    </body>
    </html>
    `

    // Return Farcaster Frame metadata
    const frameResponse = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Engagement Score</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      
      <!-- OG Meta Tags -->
      <meta property="og:title" content="My Engagement Score: ${score}/100" />
      <meta property="og:description" content="Check my Farcaster engagement score on Activity Tracker" />
      <meta property="og:image" content="https://activity-tracker.online/og-image.jpg" />
      <meta property="og:type" content="website" />
      
      <!-- Farcaster Frame Meta Tags -->
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://activity-tracker.online/api/frame/engagement-image?username=${encodeURIComponent(username)}&score=${score}&tier=${encodeURIComponent(tier)}" />
      <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
      
      <!-- Frame Buttons -->
      <meta property="fc:frame:button:1" content="Check Your Score" />
      <meta property="fc:frame:button:1:action" content="link" />
      <meta property="fc:frame:button:1:target" content="https://activity-tracker.online/?username=${encodeURIComponent(username)}" />
      
      <meta property="fc:frame:button:2" content="Share" />
      <meta property="fc:frame:button:2:action" content="post" />
      <meta property="fc:frame:button:2:target" content="https://activity-tracker.online/api/frame/share" />
      
      <meta property="fc:frame:button:3" content="Improve Today" />
      <meta property="fc:frame:button:3:action" content="link" />
      <meta property="fc:frame:button:3:target" content="https://activity-tracker.online/?tab=guide" />
    </head>
    <body>
      <h1>Engagement Score Frame</h1>
    </body>
    </html>
    `

    return new NextResponse(frameResponse, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("[v0] Frame generation error:", error)
    return NextResponse.json({ error: "Frame generation failed" }, { status: 500 })
  }
}
