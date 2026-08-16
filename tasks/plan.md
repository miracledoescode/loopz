# Implementation Plan: Loopz (Phase 1 & 2 Execution)

## Overview
We are executing the first two phases of the CEO Master Plan: eliminating all App Store/compliance launch blockers (Phase 1) and rebuilding the onboarding flow to guarantee a sub-15-second "Aha!" moment before hitting the auth wall (Phase 2). 

## Architecture Decisions
- **Firebase Auth/Firestore:** We will implement strict Security Rules locking down reads/writes to `request.auth.uid == resource.data.userId` to prevent data leakage.
- **Gemini Interceptor:** Instead of complex backend ML moderation, we will strictly instruct the Gemini System Prompt to output a specific JSON payload if self-harm or prompt injection is detected, handling it gracefully on the client.
- **Deferred Auth:** We will move the Apple/Google SSO from the initial app load to *after* the user's first successful Brain Dump.

## Task List

### Phase 1: Security & Compliance Blockers
- [x] Task 1: Profile UI Updates (Sign Out & Delete Account)
- [x] Task 2: Profile Action Wiring (Firebase Auth & Data Wiping)
- [x] Task 3: Paywall Legalities (Restore Purchases, TOS, Privacy Policy links)
- [x] Task 4: AI Liability Interceptor (Self-harm & Prompt Injection system prompt updates)
- [x] Task 5: Firestore Security Rules Lockdown

### Checkpoint: Launch Ready
- [ ] Apple/Google compliance met (account deletion, restore purchases, links).
- [ ] Security rules prevent cross-user data scraping.
- [ ] AI safely handles crisis inputs.

### Phase 2: Frictionless Onboarding
- [x] Task 6: Overhaul `OnboardingScreen.tsx` (Promise -> Rhythm -> First Dump)
- [x] Task 7: Defer Auth Wall (Move Auth to trigger *after* Step 6 completes)

### Checkpoint: Onboarding Complete
- [x] A new user can dump a thought and see the AI parse it without logging in.
- [x] Logging in successfully links that first thought to their new account.

### Phase 3: The 10-Star Sprint Experience
- [ ] Task 11: Focus Audio (Ambient Lo-Fi/Brown Noise during sprint)
- [ ] Task 12: Satisfying Completions (Lottie Confetti animations on finish)
- [ ] Task 13: Progress History (Calendar Heatmap of past sprints)

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Firebase Account Deletion fails due to recent login requirement | High | Catch `auth/requires-recent-login` error and prompt user to re-authenticate before deleting. |
| Deferred Auth causes data loss on first dump | High | Store first dump in `Zustand` (local memory) until Auth succeeds, then push to Firestore. |

## Open Questions
- Do we have the URL links for the Privacy Policy and Terms of Service ready to hardcode into the Paywall, or should I use placeholder links for now?
