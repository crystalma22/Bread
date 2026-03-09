import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { usePlayerStore } from '@/store/playerStore'
import { PlayerHUD } from '@/components/PlayerHUD'
import { OnboardingHook } from '@/pages/onboarding/OnboardingHook'

const OnboardingRileyIntro = lazy(() => import('@/pages/onboarding/OnboardingRileyIntro').then((m) => ({ default: m.OnboardingRileyIntro })))
const OnboardingQuestions = lazy(() => import('@/pages/onboarding/OnboardingQuestions').then((m) => ({ default: m.OnboardingQuestions })))
const OnboardingChooseTrack = lazy(() => import('@/pages/onboarding/OnboardingChooseTrack').then((m) => ({ default: m.OnboardingChooseTrack })))
const OnboardingCoffee = lazy(() => import('@/pages/onboarding/OnboardingCoffee').then((m) => ({ default: m.OnboardingCoffee })))
const Map = lazy(() => import('@/pages/Map').then((m) => ({ default: m.Map })))
const QuizSession = lazy(() => import('@/pages/QuizSession').then((m) => ({ default: m.QuizSession })))
const RecallQuiz = lazy(() => import('@/pages/RecallQuiz').then((m) => ({ default: m.RecallQuiz })))
const TechnicalsHub = lazy(() => import('@/pages/TechnicalsHub').then((m) => ({ default: m.TechnicalsHub })))
const LessonView = lazy(() => import('@/pages/LessonView').then((m) => ({ default: m.LessonView })))

function RouteFallback() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', fontFamily: 'var(--font-ui)', color: 'var(--color-text-muted)' }}>
      Loading…
    </div>
  )
}

/** Only show the HUD once onboarding is done, and not during onboarding screens. */
function HUDLayer() {
  const hasCompletedOnboarding = usePlayerStore((s) => s.hasCompletedOnboarding)
  const { pathname } = useLocation()
  const isOnboarding = pathname === '/' || pathname.startsWith('/onboarding')
  if (!hasCompletedOnboarding || isOnboarding) return null
  return <PlayerHUD />
}

function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const hasCompletedOnboarding = usePlayerStore((s) => s.hasCompletedOnboarding)
  if (!hasCompletedOnboarding) return <Navigate to="/" replace />
  return <>{children}</>
}

/** First visit of the day: send to recall quiz only if they've already learned something. */
function RequireRecallGate({ children }: { children: React.ReactNode }) {
  const lastRecallDate = usePlayerStore((s) => s.lastRecallDate)
  const completedConceptIds = usePlayerStore((s) => s.completedConceptIds)
  const wrongQuestionIds = usePlayerStore((s) => s.wrongQuestionIds)
  const today = new Date().toISOString().slice(0, 10)
  const hasLearnedSomething = completedConceptIds.length > 0 || wrongQuestionIds.length > 0
  if (lastRecallDate !== today && hasLearnedSomething) return <Navigate to="/recall" replace />
  return <>{children}</>
}

/** iPhone viewport width (logical px). Content is centered in a phone-sized strip. */
const PHONE_WIDTH = 390
const PHONE_MAX_HEIGHT = '100vh'

const phoneWrapperStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'stretch',
  background: '#1c1c1e',
}

const phoneFrameStyle: React.CSSProperties = {
  position: 'relative',
  width: PHONE_WIDTH,
  maxWidth: '100vw',
  minHeight: '100vh',
  maxHeight: PHONE_MAX_HEIGHT,
  overflow: 'hidden',
  borderRadius: 40,
  boxShadow: '0 0 0 12px #2c2c2e, 0 25px 50px -12px rgba(0,0,0,0.5)',
  background: 'var(--color-bg)',
}

export default function App() {
  return (
    <div style={phoneWrapperStyle}>
      <div style={phoneFrameStyle}>
        <BrowserRouter>
          <HUDLayer />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<OnboardingHook />} />
              <Route path="/onboarding/riley" element={<OnboardingRileyIntro />} />
              <Route path="/onboarding/questions" element={<OnboardingQuestions />} />
              <Route path="/onboarding/choose-track" element={<OnboardingChooseTrack />} />
              <Route path="/onboarding/coffee" element={<OnboardingCoffee />} />
              <Route
                path="/map"
                element={
                  <RequireOnboarding>
                    <RequireRecallGate>
                      <Map />
                    </RequireRecallGate>
                  </RequireOnboarding>
                }
              />
              <Route path="/recall" element={<RequireOnboarding><RecallQuiz /></RequireOnboarding>} />
              <Route path="/technicals" element={<RequireOnboarding><TechnicalsHub /></RequireOnboarding>} />
              <Route path="/technicals/:slug" element={<RequireOnboarding><LessonView /></RequireOnboarding>} />
              <Route path="/daily" element={<RequireOnboarding><div style={{ padding: 24 }}>Daily loop (quest → simulation → drill → reward) — coming next</div></RequireOnboarding>} />
              <Route path="/quiz" element={<RequireOnboarding><QuizSession /></RequireOnboarding>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </div>
  )
}
