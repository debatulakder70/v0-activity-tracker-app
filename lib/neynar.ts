// Neynar API client for Farcaster data

const NEYNAR_API_URL = "https://api.neynar.com/v2/farcaster"

export interface NeynarUser {
  object: string
  fid: number
  username: string
  display_name: string
  pfp_url: string
  custody_address: string
  profile: {
    bio: {
      text: string
    }
  }
  follower_count: number
  following_count: number
  verifications: string[]
  verified_addresses: {
    eth_addresses: string[]
    sol_addresses: string[]
  }
  power_badge: boolean
}

export interface NeynarCast {
  hash: string
  thread_hash: string
  parent_hash: string | null
  author: NeynarUser
  text: string
  timestamp: string
  reactions: {
    likes_count: number
    recasts_count: number
    likes: { fid: number; fname: string }[]
    recasts: { fid: number; fname: string }[]
  }
  replies: {
    count: number
  }
  embeds: { url: string }[]
}

export interface NeynarChannel {
  id: string
  name: string
  description: string
  image_url: string
  follower_count: number
}

// Helper to get API key from env
function getApiKey(): string {
  const apiKey = process.env.NEYNAR_API_KEY
  if (!apiKey) {
    throw new Error("NEYNAR_API_KEY environment variable is not set")
  }
  return apiKey
}

// Helper function to normalize username by removing common suffixes
function normalizeUsername(username: string): string {
  // Remove @ prefix if present
  let normalized = username.startsWith("@") ? username.slice(1) : username

  // Remove common suffixes
  const suffixes = [".farcaster.eth", ".eth", ".fc", ".farcaster"]
  for (const suffix of suffixes) {
    if (normalized.toLowerCase().endsWith(suffix)) {
      normalized = normalized.slice(0, -suffix.length)
      break
    }
  }

  return normalized.toLowerCase().trim()
}

// Fetch user by username
export async function fetchUserByUsername(username: string): Promise<NeynarUser | null> {
  const normalizedUsername = normalizeUsername(username)

  try {
    const response = await fetch(`${NEYNAR_API_URL}/user/by_username?username=${normalizedUsername}`, {
      headers: {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    if (response.status === 404) {
      const searchResults = await searchUsers(normalizedUsername, 1)
      if (searchResults.length > 0) {
        return searchResults[0]
      }
      return null
    }

    if (!response.ok) {
      console.error(`Neynar API error: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

// Fetch user by FID
export async function fetchUserByFid(fid: number): Promise<NeynarUser | null> {
  try {
    const response = await fetch(`${NEYNAR_API_URL}/user/bulk?fids=${fid}`, {
      headers: {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.users?.[0] || null
  } catch (error) {
    console.error("Error fetching user by FID:", error)
    return null
  }
}

// Fetch user's casts (posts)
export async function fetchUserCasts(fid: number, limit = 25): Promise<NeynarCast[]> {
  try {
    const response = await fetch(`${NEYNAR_API_URL}/feed/user/casts?fid=${fid}&limit=${limit}&include_replies=false`, {
      headers: {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.casts || []
  } catch (error) {
    console.error("Error fetching casts:", error)
    return []
  }
}

// Search users
export async function searchUsers(query: string, limit = 10): Promise<NeynarUser[]> {
  try {
    const response = await fetch(`${NEYNAR_API_URL}/user/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
      headers: {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.result?.users || []
  } catch (error) {
    console.error("Error searching users:", error)
    return []
  }
}

// Fetch user's channels
export async function fetchUserChannels(fid: number): Promise<NeynarChannel[]> {
  try {
    const response = await fetch(`${NEYNAR_API_URL}/user/channels?fid=${fid}`, {
      headers: {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.channels || []
  } catch (error) {
    console.error("Error fetching channels:", error)
    return []
  }
}

// Fetch trending casts
export async function fetchTrendingCasts(limit = 10): Promise<NeynarCast[]> {
  try {
    const response = await fetch(`${NEYNAR_API_URL}/feed/trending?limit=${limit}`, {
      headers: {
        "x-api-key": getApiKey(),
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.casts || []
  } catch (error) {
    console.error("Error fetching trending:", error)
    return []
  }
}
