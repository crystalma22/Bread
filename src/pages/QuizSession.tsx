import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { QuizQuestion, UserAnswer } from '@/types/quiz'
import { isInteractiveFormat, checkAnswer, getDisplayAnswer } from '@/types/quiz'
import { BackToMap } from '@/components/BackToMap'
import { QuizQuestionBlock } from '@/components/QuizQuestionBlock'
import { usePlayerStore } from '@/store/playerStore'
import { getQuestionsForTopic, getTopic, DEFAULT_TOPIC_ID } from '@/lib/quizTopics'

const QUESTIONS_PER_SESSION = 5
const XP_PER_QUESTION = 10
const TECHNICAL_STAT_PER_CORRECT = 2

function pickQuestions(
  pool: QuizQuestion[],
  wrongIds: string[],
  count: number
): QuizQuestion[] {
  const wrongPool = pool.filter((q) => wrongIds.includes(q.id))
  const rest = pool.filter((q) => !wrongIds.includes(q.id))
  const fromWrong = wrongPool.slice(0, Math.min(2, wrongPool.length, count))
  const remaining = count - fromWrong.length
  const fromRest = rest.slice(0, remaining)
  return [...fromRest, ...fromWrong]
}

export function QuizSession() {
  const [searchParams] = useSearchParams()
  const topicId = searchParams.get('topic') ?? DEFAULT_TOPIC_ID
  const topic = getTopic(topicId)
  const QUESTIONS = useMemo(() => getQuestionsForTopic(topicId), [topicId])
  const addXp = usePlayerStore((s) => s.addXp)
  const applyStatDeltas = usePlayerStore((s) => s.applyStatDeltas)
  const addWrongQuestion = usePlayerStore((s) => s.addWrongQuestion)
  const removeWrongQuestion = usePlayerStore((s) => s.removeWrongQuestion)
  const addCompletedConcept = usePlayerStore((s) => s.addCompletedConcept)
  const wrongQuestionIds = usePlayerStore((s) => s.wrongQuestionIds)

  // Pick questions once per session so the same 5 are used throughout (wrong IDs updated on "Review again" apply to future sessions).
  const sessionQuestions = useMemo(
    () => pickQuestions(QUESTIONS, wrongQuestionIds, QUESTIONS_PER_SESSION),
    [] // eslint-disable-line react-hooks/exhaustive-deps -- intentional: fixed set for this session
  )

  const [index, setIndex] = useState(0)
  const [showConcept, setShowConcept] = useState(true)
  const [showAnswer, setShowAnswer] = useState(false)
  const [submittedCorrect, setSubmittedCorrect] = useState<boolean | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = sessionQuestions[index]
  const hasConcept = question?.concept?.trim()
  const isLast = index >= sessionQuestions.length - 1
  const isInteractive = question && isInteractiveFormat(question)

  useEffect(() => {
    setSubmittedCorrect(null)
  }, [index])

  const handleGotIt = () => {
    removeWrongQuestion(question.id)
    addXp(XP_PER_QUESTION)
    applyStatDeltas({ technicalSkill: TECHNICAL_STAT_PER_CORRECT })
    setCorrectCount((c) => c + 1)
    setShowAnswer(false)
    setSubmittedCorrect(null)
    setShowConcept(true)
    if (isLast) {
      addCompletedConcept('accounting')
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  const handleReviewAgain = () => {
    addWrongQuestion(question.id)
    setShowAnswer(false)
    setSubmittedCorrect(null)
    setShowConcept(true)
    if (isLast) {
      addCompletedConcept('accounting')
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  const handleInteractiveSubmit = (answer: UserAnswer) => {
    setSubmittedCorrect(checkAnswer(question, answer))
  }

  if (sessionQuestions.length === 0) {
    return (
      <div style={styles.screen}>
        <BackToMap style={styles.backBar} />
        <div style={styles.card}>
          <p style={styles.narrative}>No questions loaded. Add content in quiz-accounting.json.</p>
          <Link to="/map" style={styles.cta}>Back to map</Link>
        </div>
      </div>
    )
  }

  if (finished) {
    const total = sessionQuestions.length
    const xpEarned = correctCount * XP_PER_QUESTION
    return (
      <div style={styles.screen}>
        <BackToMap style={styles.backBar} />
        <div style={styles.card}>
          <h2 style={styles.title}>Drill complete</h2>
          <p style={styles.narrative}>
            You went through {total} bite-sized pieces. Keep coming back — a few at a time is how it sticks.
          </p>
          <p style={styles.xp}>+{xpEarned} XP</p>
          <Link to="/map" style={styles.cta}>Back to Finance City</Link>
        </div>
      </div>
    )
  }

  if (hasConcept && showConcept) {
    return (
      <div style={styles.screen}>
        <BackToMap style={styles.backBar} />
        <div style={styles.card}>
          <p style={styles.badge}>Learn — one piece at a time</p>
          <p style={styles.progress}>
            Concept {index + 1} of {sessionQuestions.length}
          </p>
          <div style={styles.conceptBox}>
            <p style={styles.conceptText}>{question.concept}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowConcept(false)}
            style={styles.showAnswerBtn}
          >
            See question
          </button>
        </div>
      </div>
    )
  }

  const showResult = isInteractive && submittedCorrect !== null
  const displayAnswer = getDisplayAnswer(question)

  return (
    <div style={styles.screen}>
      <BackToMap style={styles.backBar} />
      <div style={styles.card}>
        <p style={styles.badge}>Technicals — {topic?.label ?? 'Practice drill'}</p>
        <p style={styles.progress}>
          Question {index + 1} of {sessionQuestions.length}
        </p>
        <h2 style={styles.question}>{question.question}</h2>
        {isInteractive ? (
          showResult ? (
            <>
              <p style={submittedCorrect ? styles.resultCorrect : styles.resultWrong}>
                {submittedCorrect ? 'Correct!' : 'Not quite.'}
              </p>
              <div style={styles.answerBox}>
                <p style={styles.answerLabel}>Answer</p>
                <p style={styles.answerText}>{displayAnswer}</p>
              </div>
              <div style={styles.actions}>
                <button type="button" onClick={handleGotIt} style={styles.gotItBtn}>
                  Got it
                </button>
                <button type="button" onClick={handleReviewAgain} style={styles.reviewBtn}>
                  Review again
                </button>
              </div>
            </>
          ) : (
            <QuizQuestionBlock
              key={question.id}
              question={question}
              onSubmit={handleInteractiveSubmit}
              styles={quizBlockStyles}
            />
          )
        ) : (
          !showAnswer ? (
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              style={styles.showAnswerBtn}
            >
              Show answer
            </button>
          ) : (
            <>
              <div style={styles.answerBox}>
                <p style={styles.answerLabel}>Answer</p>
                <p style={styles.answerText}>{displayAnswer}</p>
              </div>
              <div style={styles.actions}>
                <button type="button" onClick={handleGotIt} style={styles.gotItBtn}>
                  Got it
                </button>
                <button type="button" onClick={handleReviewAgain} style={styles.reviewBtn}>
                  Review again
                </button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  )
}

const quizBlockStyles: Record<string, React.CSSProperties> = {
  optionsBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 8,
  },
  optionBtn: {
    padding: '14px 20px',
    textAlign: 'left',
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 10,
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    color: 'var(--color-text)',
    cursor: 'pointer',
  },
  optionBtnSelected: {
    borderColor: 'var(--color-sky)',
    background: 'rgba(107, 154, 196, 0.1)',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    color: 'var(--color-text)',
    cursor: 'pointer',
  },
  checkbox: {
    width: 20,
    height: 20,
  },
  submitBtn: {
    alignSelf: 'flex-start',
    padding: '12px 24px',
    background: 'var(--color-ochre)',
    color: '#fff',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '0.9375rem',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  fillInput: {
    padding: '12px 16px',
    fontFamily: 'var(--font-ui)',
    fontSize: '1rem',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    width: '100%',
    boxSizing: 'border-box',
  },
  orderHint: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
    margin: '0 0 8px',
  },
  orderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
  },
  orderNum: {
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    minWidth: 28,
  },
  orderItem: {
    flex: 1,
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
  },
  orderControls: { display: 'flex', gap: 4 },
  orderBtn: {
    padding: '4px 10px',
    fontFamily: 'var(--font-ui)',
    border: '1px solid var(--color-border)',
    borderRadius: 6,
    background: 'var(--color-bg-elevated)',
    cursor: 'pointer',
  },
  matchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 0',
  },
  matchLeft: {
    flex: '0 0 140px',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
  },
  matchSelect: {
    flex: 1,
    padding: '8px 12px',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
  },
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: '100vh',
    background: 'var(--color-bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  backBar: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  card: {
    maxWidth: 560,
    width: '100%',
    background: 'var(--color-bg-elevated)',
    padding: 32,
    borderRadius: 12,
    border: '1px solid var(--color-border)',
  },
  badge: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-sky)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 8px',
  },
  progress: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
    marginBottom: 16,
  },
  conceptBox: {
    background: 'var(--color-bg)',
    borderLeft: '4px solid var(--color-sage)',
    padding: '16px 20px',
    borderRadius: 0,
    marginBottom: 24,
  },
  conceptText: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1rem',
    lineHeight: 1.6,
    color: 'var(--color-text)',
    margin: 0,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    margin: '0 0 16px',
  },
  narrative: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1rem',
    lineHeight: 1.6,
    color: 'var(--color-text-muted)',
    marginBottom: 24,
  },
  question: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    lineHeight: 1.5,
    margin: '0 0 24px',
    color: 'var(--color-text)',
  },
  showAnswerBtn: {
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
  answerBox: {
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  answerLabel: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-sage)',
    textTransform: 'uppercase',
    margin: '0 0 8px',
  },
  answerText: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    color: 'var(--color-text)',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: 12,
  },
  gotItBtn: {
    padding: '12px 24px',
    background: 'var(--color-sage)',
    color: '#fff',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  reviewBtn: {
    padding: '12px 24px',
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    cursor: 'pointer',
  },
  resultCorrect: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--color-sage)',
    margin: '0 0 12px',
  },
  resultWrong: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--color-terracotta)',
    margin: '0 0 12px',
  },
  xp: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--color-ochre)',
    marginBottom: 24,
  },
  cta: {
    display: 'inline-block',
    padding: '12px 24px',
    background: 'var(--color-ochre)',
    color: '#fff',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: 8,
  },
}
