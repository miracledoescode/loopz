import { renderHook, act } from '@testing-library/react-native';
import * as Linking from 'expo-linking';
import { useQuickIntake } from '../src/hooks/useQuickIntake';
import { useTasks } from '../src/hooks/useTasks';

// Mock dependencies
jest.mock('expo-linking', () => ({
  useURL: jest.fn(),
  parse: jest.fn(),
}));

jest.mock('../src/hooks/useTasks', () => ({
  useTasks: jest.fn(),
}));

describe('useQuickIntake', () => {
  let submitBrainDumpMock: jest.Mock;

  beforeEach(() => {
    submitBrainDumpMock = jest.fn().mockResolvedValue(undefined);
    (useTasks as jest.Mock).mockReturnValue({
      submitBrainDump: submitBrainDumpMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('submits a brain dump when URL contains text', async () => {
    const mockUrl = 'loopz://dump?text=Call%20the%20accountant';
    (Linking.useURL as jest.Mock).mockReturnValue(mockUrl);
    (Linking.parse as jest.Mock).mockReturnValue({
      path: 'dump',
      queryParams: { text: 'Call the accountant' },
    });

    renderHook(() => useQuickIntake());

    // Should automatically call submitBrainDump with the decoded text
    expect(submitBrainDumpMock).toHaveBeenCalledWith('Call the accountant');
  });

  it('does nothing if URL is null or path is not dump', () => {
    (Linking.useURL as jest.Mock).mockReturnValue(null);
    renderHook(() => useQuickIntake());
    expect(submitBrainDumpMock).not.toHaveBeenCalled();

    (Linking.useURL as jest.Mock).mockReturnValue('loopz://other?text=hello');
    (Linking.parse as jest.Mock).mockReturnValue({
      path: 'other',
      queryParams: { text: 'hello' },
    });
    renderHook(() => useQuickIntake());
    expect(submitBrainDumpMock).not.toHaveBeenCalled();
  });

  it('does nothing if text query param is missing', () => {
    (Linking.useURL as jest.Mock).mockReturnValue('loopz://dump');
    (Linking.parse as jest.Mock).mockReturnValue({
      path: 'dump',
      queryParams: {},
    });
    renderHook(() => useQuickIntake());
    expect(submitBrainDumpMock).not.toHaveBeenCalled();
  });
});
