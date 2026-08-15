import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile, Task } from '@/types';

interface AppState {
  // ─── Profile ───────────────────────────────────────────────
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  clearProfile: () => void;

  // ─── Subscription ──────────────────────────────────────────
  isPro: boolean;
  setIsPro: (v: boolean) => void;

  // ─── Task ──────────────────────────────────────────────────
  currentTask: Task | null;
  lastDumpText: string;
  setCurrentTask: (t: Task | null) => void;
  setLastDumpText: (text: string) => void;

  // ─── Sprint ────────────────────────────────────────────────
  activeMicroStepIndex: number;
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
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),

      // ─── Subscription ────────────────────────────────────
      isPro: false,
      setIsPro: (isPro) => set({ isPro }),

      // ─── Task ────────────────────────────────────────────
      currentTask: null,
      lastDumpText: '',
      setCurrentTask: (currentTask) =>
        set({ currentTask, activeMicroStepIndex: 0 }),
      setLastDumpText: (lastDumpText) => set({ lastDumpText }),

      // ─── Sprint ──────────────────────────────────────────
      activeMicroStepIndex: 0,
      startSprint: () =>
        set({}),

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
          return {
            currentTask: { ...task, microSteps: allDone, status: 'done' },
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
        currentTask: state.currentTask,
        lastDumpText: state.lastDumpText,
        activeMicroStepIndex: state.activeMicroStepIndex,
        isPro: state.isPro,
      }),
    }
  )
);
