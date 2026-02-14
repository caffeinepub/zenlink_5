// Allowed emoji avatars for user profiles
export const ALLOWED_AVATARS = [
  '🦢',
  '🦄',
  '🐷',
  '🪷',
  '🐯',
  '🦊',
  '🦚',
  '🌙',
  '🌊',
  '❄️',
  '🦋',
  '💸',
  '💎',
] as const;

export type AllowedAvatar = typeof ALLOWED_AVATARS[number];

export function isValidAvatar(avatar: string): boolean {
  return ALLOWED_AVATARS.includes(avatar as AllowedAvatar);
}
