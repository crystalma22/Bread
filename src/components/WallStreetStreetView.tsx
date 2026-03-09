/**
 * When zoomed into Wall Street: a "street" with two areas (Networking | Technicals).
 * The parent (Map) shows the NPC pop-up on top asking which to explore.
 */
export function WallStreetStreetView() {
  return (
    <div style={styles.screen}>
      <div style={styles.street}>
        <div style={styles.areaLeft}>
          <span style={styles.areaLabel}>Networking</span>
          <p style={styles.areaDesc}>Coffee chats, storytelling, relationships</p>
        </div>
        <div style={styles.divider} />
        <div style={styles.areaRight}>
          <span style={styles.areaLabel}>Technicals</span>
          <p style={styles.areaDesc}>Accounting, valuation, interview prep</p>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, #e8dfd4 0%, #e0d8ce 100%)',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
  },
  street: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  areaLeft: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: 'rgba(196, 163, 90, 0.12)',
    borderRight: '1px solid var(--color-border)',
  },
  areaRight: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: 'rgba(107, 154, 196, 0.1)',
  },
  divider: {
    width: 3,
    background: 'var(--color-border)',
  },
  areaLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--color-text)',
    marginBottom: 8,
  },
  areaDesc: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
    margin: 0,
  },
}
