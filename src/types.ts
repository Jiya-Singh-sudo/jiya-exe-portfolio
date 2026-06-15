export interface Project {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  problem: string;
  process: string;
  exploration: string;
  outcome: string;
  techStack: string[];
  goals: { text: string; done: boolean }[];
  statsGained: { name: string; value: number }[];
  liveUrl?: string;
  codeUrl?: string;
  imageAlt: string;
  imageUrl: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string; // 'Systems' | 'Focus & Strategy' | 'Philosophy' etc.
  type: 'book' | 'course' | 'note' | 'quote';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  stars: number;
  quote: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
}

export interface TimelineLog {
  time: string;
  title: string;
  desc: string;
  icon: string;
  statusText: string;
}

export interface DaySegment {
  id: string; // 'morning' | 'work' | 'evening' | 'night'
  title: string;
  desc: string;
  logs: TimelineLog[];
  imageAlt: string;
  imageUrl: string;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface InteractiveAchievement extends Achievement {
  xpReward: number;
  goldReward: number;
  condition: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  icon: string;
  badgeColor: string;
}

export interface LessonLeaned {
  id: string;
  text: string;
}

export interface GardenNode {
  id: string;
  label: string;
  x: number; // percentage-based 0-100
  y: number; // percentage-based 0-100
  group: 'engineering' | 'ai' | 'life' | 'productivity' | 'creative' | 'root';
  description: string;
  extendedNotes?: string;
}

export interface StarNode {
  id: string;
  name: string;
  x: number; // percentage x (sky)
  y: number; // percentage y (sky)
  category: 'career' | 'ai-research' | 'learning' | 'personal';
  description: string;
  achieved: boolean;
  isDecorative?: boolean;
}

export interface Quest {
  id: string;
  text: string;
  xpReward: number;
  goldReward: number;
  completed: boolean;
  type: 'system' | 'custom';
}

export interface ShopItem {
  id: string;
  name: string;
  desc: string;
  cost: number;
  purchased: boolean;
  icon: string;
  effect: string;
}

export interface WeatherConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  xpModifier: number;
  effectClass: string;
  desc: string;
}

export interface XpLogEntry {
  id: string;
  source: string;
  baseXp: number;
  bonusXp: number;
  totalXp: number;
  modifier: number;
  weatherName: string;
  weatherIcon: string;
  timestamp: string;
}

export interface SecretSector {
  id: string;
  name: string;
  coords: string;
  description: string;
  hint: string;
  icon: string;
}

export interface Goal {
  id: string;
  title: string;
  progress: number;
}



