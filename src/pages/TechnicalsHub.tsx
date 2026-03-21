import { Link } from 'react-router-dom'
import { usePlayerStore } from '@/store/playerStore'
import modulesIndex from '@/data/learning/modules-index.json'
import type { LearningModule } from '@/types/learning'
import { BackToMap } from '@/components/BackToMap'
import { getPlayableTopics } from '@/lib/quizTopics'

const PLAYABLE_TOPIC_IDS = new Set(getPlayableTopics().map((t) => t.id))

const modules = (modulesIndex as { modules: LearningModule[] }).modules.sort((a, b) => a.order - b.order)

export function TechnicalsHub() {
  const lastRecallDate = usePlayerStore((s) => s.lastRecallDate)
  const completedConceptIds = usePlayerStore((s) => s.completedConceptIds)
  const today = new Date().toISOString().slice(0, 10)
  const recallDoneToday = lastRecallDate === today
  const hasLearnedSomething = completedConceptIds.length > 0

  return (
    <div style={styles.screen}>
      <BackToMap style={styles.backBar} />
      <div style={styles.header}>
        <h1 style={styles.title}>Technicals</h1>
        <p style={styles.subtitle}>
          Follow the path. Each node is a lesson — concepts, why it matters, and a check.
        </p>
      </div>

      {!recallDoneToday && hasLearnedSomething && (
        <Link to="/recall" style={styles.recallCard}>
          <span style={styles.recallLabel}>Daily recall</span>
          <p style={styles.recallText}>Keep your streak — a few quick questions from what you have learned.</p>
        </Link>
      )}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Roadmap</h2>
        <div style={styles.roadmap}>
          {modules.map((m, i) => {
            const isUnlocked = i === 0 || (i > 0 && hasLearnedSomething)
            const Comp = isUnlocked ? Link : 'div'
            const linkProps = isUnlocked ? { to: `/technicals/${m.slug}` as const } : {}
            const quizTopic = (m as LearningModule & { quizTopic?: string }).quizTopic
            const hasDrill = isUnlocked && quizTopic != null && PLAYABLE_TOPIC_IDS.has(quizTopic)
            return (
              <div key={m.id} style={styles.roadmapRow}>
                {i > 0 && <div style={styles.connector} />}
                <div style={styles.nodeWrap}>
                  <Comp
                    {...linkProps}
                    style={{
                      ...styles.node,
                      ...(isUnlocked ? styles.nodeUnlocked : styles.nodeLocked),
                    }}
                  >
                    <span style={styles.nodeNumber}>{i + 1}</span>
                    <span style={styles.nodeTitle}>{m.title}</span>
                  </Comp>
                  {hasDrill && quizTopic && (
                    <Link to={`/quiz?topic=${quizTopic}`} style={styles.drillTag}>
                      Practice
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section style={styles.section}>
        <Link to="/quiz" style={styles.reviewBtn}>
          Practice drill (mixed questions)
        </Link>
      </section>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: '100vh',
    padding: 24,
    paddingTop: 60,
    background: 'var(--color-bg)',
  },
  backBar: {
    marginBottom: 12,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.75rem',
    margin: '0 0 8px',
  },
  subtitle: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    color: 'var(--color-text-muted)',
    lineHeight: 1.5,
    margin: 0,
  },
  recallCard: {
    display: 'block',
    padding: 20,
    marginBottom: 24,
    background: 'rgba(107, 154, 196, 0.12)',
    border: '1px solid var(--color-sky)',
    borderRadius: 12,
    textDecoration: 'none',
    color: 'inherit',
  },
  recallLabel: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-sky)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  recallText: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    margin: '8px 0 0',
    color: 'var(--color-text)',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1rem',
    fontWeight: 600,
    margin: '0 0 16px',
  },
  roadmap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    alignItems: 'center',
  },
  roadmapRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  nodeWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  drillTag: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.6875rem',
    fontWeight: 600,
    color: 'var(--color-ochre)',
    textDecoration: 'none',
    border: '1px solid var(--color-ochre)',
    borderRadius: 20,
    padding: '2px 10px',
    letterSpacing: '0.03em',
  },
  connector: {
    width: 2,
    height: 24,
    background: 'var(--color-border)',
    borderRadius: 1,
  },
  node: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: '50%',
    textDecoration: 'none',
    color: 'inherit',
    border: '3px solid',
    boxSizing: 'border-box',
  },
  nodeUnlocked: {
    background: 'var(--color-bg-elevated)',
    borderColor: 'var(--color-sky)',
    color: 'var(--color-text)',
  },
  nodeLocked: {
    background: 'var(--color-bg)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text-muted)',
    cursor: 'default',
  },
  nodeNumber: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1.25rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  nodeTitle: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.625rem',
    fontWeight: 600,
    textAlign: 'center',
    lineHeight: 1.2,
    marginTop: 2,
    maxWidth: 64,
  },
  reviewBtn: {
    display: 'inline-block',
    padding: '12px 20px',
    background: 'var(--color-ochre)',
    color: '#fff',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '0.9375rem',
    textDecoration: 'none',
    borderRadius: 10,
  },
}
