/** Supported question formats (Khan Academy / Duolingo / Quizlet style). */
export type QuizFormat =
  | 'flash_q'           // concept → question → reveal answer
  | 'multiple_choice'   // pick one
  | 'multiple_select'   // check all that apply
  | 'true_false'        // True / False
  | 'fill_blank'        // type the answer
  | 'ordering'          // put items in correct order
  | 'matching'          // match left column to right

export interface QuizOption {
  id: string
  label: string
}

/** Flash card: show concept, question, then reveal answer. */
export interface FlashQQuestion {
  id: string
  format: 'flash_q'
  topic: string
  concept?: string
  question: string
  correctAnswer: string
  options?: string[]
  mistake?: string
}

/** Single correct option. */
export interface MultipleChoiceQuestion {
  id: string
  format: 'multiple_choice'
  topic: string
  concept?: string
  question: string
  options: QuizOption[]
  correctAnswer: string // option id
}

/** Multiple correct options (check all that apply). */
export interface MultipleSelectQuestion {
  id: string
  format: 'multiple_select'
  topic: string
  concept?: string
  question: string
  options: QuizOption[]
  correctAnswers: string[] // option ids
}

/** True or False. */
export interface TrueFalseQuestion {
  id: string
  format: 'true_false'
  topic: string
  concept?: string
  question: string
  correctAnswer: 'true' | 'false'
}

/** Type the answer (exact or acceptable list). */
export interface FillBlankQuestion {
  id: string
  format: 'fill_blank'
  topic: string
  concept?: string
  question: string
  correctAnswer: string
  acceptableAnswers?: string[] // optional alternates for grading
}

/** Put items in correct order. */
export interface OrderingQuestion {
  id: string
  format: 'ordering'
  topic: string
  concept?: string
  question: string
  items: string[] // correct order
}

/** Match each left item to the correct right item. */
export interface MatchingQuestion {
  id: string
  format: 'matching'
  topic: string
  concept?: string
  question: string
  pairs: { left: string; right: string }[] // correct pairs (shuffled at runtime)
}

export type QuizQuestion =
  | FlashQQuestion
  | MultipleChoiceQuestion
  | MultipleSelectQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | OrderingQuestion
  | MatchingQuestion

export interface QuizSession {
  questionIds: string[]
  correctCount: number
  totalCount: number
  wrongIds: string[]
}

/** Returns the correct answer as a string for display (e.g. in "Show answer" or recall). */
export function getDisplayAnswer(q: QuizQuestion): string {
  switch (q.format) {
    case 'flash_q':
      return q.correctAnswer
    case 'multiple_choice': {
      const opt = q.options.find((o) => o.id === q.correctAnswer)
      return opt ? opt.label : q.correctAnswer
    }
    case 'multiple_select': {
      const labels = q.correctAnswers
        .map((id) => q.options.find((o) => o.id === id)?.label)
        .filter(Boolean)
      return labels.join('; ')
    }
    case 'true_false':
      return q.correctAnswer === 'true' ? 'True' : 'False'
    case 'fill_blank':
      return q.correctAnswer
    case 'ordering':
      return q.items.map((item, i) => `${i + 1}. ${item}`).join('\n')
    case 'matching':
      return q.pairs.map((p) => `${p.left} → ${p.right}`).join('\n')
    default:
      return ''
  }
}

/** Whether this format is "interactive" (user submits answer, then we show correct/incorrect). */
export function isInteractiveFormat(
  q: QuizQuestion
): q is
  | MultipleChoiceQuestion
  | MultipleSelectQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | OrderingQuestion
  | MatchingQuestion {
  return (
    q.format === 'multiple_choice' ||
    q.format === 'multiple_select' ||
    q.format === 'true_false' ||
    q.format === 'fill_blank' ||
    q.format === 'ordering' ||
    q.format === 'matching'
  )
}

/** User answer payload for interactive formats. */
export type UserAnswer =
  | string
  | string[]
  | { left: string; right: string }[]

/** Returns true if the user's answer is correct. */
export function checkAnswer(q: QuizQuestion, userAnswer: UserAnswer): boolean {
  switch (q.format) {
    case 'flash_q':
      return true
    case 'multiple_choice':
      return (userAnswer as string) === q.correctAnswer
    case 'multiple_select': {
      const a = (userAnswer as string[]).slice().sort()
      const c = q.correctAnswers.slice().sort()
      return a.length === c.length && a.every((id, i) => id === c[i])
    }
    case 'true_false':
      return (userAnswer as string) === q.correctAnswer
    case 'fill_blank': {
      const raw = (userAnswer as string).trim().toLowerCase()
      const correct = q.correctAnswer.trim().toLowerCase()
      if (raw === correct) return true
      const acceptable = q.acceptableAnswers?.map((s) => s.trim().toLowerCase()) ?? []
      return acceptable.some((s) => s === raw)
    }
    case 'ordering': {
      const a = userAnswer as string[]
      return a.length === q.items.length && a.every((item, i) => item === q.items[i])
    }
    case 'matching': {
      const pairs = userAnswer as { left: string; right: string }[]
      const correctSet = new Set(q.pairs.map((p) => `${p.left}\t${p.right}`))
      return (
        pairs.length === q.pairs.length &&
        pairs.every((p) => correctSet.has(`${p.left}\t${p.right}`))
      )
    }
    default:
      return false
  }
}
