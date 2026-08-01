import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';
import { buildRankingPrompt } from './prompts';

if (!admin.apps.length) admin.initializeApp();

const GEMINI_MODEL = 'gemini-flash-latest';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface RankTaskRequest {
  rawText: string;
  excludedTasks?: string[];
}

export const rankTask = functions.runWith({ secrets: ['GEMINI_KEY'] }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Sign in required.');
  }

  const { rawText, excludedTasks } = data as RankTaskRequest;
  if (!rawText || !rawText.trim()) {
    throw new functions.https.HttpsError('invalid-argument', 'rawText is required.');
  }

  const userDoc = await admin.firestore().doc(`users/${context.auth.uid}`).get();
  const profile = userDoc.data() ?? {};

  const prompt = buildRankingPrompt({
    rawText,
    role: profile.role ?? 'other',
    energyWindow: profile.energyWindow ?? 'morning',
    todaysWin: profile.todaysWin ?? '',
    currentTime: new Date().toISOString(),
    excludedTasks: excludedTasks ?? [],
  });

  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    throw new functions.https.HttpsError('failed-precondition', 'Gemini API key not configured.');
  }

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
    }),
  });

  if (!response.ok) {
    throw new functions.https.HttpsError('internal', `Gemini call failed: ${response.statusText}`);
  }

  const json: any = await response.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new functions.https.HttpsError('internal', 'Gemini returned unparseable JSON.');
  }

  // ─── Validate response shape ──────────────────────────────
  if (!parsed?.task?.title || typeof parsed.task.title !== 'string') {
    throw new functions.https.HttpsError('internal', 'Gemini response missing task.title.');
  }
  if (!Array.isArray(parsed.task.microSteps) || parsed.task.microSteps.length < 3) {
    throw new functions.https.HttpsError(
      'internal',
      `Expected 3-5 micro-steps, got ${parsed.task?.microSteps?.length ?? 0}.`
    );
  }
  // Cap at 5 micro-steps even if Gemini over-generates
  const validatedSteps = parsed.task.microSteps.slice(0, 5).map((s: any) => {
    const parsedMin = Number(s.estMinutes);
    const est = isNaN(parsedMin) || s.estMinutes == null || s.estMinutes === '' ? 10 : parsedMin;
    return {
      text: String(s.text ?? ''),
      estMinutes: Math.max(1, Math.min(60, est)),
      done: false,
    };
  });

  const taskRef = admin.firestore().collection(`users/${context.auth.uid}/tasks`).doc();
  const task = {
    id: taskRef.id,
    title: parsed.task.title,
    microSteps: validatedSteps,
    status: 'active',
    rank: 1,
    createdAt: Date.now(),
  };
  await taskRef.set(task);

  return { task };
});
