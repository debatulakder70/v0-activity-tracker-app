"use client"

interface EngagementScoreCardProps {
  score: number
  username: string
  profileImage: string
  displayName: string
}

export function EngagementScoreCard({
  score,
  username,
  profileImage,
  displayName,
}: EngagementScoreCardProps) {
  return (
    <div
      className="relative mx-auto max-w-sm overflow-hidden rounded-3xl p-8 space-y-6"
      style={{
        background: "linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(224, 242, 254, 0.85) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(191, 219, 254, 0.5)",
        boxShadow: "0 20px 60px rgba(15, 23, 42, 0.15)",
      }}
    >
      {/* Purple Glow Background */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}
      />

      {/* Profile Section */}
      <div className="relative z-10 space-y-4 text-center">
        {/* Profile Image with Glow */}
        <div
          className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-violet-400/50 mx-auto"
          style={{
            boxShadow: "0 0 30px rgba(124, 58, 237, 0.4)",
          }}
        >
          <img src={profileImage || "/placeholder.svg"} alt={displayName} className="w-full h-full object-cover" />
        </div>

        {/* Display Name */}
        <div>
          <h3 className="text-xl font-bold text-slate-900">{displayName}</h3>
          <p className="text-sm text-slate-600">@{username}</p>
        </div>
      </div>

      {/* Score Section */}
      <div className="relative z-10 text-center space-y-1">
        <div className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-violet-500 bg-clip-text text-transparent">
          {score}
        </div>
        <p className="text-sm text-slate-600">Engagement Score</p>
        <p className="text-xs text-slate-500">Last 30 days</p>
      </div>
    </div>
  )
}
