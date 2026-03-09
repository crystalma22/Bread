import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlayerStore } from '@/store/playerStore'
import { getNpc } from '@/lib/npcs'
import { NPCPlaceholder } from '@/components/NPCPlaceholder'
import { FinanceCityMap } from '@/components/FinanceCityMap'
import type { District } from '@/components/FinanceCityMap'
import { WallStreetStreetView } from '@/components/WallStreetStreetView'
import { MapIntro } from '@/pages/MapIntro'

const riley = getNpc('riley')

/** Recommend first path based on onboarding answers. */
function getRecommendedPath(
  graduationYear: number | null,
  accountingExperience: 'yes' | 'a_little' | 'no' | null
): 'networking' | 'technicals' | 'either' {
  if (accountingExperience === 'no' && graduationYear != null && graduationYear >= 2030) {
    return 'networking'
  }
  if (accountingExperience === 'yes' || accountingExperience === 'a_little') {
    return 'technicals'
  }
  return 'either'
}

export function Map() {
  const navigate = useNavigate()
  const hasSeenMapIntro = usePlayerStore((s) => s.hasSeenMapIntro)
  const setSeenMapIntro = usePlayerStore((s) => s.setSeenMapIntro)
  const hasSeenMapTutorial = usePlayerStore((s) => s.hasSeenMapTutorial)
  const setSeenMapTutorial = usePlayerStore((s) => s.setSeenMapTutorial)
  const hasSeenWallStreetIntro = usePlayerStore((s) => s.hasSeenWallStreetIntro)
  const setSeenWallStreetIntro = usePlayerStore((s) => s.setSeenWallStreetIntro)
  const graduationYear = usePlayerStore((s) => s.graduationYear)
  const accountingExperience = usePlayerStore((s) => s.accountingExperience)

  const [comingSoonDistrict, setComingSoonDistrict] = useState<string | null>(null)
  const [zoomedDistrict, setZoomedDistrict] = useState<District | null>(null)

  const handleDistrictClick = (d: District) => {
    if (d.playable) return
    setComingSoonDistrict(d.name)
  }

  const recommended = getRecommendedPath(graduationYear, accountingExperience)
  const isWallStreetZoom = zoomedDistrict?.id === 'wall-street'
  const showWallStreetNPC = isWallStreetZoom && !hasSeenWallStreetIntro && riley

  const handleStartNetworking = () => {
    setSeenWallStreetIntro()
    navigate('/daily')
  }

  const handleStartTechnicals = () => {
    setSeenWallStreetIntro()
    navigate('/technicals')
  }

  if (!hasSeenMapIntro) {
    return (
      <div style={styles.screen}>
        <MapIntro onContinue={setSeenMapIntro} />
      </div>
    )
  }

  const isWallStreet = zoomedDistrict?.id === 'wall-street'

  return (
    <div style={styles.screen}>
      {isWallStreet ? (
        <WallStreetStreetView />
      ) : (
        <FinanceCityMap
          onDistrictClick={handleDistrictClick}
          onZoomIntoDistrict={setZoomedDistrict}
          zoomedDistrict={zoomedDistrict}
          fillContainer
        />
      )}

      {/* Map tutorial: NPC on edge explains how to get around */}
      {!zoomedDistrict && !hasSeenMapTutorial && riley && (
        <div style={styles.tutorialNpc}>
          <div style={styles.tutorialBubble}>
            <p style={styles.tutorialText}>
              Drag to pan and zoom. Tap a district to go there — tap <strong>Wall Street</strong> to zoom in. That's where you'll choose your first path.
            </p>
            <button type="button" onClick={setSeenMapTutorial} style={styles.tutorialBtn}>
              Got it
            </button>
          </div>
          <div style={styles.tutorialAvatar}>
            <NPCPlaceholder npc={riley} size={48} showName={false} />
          </div>
        </div>
      )}

      {/* Wall Street: first time = NPC explains paths, recommends, asks where to start */}
      {showWallStreetNPC && (
        <div style={styles.overlay}>
          <div style={styles.overlayCard}>
            <div style={styles.npcRow}>
              <NPCPlaceholder npc={riley} size={56} showName showTitle={false} />
              <div style={styles.dialogue}>
                <h2 style={styles.overlayTitle}>Two paths from here</h2>
                <p style={styles.overlayBody}>
                  <strong>Networking</strong> is about conversations — coffee chats, reaching out, and telling your story. <strong>Technicals</strong> is the skills side: accounting, valuation, and interview prep.
                </p>
                <p style={styles.overlayBody}>
                  {recommended === 'networking' && "Since you're early and new to this, I'd start with Networking — get comfortable talking to people first, then layer in technicals."}
                  {recommended === 'technicals' && "You've got some accounting or finance already — you could dive into Technicals first if you want to sharpen that, or start with Networking. Your call."}
                  {recommended === 'either' && "Most people start with Networking to get comfortable, then add Technicals — but you can do either first."}
                </p>
                <p style={styles.overlayBody}>Where do you want to start?</p>
              </div>
            </div>
            <div style={styles.overlayActions}>
              <button type="button" onClick={handleStartNetworking} style={styles.overlayBtnPrimary}>
                Start with Networking
              </button>
              <button type="button" onClick={handleStartTechnicals} style={styles.overlayBtnSecondary}>
                Start with Technicals
              </button>
            </div>
            <button
              type="button"
              onClick={() => { setSeenWallStreetIntro(); setZoomedDistrict(null); }}
              style={styles.backBtn}
            >
              ← Back to map
            </button>
          </div>
        </div>
      )}

      {/* Wall Street: already seen intro = simple card with links */}
      {zoomedDistrict && !showWallStreetNPC && (
        <div style={styles.overlay}>
          <div style={styles.overlayCard}>
            <h2 style={styles.overlayTitle}>{zoomedDistrict.name}</h2>
            {zoomedDistrict.id === 'wall-street' && (
              <div style={styles.overlayActions}>
                <Link to="/daily" style={styles.overlayBtnPrimary}>
                  Networking
                </Link>
                <Link to="/technicals" style={styles.overlayBtnSecondary}>
                  Technicals
                </Link>
              </div>
            )}
            <button type="button" onClick={() => setZoomedDistrict(null)} style={styles.backBtn}>
              ← Back to map
            </button>
          </div>
        </div>
      )}

      {comingSoonDistrict && !zoomedDistrict && (
        <div style={styles.toast}>
          <span>{comingSoonDistrict} — coming soon</span>
          <button type="button" onClick={() => setComingSoonDistrict(null)} style={styles.toastDismiss} aria-label="Dismiss">×</button>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--color-bg)',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 'min(12vh, 48px)',
    pointerEvents: 'none',
  },
  overlayCard: {
    pointerEvents: 'auto',
    padding: 20,
    background: 'rgba(250, 248, 245, 0.98)',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    maxWidth: 320,
  },
  npcRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 16,
  },
  dialogue: {
    flex: 1,
    minWidth: 0,
  },
  overlayTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    margin: '0 0 12px',
  },
  overlayBody: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    lineHeight: 1.55,
    color: 'var(--color-text-muted)',
    margin: '0 0 10px',
  },
  overlayActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 16,
  },
  overlayBtnPrimary: {
    display: 'block',
    padding: '12px 16px',
    background: 'var(--color-ochre)',
    color: '#fff',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '0.9375rem',
    textDecoration: 'none',
    borderRadius: 8,
    textAlign: 'center',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
  overlayBtnSecondary: {
    display: 'block',
    padding: '12px 16px',
    background: 'var(--color-sky)',
    color: '#fff',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '0.9375rem',
    textDecoration: 'none',
    borderRadius: 8,
    textAlign: 'center',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
  backBtn: {
    display: 'block',
    width: '100%',
    padding: '10px 16px',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    fontWeight: 500,
    background: 'transparent',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
  },
  tutorialNpc: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    display: 'flex',
    alignItems: 'flex-end',
    gap: 12,
    pointerEvents: 'auto',
    maxWidth: 320,
  },
  tutorialBubble: {
    flex: 1,
    padding: 16,
    background: 'rgba(250, 248, 245, 0.98)',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  tutorialText: {
    margin: '0 0 12px',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    color: 'var(--color-text)',
  },
  tutorialBtn: {
    padding: '8px 16px',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '0.8125rem',
    background: 'var(--color-ochre)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  tutorialAvatar: {
    flexShrink: 0,
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
  },
  toastDismiss: {
    padding: '0 4px',
    fontFamily: 'inherit',
    fontSize: '1.25rem',
    lineHeight: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
  },
}
