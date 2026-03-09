import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { DialogueTree, DialogueNode } from '@/types/dialogue'
import { usePlayerStore } from '@/store/playerStore'
import { getNpc } from '@/lib/npcs'
import { NPCDialogueView } from '@/components/NPCDialogueView'
import rileyFirstCoffee from '@/data/riley-first-coffee.json'

const tree = rileyFirstCoffee as DialogueTree
const RILEY = getNpc(tree.npcId)

function getNode(id: string): DialogueNode | undefined {
  return tree.nodes[id]
}

export function OnboardingCoffee() {
  const navigate = useNavigate()
  const applyStatDeltas = usePlayerStore((s) => s.applyStatDeltas)
  const setOnboardingComplete = usePlayerStore((s) => s.setOnboardingComplete)
  const addXp = usePlayerStore((s) => s.addXp)
  const incrementStreak = usePlayerStore((s) => s.incrementStreak)

  const [nodeId, setNodeId] = useState(tree.startNodeId)
  const [feedback, setFeedback] = useState<string | null>(null)
  const node = getNode(nodeId)

  useEffect(() => {
    if (!node) return
    if (node.statDeltas) applyStatDeltas(node.statDeltas as Record<string, number>)
    if (node.feedback) setFeedback(node.feedback)
  }, [nodeId, node?.id])

  const handleChoice = (nextNodeId: string, choiceDeltas?: Record<string, number>, choiceFeedback?: string) => {
    if (choiceDeltas) applyStatDeltas(choiceDeltas as Record<string, number>)
    if (choiceFeedback) setFeedback(choiceFeedback)
    setNodeId(nextNodeId)
  }

  const handleNext = () => {
    setFeedback(null)
    if (node?.next) setNodeId(node.next)
  }

  const handleFinish = () => {
    addXp(50)
    incrementStreak()
    setOnboardingComplete()
    navigate('/map')
  }

  if (!node) return null

  const isEnd = nodeId === 'end'
  const hasChoices = node.choices && node.choices.length > 0
  const useClickAnywhere = !hasChoices

  const handleClickScreen = () => {
    if (!useClickAnywhere) return
    if (isEnd) handleFinish()
    else handleNext()
  }

  const hint = !hasChoices
    ? (isEnd ? '(click anywhere to go to Finance City)' : '(click anywhere to continue)')
    : undefined

  return (
    <div
      style={{ ...styles.screen, ...(useClickAnywhere ? styles.screenClickable : {}) }}
      onClick={useClickAnywhere ? handleClickScreen : undefined}
      role={useClickAnywhere ? 'button' : undefined}
      tabIndex={useClickAnywhere ? 0 : undefined}
      onKeyDown={useClickAnywhere ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleClickScreen(); } : undefined}
      aria-label={useClickAnywhere ? 'Continue' : undefined}
    >
      {node.speaker === 'npc' && RILEY ? (
        <NPCDialogueView npc={RILEY} hint={hint} avatarSize={80}>
          <p style={styles.text}>{node.text}</p>
          {feedback && <p style={styles.feedback}>{feedback}</p>}
          {hasChoices && (
            <div style={styles.choices}>
              {node.choices!.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleChoice(c.nextNodeId, c.statDeltas, c.feedback); }}
                  style={styles.choiceBtn}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </NPCDialogueView>
      ) : (
        <div style={styles.youWrapper}>
          <div style={styles.youBubble}>
            <p style={styles.youLabel}>You</p>
            <p style={styles.text}>{node.text}</p>
            {feedback && <p style={styles.feedback}>{feedback}</p>}
            {hasChoices ? (
              <div style={styles.choices}>
                {node.choices!.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleChoice(c.nextNodeId, c.statDeltas, c.feedback); }}
                    style={styles.choiceBtn}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            ) : (
              hint != null && <p style={styles.hint}>{hint}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: '100vh',
    background: 'var(--color-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  screenClickable: {
    cursor: 'pointer',
  },
  text: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1.0625rem',
    lineHeight: 1.6,
    margin: '0 0 12px',
    color: 'var(--color-text)',
  },
  feedback: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    color: 'var(--color-sage)',
    fontStyle: 'italic',
    margin: '0 0 12px',
  },
  choices: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: 4,
  },
  choiceBtn: {
    padding: '14px 18px',
    fontFamily: 'var(--font-ui)',
    fontSize: '1rem',
    textAlign: 'left',
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    cursor: 'pointer',
  },
  youWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    maxWidth: 520,
    width: '100%',
  },
  youBubble: {
    maxWidth: 360,
    padding: '20px 24px',
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 16,
    borderTopRightRadius: 6,
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  },
  youLabel: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-sky)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 8px',
  },
  hint: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.8125rem',
    color: 'var(--color-text-muted)',
    margin: '12px 0 0',
    fontStyle: 'italic',
  },
}
