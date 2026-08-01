import type { Role, EnergyWindow } from '@/types';

export const ROLES: { value: Role; emoji: string; label: string }[] = [
  { value: 'student', emoji: '📚', label: 'Student' },
  { value: 'developer', emoji: '💻', label: 'Developer' },
  { value: 'trader', emoji: '📈', label: 'Trader' },
  { value: 'creator', emoji: '🎨', label: 'Creator' },
  { value: 'other', emoji: '✨', label: 'Other' },
];

export const WINDOWS: { value: EnergyWindow; emoji: string; label: string; time: string }[] = [
  { value: 'morning', emoji: '🌅', label: 'Morning', time: '6am – 12pm' },
  { value: 'afternoon', emoji: '☀️', label: 'Afternoon', time: '12pm – 6pm' },
  { value: 'night', emoji: '🌙', label: 'Night', time: '6pm – 12am' },
];
