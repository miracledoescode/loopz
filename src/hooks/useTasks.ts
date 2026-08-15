import { useAppStore } from '@/store/useAppStore';
import { rankTaskLocal } from '@/services/gemini';
import { auth } from '@/config/firebase';
import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Task } from '@/types';

/** Free tier: max active tasks before paywall triggers */
const FREE_TASK_LIMIT = 3;

export function useTasks() {
  const profile = useAppStore((s) => s.profile);
  const setCurrentTask = useAppStore((s) => s.setCurrentTask);
  const setLastDumpText = useAppStore((s) => s.setLastDumpText);
  const addRecentDump = useAppStore((s) => s.addRecentDump);
  const lastDumpText = useAppStore((s) => s.lastDumpText);
  const resetForRerank = useAppStore((s) => s.resetForRerank);

  /** First brain dump — send raw text (or audio) to Gemini, get back one ranked task */
  async function submitBrainDump(
    rawText: string,
    audioData?: { mimeType: string; data: string }
  ): Promise<Task> {
    if (!profile) throw new Error('Profile required');

    // ── Paywall gate ───────────────────────────────────────────
    const isPro = useAppStore.getState().isPro;
    if (!isPro) {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const snap = await getDocs(collection(db, `users/${uid}/tasks`));
        if (snap.size >= FREE_TASK_LIMIT) {
          throw new Error('PAYWALL');
        }
      }
    }
    // ──────────────────────────────────────────────────────────

    setLastDumpText(rawText);
    addRecentDump(rawText);
    const task = await rankTaskLocal(rawText, profile, [], audioData);
    setCurrentTask(task);
    return task;
  }

  /**
   * "This isn't it" — quietly re-rank.
   */
  async function rejectAndRerank(rejectedTitle: string): Promise<Task> {
    if (!profile) throw new Error('Profile required');
    resetForRerank();
    const task = await rankTaskLocal(lastDumpText, profile, [rejectedTitle]);
    setCurrentTask(task);
    return task;
  }

  /**
   * Called when all micro-steps in the current task are done.
   */
  async function onMicroStepsExhausted(): Promise<Task | null> {
    if (!profile || !lastDumpText) return null;
    resetForRerank();
    const task = await rankTaskLocal(lastDumpText, profile);
    setCurrentTask(task);
    return task;
  }

  return { submitBrainDump, rejectAndRerank, onMicroStepsExhausted };
}
