"use client"

interface Supporter {
  username: string
  profileImage: string
  engagement: number
  fid: number
}

interface TopSupportersProps {
  supporters: Supporter[]
}

export function TopSupporters({ supporters }: TopSupportersProps) {
  const badges = ["🥇", "🥈", "🥉"]

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-700 text-center">TOP SUPPORTERS</p>
      <div className="space-y-2">
        {supporters.map((supporter, index) => (
          <div key={supporter.fid} className="flex items-center gap-3">
            <span className="text-xl">{badges[index]}</span>
            <img
              src={supporter.profileImage || "/placeholder.svg"}
              alt={supporter.username}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">@{supporter.username}</p>
            </div>
            <span className="text-sm font-semibold text-violet-600">{supporter.engagement}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
