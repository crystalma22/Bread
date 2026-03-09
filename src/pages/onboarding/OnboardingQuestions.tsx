import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayerStore } from '@/store/playerStore'

const GRAD_YEARS = [2027, 2028, 2029, 2030, 2031]
const ACCOUNTING_OPTIONS = [
  { value: 'no' as const, label: 'No' },
  { value: 'a_little' as const, label: 'A little' },
  { value: 'yes' as const, label: 'Yes' },
] as const

export function OnboardingQuestions() {
  const navigate = useNavigate()
  const [gradYear, setGradYear] = useState<number | null>(null)
  const [accounting, setAccounting] = useState<'yes' | 'a_little' | 'no' | null>(null)

  const canContinue = gradYear !== null && accounting !== null

  const setOnboardingAnswers = usePlayerStore((s) => s.setOnboardingAnswers)

  const handleContinue = () => {
    if (!canContinue) return
    setOnboardingAnswers(gradYear!, accounting!)
    navigate('/onboarding/choose-track')
  }

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <p style={styles.context}>
          A couple quick questions so we can meet you where you are. No wrong answers — whether you're a freshman or further along.
        </p>
        <p style={styles.label}>When do you graduate?</p>
        <div style={styles.options}>
          {GRAD_YEARS.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setGradYear(y)}
              style={{
                ...styles.optionBtn,
                ...(gradYear === y ? styles.optionBtnActive : {}),
              }}
            >
              {y}
            </button>
          ))}
        </div>
        <p style={styles.label}>Have you studied accounting or finance before?</p>
        <div style={styles.options}>
          {ACCOUNTING_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setAccounting(value)}
              style={{
                ...styles.optionBtn,
                ...(accounting === value ? styles.optionBtnActive : {}),
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <p style={styles.hint}>No worries if not — we'll start from the basics.</p>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          style={{
            ...styles.cta,
            ...(canContinue ? {} : styles.ctaDisabled),
          }}
        >
          Continue
        </button>
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
    maxWidth: 420,
    background: 'var(--color-bg-elevated)',
    padding: 32,
    borderRadius: 12,
    border: '1px solid var(--color-border)',
  },
  context: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    color: 'var(--color-text-muted)',
    marginBottom: 20,
    lineHeight: 1.5,
  },
  label: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--color-text)',
    marginBottom: 8,
  },
  options: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  optionBtn: {
    padding: '10px 16px',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    cursor: 'pointer',
  },
  optionBtnActive: {
    background: 'var(--color-sky)',
    color: '#fff',
    borderColor: 'var(--color-sky)',
  },
  hint: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.8125rem',
    color: 'var(--color-text-muted)',
    marginTop: -8,
    marginBottom: 20,
  },
  cta: {
    padding: '12px 24px',
    background: 'var(--color-ochre)',
    color: '#fff',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '1rem',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  ctaDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}
