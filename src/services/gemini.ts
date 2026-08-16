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

  const maxRetries = 2;
  let attempt = 0;
  let response: Response | null = null;

  while (attempt < maxRetries) {
    try {
      response = await fetch(WORKER_URL, {
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

      if (response.ok) break; // Success!

      // If it's a 502/503/504 (Service Unavailable/Bad Gateway), retry
      if (![502, 503, 504].includes(response.status)) {
        break; // Don't retry client errors (400, 401, etc)
      }
    } catch (err) {
      // Network failure, will retry
    }

    attempt++;
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Wait 1.5s before retry
    }
  }

  if (!response || !response.ok) {
    let errMessage = 'Worker error';
    try {
      const errJson = await response?.json();
      errMessage = errJson?.error || errMessage;
    } catch {
      // Ignored
    }
    throw new Error(`Failed to rank task: ${errMessage}`);
  }

  const result = await response.json();
  
  if (result.isCrisis) {
    throw new Error('CRISIS_DETECTED');
  }

  const taskData = result.task;

  if (!auth.currentUser) {
    throw new Error('User is not authenticated');
  }
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
