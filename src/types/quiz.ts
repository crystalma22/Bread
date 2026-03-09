export type QuizFormat = 'flash_q' | 'spot_the_mistake' | 'mental_math'

export interface QuizQuestion {
  id: string
  format: QuizFormat
  topic: string
  /** Optional 1–2 sentence bite-sized concept to learn before the question */
  concept?: string
  question: string
  /** Correct answer or correct option id for multiple choice */
  correctAnswer: string
  options?: string[]
  /** For spot-the-mistake: the erroneous statement */
  mistake?: string
}

export interface QuizSession {
  questionIds: string[]
  correctCount: number
  totalCount: number
  /** For spaced repetition: track wrong answers to resurface */
  wrongIds: string[]
}
