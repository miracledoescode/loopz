/**
 * Welcome to Cloudflare Workers!
 *
 * This worker acts as the secure backend proxy between the Loopz mobile app
 * and the Google Gemini API. It keeps our API keys secure and handles the
 * prompt formatting.
 */

export interface Env {
  GEMINI_API_KEY: string;
}

const SYSTEM_PROMPT = `You are the AI brain behind Loopz, a minimalist productivity app for overwhelmed people. 
The user is going to provide an audio transcript (or audio file) of them ranting about their chaotic day and tasks.
Your ONLY job is to cut through the noise, identify the single most critical bottleneck or most important action item, and return it.

Format your response exactly as a JSON object:
{
  "title": "Short action title (e.g., Email Sarah about designs)",
  "reason": "One short sentence explaining why this is the highest priority."
}`;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // CORS Handling
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { text, audioBase64 } = await request.json<{ text?: string, audioBase64?: string }>();

      if (!text && !audioBase64) {
        return new Response("Must provide text or audioBase64", { status: 400 });
      }

      // Prepare Gemini Payload
      // Note: For simplicity in this demo, we are showing the text payload structure. 
      // If passing base64 audio, the 'inlineData' object should be used per Gemini Docs.
      const geminiPayload: any = {
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [
          {
            role: "user",
            parts: []
          }
        ],
        generationConfig: {
          response_mime_type: "application/json",
        }
      };

      if (audioBase64) {
        geminiPayload.contents[0].parts.push({
          inlineData: {
            mimeType: "audio/mp3",
            data: audioBase64
          }
        });
      } else if (text) {
        geminiPayload.contents[0].parts.push({
          text: text
        });
      }

      // Call Gemini API
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiPayload),
        }
      );

      const geminiData = await geminiResponse.json();

      if (!geminiResponse.ok) {
        console.error("Gemini Error:", geminiData);
        return new Response(JSON.stringify({ error: "Failed to process via AI" }), { 
          status: 502,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // Extract the JSON text returned by Gemini
      const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      return new Response(candidateText, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  },
};
