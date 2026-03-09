import { Link } from 'react-router-dom'

export function OnboardingHook() {
  return (
    <div style={styles.screen}>
      <div style={styles.content}>
        <h1 style={styles.logo}>Bread</h1>
        <p style={styles.tagline}>
          Just starting out? Get exposure to the finance world and learn what it's about — at your own pace. No background needed.
        </p>
        <Link to="/onboarding/riley" style={styles.cta}>
          Get started
        </Link>
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
  content: {
    textAlign: 'center',
    maxWidth: 400,
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '3rem',
    fontWeight: 700,
    margin: '0 0 20px',
    color: 'var(--color-text)',
  },
  tagline: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1.125rem',
    color: 'var(--color-text-muted)',
    marginBottom: 32,
    lineHeight: 1.6,
  },
  cta: {
    display: 'inline-block',
    padding: '14px 28px',
    background: 'var(--color-ochre)',
    color: '#fff',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '1rem',
    textDecoration: 'none',
    borderRadius: 8,
  },
}
