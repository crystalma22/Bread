/** Player stats (0–100). Never decrease globally. */
export type PlayerStats = {
  technicalSkill: number
  storytelling: number
  professionalism: number
  networkingSkill: number
  interviewReadiness: number
}

export const STAT_KEYS = [
  'technicalSkill',
  'storytelling',
  'professionalism',
  'networkingSkill',
  'interviewReadiness',
] as const

export type StatKey = (typeof STAT_KEYS)[number]

export type Rank =
  | 'candidate'
  | 'intern-ready'
  | 'interview-ready'
  | 'offer-ready'
  | 'analyst'

export interface PlayerState {
  /** Set after onboarding */
  hasCompletedOnboarding: boolean
  graduationYear: number | null
  accountingExperience: 'yes' | 'a_little' | 'no' | null
  /** First time on /map: seen "intro to finance" before the map */
  hasSeenMapIntro: boolean
  /** Seen NPC tutorial on map homepage (how to pan, tap Wall Street) */
  hasSeenMapTutorial: boolean
  /** Seen NPC in Wall Street zoom (explain paths, recommend, choose where to start) */
  hasSeenWallStreetIntro: boolean
  /** Date (YYYY-MM-DD) when user last completed a recall quiz; used for "first visit of day" gate */
  lastRecallDate: string | null
  /** Concept IDs the user has completed (for recall quiz pool and review) */
  completedConceptIds: string[]
  stats: PlayerStats
  rank: Rank
  xp: number
  streak: number
  lastPlayedDate: string | null
  /** Question IDs to resurface for spaced repetition (got wrong) */
  wrongQuestionIds: string[]
}

export const INITIAL_STATS: PlayerStats = {
  technicalSkill: 0,
  storytelling: 0,
  professionalism: 0,
  networkingSkill: 0,
  interviewReadiness: 0,
}

/** XP thresholds for each rank. */
export const RANK_THRESHOLDS: Record<Rank, number> = {
  candidate: 0,
  'intern-ready': 100,
  'interview-ready': 300,
  'offer-ready': 600,
  analyst: 1000,
}

/** Ordered list from lowest to highest rank. */
export const RANK_ORDER: Rank[] = [
  'candidate',
  'intern-ready',
  'interview-ready',
  'offer-ready',
  'analyst',
]

/** Friendly display labels for each rank. */
export const RANK_LABELS: Record<Rank, string> = {
  candidate: 'Candidate',
  'intern-ready': 'Intern-ready',
  'interview-ready': 'Interview-ready',
  'offer-ready': 'Offer-ready',
  analyst: 'Analyst',
}

/** XP needed to reach the next rank (null if already at top). */
export function xpToNextRank(xp: number): { nextRank: Rank | null; xpNeeded: number } {
  const currentIdx = RANK_ORDER.findLastIndex((r) => xp >= RANK_THRESHOLDS[r])
  const nextIdx = currentIdx + 1
  if (nextIdx >= RANK_ORDER.length) return { nextRank: null, xpNeeded: 0 }
  const nextRank = RANK_ORDER[nextIdx]
  return { nextRank, xpNeeded: RANK_THRESHOLDS[nextRank] - xp }
}

/** Compute rank from XP. */
export function rankFromXp(xp: number): Rank {
  let rank: Rank = 'candidate'
  for (const r of RANK_ORDER) {
    if (xp >= RANK_THRESHOLDS[r]) rank = r
  }
  return rank
}
