import type { NPC } from '@/types/npc'
import { NPCPlaceholder } from '@/components/NPCPlaceholder'

interface NPCDialogueViewProps {
  npc: NPC
  /** Dialogue text or content (what the NPC is saying) */
  children: React.ReactNode
  /** Optional hint below the speech, e.g. "(click anywhere to continue)" */
  hint?: React.ReactNode
  /** Avatar size in pixels */
  avatarSize?: number
}

/**
 * Layout that feels like you're speaking to the NPC: avatar on the left,
 * their words in a speech-bubble style card on the right.
 */
export function NPCDialogueView({ npc, children, hint, avatarSize = 88 }: NPCDialogueViewProps) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.avatarCol}>
        <NPCPlaceholder npc={npc} size={avatarSize} showName showTitle />
      </div>
      <div style={styles.speechCol}>
        <div style={styles.bubble}>
          {children}
        </div>
        {hint != null && <p style={styles.hint}>{hint}</p>}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 24,
    maxWidth: 'min(440px, 94vw)',
    width: '100%',
  },
  avatarCol: {
    flexShrink: 0,
  },
  speechCol: {
    flex: 1,
    minWidth: 0,
  },
  bubble: {
    padding: '22px 26px',
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 16,
    borderTopLeftRadius: 6,
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    position: 'relative',
    minWidth: 0,
  },
  hint: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.8125rem',
    color: 'var(--color-text-muted)',
    margin: '12px 0 0',
    fontStyle: 'italic',
  },
}
