export type Role = 'student' | 'developer' | 'trader' | 'creator' | 'other';
export type EnergyWindow = 'morning' | 'afternoon' | 'night';

export interface UserProfile {
  name: string;
  role: Role;
  energyWindow: EnergyWindow;
  todaysWin: string;
}

export interface MicroStep {
  text: string;
  estMinutes: number;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  microSteps: MicroStep[];
  status: 'active' | 'done' | 'parked';
  rank: number;
  createdAt: number;
}

export interface Sprint {
  id: string;
  taskId: string;
  microStepIndex: number;
  startTime: number;
  endTime?: number;
  pausedAt?: number;
  totalPausedMs: number;
  completed: boolean;
}
