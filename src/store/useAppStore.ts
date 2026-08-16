import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile, Task } from '@/types';

interface AppState {
  // ─── Profile ───────────────────────────────────────────────
  profile: UserProfile | null;
  isPro: boolean;
  hasCompletedOnboarding: boolean;
  setIsPro: (p: boolean) => void;
  setProfile: (p: UserProfile) => void;
  clearProfile: () => void;
  completeOnboarding: () => void;

  // ─── Task & Dumps ──────────────────────────────────────────
  currentTask: Task | null;
  lastDumpText: string;
  recentDumps: string[];
  setCurrentTask: (t: Task | null) => void;
  setLastDumpText: (text: string) => void;
  addRecentDump: (text: string) => void;

  // ─── Sprint ────────────────────────────────────────────────
  activeMicroStepIndex: number;
  completedSprints: Task[];
  startSprint: () => void;
  advanceMicroStep: () => void;
  completeSprint: () => void;
  resetForRerank: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ─── Profile ─────────────────────────────────────────
      profile: null,
      isPro: false,
      hasCompletedOnboarding: false,
      setIsPro: (isPro) => set({ isPro }),
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null, isPro: false, hasCompletedOnboarding: false }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      // ─── Task & Dumps ────────────────────────────────────
      currentTask: null,
      lastDumpText: '',
      recentDumps: [
        "Finish physics assignment and review notes",
        "Plan weekend side-project architecture",
      ],
      setCurrentTask: (currentTask) =>
        set({ currentTask, activeMicroStepIndex: 0 }),
      setLastDumpText: (lastDumpText) => set({ lastDumpText }),
      addRecentDump: (text) =>
        set((state) => {
          if (!text || state.recentDumps.includes(text)) return state;
          return { recentDumps: [text, ...state.recentDumps].slice(0, 5) };
        }),

      // ─── Sprint ──────────────────────────────────────────
      activeMicroStepIndex: 0,
      completedSprints: [],
      startSprint: () => set({ activeMicroStepIndex: 0 }),

      advanceMicroStep: () =>
        set((state) => {
          const task = state.currentTask;
          if (!task) return {};
          const nextIndex = state.activeMicroStepIndex + 1;
          const updatedSteps = task.microSteps.map((step, i) =>
            i === state.activeMicroStepIndex ? { ...step, done: true } : step
          );
          return {
            activeMicroStepIndex: nextIndex,
            currentTask: { ...task, microSteps: updatedSteps },
          };
        }),

      completeSprint: () =>
        set((state) => {
          const task = state.currentTask;
          if (!task) return {};
          const allDone = task.microSteps.map((s) => ({ ...s, done: true }));
          const completedTask = { ...task, microSteps: allDone, status: 'done' as const };
          return {
            currentTask: completedTask,
            completedSprints: [completedTask, ...state.completedSprints],
          };
        }),

      resetForRerank: () =>
        set({
          currentTask: null,
          activeMicroStepIndex: 0,
        }),
    }),
    {
      name: 'loopz-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        currentTask: state.currentTask,
        completedSprints: state.completedSprints,
        lastDumpText: state.lastDumpText,
        recentDumps: state.recentDumps,
        activeMicroStepIndex: state.activeMicroStepIndex,
      }),
    }
  )
);
