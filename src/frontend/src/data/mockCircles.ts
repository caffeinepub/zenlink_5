// Shared mock circles data for frontend-only circle navigation
export interface MockCircle {
  id: string;
  name: string;
  topic: string;
  members: number;
  maxMembers: number;
}

export const mockCircles: MockCircle[] = [
  { id: '1', name: 'Growth Seekers', topic: 'Growth', members: 5, maxMembers: 7 },
  { id: '2', name: 'Healing Hearts', topic: 'Healing', members: 4, maxMembers: 7 },
  { id: '3', name: 'Career Navigators', topic: 'Career', members: 6, maxMembers: 7 },
];
