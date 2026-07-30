# Loopz — v1

An AI focus coach that kills decision paralysis. Brain dump everything on your mind, get back **one ranked next action** broken into tiny steps, one tap to start.

## Setup

1. **Install dependencies:**
   ```bash
   npm install          # root (Expo app)
   cd functions && npm install  # Cloud Functions
   ```

2. **Firebase project:**
   - Create a Firebase project
   - Enable: Authentication → Anonymous, and Firestore (production mode)
   - Deploy security rules: `firebase deploy --only firestore:rules`

3. **Environment variables:**
   - Copy `.env.example` to `.env` and fill in your Firebase web config
     (Project settings → your app → SDK config)
   - Get a Gemini API key from Google AI Studio, then set it for Cloud Functions **only**:
     ```bash
     firebase functions:config:set gemini.key="YOUR_KEY"
     ```

4. **Deploy Cloud Functions:**
   ```bash
   cd functions && npm run build && firebase deploy --only functions
   ```

5. **Run the app:**
   ```bash
   npx expo start
   ```

## Architecture

```
App.tsx                    → Entry: fonts, auth, navigation container
src/
  config/firebase.ts       → Firebase init (reads from expo-constants)
  theme/index.ts           → Design tokens (colors, fonts, spacing)
  theme/animations.ts      → Reanimated animation presets
  types/index.ts           → TypeScript interfaces (Task, Sprint, etc.)
  store/useAppStore.ts     → Zustand + AsyncStorage persistence
  hooks/useTasks.ts        → Brain dump → Gemini → ranked task
  hooks/useTimer.ts        → Count-up timer with pause/resume
  navigation/              → React Navigation stack
  screens/
    OnboardingScreen.tsx   → 3-step paged onboarding
    TodayScreen.tsx        → Brain dump + plan card
    SprintScreen.tsx       → Full-screen timer + step progress
    EditProfileScreen.tsx  → Edit the three onboarding answers
  components/
    BrainDumpInput.tsx     → Animated text input
    PlanCard.tsx           → Ranked task card with micro-steps
    StepProgressBar.tsx    → Dot progress indicator
    TimerRing.tsx          → SVG circular progress
    LoadingOrb.tsx         → Pulsing orb loading state
functions/
  src/prompts.ts           → Gemini prompt with role bias
  src/rankTask.ts          → Cloud Function: Gemini call + Firestore write
```

## Core Loop

1. **Onboarding** (3 taps): Role → Energy window → "What does a win look like today"
2. **Today screen**: Brain dump → Gemini returns one task with 3–5 micro-steps
3. **Sprint screen**: Timer + step progress, pause/done/"this isn't it"

## Explicitly Cut for v1

Calendar integration, insights, sprint history, notifications, team mode, paywall — all parked. Get the core loop working first.
