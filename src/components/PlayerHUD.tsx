import { usePlayerStore } from '@/store/playerStore'
import { RANK_LABELS, RANK_THRESHOLDS, RANK_ORDER, xpToNextRank } from '@/types/player'

/** Small heads-up bar for XP, rank, and streak. Sits fixed at top of the phone frame. */
export function PlayerHUD() {
  const xp = usePlayerStore((s) => s.xp)
  const rank = usePlayerStore((s) => s.rank)
  const streak = usePlayerStore((s) => s.streak)

  const { nextRank, xpNeeded } = xpToNextRank(xp)
  const currentThreshold = RANK_THRESHOLDS[rank]
  const nextThreshold = nextRank ? RANK_THRESHOLDS[nextRank] : RANK_THRESHOLDS[rank]
  const rangeSize = nextThreshold - currentThreshold
  const progressInRange = xp - currentThreshold
  const pct = rangeSize > 0 ? Math.min(100, (progressInRange / rangeSize) * 100) : 100
  const rankIdx = RANK_ORDER.indexOf(rank)

  return (
    <div style={styles.hud} aria-label={`Rank: ${RANK_LABELS[rank]}, ${xp} XP, ${streak} day streak`}>
      <div style={styles.left}>
        <span style={styles.rankBadge}>{RANK_LABELS[rank]}</span>
        <div style={styles.xpRow}>
          <div style={styles.xpBarTrack} aria-hidden>
            <div style={{ ...styles.xpBarFill, width: `${pct}%` }} />
          </div>
          <span style={styles.xpText}>{xp} XP</span>
        </div>
        {nextRank && (
          <span style={styles.nextRank}>{xpNeeded} XP to {RANK_LABELS[nextRank]}</span>
        )}
      </div>
      <div style={styles.right}>
        {streak > 0 && (
          <div style={styles.streakPill} title={`${streak} day streak`}>
            <span style={styles.streakIcon}>🔥</span>
            <span style={styles.streakCount}>{streak}</span>
          </div>
        )}
        <div style={styles.rankDots} aria-hidden>
          {RANK_ORDER.map((r, i) => (
            <div
              key={r}
              style={{
                ...styles.dot,
                ...(i <= rankIdx ? styles.dotFilled : styles.dotEmpty),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  hud: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    background: 'rgba(245, 242, 236, 0.92)',
    backdropFilter: 'blur(6px)',
    borderBottom: '1px solid var(--color-border)',
    pointerEvents: 'none',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0,
  },
  rankBadge: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.6875rem',
    fontWeight: 700,
    color: 'var(--color-ochre)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  xpRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  xpBarTrack: {
    width: 80,
    height: 5,
    background: 'var(--color-border)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    background: 'var(--color-ochre)',
    borderRadius: 3,
    transition: 'width 0.4s ease',
  },
  xpText: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  nextRank: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.625rem',
    color: 'var(--color-text-muted)',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  streakPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    background: 'rgba(196, 163, 90, 0.12)',
    borderRadius: 20,
    padding: '2px 8px',
  },
  streakIcon: {
    fontSize: '0.75rem',
    lineHeight: 1,
  },
  streakCount: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--color-ochre)',
  },
  rankDots: {
    display: 'flex',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
  },
  dotFilled: {
    background: 'var(--color-ochre)',
  },
  dotEmpty: {
    background: 'var(--color-border)',
  },
}
