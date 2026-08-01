import { doc, setDoc, collection } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import type { Task, UserProfile } from '@/types';

// The Cloudflare Worker URL serving as the secure proxy to Gemini
const WORKER_URL = 'https://loopz-rank-task.miraclesayscode.workers.dev';

export async function rankTaskLocal(
  rawText: string,
  profile: UserProfile,
  excludedTasks: string[] = [],
  audioData?: { mimeType: string; data: string }
): Promise<Task> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('You must be signed in to create a task.');
  }

  const idToken = await currentUser.getIdToken();

  const response = await fetch(WORKER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
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
