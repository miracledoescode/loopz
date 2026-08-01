import worker from './index';
import { jwtVerify } from 'jose';

// Mock jose
jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));

// Mock global fetch
const originalFetch = globalThis.fetch;
beforeAll(() => {
  globalThis.fetch = jest.fn() as any;
  // Mock crypto for randomUUID in tests
  Object.defineProperty(globalThis, 'crypto', {
    value: { randomUUID: () => 'mock-uuid' }
  });
});
afterAll(() => {
  globalThis.fetch = originalFetch;
});

describe('Worker validation', () => {
  const env = { GEMINI_KEY: 'mock-key' };
  const mockCtx = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: { sub: 'mock-uid' } });
  });

  const mockGeminiResponse = (text: string) => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text }] } }]
      })
    });
  };

  const makeRequest = (body: any) => {
    return new Request('https://worker.local/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer mock-id-token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  };

  test('Valid response with 3-5 micro-steps parses correctly', async () => {
    mockGeminiResponse(JSON.stringify({
      task: {
        title: 'Do laundry',
        microSteps: [
          { text: 'Sort clothes', estMinutes: 5 },
          { text: 'Put in washer', estMinutes: 2 },
          { text: 'Start machine', estMinutes: 1 }
        ]
      }
    }));
    
    const req = makeRequest({ rawText: 'do laundry' });
    const res = await worker.fetch(req, env, mockCtx);
    expect(res.status).toBe(200);
    const json: any = await res.json();
    
    expect(json.task.title).toBe('Do laundry');
    expect(json.task.microSteps).toHaveLength(3);
    expect(json.task.microSteps[0].text).toBe('Sort clothes');
  });

  test('Response missing task.title returns 502', async () => {
    mockGeminiResponse(JSON.stringify({
      task: {
        microSteps: [{ text: 'Step 1', estMinutes: 5 }]
      }
    }));
    
    const req = makeRequest({ rawText: 'do laundry' });
    const res = await worker.fetch(req, env, mockCtx);
    expect(res.status).toBe(502);
    const json: any = await res.json();
    expect(json.error).toMatch(/missing task\.title/);
  });

  test('Response with 2 micro-steps returns 502', async () => {
    mockGeminiResponse(JSON.stringify({
      task: {
        title: 'Task',
        microSteps: [
          { text: 'Step 1', estMinutes: 5 },
          { text: 'Step 2', estMinutes: 5 }
        ]
      }
    }));
    
    const req = makeRequest({ rawText: 'do laundry' });
    const res = await worker.fetch(req, env, mockCtx);
    expect(res.status).toBe(502);
    const json: any = await res.json();
    expect(json.error).toMatch(/Expected 3-5 micro-steps/);
  });

  test('Response with 8 micro-steps gets capped at 5', async () => {
    mockGeminiResponse(JSON.stringify({
      task: {
        title: 'Task',
        microSteps: Array(8).fill({ text: 'Step', estMinutes: 5 })
      }
    }));
    
    const req = makeRequest({ rawText: 'do laundry' });
    const res = await worker.fetch(req, env, mockCtx);
    expect(res.status).toBe(200);
    const json: any = await res.json();
    expect(json.task.microSteps).toHaveLength(5);
  });

  test('estMinutes outside 1-60 gets clamped', async () => {
    mockGeminiResponse(JSON.stringify({
      task: {
        title: 'Task',
        microSteps: [
          { text: 'Step 1', estMinutes: 0 },
          { text: 'Step 2', estMinutes: -10 },
          { text: 'Step 3', estMinutes: 90 },
          { text: 'Step 4', estMinutes: 61 }
        ]
      }
    }));
    
    const req = makeRequest({ rawText: 'do laundry' });
    const res = await worker.fetch(req, env, mockCtx);
    expect(res.status).toBe(200);
    const json: any = await res.json();
    expect(json.task.microSteps[0].estMinutes).toBe(1);
    expect(json.task.microSteps[1].estMinutes).toBe(1);
    expect(json.task.microSteps[2].estMinutes).toBe(60);
    expect(json.task.microSteps[3].estMinutes).toBe(60);
  });
});
