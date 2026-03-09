import type { NPC } from '@/types/npc'

interface NPCPlaceholderProps {
  npc: NPC
  /** Size of the figure in pixels (width and height) */
  size?: number
  /** Show name below avatar */
  showName?: boolean
  /** Show title below name */
  showTitle?: boolean
  style?: React.CSSProperties
}

/** Shadow-outlined figure: head + torso, outline only, no face. */
function FigureSilhouette({ size }: { size: number }) {
  const viewSize = 100
  const stroke = Math.max(2, 2.5 * (size / 80))
  const headR = 16
  const headCy = 20
  const bodyX = 50 - 20
  const bodyY = headCy + headR + 6
  const bodyW = 40
  const bodyH = 46
  const bodyRx = 10

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
      aria-hidden
    >
      {/* Head */}
      <circle cx={50} cy={headCy} r={headR} />
      {/* Torso */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={bodyRx} ry={bodyRx} />
    </svg>
  )
}

export function NPCPlaceholder({
  npc,
  size = 80,
  showName = true,
  showTitle = false,
  style = {},
}: NPCPlaceholderProps) {
  return (
    <div style={{ ...styles.wrapper, ...style }}>
      <div
        style={{
          ...styles.avatar,
          width: size,
          height: size,
          color: 'var(--color-text-muted)',
          opacity: 0.85,
        }}
        title={npc.title}
      >
        <FigureSilhouette size={size} />
      </div>
      {showName && (
        <p style={styles.name}>{npc.name}</p>
      )}
      {showTitle && npc.title && (
        <p style={styles.title}>{npc.title}</p>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--color-text)',
    margin: '8px 0 0',
  },
  title: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    margin: '2px 0 0',
    maxWidth: 100,
    lineHeight: 1.3,
    textAlign: 'center',
  },
}
