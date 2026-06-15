import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Quest, XpLogEntry, Goal } from '../types';
import { GOALS } from '../data';

// Initial quest definitions
export const INITIAL_QUESTS: Quest[] = [
  { id: 'explore-workshop', text: "Infiltrate the Guild Hall (Explore Workshop & a projects)", xpReward: 150, goldReward: 50, completed: false, type: 'system' },
  { id: 'read-library', text: "Consult the Archive Spells (Read James Clear summary)", xpReward: 120, goldReward: 40, completed: false, type: 'system' },
  { id: 'nodes-garden', text: "Audit Systems Nodes (Click 3 details in Digital Garden)", xpReward: 180, goldReward: 60, completed: false, type: 'system' },
  { id: 'summon-observatory', text: "Summon the Observatory stars (Unlock starry coordinates)", xpReward: 160, goldReward: 50, completed: false, type: 'system' },
  { id: 'buy-potion', text: "Consumables (Buy Focus Potion or items in Jiya's Cave Shop)", xpReward: 200, goldReward: 100, completed: false, type: 'system' },
];

export interface GameState {
  level: number;
  xp: number;
  gold: number;
  soundEnabled: boolean;
  activeTab: string;
  questsList: Quest[];
  unlockedPurchases: string[];
  unlockedStars: string[];
  clickedNodes: string[];
  unlockedAchievements: string[];
  visitedSectors: string[];
  inspectedTabs: string[];
  discoveredSecrets: string[];
  xpLog: XpLogEntry[];
  streakCount: number;
  lastLoginDate: string;
  streakClaimedToday: boolean;
  showIntroDialog: boolean;
  introRewardClaimed: boolean;
  goals: Goal[];
  booksRead: string[];
  hasUsedGemini: boolean;
  soundPlaysCount: number;
  usedOscillators: string[];
  showLevelUpOverlay: boolean;

  // Actions
  setLevel: (val: number | ((prev: number) => number)) => void;
  setXp: (val: number | ((prev: number) => number)) => void;
  setGold: (val: number | ((prev: number) => number)) => void;
  setSoundEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  setActiveTab: (val: string) => void;
  setQuestsList: (val: Quest[] | ((prev: Quest[]) => Quest[])) => void;
  setUnlockedPurchases: (val: string[] | ((prev: string[]) => string[])) => void;
  setUnlockedStars: (val: string[] | ((prev: string[]) => string[])) => void;
  setClickedNodes: (val: string[] | ((prev: string[]) => string[])) => void;
  setUnlockedAchievements: (val: string[] | ((prev: string[]) => string[])) => void;
  setVisitedSectors: (val: string[] | ((prev: string[]) => string[])) => void;
  setInspectedTabs: (val: string[] | ((prev: string[]) => string[])) => void;
  setDiscoveredSecrets: (val: string[] | ((prev: string[]) => string[])) => void;
  setXpLog: (val: XpLogEntry[] | ((prev: XpLogEntry[]) => XpLogEntry[])) => void;
  setStreakCount: (val: number | ((prev: number) => number)) => void;
  setLastLoginDate: (val: string | ((prev: string) => string)) => void;
  setStreakClaimedToday: (val: boolean | ((prev: boolean) => boolean)) => void;
  setShowIntroDialog: (val: boolean | ((prev: boolean) => boolean)) => void;
  setIntroRewardClaimed: (val: boolean | ((prev: boolean) => boolean)) => void;
  setGoals: (val: Goal[] | ((prev: Goal[]) => Goal[])) => void;
  setBooksRead: (val: string[] | ((prev: string[]) => string[])) => void;
  setHasUsedGemini: (val: boolean | ((prev: boolean) => boolean)) => void;
  setSoundPlaysCount: (val: number | ((prev: number) => number)) => void;
  setUsedOscillators: (val: string[] | ((prev: string[]) => string[])) => void;
  setShowLevelUpOverlay: (val: boolean | ((prev: boolean) => boolean)) => void;
  resetAll: () => void;
}

