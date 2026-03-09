import { useNavigate } from 'react-router-dom'
import { usePlayerStore } from '@/store/playerStore'

export function OnboardingChooseTrack() {
  const navigate = useNavigate()
  const setOnboardingComplete = usePlayerStore((s) => s.setOnboardingComplete)

  const handleNetworking = () => {
    navigate('/onboarding/coffee')
  }

  const handleTechnicals = () => {
    setOnboardingComplete()
    navigate('/quiz')
  }

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <p style={styles.speaker}>Riley</p>
        <p style={styles.text}>
          What do you want to try first? You can explore the other track anytime from Finance City — go at your own pace.
        </p>
        <div style={styles.tracks}>
          <button type="button" onClick={handleNetworking} style={styles.trackBtn}>
            <span style={styles.trackTitle}>Networking</span>
            <span style={styles.trackDesc}>
              Practice a conversation — the kind you'd have when you reach out to someone in the industry. I'll play the banker; you practice your answers. Low pressure.
            </span>
          </button>
          <button type="button" onClick={handleTechnicals} style={styles.trackBtn}>
            <span style={styles.trackTitle}>Technicals</span>
            <span style={styles.trackDesc}>
              Short drill on accounting and the three statements. All the technical questions fit under this track. Start with the basics and go from there — no prior knowledge needed.
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: '100vh',
    background: 'var(--color-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    maxWidth: 500,
    background: 'var(--color-bg-elevated)',
    padding: 32,
    borderRadius: 12,
    border: '1px solid var(--color-border)',
  },
  speaker: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-sky)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 12px',
  },
  text: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1rem',
    lineHeight: 1.6,
    margin: '0 0 24px',
    color: 'var(--color-text)',
  },
  tracks: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  trackBtn: {
    display: 'block',
    textAlign: 'left',
    padding: 20,
    background: 'var(--color-bg)',
    border: '2px solid var(--color-border)',
    borderRadius: 10,
    cursor: 'pointer',
  },
  trackTitle: {
    display: 'block',
    fontFamily: 'var(--font-ui)',
    fontSize: '1.0625rem',
    fontWeight: 600,
    color: 'var(--color-text)',
    marginBottom: 6,
  },
  trackDesc: {
    display: 'block',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
    lineHeight: 1.5,
  },
}
