"use client"
import type { NeynarUser } from "@/lib/neynar"
import { motion } from "framer-motion"

interface ShareableCardProps {
  user: NeynarUser
  stats: any
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
  engagementPercent: number
}

const tierConfig = {
  bronze: {
    bgGradient: "from-orange-500 via-orange-400 to-blue-400",
    accentColor: "rgb(255, 140, 0)",
    label: "BRONZE",
    icon: "🥉",
  },
  silver: {
    bgGradient: "from-blue-400 via-cyan-400 to-purple-300",
    accentColor: "rgb(192, 192, 192)",
    label: "SILVER",
    icon: "🥈",
  },
  gold: {
    bgGradient: "from-yellow-400 via-orange-300 to-pink-300",
    accentColor: "rgb(255, 215, 0)",
    label: "GOLD",
    icon: "✨",
  },
  platinum: {
    bgGradient: "from-purple-500 via-pink-400 to-cyan-400",
    accentColor: "rgb(229, 228, 226)",
    label: "PLATINUM",
    icon: "💎",
  },
  diamond: {
    bgGradient: "from-purple-600 via-violet-500 to-purple-400",
    accentColor: "rgb(168, 85, 247)",
    label: "DIAMOND",
    icon: "👑",
  },
}

export function ShareableCard({ user, stats, tier, engagementPercent }: ShareableCardProps) {
  const config = tierConfig[tier]

  return (
    <div className="w-[1080px] h-[1350px] relative overflow-hidden rounded-3xl shadow-2xl">
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-90`} />

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${config.accentColor}33 0%, transparent 70%)`,
            top: "-100px",
            right: "-50px",
          }}
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)`,
            bottom: "-50px",
            left: "-100px",
          }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-12 text-white">
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold tracking-tight">activity tracker</h1>
          <div className="flex justify-center mt-2 text-3xl">{config.icon}</div>
        </motion.div>

        <motion.div
          className="flex justify-between gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex-1 bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/30">
            <p className="text-sm font-medium text-white/80 mb-2">Engagement Per Cast</p>
            <p className="text-4xl font-bold">{stats.engagementRate.toFixed(1)}</p>
          </div>
          <div className="flex-1 bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/30">
            <p className="text-sm font-medium text-white/80 mb-2">Weekly Casts</p>
            <p className="text-4xl font-bold">{stats.weeklyPosts}</p>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col items-center mb-12 flex-shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="w-64 h-64 rounded-3xl mb-8 overflow-hidden border-4 shadow-2xl"
            style={{
              borderColor: config.accentColor,
              boxShadow: `0 0 40px ${config.accentColor}66`,
            }}
          >
            <img src={user.pfp_url || "/placeholder.svg"} alt={user.username} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-5xl font-bold text-center mb-2">{user.display_name || user.username}</h2>
          <p className="text-xl text-white/80 mb-4">@{user.username}</p>
          <p className="text-lg text-white/70 text-center max-w-md">Account growth champion</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-4 mb-12 flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/10 backdrop-blur px-4 py-6 rounded-2xl text-center border border-white/20">
            <p className="text-3xl font-bold">{stats.totalLikes.toLocaleString()}</p>
            <p className="text-xs text-white/70 mt-2">Total Likes</p>
          </div>
          <div className="bg-white/10 backdrop-blur px-4 py-6 rounded-2xl text-center border border-white/20">
            <p className="text-3xl font-bold">{stats.totalRecasts.toLocaleString()}</p>
            <p className="text-xs text-white/70 mt-2">Recasts</p>
          </div>
          <div className="bg-white/10 backdrop-blur px-4 py-6 rounded-2xl text-center border border-white/20">
            <p className="text-3xl font-bold">{stats.weeklyPosts}</p>
            <p className="text-xs text-white/70 mt-2">This Week</p>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-between items-center mt-auto pt-8 border-t border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-sm font-bold text-white/80">activity tracker</div>
          <div
            className="px-6 py-3 rounded-full font-bold text-lg"
            style={{
              backgroundColor: config.accentColor,
              color: "#000",
            }}
          >
            {config.label} • {engagementPercent.toFixed(0)}%
          </div>
        </motion.div>
      </div>
    </div>
  )
}
