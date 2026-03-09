import { create } from 'zustand'
import type { PlayerState, PlayerStats, StatKey } from '@/types/player'
import { INITIAL_STATS, rankFromXp } from '@/types/player'

const clampStat = (v: number) => Math.max(0, Math.min(100, Math.round(v)))

export const usePlayerStore = create<PlayerState & {
  setOnboardingAnswers: (year: number, accounting: 'yes' | 'a_little' | 'no') => void
  setOnboardingComplete: () => void
  setSeenMapIntro: () => void
  setSeenMapTutorial: () => void
  setSeenWallStreetIntro: () => void
  setLastRecallDate: (date: string) => void
  addCompletedConcept: (id: string) => void
  applyStatDeltas: (deltas: Partial<Record<StatKey, number>>) => void
  addXp: (amount: number) => void
  incrementStreak: () => void
  addWrongQuestion: (id: string) => void
  removeWrongQuestion: (id: string) => void
  reset: () => void
}>((set) => ({
  hasCompletedOnboarding: false,
  graduationYear: null,
  accountingExperience: null,
  hasSeenMapIntro: false,
  hasSeenMapTutorial: false,
  hasSeenWallStreetIntro: false,
  lastRecallDate: null,
  completedConceptIds: [],
  stats: { ...INITIAL_STATS },
  rank: 'candidate',
  xp: 0,
  streak: 0,
  lastPlayedDate: null,
  wrongQuestionIds: [],

  setOnboardingAnswers: (year, accounting) => set({
    graduationYear: year,
    accountingExperience: accounting,
  }),
  setOnboardingComplete: () => set({
    hasCompletedOnboarding: true,
  }),

  setSeenMapIntro: () => set({ hasSeenMapIntro: true }),
  setSeenMapTutorial: () => set({ hasSeenMapTutorial: true }),
  setSeenWallStreetIntro: () => set({ hasSeenWallStreetIntro: true }),
  setLastRecallDate: (date) => set({ lastRecallDate: date }),
  addCompletedConcept: (id) => set((state) => ({
    completedConceptIds: state.completedConceptIds.includes(id)
      ? state.completedConceptIds
      : [...state.completedConceptIds, id],
  })),

  applyStatDeltas: (deltas) => set((state) => {
    const next: PlayerStats = { ...state.stats }
    for (const [key, delta] of Object.entries(deltas)) {
      if (key in next && typeof delta === 'number') {
        (next as Record<string, number>)[key] = clampStat(next[key as StatKey] + delta)
      }
    }
    return { stats: next }
  }),

  addXp: (amount) => set((state) => {
    const xp = state.xp + amount
    return { xp, rank: rankFromXp(xp) }
  }),

  incrementStreak: () => set((state) => ({
    streak: state.streak + 1,
    lastPlayedDate: new Date().toISOString().slice(0, 10),
  })),

  addWrongQuestion: (id) => set((state) => ({
    wrongQuestionIds: state.wrongQuestionIds.includes(id)
      ? state.wrongQuestionIds
      : [...state.wrongQuestionIds, id],
  })),
  removeWrongQuestion: (id) => set((state) => ({
    wrongQuestionIds: state.wrongQuestionIds.filter((x) => x !== id),
  })),

  reset: () => set({
    hasCompletedOnboarding: false,
    graduationYear: null,
    accountingExperience: null,
    hasSeenMapIntro: false,
    hasSeenMapTutorial: false,
    hasSeenWallStreetIntro: false,
    lastRecallDate: null,
    completedConceptIds: [],
    stats: { ...INITIAL_STATS },
    rank: 'candidate',
    xp: 0,
    streak: 0,
    lastPlayedDate: null,
    wrongQuestionIds: [],
  }),
}))
