# Bread — Finance Recruiting RPG (Web MVP)

Career RPG that trains college students to navigate finance recruiting through daily 10–15 min gameplay. Web MVP first; React Native for iOS later.

## Quick start

```bash
# Install dependencies
npm install

# Copy env and add your Supabase keys (optional for first run)
cp .env.example .env

# Run dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). You can run without Supabase; player state lives in Zustand (in-memory) until you wire persistence.

## What’s in the repo

- **Onboarding (5 steps):** Hook → Riley intro → 2 questions (grad year, accounting) → first coffee chat (branching dialogue) → land on Finance City map.
- **Finance City map:** Hub with Wall Street District entry; other districts fogged (placeholder).
- **Dialogue engine:** Loads `src/data/riley-first-coffee.json`, applies stat deltas, shows coaching feedback.
- **Player state (Zustand):** Stats, XP, streak, onboarding answers; ready to persist to Supabase when you add keys.

## Content (quizzes + learning)

Quiz and learning content is wired to your PDFs in **Desktop/Bread App/Bread/Content/** (400 Question Bank, M&I 400 2025, IBIG modules). See **CONTENT_INTEGRATION.md** for what each file is and how to convert them into `src/data/` and `src/data/learning/`.

## Project structure

```
src/
  data/           # JSON: dialogue trees, quiz questions, learning modules
  data/learning/  # IBIG learning modules (from Content PDFs)
  data/quizzes/   # Optional; quiz JSONs can live in data/ or here
  lib/            # Supabase client
  pages/          # Onboarding screens, Map, (daily loop next)
  store/          # Zustand player store
  types/          # Player, dialogue, quiz types
  App.tsx         # Router + routes
  index.css       # GVD theme (parchment, fonts, palette)
```

## Next steps (from BUILD_PLAN.md)

1. **Supabase:** Create project, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`, then add save/load in the store.
2. **Daily loop:** From map → Daily Quest → Simulation (coffee) → Skill Drill (quiz) → Reward + Plan.
3. **Quiz engine:** Use `src/data/quiz-accounting-sample.json`; Flash Q UI + simple spaced repetition.
4. **Map asset:** Replace placeholder with isometric Finance City art (Wall Street unlocked, rest fogged).
5. **Polish:** Rive/Lottie for Riley and transitions; streak protection; analytics.

See **BUILD_PLAN.md** for full MVP scope and build order.
