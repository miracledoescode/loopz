import { useAppStore } from '../src/store/useAppStore';
import type { Task } from '../src/types';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset state before each test
    useAppStore.setState({
      profile: null,
      hasCompletedOnboarding: false,
      currentTask: null,
      completedSprints: [],
      recentDumps: [],
      activeMicroStepIndex: 0,
    });
  });

  it('completes onboarding correctly', () => {
    expect(useAppStore.getState().hasCompletedOnboarding).toBe(false);
    useAppStore.getState().completeOnboarding();
    expect(useAppStore.getState().hasCompletedOnboarding).toBe(true);
  });

  it('sets and clears profile correctly', () => {
    const mockProfile = { name: 'Alice', role: 'developer' as const, energyWindow: 'afternoon' as const, todaysWin: 'Design home page' };
    useAppStore.getState().setProfile(mockProfile);
    expect(useAppStore.getState().profile).toEqual(mockProfile);

    useAppStore.getState().clearProfile();
    expect(useAppStore.getState().profile).toBeNull();
  });

  it('handles sprint progression correctly', () => {
    const mockTask: Task = {
      id: 'task-1',
      title: 'Test Sprint',
      status: 'active',
      rank: 1,
      microSteps: [
        { text: 'Step 1', done: false, estMinutes: 5 },
        { text: 'Step 2', done: false, estMinutes: 5 },
      ],
      createdAt: Date.now(),
    };

    useAppStore.getState().setCurrentTask(mockTask);
    
    // Start sprint
    useAppStore.getState().startSprint();
    expect(useAppStore.getState().activeMicroStepIndex).toBe(0);

    // Advance step
    useAppStore.getState().advanceMicroStep();
    expect(useAppStore.getState().activeMicroStepIndex).toBe(1);
    expect(useAppStore.getState().currentTask?.microSteps[0].done).toBe(true);

    // Complete sprint
    useAppStore.getState().completeSprint();
    const state = useAppStore.getState();
    
    // Task should be marked done
    expect(state.currentTask?.status).toBe('done');
    expect(state.currentTask?.microSteps[0].done).toBe(true);
    expect(state.currentTask?.microSteps[1].done).toBe(true);

    // Task should be in completedSprints
    expect(state.completedSprints.length).toBe(1);
    expect(state.completedSprints[0].id).toBe('task-1');
  });
});
