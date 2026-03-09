# Bread — Build Plan (from GVD v2.2 & v2.4)

## What Bread Is

**Bread** is a career RPG that trains college students (especially non-target, first-gen, international) to navigate **finance recruiting** through daily 10–15 min gameplay. Players build a character, progress through a “Finance City” map, do coffee-chat simulations, technical drills (e.g. M&I 400), and earn stats/artefacts (resume bullets, STAR stories).

**Product promise:** *"Use this app for 10 minutes a day and you will understand the finance landscape, know exactly what to do next in recruiting, and steadily build interview readiness — without needing to already have mentors."*

---

## Which Doc to Follow?

| Doc | Focus | Stack |
|-----|--------|--------|
| **v2.4** | Web MVP first, then React Native | React (web) → React Native, Vercel, Zustand, Supabase, Rive + Lottie |
| **v2.2** | Mobile-first | React Native (Expo), Redux or Zustand, Supabase, Rive + Lottie, EAS Build |

**Recommendation:** Use **v2.4** to ship a **web MVP** quickly (no App Store delay), then port to **React Native** for iOS (and Android). Logic and content (JSON) carry over to V2.

---

## Web now → iOS later (platform path)

- **Now:** Web MVP in **React** (Vite), deploy on Vercel.
- **Later:** iOS (and optionally Android) via **React Native** (Expo), not a separate Swift app.

**Why React Native, not Swift:**  
The GVD specifies React → React Native for V2. A single React Native codebase gives you native iOS (and Android) while reusing the same TypeScript/JavaScript, Zustand state, Supabase client, and all JSON content from the web app. A separate **Swift** app would be a second codebase with no shared logic.

**Keeping the web app “iOS-ready”:**
- Use **TypeScript** and keep game logic, state shape, and content formats in **plain TS/JSON** (no DOM-specific code in core logic).
- Put **shared logic** (dialogue engine, quiz engine, stat math) in a structure that can be moved into a `shared/` or `core/` package later for React Native.
- Prefer **React** patterns that map 1:1 to React Native (e.g. same Zustand stores, same component mental model). Avoid web-only APIs in core flows so the eventual RN port is mostly UI swap + navigation.

If you ever need a **native Swift** app (e.g. App Store requirement or platform-specific feature), that would be a separate project; the recommended path is still web → React Native for maximum reuse.

---

## MVP Scope (Must Ship — P0)

1. **Onboarding (5 screens, Riley-led)**  
   Hook → Riley intro → 2 questions (grad year, accounting experience) → first coffee chat → land on Finance City map. Target: inside the game in ~60 seconds.

2. **Finance City map (hub)**  
   Static hub. Only **Wall Street District** playable; other districts (Asset Harbor, Alpha Alley, etc.) visible but fogged/locked.

3. **Coffee chat dialogue engine**  
   One scenario with **Riley** (second-year Goldman analyst). Branching dialogue from **JSON trees**; stat deltas; coaching feedback after choices.

4. **M&I 400 quiz engine (accounting section)**  
   Flash Q + spaced repetition; JSON-driven question bank.

5. **Player progression**  
   - **5 stats** (0–100): Technical Skill, Storytelling, Professionalism, Networking Skill, Interview Readiness.  
   - **Ranks:** Candidate → Intern-Ready → Interview-Ready → Offer-Ready → Analyst.  
   - Stats only go up; poor choices affect relationships, not global stats.

6. **Streak counter**  
   Daily return mechanic + “come back tomorrow” prompt.

7. **Player persistence**  
   **Supabase**: full state save/load across sessions.

---

## Tech Stack (v2.4 Web MVP)

| Layer | Choice |
|-------|--------|
| Framework | React (Vite or CRA) |
| State | Zustand |
| Backend / DB / Auth | Supabase (Postgres + Auth) |
| Animation | Rive (interactive) + Lottie (UI micro) |
| Content | JSON in repo (dialogue trees, question bank) |
| Deployment | Vercel |

---

## Content Architecture (JSON-Driven)

- **Dialogue trees** — branching coffee chat / interview; each option has stat/affinity deltas; non-devs can add trees without code.
- **Question bank** — M&I 400 (accounting first); formats: Flash Q, spot-the-mistake, mental math.
- **NPC definitions** — Riley + later 10–12 NPCs (Phase 2).

---

## Art Direction (from GVD)

- **Tone:** Supportive, sharp, realistic. Not “hustle bro.”
- **Background:** Light parchment `#F5F2EC`.
- **Palette:** Earthy + vibrant (ochre, terracotta, sage, sky blue, plum).
- **Map:** Isometric city — Monument Valley meets Candy Crush progress path.
- **NPCs:** Simple geometric blob forms, animal-based; personality via shape + eyes.
- **Fonts:** Cormorant Garamond (display), Jost (UI).

---

## Suggested Build Order

1. **Repo + app shell**  
   React app (Vite), routing, layout, theme (colors, fonts).

2. **Supabase**  
   Project, Auth, tables for: `players` (profile, stats, streak, rank), `sessions`, and any content you want in DB later.

3. **Zustand**  
   Player store (stats, streak, rank, progress), persistence hook to Supabase.

4. **Onboarding flow**  
   5 screens: Hook → Riley intro → 2 questions → first coffee chat (single branch) → land on map. Copy and simple state; no backend required for first pass.

5. **Finance City map**  
   Single hub screen: static map image or SVG, Wall Street District clickable, others fogged. Navigate to “today’s activity” from here.

6. **Dialogue engine**  
   Generic runner: load one JSON dialogue tree, show Riley’s lines and player choices, apply stat deltas, show coaching feedback. Wire first coffee chat to this.

7. **Quiz engine**  
   Load accounting questions from JSON; Flash Q format; track correct/incorrect; simple spaced repetition (e.g. wrong answers reappear in 2–3 sessions).

8. **Daily loop**  
   From map: Daily Quest → Simulation (coffee chat) → Skill Drill → Reward + Plan (XP, streak, next nudge). Reuse dialogue + quiz; add simple “daily quest” and “reward” screens.

9. **Polish**  
   Rive/Lottie where needed, streak protection (optional), and basic analytics (e.g. PostHog or Supabase events).

---

## Immediate Next Steps

1. **Choose path:** Web MVP (v2.4) vs mobile-first (v2.2).  
2. **Create Supabase project** and add env vars.  
3. **Scaffold React app** in this repo (e.g. `npm create vite@latest . -- --template react-ts` or similar).  
4. **Add** `src/data/` for JSON: one sample dialogue tree, one set of accounting questions.  
5. **Implement** onboarding (screens 1–5) and one Riley coffee chat from JSON.

If you tell me whether you want **web MVP** or **React Native first**, I can outline the exact commands and file structure for the next step (e.g. “scaffold Vite + Supabase + first onboarding screen”).
