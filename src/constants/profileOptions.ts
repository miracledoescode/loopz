import type { Role, EnergyWindow } from '@/types';

export const ROLES: { value: Role; label: string }[] = [
  { value: 'developer', label: 'Developer' },
  { value: 'creator', label: 'Creator' },
  { value: 'student', label: 'Student' },
  { value: 'trader', label: 'Trader' },
  { value: 'other', label: 'Other' },
];

export const WINDOWS: { value: EnergyWindow; label: string; time: string }[] = [
  { value: 'morning', label: 'Morning', time: '6am – 12pm' },
  { value: 'afternoon', label: 'Afternoon', time: '12pm – 6pm' },
  { value: 'night', label: 'Night', time: '6pm – 12am' },
];
