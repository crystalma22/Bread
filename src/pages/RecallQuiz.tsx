import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { QuizQuestion } from '@/types/quiz'
import { getDisplayAnswer } from '@/types/quiz'
import { BackToMap } from '@/components/BackToMap'
import { usePlayerStore } from '@/store/playerStore'
import quizAccounting from '@/data/quiz-accounting.json'

const POOL = quizAccounting as QuizQuestion[]
const RECALL_COUNT = 4
const XP_PER_RECALL = 5

function pickRecallQuestions(wrongIds: string[], count: number): QuizQuestion[] {
  const wrong = POOL.filter((q) => wrongIds.includes(q.id))
  const rest = POOL.filter((q) => !wrongIds.includes(q.id))
  const fromWrong = wrong.slice(0, Math.min(2, wrong.length, count))
  const need = count - fromWrong.length
  const fromRest = rest.slice(0, need)
  return [...fromWrong, ...fromRest]
}

export function RecallQuiz() {
  const navigate = useNavigate()
  const wrongQuestionIds = usePlayerStore((s) => s.wrongQuestionIds)
  const addXp = usePlayerStore((s) => s.addXp)
  const incrementStreak = usePlayerStore((s) => s.incrementStreak)
  const setLastRecallDate = usePlayerStore((s) => s.setLastRecallDate)
  const addWrongQuestion = usePlayerStore((s) => s.addWrongQuestion)
  const removeWrongQuestion = usePlayerStore((s) => s.removeWrongQuestion)
  const applyStatDeltas = usePlayerStore((s) => s.applyStatDeltas)

  const questions = useMemo(
    () => pickRecallQuestions(wrongQuestionIds, RECALL_COUNT),
    [wrongQuestionIds]
  )

  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)

  const question = questions[index]
  const isLast = index >= questions.length - 1
  const hasQuestions = questions.length > 0

  const finishRecall = () => {
    setLastRecallDate(new Date().toISOString().slice(0, 10))
    incrementStreak()
    navigate('/map', { replace: true })
  }

  const handleGotIt = () => {
    removeWrongQuestion(question.id)
    addXp(XP_PER_RECALL)
    applyStatDeltas({ technicalSkill: 1 })
    setCorrectCount((c) => c + 1)
    setShowAnswer(false)
    if (isLast) setDone(true)
    else setIndex((i) => i + 1)
  }

  const handleReviewAgain = () => {
    addWrongQuestion(question.id)
    setShowAnswer(false)
    if (isLast) setDone(true)
    else setIndex((i) => i + 1)
  }

  if (!hasQuestions) {
    return (
      <div style={styles.screen}>
        <BackToMap style={styles.backBar} />
        <div style={styles.card}>
          <h1 style={styles.title}>Daily recall</h1>
          <p style={styles.body}>Nothing to review yet. Go learn something new and come back tomorrow to keep your streak.</p>
          <button type="button" onClick={finishRecall} style={styles.cta}>
            Go to map
          </button>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div style={styles.screen}>
        <BackToMap style={styles.backBar} />
        <div style={styles.card}>
          <h1 style={styles.title}>Recall done</h1>
          <p style={styles.body}>You got {correctCount} of {questions.length} right. Keep your streak going — see you tomorrow.</p>
          <button type="button" onClick={finishRecall} style={styles.cta}>
            Go to map
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.screen}>
      <BackToMap style={styles.backBar} />
      <div style={styles.card}>
        <p style={styles.badge}>Daily recall ({index + 1}/{questions.length})</p>
        <p style={styles.prompt}>{question.question}</p>
        {!showAnswer ? (
          <button type="button" onClick={() => setShowAnswer(true)} style={styles.showAnswerBtn}>
            Show answer
          </button>
        ) : (
          <>
            <div style={styles.answerBox}>
              <p style={styles.answerLabel}>Answer</p>
              <p style={styles.answerText}>{getDisplayAnswer(question)}</p>
            </div>
            <div style={styles.actions}>
              <button type="button" onClick={handleGotIt} style={styles.gotItBtn}>Got it</button>
              <button type="button" onClick={handleReviewAgain} style={styles.reviewBtn}>Review again</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: '100vh',
    padding: 24,
    paddingTop: 60,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'var(--color-bg)',
  },
  backBar: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  card: {
    maxWidth: 400,
    width: '100%',
    padding: 28,
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    margin: '0 0 16px',
  },
  body: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1rem',
    lineHeight: 1.6,
    color: 'var(--color-text-muted)',
    margin: '0 0 24px',
  },
  badge: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-sky)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 12px',
  },
  prompt: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1.0625rem',
    lineHeight: 1.5,
    margin: '0 0 20px',
    color: 'var(--color-text)',
  },
  showAnswerBtn: {
    padding: '12px 20px',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '1rem',
    background: 'var(--color-sky)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
  },
  answerBox: {
    padding: 16,
    background: 'var(--color-bg)',
    borderRadius: 10,
    marginBottom: 16,
  },
  answerLabel: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    margin: '0 0 8px',
  },
  answerText: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    lineHeight: 1.5,
    margin: 0,
    color: 'var(--color-text)',
  },
  actions: {
    display: 'flex',
    gap: 12,
  },
  gotItBtn: {
    flex: 1,
    padding: '12px 20px',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '0.9375rem',
    background: 'var(--color-sage)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
  },
  reviewBtn: {
    flex: 1,
    padding: '12px 20px',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '0.9375rem',
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
    borderRadius: 10,
    cursor: 'pointer',
  },
  cta: {
    display: 'block',
    width: '100%',
    padding: '14px 20px',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '1rem',
    background: 'var(--color-sky)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
  },
}
