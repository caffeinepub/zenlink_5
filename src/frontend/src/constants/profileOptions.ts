// Predefined options for Interests and Perspectives
// Used in both Profile editing and onboarding flows

export const PREDEFINED_INTERESTS = [
  'Philosophy',
  'Psychology',
  'Art & Creativity',
  'Music',
  'Literature',
  'Science & Technology',
  'Nature & Environment',
  'Mindfulness & Meditation',
  'Personal Growth',
  'Social Justice',
  'Health & Wellness',
  'Travel & Culture',
  'Gaming',
  'Sports & Fitness',
  'Cooking & Food',
  'Photography',
  'Film & Cinema',
  'Entrepreneurship',
  'Education',
  'Spirituality',
] as const;

export const PREDEFINED_PERSPECTIVES = [
  'Optimist',
  'Realist',
  'Idealist',
  'Pragmatist',
  'Skeptic',
  'Empath',
  'Analyst',
  'Visionary',
  'Traditionalist',
  'Progressive',
  'Minimalist',
  'Maximalist',
  'Introvert',
  'Extrovert',
  'Ambivert',
  'Growth Mindset',
  'Curious Explorer',
  'Deep Thinker',
  'Action-Oriented',
  'Reflective',
] as const;

export type PredefinedInterest = typeof PREDEFINED_INTERESTS[number];
export type PredefinedPerspective = typeof PREDEFINED_PERSPECTIVES[number];
