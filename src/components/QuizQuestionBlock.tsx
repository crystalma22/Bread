import { useState, useMemo } from 'react'
import type {
  QuizQuestion,
  UserAnswer,
  MultipleChoiceQuestion,
  MultipleSelectQuestion,
  OrderingQuestion,
  MatchingQuestion,
} from '@/types/quiz'

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

interface QuizQuestionBlockProps {
  question: QuizQuestion
  onSubmit: (answer: UserAnswer) => void
  disabled?: boolean
  styles: Record<string, React.CSSProperties>
}

export function QuizQuestionBlock({
  question,
  onSubmit,
  disabled = false,
  styles,
}: QuizQuestionBlockProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [fillText, setFillText] = useState('')
  const [order, setOrder] = useState<string[]>(() =>
    question.format === 'ordering' ? shuffle([...question.items]) : []
  )
  const [matches, setMatches] = useState<Record<string, string>>({})

  const handleMultipleChoice = (id: string) => {
    if (disabled) return
    setSelectedId(id)
    onSubmit(id)
  }

  const handleMultipleSelectToggle = (id: string) => {
    if (disabled) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleMultipleSelectSubmit = () => {
    if (disabled) return
    onSubmit([...selectedIds])
  }

  const handleTrueFalse = (value: 'true' | 'false') => {
    if (disabled) return
    onSubmit(value)
  }

  const handleFillBlankSubmit = () => {
    if (disabled) return
    onSubmit(fillText)
  }

  const moveItem = (index: number, dir: 1 | -1) => {
    if (question.format !== 'ordering' || disabled) return
    const newIndex = index + dir
    if (newIndex < 0 || newIndex >= order.length) return
    setOrder((prev) => {
      const next = [...prev]
      ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
      return next
    })
  }

  const handleOrderingSubmit = () => {
    if (disabled) return
    onSubmit(order)
  }

  const rightOptions = useMemo(() => {
    if (question.format !== 'matching') return []
    return shuffle(question.pairs.map((p) => p.right))
  }, [question])

  const handleMatchSelect = (left: string, right: string) => {
    if (disabled) return
    setMatches((prev) => ({ ...prev, [left]: right }))
  }

  const handleMatchingSubmit = () => {
    if (disabled || question.format !== 'matching') return
    const pairs = question.pairs.map((p) => ({
      left: p.left,
      right: matches[p.left] ?? '',
    }))
    onSubmit(pairs)
  }

  if (question.format === 'multiple_choice') {
    const q = question as MultipleChoiceQuestion
    return (
      <div style={styles.optionsBlock}>
        {q.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleMultipleChoice(opt.id)}
            disabled={disabled}
            style={{
              ...styles.optionBtn,
              ...(selectedId === opt.id ? styles.optionBtnSelected : {}),
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    )
  }

  if (question.format === 'multiple_select') {
    const q = question as MultipleSelectQuestion
    return (
      <div style={styles.optionsBlock}>
        {q.options.map((opt) => (
          <label key={opt.id} style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedIds.has(opt.id)}
              onChange={() => handleMultipleSelectToggle(opt.id)}
              disabled={disabled}
              style={styles.checkbox}
            />
            <span>{opt.label}</span>
          </label>
        ))}
        <button
          type="button"
          onClick={handleMultipleSelectSubmit}
          disabled={disabled || selectedIds.size === 0}
          style={styles.submitBtn}
        >
          Submit
        </button>
      </div>
    )
  }

  if (question.format === 'true_false') {
    return (
      <div style={styles.optionsBlock}>
        <button
          type="button"
          onClick={() => handleTrueFalse('true')}
          disabled={disabled}
          style={styles.optionBtn}
        >
          True
        </button>
        <button
          type="button"
          onClick={() => handleTrueFalse('false')}
          disabled={disabled}
          style={styles.optionBtn}
        >
          False
        </button>
      </div>
    )
  }

  if (question.format === 'fill_blank') {
    return (
      <div style={styles.optionsBlock}>
        <input
          type="text"
          value={fillText}
          onChange={(e) => setFillText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFillBlankSubmit()}
          placeholder="Type your answer..."
          disabled={disabled}
          style={styles.fillInput}
        />
        <button
          type="button"
          onClick={handleFillBlankSubmit}
          disabled={disabled || !fillText.trim()}
          style={styles.submitBtn}
        >
          Submit
        </button>
      </div>
    )
  }

  if (question.format === 'ordering') {
    const q = question as OrderingQuestion
    return (
      <div style={styles.optionsBlock}>
        <p style={styles.orderHint}>Put in order (use arrows to move):</p>
        {order.map((item, i) => (
          <div key={i} style={styles.orderRow}>
            <span style={styles.orderNum}>{i + 1}.</span>
            <span style={styles.orderItem}>{item}</span>
            <span style={styles.orderControls}>
              <button
                type="button"
                onClick={() => moveItem(i, -1)}
                disabled={disabled || i === 0}
                style={styles.orderBtn}
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveItem(i, 1)}
                disabled={disabled || i === order.length - 1}
                style={styles.orderBtn}
                aria-label="Move down"
              >
                ↓
              </button>
            </span>
          </div>
        ))}
        <button
          type="button"
          onClick={handleOrderingSubmit}
          disabled={disabled}
          style={styles.submitBtn}
        >
          Submit order
        </button>
      </div>
    )
  }

  if (question.format === 'matching') {
    const q = question as MatchingQuestion
    return (
      <div style={styles.optionsBlock}>
        <p style={styles.orderHint}>Match each item on the left to the correct item on the right:</p>
        {q.pairs.map((p) => (
          <div key={p.left} style={styles.matchRow}>
            <span style={styles.matchLeft}>{p.left}</span>
            <select
              value={matches[p.left] ?? ''}
              onChange={(e) => handleMatchSelect(p.left, e.target.value)}
              disabled={disabled}
              style={styles.matchSelect}
            >
              <option value="">—</option>
              {rightOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={handleMatchingSubmit}
          disabled={disabled || Object.keys(matches).length < q.pairs.length}
          style={styles.submitBtn}
        >
          Submit matches
        </button>
      </div>
    )
  }

  return null
}
