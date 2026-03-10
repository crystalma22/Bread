import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BackToMap } from '@/components/BackToMap'
import type { LearningModule, LearningSection } from '@/types/learning'

// Dynamic module map — add new module files here
import accounting3Statements from '@/data/learning/accounting-3-statements.json'
import advancedAccounting from '@/data/learning/advanced-accounting.json'
import modulesIndex from '@/data/learning/modules-index.json'

const MODULE_CONTENT: Record<string, LearningModule> = {
  'accounting-3-statements': accounting3Statements as LearningModule,
  'advanced-accounting': advancedAccounting as LearningModule,
}

const modules = (modulesIndex as { modules: Array<{ id: string; slug: string; title: string; description?: string; quizTopic: string; order: number }> }).modules

export function LessonView() {
  const { slug } = useParams<{ slug: string }>()
  const meta = modules.find((m) => m.slug === slug)
  const module = slug ? MODULE_CONTENT[slug] : undefined
  const [activeSection, setActiveSection] = useState(0)

  if (!meta) {
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

  if (!module || !module.sections?.length) {
    return (
      <div style={styles.screen}>
        <BackToMap style={styles.backBar} />
        <div style={styles.card}>
          <h1 style={styles.title}>{meta.title}</h1>
          {meta.description && <p style={styles.desc}>{meta.description}</p>}
          <p style={styles.comingSoon}>
            Lesson content for this module is coming soon. Use the practice drill to prep in the meantime.
          </p>
          <Link to={`/quiz?topic=${meta.quizTopic}`} style={styles.cta}>Practice drill</Link>
          <Link to="/technicals" style={styles.backLink}>← Back to Technicals</Link>
        </div>
      </div>
    )
  }

  const section = module.sections[activeSection]
  const isFirst = activeSection === 0
  const isLast = activeSection === module.sections.length - 1

  return (
    <div style={styles.screen}>
      <BackToMap style={styles.backBar} />

      {/* Header */}
      <div style={styles.header}>
        <Link to="/technicals" style={styles.breadcrumb}>Technicals</Link>
        <span style={styles.breadcrumbSep}> / </span>
        <span style={styles.breadcrumbCurrent}>{module.title}</span>
      </div>

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${((activeSection + 1) / module.sections.length) * 100}%`,
          }}
        />
      </div>
      <p style={styles.progressLabel}>
        {activeSection + 1} of {module.sections.length}
      </p>

      {/* Section content */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>{section.title}</h2>
        <div style={styles.sectionBody}>
          {section.body.split('\n').map((line, i) =>
            line.trim() === '' ? (
              <div key={i} style={{ height: 12 }} />
            ) : (
              <p key={i} style={styles.bodyPara}>{line}</p>
            )
          )}
        </div>

        {section.keyPoints && section.keyPoints.length > 0 && (
          <div style={styles.keyPointsBox}>
            <p style={styles.keyPointsLabel}>Key takeaways</p>
            <ul style={styles.keyPointsList}>
              {section.keyPoints.map((kp, i) => (
                <li key={i} style={styles.keyPoint}>{kp}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={styles.navRow}>
        <button
          type="button"
          onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
          disabled={isFirst}
          style={{ ...styles.navBtn, ...(isFirst ? styles.navBtnDisabled : {}) }}
        >
          ← Previous
        </button>
        {isLast ? (
          <Link to={`/quiz?topic=${module.quizTopic}`} style={styles.navBtnPrimary}>
            Practice drill →
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setActiveSection((s) => Math.min(module.sections.length - 1, s + 1))}
            style={styles.navBtnPrimary}
          >
            Next →
          </button>
        )}
      </div>

      {/* Section jump list */}
      <div style={styles.sectionList}>
        {module.sections.map((s: LearningSection, i: number) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(i)}
            style={{
              ...styles.sectionPill,
              ...(i === activeSection ? styles.sectionPillActive : {}),
            }}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: '100vh',
    padding: '60px 20px 32px',
    background: 'var(--color-bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  backBar: {
    marginBottom: 8,
  },
  header: {
    marginBottom: 12,
    fontFamily: 'var(--font-ui)',
    fontSize: '0.8125rem',
    color: 'var(--color-text-muted)',
  },
  breadcrumb: {
    color: 'var(--color-sky)',
    textDecoration: 'none',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.8125rem',
  },
  breadcrumbSep: {
    margin: '0 4px',
  },
  breadcrumbCurrent: {
    color: 'var(--color-text)',
  },
  progressTrack: {
    height: 4,
    background: 'var(--color-border)',
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'var(--color-sage)',
    borderRadius: 2,
    transition: 'width 0.3s ease',
  },
  progressLabel: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    margin: '0 0 16px',
    textAlign: 'right',
  },
  card: {
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.375rem',
    margin: '0 0 16px',
    color: 'var(--color-text)',
  },
  sectionBody: {
    marginBottom: 20,
  },
  bodyPara: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    lineHeight: 1.7,
    color: 'var(--color-text)',
    margin: '0 0 4px',
  },
  keyPointsBox: {
    background: 'var(--color-bg)',
    borderLeft: '3px solid var(--color-sage)',
    borderRadius: '0 8px 8px 0',
    padding: '14px 16px',
  },
  keyPointsLabel: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--color-sage)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 10px',
  },
  keyPointsList: {
    margin: 0,
    paddingLeft: 18,
  },
  keyPoint: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    lineHeight: 1.6,
    color: 'var(--color-text)',
    marginBottom: 4,
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  navBtn: {
    padding: '11px 20px',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '0.9375rem',
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 10,
    cursor: 'pointer',
    color: 'var(--color-text)',
  },
  navBtnDisabled: {
    opacity: 0.35,
    cursor: 'default',
  },
  navBtnPrimary: {
    padding: '11px 20px',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '0.9375rem',
    background: 'var(--color-ochre)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  sectionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  sectionPill: {
    textAlign: 'left',
    padding: '10px 16px',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 10,
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
  },
  sectionPillActive: {
    borderColor: 'var(--color-sage)',
    color: 'var(--color-text)',
    background: 'rgba(125, 155, 118, 0.08)',
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
    fontFamily: 'var(--font-ui)',
  },
}
