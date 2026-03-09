import { Link } from 'react-router-dom'

interface BackToMapProps {
  /** Optional label, default "Back to map" */
  label?: string
  style?: React.CSSProperties
}

export function BackToMap({ label = '← Back to map', style }: BackToMapProps) {
  return (
    <Link to="/map" style={{ ...styles.link, ...style }}>
      {label}
    </Link>
  )
}

const styles: React.CSSProperties = {
  display: 'inline-block',
  fontFamily: 'var(--font-ui)',
  fontSize: '0.9375rem',
  color: 'var(--color-text-muted)',
  textDecoration: 'none',
  marginBottom: 8,
}
