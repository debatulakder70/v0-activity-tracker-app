"use client"

import { useMemo } from "react"
import type { NeynarUser } from "@/lib/neynar"
import { ResponsiveContainer, AreaChart, Area } from "recharts"
import { motion } from "framer-motion"

interface ShareableCardProps {
  user: NeynarUser
  stats: any
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
  engagementPercent: number
}

const tierConfig = {
  bronze: {
    bgGradient: "from-[#1a1a1a] to-[#2d2d2d]",
    border: "border-[#cd7f32]",
    glow: "rgba(205, 127, 50, 0.2)",
    primary: "#cd7f32",
    label: "NOOB",
    stars: 0,
  },
  silver: {
    bgGradient: "from-[#1e1e2e] to-[#2a2a3e]",
    border: "border-[#c0c0c0]",
    glow: "rgba(192, 192, 192, 0.3)",
    primary: "#c0c0c0",
    label: "NORMAL",
    stars: 5,
  },
  gold: {
    bgGradient: "from-[#1a1a2e] to-[#2d2d4a]",
    border: "border-[#ffd700]",
    glow: "rgba(255, 215, 0, 0.4)",
    primary: "#ffd700",
    label: "AVERAGE",
    stars: 10,
  },
  platinum: {
    bgGradient: "from-[#0f0f1e] to-[#1a1a35]",
    border: "border-[#e5e4e2]",
    glow: "rgba(229, 228, 226, 0.5)",
    primary: "#e5e4e2",
    label: "GOOD",
    stars: 20,
  },
  diamond: {
    bgGradient: "from-[#0a0a1a] to-[#14143a]",
    border: "border-purple-500",
    glow: "rgba(168, 85, 247, 0.6)",
    primary: "rgb(168, 85, 247)",
    label: "ELITE",
    stars: 30,
  },
}

function generateGrowthData(stats: any) {
  return [
    { week: "W1", value: Math.max(1, stats.engagementRate - 10) },
    { week: "W2", value: Math.max(1, stats.engagementRate - 8) },
    { week: "W3", value: Math.max(1, stats.engagementRate - 5) },
    { week: "W4", value: Math.max(1, stats.engagementRate - 2) },
    { week: "Now", value: stats.engagementRate },
  ]
}

export function ShareableCard({ user, stats, tier, engagementPercent }: ShareableCardProps) {
  const config = tierConfig[tier]
  const growthData = useMemo(() => generateGrowthData(stats), [stats])

  const starPositions = useMemo(() => {
    return Array.from({ length: config.stars }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 3,
    }))
  }, [config.stars])

  return (
    <div
      className={`w-[1080px] h-[1350px] bg-gradient-to-br ${config.bgGradient} border-2 ${config.border} relative overflow-hidden`}
      style={{
        boxShadow: `0 0 40px ${config.glow}`,
      }}
    >
      {/* Stars background */}
      {starPositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute text-white text-lg opacity-60"
          style={{
            top: `${pos.top}%`,
            left: `${pos.left}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            delay: pos.delay,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          ✦
        </motion.div>
      ))}

      {/* Light rays for premium tiers */}
      {(tier === "platinum" || tier === "diamond") && (
        <>
          <motion.div
            className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-20"
            animate={{
              x: [-100, 1100],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{ left: "-100px" }}
          />
          <motion.div
            className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-20"
            animate={{
              x: [-100, 1100],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: 4,
            }}
            style={{ right: "-100px" }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-12 text-white">
        {/* Header */}
        <motion.div
          className={`text-center mb-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 ${
            tier === "diamond" ? "border-purple-400" : ""
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold">activity tracker</h1>
          {tier === "diamond" && <span className="text-3xl ml-2">👑</span>}
        </motion.div>

        {/* Stats boxes */}
        <motion.div
          className="flex justify-between gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            className={`flex-1 p-4 rounded-lg border ${tier === "diamond" ? "border-purple-400 bg-purple-500/10" : "border-white/20 bg-white/5"} backdrop-blur`}
          >
            <p className="text-sm text-gray-300 mb-1">avg engagement per cast</p>
            <p className="text-2xl font-bold">{stats.engagementRate.toFixed(1)}</p>
          </div>
          <div
            className={`flex-1 p-4 rounded-lg border ${tier === "diamond" ? "border-purple-400 bg-purple-500/10" : "border-white/20 bg-white/5"} backdrop-blur`}
          >
            <p className="text-sm text-gray-300 mb-1">avg like per cast</p>
            <p className="text-2xl font-bold">{stats.avgLikes}</p>
          </div>
        </motion.div>

        {/* Profile section */}
        <motion.div
          className="flex flex-col items-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="w-48 h-48 rounded-2xl mb-6 overflow-hidden border-4"
            style={{
              borderColor: tier === "diamond" ? "rgb(168, 85, 247)" : config.primary,
              boxShadow: `0 0 20px ${config.glow}`,
            }}
          >
            <img src={user.pfp_url || "/placeholder.svg"} alt={user.username} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-3xl font-bold text-center">{user.display_name || user.username}</h2>
          <p className="text-gray-400 text-lg">@{user.username}</p>
        </motion.div>

        {/* Chart */}
        <motion.div
          className="flex-1 mb-8 min-h-[200px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-400 mb-4 text-center">account growth chart</p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id={`gradient-${tier}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={config.primary} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={config.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={config.primary}
                fill={`url(#gradient-${tier})`}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Corner badges */}
        <motion.div
          className="flex justify-between text-xs font-bold text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-black/30 backdrop-blur px-3 py-2 rounded-lg">{config.label} engagement</div>
          <div className="bg-black/30 backdrop-blur px-3 py-2 rounded-lg">{engagementPercent.toFixed(0)}% tier</div>
        </motion.div>
      </div>
    </div>
  )
}
