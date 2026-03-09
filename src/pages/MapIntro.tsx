import { useState } from 'react'
import { getNpc } from '@/lib/npcs'
import { NPCDialogueView } from '@/components/NPCDialogueView'

const RILEY = getNpc('riley')

const MAP_INTRO_CHUNKS = [
  'Welcome to Finance City.',
  "This is your home base — a map of the world you're stepping into.",
  "Here you'll explore the main areas of finance recruiting: networking and technicals.",
  "Networking is meeting people, coffee chats, and storytelling. Technicals is accounting, valuation, and the skills you'll need in interviews.",
  'Tap through the map to get oriented. When you\'re ready, we\'ll show you where to start.',
]

const HINT = '(click anywhere to continue)'

interface MapIntroProps {
  onContinue: () => void
}

export function MapIntro({ onContinue }: MapIntroProps) {
  const [step, setStep] = useState(0)
  const chunk = MAP_INTRO_CHUNKS[step]
  const isLast = step === MAP_INTRO_CHUNKS.length - 1

  const handleAdvance = () => {
    if (isLast) onContinue()
    else setStep((s) => s + 1)
  }

  return (
    <div
      style={styles.screen}
      onClick={handleAdvance}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAdvance(); }}
      aria-label="Continue"
    >
      {RILEY ? (
        <NPCDialogueView npc={RILEY} hint={HINT} avatarSize={88}>
          <p style={styles.text}>{chunk}</p>
        </NPCDialogueView>
      ) : (
        <div style={styles.fallbackCard}>
          <p style={styles.text}>{chunk}</p>
          <p style={styles.hint}>{HINT}</p>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: 'var(--color-bg)',
    cursor: 'pointer',
  },
  text: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1rem',
    lineHeight: 1.6,
    color: 'var(--color-text)',
    margin: 0,
  },
  fallbackCard: {
    maxWidth: 360,
    padding: 28,
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  hint: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.8125rem',
    color: 'var(--color-text-muted)',
    margin: '12px 0 0',
    fontStyle: 'italic',
  },
}
