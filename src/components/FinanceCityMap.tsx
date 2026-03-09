import { useRef, useState, useCallback, useEffect } from 'react'

export interface District {
  id: string
  name: string
  playable: boolean
  /** SVG polygon points (e.g. "100,50 200,50 200,150 100,150") */
  points: string
  /** Approximate label position (x, y) */
  labelX: number
  labelY: number
}

const DISTRICTS: District[] = [
  { id: 'wall-street', name: 'Wall Street', playable: true, points: '320,120 480,120 520,220 480,320 320,320 280,220', labelX: 400, labelY: 220 },
  { id: 'asset-harbor', name: 'Asset Harbor', playable: false, points: '520,80 680,80 720,180 680,280 520,280 480,180', labelX: 600, labelY: 180 },
  { id: 'alpha-alley', name: 'Alpha Alley', playable: false, points: '520,320 680,320 720,420 680,520 520,520 480,420', labelX: 600, labelY: 420 },
  { id: 'enterprise-hill', name: 'Enterprise Hill', playable: false, points: '120,280 280,280 320,380 280,480 120,480 80,380', labelX: 200, labelY: 380 },
  { id: 'ledger-lane', name: 'Ledger Lane', playable: false, points: '120,80 280,80 320,180 280,280 120,280 80,180', labelX: 200, labelY: 180 },
]

const MAP_WIDTH = 800
const MAP_HEIGHT = 600
const MAP_CENTER_X = MAP_WIDTH / 2
const MAP_CENTER_Y = MAP_HEIGHT / 2
const ZOOMED_SCALE = 1.9
const DEFAULT_SCALE = 0.85
const ANIMATION_MS = 500

/* Monument Valley–inspired: soft pastels, dreamy geometry */
const MAP_STYLE = {
  base: '#e8dfd4',
  baseAccent: '#d4c4b8',
  regionActive: '#d4a5a5',
  regionActiveLight: '#e8c4c4',
  regionLocked: '#b8a8c4',
  regionLockedLight: '#d4c8dc',
  border: 'rgba(255,255,255,0.7)',
  borderLocked: 'rgba(180,170,190,0.6)',
  path: '#c8b8a8',
  label: '#5c4a4a',
  labelLocked: '#7a6a8a',
  labelShadow: 'rgba(255,255,255,0.9)',
  shadow: 'rgba(100,80,90,0.15)',
} as const

/** Road paths (x,y pairs) — minimal lines for structure */
const ROADS: string[] = [
  '200,200 400,200 600,200 700,250',
  '400,100 400,300 400,500',
  '200,300 320,300 520,300 600,300',
]

function getTargetPanForDistrict(d: District): { x: number; y: number } {
  return {
    x: -(d.labelX - MAP_CENTER_X) * ZOOMED_SCALE,
    y: -(d.labelY - MAP_CENTER_Y) * ZOOMED_SCALE,
  }
}

/** Path to the isometric map image (in public/). Set to a URL to use an image; empty string = SVG placeholders only. */
const MAP_IMAGE_URL = ''

interface FinanceCityMapProps {
  onDistrictClick: (district: District) => void
  onZoomIntoDistrict?: (district: District) => void
  /** When set, we're in "district view" (zoomed in); when cleared, we animate back to overview */
  zoomedDistrict?: District | null
  /** When true, map fills its container (e.g. full viewport) instead of fixed height */
  fillContainer?: boolean
}

