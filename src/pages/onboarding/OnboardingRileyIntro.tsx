import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNpc } from '@/lib/npcs'
import { NPCDialogueView } from '@/components/NPCDialogueView'

const RILEY = getNpc('riley')
/** Small chunks for click-anywhere advancement. */
const RILEY_STEPS = [
  "Hey — I'm Riley. I'm a second-year analyst at Goldman Sachs.",
  "I'm here to help you get exposure to the finance world, especially if you're early in college and don't know where to start. I didn't either.",
  "What do investment banks actually do?",
  "In the simplest terms: we help companies and sometimes governments with big money decisions.",
  "That means helping them raise money — like when a company goes public (IPO) or borrows by issuing debt — and advising on mergers, acquisitions, and restructurings.",
  "The clients are usually companies; the bank earns fees for the advice and the execution.",
  "How do they work? Banks are organized into teams.",
  "Some focus on a type of deal (e.g. M&A, or capital markets — IPOs and debt). Others focus on an industry (e.g. healthcare, tech).",
  "You work in a team, support senior bankers, and everything is organized around deals.",
  "When a deal is live, the pace is intense; when it's quiet, you might be pitching for the next one.",
  "What would you do if you worked at one?",
  "As an analyst (the entry-level role), you'd build financial models, put together presentations for clients, and help with due diligence.",
  "You do a lot of the number-crunching and slides that senior bankers use. Hours can be long, but you learn a ton.",
  "Many people do it for two years then move to private equity, hedge funds, or corporate roles — or stay in banking.",
  "So 'investment banking' or 'IB' is that world: helping companies raise capital and do M&A.",
  "If you want to explore it, two things matter — and you can learn both at your own pace.",
  "First: networking. Building real relationships with people in the industry through conversations.",
  "Those are often called 'coffee chats' — so they get to know you and can help when the time comes.",
  "Second: technicals. The stuff they test in interviews — accounting, the three financial statements, valuation basics.",
  "You don't need a finance degree; you can start from zero and go step by step.",
  "In here you can explore both. We'll ask a couple quick questions, then you choose what to try first.",
  "A practice conversation or a short technical drill. You'll land in Finance City where you can dip in whenever you have a few minutes. No rush. Ready?",
]

const HINT = '(click anywhere to continue)'

export function OnboardingRileyIntro() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const line = RILEY_STEPS[step]
  const isLast = step === RILEY_STEPS.length - 1

  const handleAdvance = () => {
    if (isLast) navigate('/onboarding/questions')
    else setStep((s) => s + 1)
  }

  return (
    <div style={styles.screen} onClick={handleAdvance} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAdvance(); }} aria-label="Continue">
      {RILEY ? (
        <NPCDialogueView npc={RILEY} hint={HINT} avatarSize={88}>
          <p style={styles.text}>{line}</p>
        </NPCDialogueView>
      ) : (
        <div style={styles.fallbackCard}>
          <p style={styles.text}>{line}</p>
          <p style={styles.hint}>{HINT}</p>
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
    cursor: 'pointer',
  },
  text: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1.0625rem',
    lineHeight: 1.65,
    margin: 0,
    color: 'var(--color-text)',
  },
  fallbackCard: {
    maxWidth: 480,
    padding: 28,
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  hint: {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.8125rem',
    color: 'var(--color-text-muted)',
    margin: '12px 0 0',
    fontStyle: 'italic',
  },
}
