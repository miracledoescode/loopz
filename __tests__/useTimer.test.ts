import { renderHook, act } from '@testing-library/react-native';
import { useTimer } from '../src/hooks/useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts automatically if autoStart is true', () => {
    const { result } = renderHook(() => useTimer(true));
    
    expect(result.current.isPaused).toBe(false);
    expect(result.current.elapsed).toBe(0);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.elapsed).toBe(2);
  });

  it('starts paused if autoStart is false', () => {
    const { result } = renderHook(() => useTimer(false));
    
    expect(result.current.isPaused).toBe(true);
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.elapsed).toBe(0);
  });

  it('toggles pause state', () => {
    const { result } = renderHook(() => useTimer(false));
    
    act(() => {
      result.current.toggle(); // Start
    });
    
    expect(result.current.isPaused).toBe(false);

    act(() => {
      jest.advanceTimersByTime(3000);
      result.current.toggle(); // Pause
    });

    expect(result.current.isPaused).toBe(true);
    expect(result.current.elapsed).toBe(3);

    act(() => {
      jest.advanceTimersByTime(2000); // Should not increase elapsed
    });

    expect(result.current.elapsed).toBe(3);
  });

  it('resets elapsed time and pauses', () => {
    const { result } = renderHook(() => useTimer(true));
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.elapsed).toBe(5);

    act(() => {
      result.current.reset();
    });

    expect(result.current.elapsed).toBe(0);
    expect(result.current.isPaused).toBe(true);
  });
});
