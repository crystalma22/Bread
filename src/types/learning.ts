/**
 * Learning modules (from IBIG / content PDFs).
 * Segmented into lessons and concepts: learn concept → why it matters → interactive check → recall later.
 */

export interface LearningSection {
  id: string
  title: string
  /** Body content: plain text or simple HTML/markdown if you add a renderer */
  body: string
  /** Optional key takeaways for review */
  keyPoints?: string[]
}

export interface LearningModule {
  id: string
  /** Short slug for URLs and quiz topic mapping */
  slug: string
  title: string
  /** Source PDF name for reference (e.g. IBIG-04-02-Accounting-3-Statements) */
  sourceDoc?: string
  description?: string
  sections: LearningSection[]
  /** Quiz topic tag: use same value in quiz questions for "learn then quiz" flow */
  quizTopic: string
  order: number
}

/** Single concept within a lesson: explain → why it matters → quick check */
export interface LearningConcept {
  id: string
  title: string
  /** Short explanation of the concept */
  body: string
  /** Why this matters for IB / interviews (relevance) */
  whyItMatters: string
  /** One quick check (e.g. multiple choice) to confirm understanding */
  check?: {
    prompt: string
    options: { label: string; correct: boolean }[]
  }
}

/** A lesson = one or more concepts (IBIG-style segment) */
export interface Lesson {
  id: string
  moduleId: string
  title: string
  order: number
  concepts: LearningConcept[]
}

/** Module with optional lesson list (for hub) */
export interface LearningModuleWithLessons extends LearningModule {
  lessons?: Lesson[]
}
