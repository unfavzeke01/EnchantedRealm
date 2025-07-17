export const categories = [
  {
    id: 'hope',
    name: 'Hope & Inspiration',
    emoji: '🌱',
    color: 'category-hope',
    description: 'Messages of hope, inspiration, and positive outlook'
  },
  {
    id: 'reflection',
    name: 'Reflection & Thoughts',
    emoji: '🌙',
    color: 'category-reflection',
    description: 'Deep thoughts, reflections, and contemplations'
  },
  {
    id: 'gratitude',
    name: 'Gratitude & Thanks',
    emoji: '☀️',
    color: 'category-gratitude',
    description: 'Expressions of gratitude and thankfulness'
  },
  {
    id: 'support',
    name: 'Support & Encouragement',
    emoji: '💙',
    color: 'category-support',
    description: 'Messages of support and encouragement'
  },
  {
    id: 'dreams',
    name: 'Dreams & Aspirations',
    emoji: '✨',
    color: 'category-dreams',
    description: 'Dreams, goals, and aspirations for the future'
  }
] as const;

export type CategoryId = typeof categories[number]['id'];
