/**
 * NPC (non-player character) definition.
 * Used for dialogue scenes, relationship system, and UI placeholders.
 */
export interface NPC {
  id: string
  name: string
  /** Short title/role for display (e.g. "Second-year analyst, Goldman Sachs") */
  title: string
  /** Optional: avatar image URL. Until then, use placeholder with initial. */
  avatarUrl?: string
  /** For placeholder: first letter of name, or custom initial */
  initial?: string
  /** District or team (e.g. "Wall Street", "M&A") */
  district?: string
  /** Seniority for relationship/affinity logic */
  seniority?: 'analyst' | 'associate' | 'vp' | 'director' | 'recruiter'
}
