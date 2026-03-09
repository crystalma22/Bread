/** Single node in a dialogue tree */
export interface DialogueNode {
  id: string
  speaker: 'npc' | 'player'
  text: string
  /** For NPC: next node id. For player: array of choice nodes. */
  next?: string
  choices?: DialogueChoice[]
  /** Stat deltas applied when this node is reached (e.g. for player choices) */
  statDeltas?: Partial<Record<string, number>>
  /** Coaching feedback shown after this node */
  feedback?: string
}

export interface DialogueChoice {
  id: string
  label: string
  nextNodeId: string
  statDeltas?: Partial<Record<string, number>>
  feedback?: string
}

export interface DialogueTree {
  id: string
  title: string
  npcId: string
  startNodeId: string
  nodes: Record<string, DialogueNode>
}
