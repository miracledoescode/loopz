## Task 1: Profile UI Updates (Sign Out & Delete Account)
**Description:** Add the structural UI buttons to the bottom of `EditProfileScreen.tsx` for logging out and deleting the account.
**Acceptance criteria:**
- [x] A "Sign Out" button is visible at the bottom of the profile screen.
- [x] A "Delete Account" button is visible, styled in red (destructive), below the Sign Out button.
**Verification:**
- [ ] Manual check: Render `EditProfileScreen` and verify both buttons are visible and tap-able.
**Dependencies:** None
**Files likely touched:** `src/screens/EditProfileScreen.tsx`
**Estimated scope:** Small

## Task 2: Profile Action Wiring (Auth & Data Wiping)
**Description:** Implement the actual Firebase Auth logic for signing out and deleting the user account, including wiping their Firestore data.
**Acceptance criteria:**
- [x] Tapping "Sign Out" clears Zustand state and triggers Firebase `signOut()`.
- [x] Tapping "Delete Account" triggers an Alert confirmation ("Are you sure?").
- [x] Confirming deletion deletes the user's Firestore document and calls Firebase `deleteUser()`.
**Verification:**
- [ ] Manual check: Sign in with a test account, tap Delete, verify Auth and Firestore records are wiped.
**Dependencies:** Task 1
**Files likely touched:** `src/screens/EditProfileScreen.tsx`, `src/store/useAppStore.ts`
**Estimated scope:** Medium

## Task 3: Paywall Legalities
**Description:** Add the legally required links and buttons to the Paywall to pass App Store review.
**Acceptance criteria:**
- [x] "Restore Purchases" button is wired to RevenueCat's `Purchases.restorePurchases()`.
- [x] "Terms of Service" and "Privacy Policy" links are visible and open web URLs.
**Verification:**
- [ ] Manual check: Tap "Restore Purchases" and verify the RevenueCat API is called.
**Dependencies:** None
**Files likely touched:** `src/screens/PaywallScreen.tsx`
**Estimated scope:** Small

## Task 4: AI Liability Interceptor
**Description:** Update the Gemini system prompt to detect and safely intercept self-harm or prompt injection attempts.
**Acceptance criteria:**
- [x] System prompt explicitly blocks generating tasks for self-harm, returning a specific JSON flag instead (e.g., `isCrisis: true`).
- [x] UI catches the `isCrisis` flag and renders a Crisis Hotline message instead of a task.
**Verification:**
- [ ] Manual check: Submit a test brain dump of "I want to hurt myself" and verify the crisis UI appears instead of a sprint timer.
**Dependencies:** None
**Files likely touched:** `src/services/ai.ts`, `src/screens/TodayScreen.tsx`
**Estimated scope:** Medium

## Task 5: Firestore Security Rules Lockdown
**Description:** Write and deploy Firebase Security Rules to ensure users can only access their own data.
**Acceptance criteria:**
- [x] Users can only read/write documents where `userId == request.auth.uid`.
- [x] Unauthenticated users cannot read or write to the database.
**Verification:**
- [ ] Manual check: Deploy rules and verify the app still works for an authenticated user, but fails if trying to query another UID.
**Dependencies:** None
**Files likely touched:** `firestore.rules` (or Firebase Console)
**Estimated scope:** Small

---

## Checkpoint 1: Launch Ready
- [ ] All App Store compliance blockers are resolved.
- [ ] Review with human before proceeding to Phase 2.

---

## Task 6: Overhaul Onboarding UX
**Description:** Redesign the `OnboardingScreen` to match the PRD flow: The Promise -> Rhythm Selection -> First Dump.
**Acceptance criteria:**
- [x] Screen 1: Welcome message.
- [x] Screen 2: Select Rhythm (Morning/Afternoon/Night).
- [x] Screen 3: A massive microphone button prompting the first dump.
**Verification:**
- [ ] Manual check: Navigate through the new onboarding flow seamlessly.
**Dependencies:** None
**Files likely touched:** `src/screens/OnboardingScreen.tsx`
**Estimated scope:** Large

## Task 7: Defer Auth Wall
**Description:** Move the Authentication screen to trigger *only after* the user completes their first brain dump in onboarding.
**Acceptance criteria:**
- [x] App launches directly into Onboarding for first-time users (no login required).
- [x] After the first dump is processed by AI, the Auth screen appears.
- [x] Upon successful login, the local dump state is persisted to the new user's Firestore account.
**Verification:**
- [ ] Manual check: Fresh install simulation -> Dump brain -> See AI result -> Prompted to login -> Login -> State is saved.
**Dependencies:** Task 6
**Files likely touched:** `src/navigation/RootNavigator.tsx`, `src/screens/AuthScreen.tsx`, `src/store/useAppStore.ts`
**Estimated scope:** Large

---

## Checkpoint 2: Onboarding Complete
- [x] End-to-end "Aha" moment works without friction.

---

## Task 9: Empty State Polish
**Description:** Make the "Zero Inbox" state on the `TodayScreen` feel more guided and inviting.
**Acceptance criteria:**
- [x] Add a beautiful prompt like "What's occupying your mind right now?" above the Brain Dump input when there are no tasks.

## Task 10: Profile Rhythm Integration
**Description:** Pass the user's `energyWindow` (Morning/Afternoon/Night) to the AI so it schedules their sprint appropriately.
**Acceptance criteria:**
- [x] `useTasks` and `gemini.ts` send the `energyWindow` to the Cloudflare worker.

---

## Task 11: Focus Audio
**Description:** Integrate `expo-audio` to play ambient sound (e.g. brown noise) during a focus sprint.
**Acceptance criteria:**
- [x] Sound starts playing automatically when a sprint begins.
- [x] Sound pauses when the sprint pauses, and stops on completion.

## Task 12: Satisfying Completions
**Description:** Implement rich Lottie animations for sprint completion.
**Acceptance criteria:**
- [x] Confetti or a dynamic success animation plays over the Celebration screen when the sprint finishes.

## Task 13: Progress History
**Description:** Render a history of past sprints on the `EditProfileScreen`.
**Acceptance criteria:**
- [x] A list or heatmap of past completed sprints is visible to the user.

---

## Task 14: Telemetry & Infrastructure (Don't Forget!)
**Description:** Boilerplate setup for PostHog (Product Analytics) and Crashlytics (Error Tracking).
**Acceptance criteria:**
- [x] PostHog SDK initialized.
- [x] Placeholder Firebase Native / Crashlytics setup ready.
