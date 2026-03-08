/**
 * Shared config for onboarding & profile skills (planets/galaxies)
 */
export const SUGGESTIONS: Record<string, string[]> = {
  language: ['English', 'Spanish', 'Mandarin', 'French', 'Japanese', 'German'],
  fitness: ['Yoga', 'HIIT', 'Running', 'Weightlifting', 'Pilates', 'Meditation'],
  tech: ['Python', 'React', 'JavaScript', 'AI/ML', 'Data Science', 'Rust'],
  design: ['Figma', 'Photoshop', 'UI/UX', 'Illustration', '3D Modeling', 'Canva'],
  other: ['Astronomy', 'History', 'Photography', 'Writing', 'Travel', 'Cooking']
};

export const GALAXY_IDS = ['language', 'fitness', 'tech', 'design', 'other'] as const;
export type GalaxyId = typeof GALAXY_IDS[number];

export interface GalaxyItem {
  id: GalaxyId;
  labelKey: string; // e.g. 'hero.skills.language'
  color: string;
}

export const GALAXY_COLORS: Record<GalaxyId, string> = {
  language: '#A78BFA',
  fitness: '#F472B6',
  tech: '#60A5FA',
  design: '#FCD34D',
  other: '#34D399'
};
