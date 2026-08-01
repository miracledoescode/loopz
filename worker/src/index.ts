import { buildRankingPrompt } from './prompts';
import { jwtVerify, createRemoteJWKSet } from 'jose';

const FIREBASE_PROJECT_ID = 'loopz-a6a7b';
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));

async function verifyFirebaseToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export interface Env {
  GEMINI_KEY: string;
}

const GEMINI_MODEL = 'gemini-flash-latest';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing Bearer token' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const userPayload = await verifyFirebaseToken(idToken);
    
    if (!userPayload) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid Firebase ID Token' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { rawText, role, energyWindow, todaysWin, excludedTasks, audioData } = body;

    if (!rawText || !rawText.trim()) {
      return new Response(JSON.stringify({ error: 'rawText is required.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const prompt = buildRankingPrompt({
      rawText,
      role: role ?? 'other',
      energyWindow: energyWindow ?? 'morning',
      todaysWin: todaysWin ?? '',
      currentTime: new Date().toISOString(),
      excludedTasks: excludedTasks ?? [],
    });

    if (!env.GEMINI_KEY) {
      return new Response(JSON.stringify({ error: 'Gemini API key not configured.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    try {
      const userParts: any[] = [{ text: prompt }];
      if (audioData) {
        userParts.push({
          inlineData: {
            mimeType: audioData.mimeType,
            data: audioData.data,
          },
        });
      }

      const response = await fetch(`${GEMINI_URL}?key=${env.GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: userParts }],
          generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
        }),
      });

      if (!response.ok) {
        return new Response(JSON.stringify({ error: `Gemini call failed: ${response.statusText}` }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const json: any = await response.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        return new Response(JSON.stringify({ error: 'Gemini returned unparseable JSON.' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // ─── Validate response shape ──────────────────────────────
      if (!parsed?.task?.title || typeof parsed.task.title !== 'string') {
        return new Response(JSON.stringify({ error: 'Gemini response missing task.title.' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (!Array.isArray(parsed.task.microSteps) || parsed.task.microSteps.length < 3) {
        return new Response(JSON.stringify({ error: `Expected 3-5 micro-steps, got ${parsed.task?.microSteps?.length ?? 0}.` }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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

      const task = {
        id: crypto.randomUUID(), // Assuming the client can use this ID, or generate one client-side
        title: parsed.task.title,
        microSteps: validatedSteps,
        status: 'active',
        rank: 1,
        createdAt: Date.now(),
      };

      return new Response(JSON.stringify({ task }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  },
};
