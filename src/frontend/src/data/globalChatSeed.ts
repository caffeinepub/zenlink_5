// Seed data for Global Chat to avoid empty state
export interface SeedMessage {
  content: string;
  perspective: string;
  displayName: string;
  avatar: string;
  hoursAgo: number;
}

export const globalChatSeed: SeedMessage[] = [
  {
    content: "Today I realized that asking for help isn't a weakness. It's actually a sign of self-awareness and courage.",
    perspective: "Growth",
    displayName: "Luna",
    avatar: "🦢",
    hoursAgo: 2,
  },
  {
    content: "Feeling grateful for the small moments today. Sometimes it's the quiet conversations that mean the most.",
    perspective: "Gratitude",
    displayName: "River",
    avatar: "🌊",
    hoursAgo: 5,
  },
  {
    content: "Anyone else find it hard to balance being there for others while taking care of yourself? Learning to set boundaries.",
    perspective: "Reflection",
    displayName: "Sage",
    avatar: "🪷",
    hoursAgo: 8,
  },
  {
    content: "Had a breakthrough in therapy today. It's amazing how much we carry without realizing it.",
    perspective: "Support",
    displayName: "Phoenix",
    avatar: "🦋",
    hoursAgo: 12,
  },
  {
    content: "Starting to understand that healing isn't linear. Some days are harder than others, and that's okay.",
    perspective: "Hope",
    displayName: "Willow",
    avatar: "🦄",
    hoursAgo: 18,
  },
  {
    content: "Proud of myself for speaking up in a difficult conversation today. My voice matters.",
    perspective: "Confidence",
    displayName: "Atlas",
    avatar: "🐯",
    hoursAgo: 24,
  },
  {
    content: "Sometimes I wonder if I'm making the right choices. Learning to trust my intuition more.",
    perspective: "Uncertainty",
    displayName: "Nova",
    avatar: "🌙",
    hoursAgo: 36,
  },
  {
    content: "Celebrating a small win today - I finally finished that project I've been putting off!",
    perspective: "Joy",
    displayName: "Ember",
    avatar: "🦊",
    hoursAgo: 48,
  },
];