export function FinanceCityMap({ onDistrictClick, onZoomIntoDistrict, zoomedDistrict = null, fillContainer = false }: FinanceCityMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(DEFAULT_SCALE)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const animRef = useRef<number | null>(null)

  const animateTo = useCallback((targetPan: { x: number; y: number }, targetScale: number, onComplete?: () => void) => {
    if (animRef.current != null) cancelAnimationFrame(animRef.current)
    const startPan = { ...pan }
    const startScale = scale
    const startTime = performance.now()
    setIsAnimating(true)

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / ANIMATION_MS, 1)
      const eased = 1 - (1 - t) * (1 - t)
      setPan({
        x: startPan.x + (targetPan.x - startPan.x) * eased,
        y: startPan.y + (targetPan.y - startPan.y) * eased,
      })
      setScale(startScale + (targetScale - startScale) * eased)
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        setIsAnimating(false)
        animRef.current = null
        onComplete?.()
      }
    }
    animRef.current = requestAnimationFrame(tick)
  }, [pan, scale])

  const handleDistrictClick = useCallback((d: District) => {
    if (isAnimating) return
    if (d.playable && onZoomIntoDistrict) {
      const target = getTargetPanForDistrict(d)
      animateTo(target, ZOOMED_SCALE, () => onZoomIntoDistrict(d))
    } else {
      onDistrictClick(d)
    }
  }, [isAnimating, onDistrictClick, onZoomIntoDistrict, animateTo])

  const prevZoomedRef = useRef<District | null>(null)
  useEffect(() => {
    if (prevZoomedRef.current !== null && zoomedDistrict === null) {
      animateTo({ x: 0, y: 0 }, DEFAULT_SCALE)
    }
    prevZoomedRef.current = zoomedDistrict
  }, [zoomedDistrict, animateTo])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('[data-district]')) return
      e.currentTarget.setPointerCapture(e.pointerId)
      setIsDragging(true)
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
      }
    },
    [pan]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      setPan({
        x: dragStart.current.panX + e.clientX - dragStart.current.x,
        y: dragStart.current.panY + e.clientY - dragStart.current.y,
      })
    },
    [isDragging]
  )

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId)
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.08 : 0.08
      setScale((s) => Math.min(1.5, Math.max(0.4, s + delta)))
    },
    []
  )

  const tiltDeg = 14
  const perspectivePx = 1400

  return (
    <div
      ref={containerRef}
      className="finance-city-map-container"
      style={{
        width: '100%',
        height: fillContainer ? '100%' : 380,
        overflow: 'hidden',
        borderRadius: fillContainer ? 0 : 20,
        border: fillContainer ? 'none' : '1px solid rgba(0,0,0,0.06)',
        background: 'linear-gradient(180deg, #ebe2d8 0%, #e0d6cc 100%)',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        boxShadow: fillContainer ? 'none' : '0 8px 32px rgba(90,70,80,0.12), 0 2px 8px rgba(90,70,80,0.08)',
        perspective: perspectivePx,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => setIsDragging(false)}
      onWheel={handleWheel}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `perspective(${perspectivePx}px) rotateX(${tiltDeg}deg) translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
          transition: isAnimating ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          style={{
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'block',
          }}
        >
          <defs>
            <filter id="mvLabelShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={MAP_STYLE.labelShadow} floodOpacity="1" />
            </filter>
            <filter id="mvSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={MAP_STYLE.shadow} floodOpacity="0.5" />
            </filter>
            <linearGradient id="mvBase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ebe2d8" />
              <stop offset="100%" stopColor="#e0d6cc" />
            </linearGradient>
            <linearGradient id="mvRegionActive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={MAP_STYLE.regionActiveLight} />
              <stop offset="100%" stopColor={MAP_STYLE.regionActive} />
            </linearGradient>
            <linearGradient id="mvRegionLocked" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={MAP_STYLE.regionLockedLight} />
              <stop offset="100%" stopColor={MAP_STYLE.regionLocked} />
            </linearGradient>
          </defs>
          {/* Background: image asset or SVG fallback */}
          {MAP_IMAGE_URL ? (
            <image
              href={MAP_IMAGE_URL}
              x={0}
              y={0}
              width={MAP_WIDTH}
              height={MAP_HEIGHT}
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <>
              <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#mvBase)" />
              <ellipse cx={680} cy={80} rx={100} ry={55} fill="#b8c8c4" opacity={0.4} />
              <ellipse cx={80} cy={520} rx={80} ry={70} fill="#a8b8b4" opacity={0.35} />
              <g stroke={MAP_STYLE.path} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.5}>
                {ROADS.map((path, i) => (
                  <path key={i} d={`M ${path.split(' ').join(' L ')}`} />
                ))}
              </g>
            </>
          )}
          {/* Districts — invisible hit areas when using image; labels on top */}
          {DISTRICTS.map((d) => (
            <g key={d.id} data-district style={{ cursor: 'pointer' }}>
              <polygon
                points={d.points}
                fill={MAP_IMAGE_URL ? 'transparent' : d.playable ? 'url(#mvRegionActive)' : 'url(#mvRegionLocked)'}
                stroke={MAP_IMAGE_URL ? 'none' : d.playable ? MAP_STYLE.border : MAP_STYLE.borderLocked}
                strokeWidth={d.playable ? 2 : 1.5}
                opacity={MAP_IMAGE_URL ? 1 : d.playable ? 1 : 0.88}
                filter={!MAP_IMAGE_URL && d.playable ? 'url(#mvSoftShadow)' : undefined}
                onClick={() => handleDistrictClick(d)}
              />
              <text
                x={d.labelX}
                y={d.labelY}
                textAnchor="middle"
                fill={d.playable ? MAP_STYLE.label : MAP_STYLE.labelLocked}
                fontFamily="var(--font-display), Georgia, serif"
                fontSize={15}
                fontWeight={600}
                filter="url(#mvLabelShadow)"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {d.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
      {/* Apple Maps–style corner controls */}
      <div style={cornerControlsStyle}>
        <button
          type="button"
          style={mapControlBtnStyle}
          aria-label="Zoom in"
          onClick={(e) => { e.stopPropagation(); setScale((s) => Math.min(1.5, s + 0.15)); }}
        >
          +
        </button>
        <button
          type="button"
          style={mapControlBtnStyle}
          aria-label="Zoom out"
          onClick={(e) => { e.stopPropagation(); setScale((s) => Math.max(0.4, s - 0.15)); }}
        >
          −
        </button>
      </div>
      {!fillContainer && (
        <p style={hintStyle}>
          {zoomedDistrict ? 'Use "Back to Finance City" below to return to the full map.' : 'Drag to pan · Scroll to zoom · Tap a district to zoom in'}
        </p>
      )}
    </div>
  )
}

const hintStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 8,
  left: '50%',
  transform: 'translateX(-50%)',
  margin: 0,
  fontFamily: 'var(--font-ui)',
  fontSize: '0.75rem',
  color: 'var(--color-text-muted)',
  pointerEvents: 'none',
}

const cornerControlsStyle: React.CSSProperties = {
  position: 'absolute',
  top: 12,
  right: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  pointerEvents: 'auto',
}

const mapControlBtnStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
  fontSize: 20,
  fontWeight: 400,
  color: '#1d1d1f',
  background: 'rgba(255,255,255,0.95)',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 8,
  cursor: 'pointer',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
}

export { DISTRICTS }
