import { doc, setDoc, collection } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import type { Task, UserProfile } from '@/types';

// The Cloudflare Worker URL serving as the secure proxy to Gemini
const WORKER_URL = 'https://loopz-rank-task.miraclesayscode.workers.dev'; 
const APP_SECRET = '304a37a510e84617c32f30bd1cf31048';

export async function rankTaskLocal(
  rawText: string,
  profile: UserProfile,
  excludedTasks: string[] = [],
  audioData?: { mimeType: string; data: string }
): Promise<Task> {
  if (!auth.currentUser) {
    throw new Error('Must be signed in to rank tasks');
  }

  const response = await fetch(WORKER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-secret': APP_SECRET,
    },
    body: JSON.stringify({
      rawText,
      role: profile.role,
      energyWindow: profile.energyWindow,
      todaysWin: profile.todaysWin,
      excludedTasks,
      audioData,
    }),
  });

  if (!response.ok) {
    let errMessage = 'Worker error';
    try {
      const errJson = await response.json();
      errMessage = errJson.error || errMessage;
    } catch {
      // Ignored
    }
    throw new Error(`Failed to rank task: ${errMessage}`);
  }

  const result = await response.json();
  const taskData = result.task;

  // Create a new document reference to get a unique ID
  const taskRef = doc(collection(db, `users/${auth.currentUser.uid}/tasks`));
  const task: Task = {
    id: taskRef.id,
    title: taskData.title,
    microSteps: taskData.microSteps,
    status: 'active',
    rank: 1,
    createdAt: Date.now(),
  };

  // Save to Firestore directly from the client
  await setDoc(taskRef, task);

  return task;
}
