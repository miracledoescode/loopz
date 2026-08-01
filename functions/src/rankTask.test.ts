import fft from 'firebase-functions-test';

jest.mock('node-fetch');
const mockedFetch = require('node-fetch') as any;

jest.mock('firebase-admin', () => {
  const setMock = jest.fn();
  const getMock = jest.fn().mockResolvedValue({ data: () => ({ role: 'developer' }) });
  return {
    apps: ['mock'],
    initializeApp: jest.fn(),
    firestore: () => ({
      collection: () => ({
        doc: () => ({
          id: 'mock-id',
          set: setMock,
        }),
      }),
      doc: () => ({
        get: getMock,
      }),
    }),
  };
});

import { rankTask } from './rankTask';

const testEnv = fft();

describe('rankTask validation', () => {
  const mockContext = { auth: { uid: 'user123' } };
  const mockData = { rawText: 'do laundry' };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_KEY = 'mock-key';
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  const mockGeminiResponse = (text: string) => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text }] } }]
      })
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
    
    const wrapped = testEnv.wrap(rankTask as any);
    const result = await wrapped(mockData, mockContext);
    
    expect(result.task.title).toBe('Do laundry');
    expect(result.task.microSteps).toHaveLength(3);
    expect(result.task.microSteps[0].text).toBe('Sort clothes');
  });

  test('Response missing task.title throws HttpsError', async () => {
    mockGeminiResponse(JSON.stringify({
      task: {
        microSteps: [{ text: 'Step 1', estMinutes: 5 }]
      }
    }));
    
    const wrapped = testEnv.wrap(rankTask as any);
    await expect(wrapped(mockData, mockContext)).rejects.toThrow('Gemini response missing task.title.');
  });

  test('Response with 2 micro-steps throws HttpsError', async () => {
    mockGeminiResponse(JSON.stringify({
      task: {
        title: 'Task',
        microSteps: [
          { text: 'Step 1', estMinutes: 5 },
          { text: 'Step 2', estMinutes: 5 }
        ]
      }
    }));
    
    const wrapped = testEnv.wrap(rankTask as any);
    await expect(wrapped(mockData, mockContext)).rejects.toThrow(/Expected 3-5 micro-steps/);
  });

  test('Response with 8 micro-steps gets capped at 5', async () => {
    mockGeminiResponse(JSON.stringify({
      task: {
        title: 'Task',
        microSteps: Array(8).fill({ text: 'Step', estMinutes: 5 })
      }
    }));
    
    const wrapped = testEnv.wrap(rankTask as any);
    const result = await wrapped(mockData, mockContext);
    
    expect(result.task.microSteps).toHaveLength(5);
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
    
    const wrapped = testEnv.wrap(rankTask as any);
    const result = await wrapped(mockData, mockContext);
    
    expect(result.task.microSteps[0].estMinutes).toBe(1);
    expect(result.task.microSteps[1].estMinutes).toBe(1);
    expect(result.task.microSteps[2].estMinutes).toBe(60);
    expect(result.task.microSteps[3].estMinutes).toBe(60);
  });
});
