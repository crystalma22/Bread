import type { NPC } from '@/types/npc'
import npcData from '@/data/npcs.json'

const npcs = (npcData as { npcs: NPC[] }).npcs

export function getNpc(id: string): NPC | undefined {
  return npcs.find((n) => n.id === id)
}

export function getAllNpcs(): NPC[] {
  return npcs
}
