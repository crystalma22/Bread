import type { QuizQuestion } from '@/types/quiz'
import quizTopicsData from '@/data/quiz-topics.json'

// Static file map — add new topic files here as content grows
import quizAccounting from '@/data/quiz-accounting.json'
import quizCore from '@/data/quiz-core.json'

export interface QuizTopic {
  id: string
  label: string
  learningModuleSlug: string
  questionFile: string | null
  description: string
}

const QUESTION_FILES: Record<string, QuizQuestion[]> = {
  'quiz-accounting.json': quizAccounting as QuizQuestion[],
  'quiz-core.json': quizCore as QuizQuestion[],
}

export const ALL_TOPICS: QuizTopic[] = (quizTopicsData as { topics: QuizTopic[] }).topics

/** Get a topic by id, or undefined if not found. */
export function getTopic(id: string): QuizTopic | undefined {
  return ALL_TOPICS.find((t) => t.id === id)
}

/** Get questions for a topic. Returns empty array if no file is mapped yet. */
export function getQuestionsForTopic(topicId: string): QuizQuestion[] {
  const topic = getTopic(topicId)
  if (!topic || !topic.questionFile) return []
  return QUESTION_FILES[topic.questionFile] ?? []
}

/** Get all available topics (have a question file). */
export function getPlayableTopics(): QuizTopic[] {
  return ALL_TOPICS.filter(
    (t) => t.questionFile != null && (QUESTION_FILES[t.questionFile] ?? []).length > 0
  )
}

/** Default fallback topic when none is specified. */
export const DEFAULT_TOPIC_ID = 'accounting'