const getInitialState = () => ({
  level: 0,
  xp: 0,
  gold: 0,
  soundEnabled: true,
  activeTab: 'home',
  questsList: INITIAL_QUESTS,
  unlockedPurchases: [],
  unlockedStars: [],
  clickedNodes: [],
  unlockedAchievements: [],
  visitedSectors: ['home'],
  inspectedTabs: [],
  discoveredSecrets: [],
  xpLog: [
    {
      id: 'init-alignment',
      source: 'System Startup Alignment',
      baseXp: 180,
      bonusXp: 0,
      totalXp: 180,
      modifier: 1.0,
      weatherName: 'Clear Skylands',
      weatherIcon: 'wb_sunny',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }
  ],
  streakCount: 1,
  lastLoginDate: '',
  streakClaimedToday: false,
  showIntroDialog: true,
  introRewardClaimed: false,
  goals: GOALS,
  booksRead: [],
  hasUsedGemini: false,
  soundPlaysCount: 0,
  usedOscillators: [],
  showLevelUpOverlay: false,
});

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setLevel: (val) => set((state) => ({ level: typeof val === 'function' ? val(state.level) : val })),
      setXp: (val) => set((state) => ({ xp: typeof val === 'function' ? val(state.xp) : val })),
      setGold: (val) => set((state) => ({ gold: typeof val === 'function' ? val(state.gold) : val })),
      setSoundEnabled: (val) => set((state) => ({ soundEnabled: typeof val === 'function' ? val(state.soundEnabled) : val })),
      setActiveTab: (val) => set({ activeTab: val }),
      setQuestsList: (val) => set((state) => ({ questsList: typeof val === 'function' ? val(state.questsList) : val })),
      setUnlockedPurchases: (val) => set((state) => ({ unlockedPurchases: typeof val === 'function' ? val(state.unlockedPurchases) : val })),
      setUnlockedStars: (val) => set((state) => ({ unlockedStars: typeof val === 'function' ? val(state.unlockedStars) : val })),
      setClickedNodes: (val) => set((state) => ({ clickedNodes: typeof val === 'function' ? val(state.clickedNodes) : val })),
      setUnlockedAchievements: (val) => set((state) => ({ unlockedAchievements: typeof val === 'function' ? val(state.unlockedAchievements) : val })),
      setVisitedSectors: (val) => set((state) => ({ visitedSectors: typeof val === 'function' ? val(state.visitedSectors) : val })),
      setInspectedTabs: (val) => set((state) => ({ inspectedTabs: typeof val === 'function' ? val(state.inspectedTabs) : val })),
      setDiscoveredSecrets: (val) => set((state) => ({ discoveredSecrets: typeof val === 'function' ? val(state.discoveredSecrets) : val })),
      setXpLog: (val) => set((state) => ({ xpLog: typeof val === 'function' ? val(state.xpLog) : val })),
      setStreakCount: (val) => set((state) => ({ streakCount: typeof val === 'function' ? val(state.streakCount) : val })),
      setLastLoginDate: (val) => set((state) => ({ lastLoginDate: typeof val === 'function' ? val(state.lastLoginDate) : val })),
      setStreakClaimedToday: (val) => set((state) => ({ streakClaimedToday: typeof val === 'function' ? val(state.streakClaimedToday) : val })),
      setShowIntroDialog: (val) => set((state) => ({ showIntroDialog: typeof val === 'function' ? val(state.showIntroDialog) : val })),
      setIntroRewardClaimed: (val) => set((state) => ({ introRewardClaimed: typeof val === 'function' ? val(state.introRewardClaimed) : val })),
      setGoals: (val) => set((state) => ({ goals: typeof val === 'function' ? val(state.goals) : val })),
      setBooksRead: (val) => set((state) => ({ booksRead: typeof val === 'function' ? val(state.booksRead) : val })),
      setHasUsedGemini: (val) => set((state) => ({ hasUsedGemini: typeof val === 'function' ? val(state.hasUsedGemini) : val })),
      setSoundPlaysCount: (val) => set((state) => ({ soundPlaysCount: typeof val === 'function' ? val(state.soundPlaysCount) : val })),
      setUsedOscillators: (val) => set((state) => ({ usedOscillators: typeof val === 'function' ? val(state.usedOscillators) : val })),
      setShowLevelUpOverlay: (val) => set((state) => ({ showLevelUpOverlay: typeof val === 'function' ? val(state.showLevelUpOverlay) : val })),
      
      resetAll: () => set(getInitialState()),
    }),
    {
      name: 'jiya-save-file',
    }
  )
);
