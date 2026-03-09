import { Link, useParams } from 'react-router-dom'
import modulesIndex from '@/data/learning/modules-index.json'
import type { LearningModule } from '@/types/learning'
import { BackToMap } from '@/components/BackToMap'

const modules = (modulesIndex as { modules: LearningModule[] }).modules

export function LessonView() {
  const { slug } = useParams<{ slug: string }>()
  const module = modules.find((m) => m.slug === slug)

  if (!module) {
    return (
      <div style={styles.screen}>
        <BackToMap style={styles.backBar} />
        <div style={styles.card}>
          <p style={styles.body}>Module not found.</p>
          <Link to="/technicals" style={styles.backLink}>← Back to Technicals</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.screen}>
      <BackToMap style={styles.backBar} />
      <div style={styles.card}>
        <h1 style={styles.title}>{module.title}</h1>
        {module.description && <p style={styles.desc}>{module.description}</p>}
        <p style={styles.comingSoon}>
          Segmented lessons with concepts, “why it matters,” and interactive checks are coming next. For now, use the practice drill to reinforce.
        </p>
        <Link to="/quiz" style={styles.cta}>Practice drill</Link>
        <Link to="/technicals" style={styles.backLink}>← Back to Technicals</Link>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: '100vh',
    padding: 24,
    background: 'var(--color-bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backBar: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  card: {
    maxWidth: 480,
    width: '100%',
    padding: 28,
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 16,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    margin: '0 0 12px',
  },
  desc: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    color: 'var(--color-text-muted)',
    lineHeight: 1.5,
    margin: '0 0 20px',
  },
  comingSoon: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    lineHeight: 1.5,
    margin: '0 0 24px',
    color: 'var(--color-text-muted)',
  },
  cta: {
    display: 'inline-block',
    padding: '12px 20px',
    marginBottom: 16,
    background: 'var(--color-sky)',
    color: '#fff',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '0.9375rem',
    textDecoration: 'none',
    borderRadius: 10,
  },
  backLink: {
    display: 'block',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    color: 'var(--color-text-muted)',
    textDecoration: 'none',
  },
  body: {
    margin: '0 0 16px',
  },
}
