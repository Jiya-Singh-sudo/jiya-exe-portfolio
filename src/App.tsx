import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, 
  Flame, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Github, 
  ExternalLink, 
  Lock, 
  Volume2, 
  VolumeX, 
  Award, 
  RotateCcw, 
  Plus, 
  Check, 
  Trash2, 
  Calendar, 
  Compass, 
  FolderGit2, 
  Wrench, 
  X, 
  ShieldAlert, 
  Lightbulb, 
  Send 
} from 'lucide-react';

import { Project, Book, DaySegment, Achievement, InteractiveAchievement, Certificate, Quest, GardenNode, XpLogEntry, SecretSector } from './types';
import { PROJECTS, BOOKS, BOOK_LESSONS, DAY_SEGMENTS, ACHIEVEMENTS, INTERACTIVE_ACHIEVEMENTS, CERTIFICATES, LESSONS_LEARNED, WEATHER_CONDITIONS, SECRET_SECTORS } from './data';
import { playClick, playCoin, playXPChime, playQuestSuccess, playLevelUpChime, startWeatherAmbience, stopWeatherAmbience, updateWeatherSoundToggle } from './utils/sound';

import { DialogGreeting } from './components/DialogGreeting';
import { WorldMap } from './components/WorldMap';
import { useGameStore } from './store/game-store';
import { MindMap } from './components/MindMap';
import { ConstellationPanel } from './components/ConstellationPanel';
import { ExtrasShop } from './components/ExtrasShop';
import { WizardLab } from './components/WizardLab';
import DayInTheLife from './components/DayInTheLife';

// Initial quest definitions
const INITIAL_QUESTS: Quest[] = [
  { id: 'explore-workshop', text: "Infiltrate the Guild Hall (Explore Workshop & a projects)", xpReward: 150, goldReward: 50, completed: false, type: 'system' },
  { id: 'read-library', text: "Consult the Archive Spells (Read James Clear summary)", xpReward: 120, goldReward: 40, completed: false, type: 'system' },
  { id: 'nodes-garden', text: "Audit Systems Nodes (Click 3 details in Digital Garden)", xpReward: 180, goldReward: 60, completed: false, type: 'system' },
  { id: 'summon-observatory', text: "Summon the Observatory stars (Unlock starry coordinates)", xpReward: 160, goldReward: 50, completed: false, type: 'system' },
  { id: 'buy-potion', text: "Consumables (Buy Focus Potion or items in Jiya's Cave Shop)", xpReward: 200, goldReward: 100, completed: false, type: 'system' },
];

const ROUTE_MAP: Record<string, string> = {
  home: '/',
  workshop: '/workshop',
  library: '/archives',
  life: '/life',
  progress: '/quest',
  garden: '/garden',
  observatory: '/observatory',
  lab: '/wizardLabs',
  cave: '/extras',
  stats: '/stats'
};

const TAB_MAP: Record<string, string> = {
  '/': 'home',
  '/workshop': 'workshop',
  '/archives': 'library',
  '/life': 'life',
  '/quest': 'progress',
  '/garden': 'garden',
  '/observatory': 'observatory',
  '/wizardLabs': 'lab',
  '/extras': 'cave',
  '/stats': 'stats'
};

const getTabFromPath = (path: string): string => {
  const normalized = path.replace(/\/$/, '') || '/';
  for (const [route, tab] of Object.entries(TAB_MAP)) {
    if (normalized === route || normalized.endsWith(route)) {
      return tab;
    }
  }
  return 'home';
};

interface RPGNotification {
  id: string;
  text: string;
  icon: string;
  gold?: number;
  xp?: number;
}

const getLevelXpCap = (lvl: number): number => {
  return Math.max(1, lvl) * 100;
};

const getVisitorTitle = (lvl: number): string => {
  if (lvl === 0) return 'Newbie';
  if (lvl < 5) return 'Apprentice';
  if (lvl < 10) return 'Builder';
  if (lvl < 20) return 'Engineer';
  return 'Sorcerer Engineer';
};

export default function App() {
  // Zustand persistent game state
  const level = useGameStore(state => state.level);
  const setLevel = useGameStore(state => state.setLevel);
  const xp = useGameStore(state => state.xp);
  const setXp = useGameStore(state => state.setXp);
  const gold = useGameStore(state => state.gold);
  const setGold = useGameStore(state => state.setGold);
  const soundEnabled = useGameStore(state => state.soundEnabled);
  const setSoundEnabled = useGameStore(state => state.setSoundEnabled);
  const activeTab = useGameStore(state => state.activeTab);
  const setActiveTab = useGameStore(state => state.setActiveTab);
  const questsList = useGameStore(state => state.questsList);
  const setQuestsList = useGameStore(state => state.setQuestsList);
  const unlockedPurchases = useGameStore(state => state.unlockedPurchases);
  const setUnlockedPurchases = useGameStore(state => state.setUnlockedPurchases);
  const unlockedStars = useGameStore(state => state.unlockedStars);
  const setUnlockedStars = useGameStore(state => state.setUnlockedStars);
  const clickedNodes = useGameStore(state => state.clickedNodes);
  const setClickedNodes = useGameStore(state => state.setClickedNodes);
  const unlockedAchievements = useGameStore(state => state.unlockedAchievements);
  const setUnlockedAchievements = useGameStore(state => state.setUnlockedAchievements);
  const visitedSectors = useGameStore(state => state.visitedSectors);
  const setVisitedSectors = useGameStore(state => state.setVisitedSectors);
  const inspectedTabs = useGameStore(state => state.inspectedTabs);
  const setInspectedTabs = useGameStore(state => state.setInspectedTabs);
  const discoveredSecrets = useGameStore(state => state.discoveredSecrets);
  const setDiscoveredSecrets = useGameStore(state => state.setDiscoveredSecrets);
  const xpLog = useGameStore(state => state.xpLog);
  const setXpLog = useGameStore(state => state.setXpLog);
  const streakCount = useGameStore(state => state.streakCount);
  const setStreakCount = useGameStore(state => state.setStreakCount);
  const lastLoginDate = useGameStore(state => state.lastLoginDate);
  const setLastLoginDate = useGameStore(state => state.setLastLoginDate);
  const streakClaimedToday = useGameStore(state => state.streakClaimedToday);
  const setStreakClaimedToday = useGameStore(state => state.setStreakClaimedToday);
  const showIntroDialog = useGameStore(state => state.showIntroDialog);
  const setShowIntroDialog = useGameStore(state => state.setShowIntroDialog);
  const introRewardClaimed = useGameStore(state => state.introRewardClaimed);
  const setIntroRewardClaimed = useGameStore(state => state.setIntroRewardClaimed);
  const showLevelUpOverlay = useGameStore(state => state.showLevelUpOverlay);
  const setShowLevelUpOverlay = useGameStore(state => state.setShowLevelUpOverlay);
  
  const goals = useGameStore(state => state.goals);
  const setGoals = useGameStore(state => state.setGoals);
  const booksRead = useGameStore(state => state.booksRead);
  const setBooksRead = useGameStore(state => state.setBooksRead);
  const hasUsedGemini = useGameStore(state => state.hasUsedGemini);
  const setHasUsedGemini = useGameStore(state => state.setHasUsedGemini);
  const soundPlaysCount = useGameStore(state => state.soundPlaysCount);
  const setSoundPlaysCount = useGameStore(state => state.setSoundPlaysCount);
  const usedOscillators = useGameStore(state => state.usedOscillators);
  const setUsedOscillators = useGameStore(state => state.setUsedOscillators);
  const resetAll = useGameStore(state => state.resetAll);

  // Weather state (non-persistent environment cycle)
  const [currentWeather, setCurrentWeather] = useState(WEATHER_CONDITIONS[0]);

  // Transient UI states
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);
  const [newQuestText, setNewQuestText] = useState<string>("");
  
  const [showRpgModal, setShowRpgModal] = useState<boolean>(false);
  const [rpgModalConfig, setRpgModalConfig] = useState<{
    type: 'success' | 'error' | 'warning';
    title: string;
    subtitle: string;
    body: string;
    rewards?: { label: string; value: string }[];
    buttonText: string;
  }>({
    type: 'success',
    title: 'QUEST COMPLETED',
    subtitle: 'Transmission Received',
    body: "Your signal has been delivered to Jiya's transceiving mailbox.",
    rewards: [{ label: 'Gold', value: '+50 Gold' }, { label: 'XP', value: '+50 XP' }],
    buttonText: 'CONTINUE JOURNEY'
  });

  const triggerRpgModal = (
    type: 'success' | 'error' | 'warning',
    title: string,
    subtitle: string,
    body: string,
    rewards?: { label: string; value: string }[],
    buttonText = 'CONTINUE JOURNEY'
  ) => {
    setRpgModalConfig({ type, title, subtitle, body, rewards, buttonText });
    setShowRpgModal(true);
  };
  
  // Detailed Inspect item states
  const [selectedProject, setSelectedProject] = useState<Project>(PROJECTS[0]);
  const [projectTab, setProjectTab] = useState<'problem' | 'process' | 'exploration' | 'outcome'>('problem');
  const [libraryTypeFilter, setLibraryTypeFilter] = useState<'all' | 'book' | 'course' | 'note' | 'quote'>('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeDaySegment, setActiveDaySegment] = useState<string>('work');
  const [timelineYearFilter, setTimelineYearFilter] = useState<number>(2026);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [statsSubTab, setStatsSubTab] = useState<'trophies' | 'secrets'>('trophies');

  // Overlays
  const [notifications, setNotifications] = useState<RPGNotification[]>([]);
  const [contactMessage, setContactMessage] = useState({ name: '', email: '', body: '' });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionProgress, setTransmissionProgress] = useState(0);
  const [transceiverPlaceholder, setTransceiverPlaceholder] = useState("Inscribe spell request/letter body...");

  useEffect(() => {
    if (contactMessage.name === "" && contactMessage.email === "" && contactMessage.body === "") {
      const placeholders = [
        "Looking for a backend engineer...",
        "Let's build something together...",
        "I have an opportunity...",
        "Greetings from another guild...",
        "Need a Sorcerer Engineer for our stack...",
        "Seeking cooperation on a new legendary project..."
      ];
      setTransceiverPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)]);
    }
  }, [contactMessage.name, contactMessage.email, contactMessage.body]);

  // Sound triggers wrapping with muter toggler
  const triggerAudio = (soundFn: () => void) => {
    if (soundEnabled) {
      soundFn();
    }
  };

  // Push notifications toast logic
  const addNotification = (text: string, xpAmt?: number, goldAmt?: number, icon = 'stars') => {
    const freshId = Date.now().toString() + Math.random().toString();
    const weatherModifier = currentWeather ? currentWeather.xpModifier : 1.0;
    const finalXp = xpAmt !== undefined && xpAmt > 0 ? Math.round(xpAmt * weatherModifier) : undefined;

    setNotifications(prev => [...prev, { id: freshId, text, xp: finalXp, gold: goldAmt, icon }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== freshId));
    }, 4500);
  };

  // Quest Autocomplete Helper triggers XP + Gold + Levels Up scale
  const completeQuestAndAward = (questId: string) => {
    setQuestsList(prev => prev.map(q => {
      if (q.id === questId && !q.completed) {
        addNotification(`Quest Completed: "${q.text}"!`, q.xpReward, q.goldReward, 'verified');
        triggerAudio(playQuestSuccess);
        claimRewards(q.goldReward, q.xpReward, `Completed Quest: "${q.text}"`, false);
        return { ...q, completed: true };
      }
      return q;
    }));
  };

  const claimRewards = (rewardGold: number, rewardXp: number, actionName = 'General Activity', triggerNotification = false) => {
    if (rewardGold > 0) setGold(prev => prev + rewardGold);
    
    // Apply dynamic weather condition XP modifier safely to XP rewards!
    const weatherModifier = currentWeather ? currentWeather.xpModifier : 1.0;
    const modifiedXp = Math.round(rewardXp * weatherModifier);

    if (rewardXp > 0) {
      setXpLog(prev => [
        {
          id: Math.random().toString(36).substring(2, 9) + Date.now().toString(),
          source: actionName,
          baseXp: rewardXp,
          bonusXp: modifiedXp - rewardXp,
          totalXp: modifiedXp,
          modifier: weatherModifier,
          weatherName: currentWeather ? currentWeather.name : 'Clear Skylands',
          weatherIcon: currentWeather ? currentWeather.icon : 'wb_sunny',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        ...prev
      ].slice(0, 50));
    }

    if (modifiedXp > 0) {
      const currentLevel = useGameStore.getState().level;
      const levelXpCap = getLevelXpCap(currentLevel);

      setXp(prev => {
        const targetXp = prev + modifiedXp;
        if (targetXp >= levelXpCap) {
          // Trigger Level Up Event!
          setLevel(prevLvl => prevLvl + 1);
          setGold(prevG => prevG + 100); // 100G Level Up bonus!
          setShowLevelUpOverlay(true);
          triggerAudio(playLevelUpChime);
          addNotification(`⭐ LEVEL UP! Reached LVL ${currentLevel + 1}! Claimed +100G!`, 0, 100, 'trophy');
          return targetXp - levelXpCap;
        } else {
          triggerAudio(playXPChime);
          return targetXp;
        }
      });
    }

    if (triggerNotification) {
      addNotification(actionName, rewardXp, rewardGold);
    }
  };

  // Unlock Achievements Helper
  const unlockAchievement = (achId: string) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(achId)) return prev;
      const target = INTERACTIVE_ACHIEVEMENTS.find(a => a.id === achId);
      if (target) {
        triggerAudio(playLevelUpChime);
        addNotification(`🏆 UNLOCKED ACCOMPLISHMENT: "${target.title}"!`, target.xpReward, target.goldReward, 'emoji_events');
        claimRewards(target.goldReward, target.xpReward, `Unlocked Achievement: "${target.title}"`, false);
        return [...prev, achId];
      }
      return prev;
    });
  };

  // Nav sector selector awarding XP rewards on fresh visits
  const handleSelectTab = (tabId: string, shouldPushHistory = true) => {
    triggerAudio(playClick);

    if (shouldPushHistory) {
      const targetRoute = ROUTE_MAP[tabId] || '/';
      if (window.location.pathname !== targetRoute) {
        window.history.pushState(null, '', targetRoute);
      }
    }

    setActiveTab(tabId);

    setVisitedSectors(prev => {
      if (prev.includes(tabId)) return prev;
      const updated = [...prev, tabId];
      
      const exploreRewardXp = 25;
      const exploreRewardGold = 10;
      addNotification(`Explored Sector: "${tabId.toUpperCase()}"!`, exploreRewardXp, exploreRewardGold, 'explore');
      claimRewards(exploreRewardGold, exploreRewardXp, `Explored Region: "${tabId.toUpperCase()}"`, false);
      
      return updated;
    });
  };

  const handleDiscoverSecret = (secretId: string, label: string) => {
    setDiscoveredSecrets(prev => {
      if (prev.includes(secretId)) return prev;
      const updated = [...prev, secretId];
      localStorage.setItem('jiya_discovered_secrets', JSON.stringify(updated));
      
      const secretRewardGold = 35;
      const secretRewardXp = 120;
      addNotification(`👑 DISCOVERED SECRET SECTOR: ${label.toUpperCase()}!`, secretRewardXp, secretRewardGold, 'stars');
      claimRewards(secretRewardGold, secretRewardXp, `Discovered Secret Sector: "${label}"`, false);
      
      return updated;
    });
  };

  // Migrate legacy state where level=22 to a clean visitor state
  useEffect(() => {
    if (level === 22) {
      resetAll();
    }
  }, [level, resetAll]);

  // Daily Streak automatic synchronization on startup
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const curStreak = useGameStore.getState().streakCount;
    const lastLogin = useGameStore.getState().lastLoginDate;

    if (!lastLogin) {
      // Clean slate initialization
      setStreakCount(1);
      setLastLoginDate(todayStr);
      setStreakClaimedToday(true);
      
      const { gold: goldBonus, xp: xpBonus } = getStreakRewards(1);
      setTimeout(() => {
        addNotification(`🔥 Daily Check-In Initiative! 1-Day Streak Active!`, xpBonus, goldBonus, 'local_fire_department');
        claimRewards(goldBonus, xpBonus, 'Daily Check-In starter reward!', false);
      }, 1500);
    } else {
      const lastDate = new Date(lastLogin);
      lastDate.setHours(0, 0, 0, 0);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      const diffMs = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Logged in earlier today
        setStreakClaimedToday(true);
      } else if (diffDays === 1) {
        // Consecutive entry!
        const nextStreak = curStreak + 1;
        setStreakCount(nextStreak);
        setLastLoginDate(todayStr);
        setStreakClaimedToday(true);

        const { gold: goldBonus, xp: xpBonus } = getStreakRewards(nextStreak);
        
        setTimeout(() => {
          addNotification(`🔥 Consecutive Entry! ${nextStreak}-Day Streak Active!`, xpBonus, goldBonus, 'local_fire_department');
          claimRewards(goldBonus, xpBonus, `Checked in consecutively for Day ${nextStreak}`, false);
        }, 1500);
      } else if (diffDays > 1) {
        // Streak broke, restore back to Day 1
        setStreakCount(1);
        setLastLoginDate(todayStr);
        setStreakClaimedToday(true);

        const { gold: goldBonus, xp: xpBonus } = getStreakRewards(1);
        setTimeout(() => {
          addNotification(`🔥 Streak Sync Restored! 1-Day Streak Active!`, xpBonus, goldBonus, 'local_fire_department');
          claimRewards(goldBonus, xpBonus, 'Daily login streak restored!', false);
        }, 1500);
      } else {
        // Safe-guard timezone fluctuations
        setStreakClaimedToday(true);
      }
    }
  }, []);

  // Listen to browser Back/Forward navigation to update in-memory activeTab state
  useEffect(() => {
    const handlePopState = () => {
      const currentTab = getTabFromPath(window.location.pathname);
      handleSelectTab(currentTab, false);
    };
    window.addEventListener('popstate', handlePopState);

    // If loaded directly at a specific route, track it as explored
    const initialTab = getTabFromPath(window.location.pathname);
    if (initialTab !== 'home') {
      setVisitedSectors(prev => {
        if (prev.includes(initialTab)) return prev;
        return [...prev, initialTab];
      });
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const simulateNextDayCheckIn = () => {
    triggerAudio(playCoin);
    const nextStreak = streakCount + 1;
    setStreakCount(nextStreak);

    const { gold: goldBonus, xp: xpBonus } = getStreakRewards(nextStreak);

    // Set simulated yesterday date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setLastLoginDate(yesterday.toISOString().split('T')[0]);

    setStreakClaimedToday(true);

    addNotification(`🎯 Simulated Consecutive Day! ${nextStreak}-Day Streak!`, xpBonus, goldBonus, 'local_fire_department');
    claimRewards(goldBonus, xpBonus, `Check-In Simulation (Consecutive Day ${nextStreak})`, false);
  };

  const resetStreakTracker = () => {
    triggerAudio(playClick);
    setStreakCount(1);
    setLastLoginDate('');
    setStreakClaimedToday(false);
    addNotification(`🗑️ Streak telemetries purged! Reset to Day 1.`, 0, 0, 'delete');
  };

  const getStreakRewards = (day: number) => {
    switch (day) {
      case 1: return { gold: 10, xp: 30 };
      case 2: return { gold: 20, xp: 50 };
      case 3: return { gold: 25, xp: 60 };
      case 4: return { gold: 30, xp: 70 };
      case 5: return { gold: 35, xp: 80 };
      case 6: return { gold: 40, xp: 90 };
      case 7:
      default: return { gold: 45, xp: 100 };
    }
  };

  // Weather cycle controls
  const cycleWeather = () => {
    triggerAudio(playClick);
    const currentIndex = WEATHER_CONDITIONS.findIndex(w => w.id === currentWeather.id);
    const nextIndex = (currentIndex + 1) % WEATHER_CONDITIONS.length;
    const nextWeather = WEATHER_CONDITIONS[nextIndex];
    setCurrentWeather(nextWeather);
    addNotification(`🌈 Atmosphere Synced: "${nextWeather.name}" (${nextWeather.xpModifier}x XP)`, 0, 0, 'cloud');
  };

  // Weather system auto-transitions shift atmospheric system every 90 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWeather(prev => {
        const nextIndex = (WEATHER_CONDITIONS.findIndex(w => w.id === prev.id) + 1) % WEATHER_CONDITIONS.length;
        const nextWeather = WEATHER_CONDITIONS[nextIndex];
        addNotification(`Weather Shift: "${nextWeather.name}" (${nextWeather.xpModifier}x XP)`, 0, 0, 'air');
        return nextWeather;
      });
    }, 90000);
    return () => clearInterval(timer);
  }, []);

  // Synchronize weather background procedural sound synthesis
  useEffect(() => {
    startWeatherAmbience(currentWeather.id, soundEnabled);
    return () => {
      stopWeatherAmbience();
    };
  }, [currentWeather.id, soundEnabled]);

  // Tracking page clicks & systems targets to trigger achievements
  useEffect(() => {
    if (activeTab === 'workshop') {
      completeQuestAndAward('explore-workshop');
    }
    if (activeTab === 'observatory') {
      completeQuestAndAward('summon-observatory');
    }
    if (unlockedPurchases.includes('potion-red') || unlockedPurchases.includes('elixir-blue')) {
      completeQuestAndAward('buy-potion');
    }
  }, [activeTab, unlockedPurchases]);

  // Cartographer achievement evaluator
  useEffect(() => {
    // We check if visitedSectors is at least 5
    if (visitedSectors.length >= 5 && !unlockedAchievements.includes('cartographer')) {
      unlockAchievement('cartographer');
    }
  }, [visitedSectors, unlockedAchievements]);

  // Grand Architect spec tab checklist tracking
  useEffect(() => {
    if (activeTab === 'workshop' && !inspectedTabs.includes(projectTab)) {
      setInspectedTabs(prev => {
        if (prev.includes(projectTab)) return prev;
        const next = [...prev, projectTab];
        if (next.length === 4 && !unlockedAchievements.includes('grand-architect')) {
          unlockAchievement('grand-architect');
        }
        return next;
      });
    }
  }, [projectTab, activeTab, unlockedAchievements]);

  // Synthesizer achievements evaluator
  useEffect(() => {
    if (soundPlaysCount >= 1 && !unlockedAchievements.includes('cast-first-spell')) {
      unlockAchievement('cast-first-spell');
    }
    if (soundPlaysCount >= 5 && !unlockedAchievements.includes('create-5-sounds')) {
      unlockAchievement('create-5-sounds');
    }
    if (usedOscillators.includes('sine') &&
        usedOscillators.includes('square') &&
        usedOscillators.includes('sawtooth') &&
        usedOscillators.includes('triangle') &&
        !unlockedAchievements.includes('try-all-oscillators')) {
      unlockAchievement('try-all-oscillators');
    }
  }, [soundPlaysCount, usedOscillators, unlockedAchievements]);

  // Clicked nodes counter triggers
  const handleSetClickedNode = (nodeId: string) => {
    if (!clickedNodes.includes(nodeId)) {
      const current = [...clickedNodes, nodeId];
      setClickedNodes(current);
      if (current.length >= 3) {
        completeQuestAndAward('nodes-garden');
      }
    }
  };

  // Book reader tracking action
  const handleReadBook = (book: Book) => {
    triggerAudio(playClick);
    setSelectedBook(book);
    unlockAchievement('spell-binder');

    if (!booksRead.includes(book.id)) {
      setBooksRead([...booksRead, book.id]);
      addNotification(`Finished Reading Summary of "${book.title}"!`, 30, 5, 'auto_stories');
      claimRewards(5, 30, `Read Book Summary: "${book.title}"`, false);
    }

    if (book.id === 'atomic-habits') {
      completeQuestAndAward('read-library');
    }
  };

  // Purchasing shop items handler
  const handlePurchaseItem = (itemId: string, cost: number) => {
    if (gold < cost) return;
    setGold(prev => prev - cost);
    setUnlockedPurchases(prev => [...prev, itemId]);
    addNotification(`Acquired: ${itemId.replaceAll('-', ' ')}!`, 0, 0, 'shield');
    triggerAudio(playCoin);
  };

  // Dice/General adjust handler
  const handleAdjustGold = (amount: number) => {
    setGold(prev => Math.max(0, prev + amount));
  };

  // Adding customizable quests
  const handleAddCustomQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestText.trim()) return;

    triggerAudio(playClick);
    const newQuest: Quest = {
      id: 'custom-' + Date.now().toString(),
      text: newQuestText,
      xpReward: 50,
      goldReward: 20,
      completed: false,
      type: 'custom'
    };

    setQuestsList(prev => [newQuest, ...prev]);
    setNewQuestText("");
    addNotification(`Added custom quest objective: "${newQuest.text}"!`, 0, 0, 'checklist');
  };

  // Checking off a quest item
  const handleToggleQuest = (questId: string) => {
    triggerAudio(playClick);
    setQuestsList(prev => prev.map(q => {
      if (q.id === questId) {
        if (!q.completed) {
          addNotification(`Quest complete: "${q.text}"!`, q.xpReward, q.goldReward, 'check_circle');
          triggerAudio(playQuestSuccess);
          claimRewards(q.goldReward, q.xpReward, `Completed Quest: "${q.text}"`, false);
          return { ...q, completed: true };
        } else {
          // Revert completion
          addNotification(`Reverted objective: "${q.text}"`, 0, 0, 'history');
          return { ...q, completed: false };
        }
      }
      return q;
    }));
  };

  // Deleting a quest path
  const handleDeleteQuest = (questId: string) => {
    triggerAudio(playClick);
    const tar = questsList.find(q => q.id === questId);
    setQuestsList(prev => prev.filter(q => q.id !== questId));
    if (tar) {
      addNotification(`Deleted objective: "${tar.text}"`, 0, 0, 'delete');
    }
  };

  // Checking off project objectives
  const handleToggleProjectGoal = (projId: string, goalText: string) => {
    triggerAudio(playClick);
    PROJECTS.forEach(p => {
      if (p.id === projId) {
        p.goals = p.goals.map(g => {
          if (g.text === goalText) {
            const nowDone = !g.done;
            if (nowDone) {
              addNotification(`Step Complete: +15 XP!`, 15, 5, 'task_alt');
              triggerAudio(playQuestSuccess);
              claimRewards(5, 15, `Completed Step: "${goalText}"`, false);
            }
            return { ...g, done: nowDone };
          }
          return g;
        });
      }
    });
    // Force rerender selected projection variables
    setSelectedProject({ ...selectedProject });
  };

  // Sending Jiya a contact letter
  const handleSendContactMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.name || !contactMessage.email || !contactMessage.body) {
      triggerAudio(playClick);
      triggerRpgModal(
        'warning', 
        'SIGNAL FAILURE', 
        'Incomplete Connection', 
        'Please complete all message slots to establish a transceiver link.',
        undefined,
        'RETURN TO TRANSMITTER'
      );
      return;
    }

    triggerAudio(playClick);
    setIsTransmitting(true);
    setTransmissionProgress(0);

    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setTransmissionProgress(progress);

      if (progress >= 100) {
        clearInterval(progressInterval);
        
        // Execute transmission API call in nested scope
        (async () => {
          try {
            const response = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: contactMessage.name,
                email: contactMessage.email,
                message: contactMessage.body
              })
            });

            if (!response.ok) {
              throw new Error('Transceiver error');
            }

            triggerAudio(playQuestSuccess);
            addNotification("MESSAGE SENT! Jiya's transceiver received your signal!", 50, 50, 'mail');
            claimRewards(50, 50, `Transmitted Msg: "${contactMessage.name}"`, false);
            setContactMessage({ name: '', email: '', body: '' });
            setIsTransmitting(false);

            triggerRpgModal(
              'success',
              'QUEST COMPLETED',
              'Transmission Received',
              "Your signal has been delivered to Jiya's transceiving mailbox.",
              [{ label: 'Gold', value: '+50 Gold' }, { label: 'XP', value: '+50 XP' }]
            );
          } catch (err) {
            console.error(err);
            setIsTransmitting(false);
            triggerRpgModal(
              'error',
              'SIGNAL LOST',
              'Connection Terminated',
              'Failed to emit transceiver signal. The local space-time link is too weak.',
              undefined,
              'RETRY TRANSMISSION'
            );
          }
        })();
      }
    }, 50);
  };

  // Quick helper stars filter counting
  const totalStarsCount = unlockedStars.length;

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans selection:bg-primary/20 flex flex-col relative pb-16">
      {/* Ambient glass CRT scanline scanlines overlay */}
      <div className="scanlines" />

      {/* 1.5 Daily Streak & Check-In Modal Panel */}
      <AnimatePresence>
        {showStreakModal && (
          <motion.div 
            id="streak-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-center select-none"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -30 }}
              className="max-w-md w-full bg-surface-container border-2 border-orange-500 rounded-xl p-6 carved-panel shadow-[0_0_25px_rgba(249,115,22,0.25)] relative text-left"
            >
              {/* Flame spark decorative style */}
              <div className="absolute top-4 right-4 text-orange-500 animate-pulse">
                <span className="material-symbols-outlined text-[32px]">local_fire_department</span>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-orange-500 text-[24px]">workspace_premium</span>
                <h3 className="font-display font-extrabold text-base text-on-surface uppercase tracking-wider leading-none">
                  Atmospheric Log: Streak Dynamic
                </h3>
              </div>

              {/* Central Streak Flame graphic */}
              <div className="bg-[#151512] border border-orange-950 rounded-lg p-5 flex flex-col items-center justify-center text-center relative overflow-hidden mb-5">
                {/* Background glow shadow */}
                <div className="absolute w-32 h-32 rounded-full bg-orange-600/10 blur-xl pointer-events-none" />
                
                <span className="material-symbols-outlined text-[54px] text-orange-500 animate-bounce leading-none drop-shadow-[0_0_6px_rgba(249,115,22,0.6)]">
                  local_fire_department
                </span>
                <div className="font-display font-black text-3xl text-orange-100 mt-2 leading-none">
                  {streakCount} Day{streakCount > 1 ? 's' : ''}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-outline mt-1 font-bold">
                  Active Consecutive Login Streak
                </div>
                {lastLoginDate && (
                  <div className="text-[8px] font-mono text-on-surface-variant bg-[#1d1d19] border border-outline-variant/35 px-2 py-0.5 rounded-full mt-3 leading-none">
                    Last sync: {lastLoginDate} (Checked in: {streakClaimedToday ? 'CONFIRMED' : 'STALE'})
                  </div>
                )}
              </div>

              {/* 7-Day Checklist visualization */}
              <h4 className="font-display font-extrabold text-[10px] uppercase tracking-wider text-secondary mb-2 select-none">
                Weekly Consecutive Checkpoints
              </h4>
              <div className="grid grid-cols-7 gap-1.5 mb-5 select-none">
                {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                  // Figure out if this day is checked off in current week
                  const normalizedCurrentDay = ((streakCount - 1) % 7) + 1;
                  const isChecked = dayNum < normalizedCurrentDay || (dayNum === normalizedCurrentDay && streakClaimedToday);
                  const isToday = dayNum === normalizedCurrentDay;

                  // Gold/XP rewards breakdown list
                  const dayGold = 10 + Math.min(dayNum * 5, 55);
                  const dayXP = 30 + Math.min(dayNum * 10, 110);

                  return (
                    <div 
                      key={dayNum}
                      className={`relative flex flex-col items-center p-2 rounded border font-mono transition-all duration-300 ${
                        isChecked 
                          ? 'bg-orange-950/20 border-orange-500/50 text-orange-300 shadow-[0_0_8px_rgba(249,115,22,0.1)]' 
                          : isToday
                            ? 'bg-[#252520] border-secondary text-secondary animate-pulse shadow-[0_0_6px_rgba(242,202,80,0.1)]'
                            : 'bg-[#151512] border-outline-variant/30 text-outline'
                      }`}
                      title={`Day ${dayNum} Reward: +${dayGold}G, +${dayXP}XP`}
                    >
                      <div className="text-[8px] uppercase tracking-wider font-semibold leading-none mb-1">
                        D0{dayNum}
                      </div>
                      
                      <div className="w-5 h-5 rounded-full border flex items-center justify-center transition-all bg-[#1a1a17]" style={{ borderColor: isChecked ? '#f97316' : (isToday ? '#f2ca50' : 'rgba(255,255,255,0.08)') }}>
                        {isChecked ? (
                          <span className="material-symbols-outlined text-[12px] text-orange-500 font-bold leading-none">done</span>
                        ) : (
                          <span className="material-symbols-outlined text-[10px] text-outline font-bold leading-none">lock</span>
                        )}
                      </div>

                      <div className="text-[7px] leading-tight font-extrabold mt-1.5 uppercase tracking-tighter">
                        +{dayGold}G
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rewards Scale Info Card */}
              <div className="bg-[#1c1c19] border border-outline-variant/50 rounded-lg p-3 font-mono text-[9px] flex flex-col gap-1.5 mb-5 select-none leading-relaxed text-outline">
                <div className="font-extrabold text-[9.5px] text-orange-400 uppercase tracking-wide flex items-center gap-1 mb-1 select-none">
                  <span className="material-symbols-outlined text-[13px]">military_tech</span>
                  Streak Rewards Calibration:
                </div>
                <div className="flex items-center justify-between">
                  <span>Day 1:</span> <span className="text-white">+10G / +30XP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Day 2:</span> <span className="text-white">+20G / +50XP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Day 3 - 6:</span> <span className="text-white">Gradually Increasing scaling</span>
                </div>
                <div className="flex items-center justify-between font-bold text-orange-200">
                  <span>Day 7+ Peak:</span> <span className="text-orange-400">+45G / +100XP max reward bonus!</span>
                </div>
              </div>

              {/* Action Simulation buttons and Dismiss controls */}
              <div className="flex flex-col gap-2">
                <button 
                  onClick={simulateNextDayCheckIn}
                  className="w-full font-mono font-bold text-[10px] tracking-wider uppercase py-2 px-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded border border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)] hover:shadow-[0_0_15px_rgba(249,115,22,0.35)] transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                >
                  <span className="material-symbols-outlined text-[13px]">fast_forward</span>
                  Simulate Consecutive Login (Advance Day)
                </button>
                
                <div className="flex gap-2">
                  <button 
                    onClick={resetStreakTracker}
                    className="flex-1 font-mono font-bold text-[9px] tracking-wider uppercase py-1.5 px-2 bg-[#1a1a17] hover:bg-red-950/20 hover:text-red-400 border border-outline-variant/50 hover:border-red-950 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer text-outline"
                  >
                    <span className="material-symbols-outlined text-[12px]">filter_alt_off</span>
                    Reset Log
                  </button>
                  <button 
                    onClick={() => { triggerAudio(playClick); setShowStreakModal(false); }}
                    className="flex-1 font-mono font-bold text-[10px] tracking-wider uppercase py-2 px-3 bg-secondary hover:bg-secondary/95 text-on-secondary border border-[#ffd55a]/20 rounded text-center cursor-pointer shadow"
                  >
                    Return to Map
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Level Up Big Fanfare Particle Overlay */}
      <AnimatePresence>
        {showLevelUpOverlay && (
          <motion.div 
            id="level-up-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-6 text-center select-none"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -30 }}
              className="max-w-md w-full bg-surface-container-high border-2 border-primary rounded-xl p-8 carved-panel shadow-2xl relative"
            >
              {/* Star sparkles */}
              <div className="absolute top-4 left-4 text-primary animate-bounce">
                <span className="material-symbols-outlined text-[36px]">sparkles</span>
              </div>
              <div className="absolute top-4 right-4 text-primary animate-ping">
                <span className="material-symbols-outlined text-[20px]">star</span>
              </div>

              <div className="w-24 h-24 rounded-full border-4 border-dotted border-primary bg-primary/15 flex items-center justify-center mx-auto mb-6 shadow-xl animate-spin" />

              <h2 className="font-display font-extrabold text-[36px] text-primary tracking-widest text-glow leading-none">LEVEL UP!</h2>
              <p className="font-mono text-xs text-secondary tracking-widest uppercase mt-1">Status Synchronized</p>

              <div className="my-6 py-4 bg-background border border-outline-variant rounded-lg">
                <span className="font-mono text-[10px] text-outline uppercase tracking-[0.2em] block">New Level Unlocked</span>
                <span className="font-display font-bold text-4xl text-on-surface">LEVEL {level}</span>
                <span className="font-sans text-xs text-on-surface-variant block mt-2 px-4 italic">"Your developer capabilities are expanding! Standard mana ratio and code processing velocities have increased."</span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center bg-primary/10 border border-primary/30 p-2.5 rounded-md font-mono text-xs">
                  <span className="text-primary font-bold">LEVEL BONUS CLAIMED:</span>
                  <span className="text-yellow-400 font-bold flex items-center gap-1">
                    +100 GOLD COINS
                  </span>
                </div>
                
                <button 
                  onClick={() => { triggerAudio(playClick); setShowLevelUpOverlay(false); }}
                  className="press-start-btn py-3 bg-primary hover:bg-primary/95 text-on-primary rounded font-mono font-bold text-sm tracking-widest uppercase shadow border border-white mt-1"
                >
                  Continue Quest
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RPG Reward/Status Modal */}
      <AnimatePresence>
        {showRpgModal && (
          <motion.div
            id="rpg-reward-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="reward-overlay"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="reward-modal"
              style={{
                borderColor: 
                  rpgModalConfig.type === 'error' ? '#ef4444' : 
                  rpgModalConfig.type === 'warning' ? '#f97316' : 
                  '#f2ca50',
                boxShadow: 
                  rpgModalConfig.type === 'error' ? '0 0 30px rgba(239,68,68,0.15), inset 0 0 15px rgba(239,68,68,0.08)' : 
                  rpgModalConfig.type === 'warning' ? '0 0 30px rgba(249,115,22,0.15), inset 0 0 15px rgba(249,115,22,0.08)' : 
                  '0 0 30px rgba(242,202,80,0.15), inset 0 0 15px rgba(242,202,80,0.08)'
              }}
            >
              <div 
                className="reward-header flex items-center justify-between"
                style={{
                  color: 
                    rpgModalConfig.type === 'error' ? '#ef4444' : 
                    rpgModalConfig.type === 'warning' ? '#f97316' : 
                    '#f2ca50',
                  borderBottomColor: 
                    rpgModalConfig.type === 'error' ? 'rgba(239,68,68,0.2)' : 
                    rpgModalConfig.type === 'warning' ? 'rgba(249,115,22,0.2)' : 
                    'rgba(242,202,80,0.2)'
                }}
              >
                <span className="flex items-center gap-2 font-display">
                  <span className="material-symbols-outlined text-[18px]">
                    {rpgModalConfig.type === 'error' ? 'error' : 
                     rpgModalConfig.type === 'warning' ? 'warning' : 
                     'stars'}
                  </span>
                  {rpgModalConfig.title}
                </span>
                <button 
                  onClick={() => { triggerAudio(playClick); setShowRpgModal(false); }}
                  className="text-outline hover:text-on-surface transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="reward-content">
                <h3 
                  className="font-display font-bold text-lg mb-3"
                  style={{
                    color: 
                      rpgModalConfig.type === 'error' ? '#fca5a5' : 
                      rpgModalConfig.type === 'warning' ? '#fed7aa' : 
                      '#f5e6a8'
                  }}
                >
                  {rpgModalConfig.subtitle}
                </h3>

                <p className="font-sans text-sm text-[#b8b8a6] leading-relaxed mb-4">
                  {rpgModalConfig.body}
                </p>

                {rpgModalConfig.rewards && rpgModalConfig.rewards.length > 0 && (
                  <div className="rewards mb-5 flex gap-4">
                    {rpgModalConfig.rewards.map((reward, idx) => (
                      <div 
                        key={idx}
                        className="flex-1 text-center border p-3 font-mono font-bold text-sm"
                        style={{
                          borderColor: 'rgba(242, 202, 80, 0.3)',
                          background: 'rgba(242, 202, 80, 0.05)',
                          color: '#facc15'
                        }}
                      >
                        {reward.value}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    triggerAudio(playClick);
                    setShowRpgModal(false);
                  }}
                  className="w-full py-3.5 font-bold font-mono tracking-widest text-center cursor-pointer rounded transition-opacity hover:opacity-90"
                  style={{
                    background: 
                      rpgModalConfig.type === 'error' ? 'linear-gradient(90deg, #dc2626, #ef4444)' : 
                      rpgModalConfig.type === 'warning' ? 'linear-gradient(90deg, #ea580c, #f97316)' : 
                      'linear-gradient(90deg, #d4af37, #facc15)',
                    color: rpgModalConfig.type === 'success' ? '#1a1a1a' : '#ffffff'
                  }}
                >
                  {rpgModalConfig.buttonText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Slide Toast Notifications Stacker */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full font-mono text-[11px]">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              className="p-3 bg-surface-container border-2 border-outline-variant text-[#d4af37] flex items-center gap-3 rounded shadow-lg backdrop-blur-md relative"
            >
              <div className="p-1 rounded bg-yellow-950 text-primary">
                <span className="material-symbols-outlined text-[16px]">
                  {n.icon === 'trophy' ? 'emoji_events' : n.icon === 'verified' ? 'verified_user' : n.icon}
                </span>
              </div>
              <div className="flex-grow select-none">
                <p className="text-on-surface text-xs font-semibold font-sans">{n.text}</p>
                <div className="flex gap-4 mt-0.5 text-[10px]">
                  {n.xp !== undefined && n.xp > 0 && <span className="text-primary font-bold">+{n.xp} EXP</span>}
                  {n.gold !== undefined && n.gold > 0 && <span className="text-secondary font-bold">+{n.gold} GOLD</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3. Top Master Heads Up Display banner */}
      <header className="sticky top-0 bg-background/95 border-b-2 border-outline-variant z-30 select-none pb-2.5 pt-3 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Left Avatar Portrait Info Block */}
          <div className="flex flex-col md:flex-row items-center gap-4.5 w-full lg:w-auto">
            {/* Jiya Profile Block */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Custom JIYA.EXE Logo Icon */}
              <div className="relative flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="JIYA.EXE Logo"
                  width={40}
                  height={40}
                  className="rounded-full drop-shadow-[0_0_8px_rgba(242,202,80,0.5)] select-none"
                />
                {unlockedPurchases.includes('legendary-cape') && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500/30 to-transparent animate-pulse pointer-events-none" />
                )}
              </div>

              {/* Hologram Circle Portrait frame */}
              <div className={`relative w-11 h-11 border-2 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high transition-all ${
                unlockedPurchases.includes('legendary-cape') 
                  ? 'border-[#ff007f] shadow-[0_0_12px_rgba(255,0,127,0.4)]' 
                  : 'border-primary'
              }`}>
                <img 
                  alt="Jiya portrait avatar"
                  className="w-full h-full object-cover select-none"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDD7FMhUjA0kK9i-HW1opUvIWfO0k-2u--boOJ15vOlu25X9PjrZFGxjNnCn3KOjFjXFALox177-d_jE3ZXjMa8TNUy-wEVB1YsdFUbWsWGIF6XEhBkGEM3XuLKUAdQixwxmGyHl7l03_k7yFpPJTHLIgB7gm7QZLb0mvBHCUpIdZDuLYTs3wFDj7Pue6t94P2hNvBMUnZCk_Bh1D77o4IGN-usyOSnK-tHX6Yct3GD6GYSGuTxedmMmeXCzjqd5CTB7jZUZXeFJs"
                />
                {unlockedPurchases.includes('legendary-cape') && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-transparent mix-blend-color-dodge animate-pulse" />
                )}
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-extrabold text-base tracking-wider">JIYA.EXE</span>
                  <span className="font-mono text-[8px] bg-primary/20 border border-primary/35 px-1.5 py-0.2 rounded text-primary font-extrabold select-none">
                    LVL 22
                  </span>
                </div>
                <div className="font-mono text-[9px] text-[#eb9800] uppercase font-extrabold leading-none mt-1">
                  {unlockedPurchases.includes('legendary-cape') ? 'Architect Overseer' : 'Sorcerer Engineer'}
                </div>
              </div>
            </div>

            {/* Divider line on larger screens */}
            <div className="hidden md:block h-9 w-[1px] bg-outline-variant/65" />

            {/* Visitor Progress Block */}
            <div className="flex-grow w-full md:w-auto min-w-[200px] md:min-w-[260px] max-w-sm md:max-w-none bg-[#171714] border border-outline-variant/40 rounded p-2 flex flex-col justify-center">
              <div className="flex items-baseline justify-between font-mono text-[8px] sm:text-[9.5px]">
                <span className="font-display font-black text-secondary tracking-widest text-[9px] uppercase">VISITOR.EXE</span>
                <span className="text-outline uppercase font-extrabold">
                  {getVisitorTitle(level)} <span className="text-primary font-black ml-1">(LVL {level})</span>
                </span>
              </div>

              {/* Progress bar and XP metrics */}
              <div className="flex items-center gap-2 mt-1 w-full">
                <div className="flex-grow h-3 bg-[#11110f] border border-outline-variant/50 rounded-sm overflow-hidden p-[1px] relative">
                  <div 
                    className="h-full exp-bar-fill rounded-sm transition-all duration-500" 
                    style={{ width: `${Math.min(100, (xp / getLevelXpCap(level)) * 100)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-white font-extrabold text-glow select-none">
                    {xp} / {getLevelXpCap(level)} EXP
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Central Actions & Sound buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center lg:justify-end w-full lg:w-auto">
            
            {/* Weather HUD Widget */}
            <button 
              onClick={cycleWeather}
              className="bg-[#1c1c19] border border-outline-variant rounded px-2 py-1 sm:px-2.5 sm:py-1.5 flex items-center gap-1.5 sm:gap-2 shadow select-none hover:bg-surface-container hover:border-[#ffd65a]/60 hover:shadow-[0_0_8px_rgba(255,214,90,0.1)] transition-all text-left cursor-pointer group"
              title={`Weather affected XP Modifier is ${currentWeather.xpModifier}x. Click to cycle atmosphere!`}
            >
              <div className="flex items-center justify-center">
                <span className={`material-symbols-outlined text-[18px] sm:text-[20px] ${currentWeather.color} animate-pulse`}>
                  {currentWeather.icon}
                </span>
              </div>
              <div className="hidden sm:block min-w-[70px]">
                <span className="font-mono text-[7px] text-outline uppercase block leading-none flex items-center gap-0.5">
                  Weather ({currentWeather.xpModifier}x)
                  <span className="material-symbols-outlined text-[8px] opacity-35 group-hover:opacity-100 transition-opacity">sync</span>
                </span>
                <span className="font-display font-extrabold text-[9px] text-[#f2ca50] leading-tight tracking-wider uppercase block mt-0.5 whitespace-nowrap">{currentWeather.name}</span>
              </div>
              <span className="font-mono text-[10px] font-bold text-[#f2ca50] sm:hidden">
                {currentWeather.xpModifier}x
              </span>
            </button>

            {/* Daily Streak HUD Badge */}
            <button 
              onClick={() => { triggerAudio(playClick); setShowStreakModal(true); }}
              className="bg-[#1c1c19] border border-outline-variant rounded px-2 py-1 sm:px-2.5 sm:py-1.5 flex items-center gap-1.5 sm:gap-2 shadow select-none hover:bg-surface-container hover:border-orange-500/60 hover:shadow-[0_0_8px_rgba(249,115,22,0.15)] transition-all text-left cursor-pointer group"
              title="Consecutive Daily Streak tracker. Click to view rewards and simulations!"
            >
              <div className="flex items-center justify-center relative">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-orange-500 animate-pulse">
                  local_fire_department
                </span>
                <span className="absolute -top-1.5 -right-1.5 bg-orange-600 border border-black text-white text-[7px] font-bold font-mono px-1 rounded-full scale-90 leading-none py-0.5">
                  {streakCount}d
                </span>
              </div>
              <div className="hidden sm:block min-w-[70px]">
                <span className="font-mono text-[7px] text-outline uppercase block leading-none flex items-center gap-0.5">
                  STREAK SYSTEM
                  <span className="material-symbols-outlined text-[8px] opacity-35 group-hover:opacity-100 transition-opacity text-orange-400">info</span>
                </span>
                <span className="font-display font-extrabold text-[9px] text-orange-400 leading-tight tracking-wider uppercase block mt-0.5 whitespace-nowrap">
                  {streakCount} Days Active
                </span>
              </div>
            </button>

            {/* Coins count */}
            <div className="bg-[#1c1c19] border border-outline-variant rounded px-2 py-1 sm:px-3 sm:py-1.5 flex items-center gap-1.5 sm:gap-2 shadow select-none hover:bg-surface-container transition-colors">
              <Coins className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary animate-bounce" />
              <div>
                <span className="font-mono text-[7px] text-outline uppercase block leading-none hidden sm:block">Coins count</span>
                <span className="font-display font-bold text-xs sm:text-sm text-yellow-100">{gold} G</span>
              </div>
            </div>

            {/* Volume on-off */}
            <button 
              onClick={() => { setSoundEnabled(!soundEnabled); triggerAudio(playClick); }}
              className="p-1.5 sm:p-2 border border-outline-variant bg-[#1c1c19] text-on-surface-variant hover:text-white rounded hover:bg-surface-container transition-colors"
              title={soundEnabled ? "Disable audio synthetics" : "Enable audio synthetics"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-outline" />
              )}
            </button>

            {/* Stats / Achievements Panel button */}
            <button 
              onClick={() => { triggerAudio(playClick); handleSelectTab('stats'); }}
              className={`px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded font-display text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 border transition-all ${
                activeTab === 'stats' 
                  ? 'bg-secondary border-secondary text-on-secondary font-bold shadow' 
                  : 'bg-[#1c1c19] hover:bg-surface-container text-on-surface border-outline-variant'
              }`}
            >
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">CHARACTER </span>STATS
            </button>

            {/* Direct Home / Map pin selector */}
            <button 
              onClick={() => { triggerAudio(playClick); handleSelectTab('home'); }}
              className={`px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded font-display text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 border transition-all ${
                activeTab === 'home' 
                  ? 'bg-primary border-primary text-on-primary font-bold shadow' 
                  : 'bg-[#1c1c19] hover:bg-surface-container text-on-surface border-outline-variant'
              }`}
            >
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin-slow" />
              <span className="hidden sm:inline">WORLD </span>MAP
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="max-w-7xl mx-auto px-4 mt-6 flex-grow w-full">
        
        {/* Intro tutorial greeting banner box (can be hidden or displayed optionally) */}
        <AnimatePresence>
          {showIntroDialog && activeTab !== 'home' && (
            <div className="mb-6">
              <DialogGreeting 
                onStartQuest={() => { triggerAudio(playClick); setShowIntroDialog(false); }}
                onGrantReward={(g, x, t) => claimRewards(g, x, t)}
                earnedGold={introRewardClaimed}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Global Page Switchboard Router */}
        <div className={`bg-surface border-2 border-outline-variant rounded-lg carved-panel ${activeTab === 'home' ? 'p-0 overflow-hidden' : 'p-5'}`}>
          
          {/* Main Map Page */}
          {activeTab === 'home' && (
            <WorldMap 
              onSelectSection={(tid) => handleSelectTab(tid)}
              activeQuests={questsList}
              onFoundEasterEgg={(txt, gAmt) => {
                triggerAudio(playCoin);
                claimRewards(gAmt, 20, txt);
                unlockAchievement('secret-seeker');
              }}
              weatherId={currentWeather.id}
              onDiscoverSecret={handleDiscoverSecret}
              discoveredSecrets={discoveredSecrets}
              showIntroDialog={showIntroDialog}
              introRewardClaimed={introRewardClaimed}
              onStartQuest={() => { triggerAudio(playClick); setShowIntroDialog(false); }}
              onGrantReward={(g, x, t) => claimRewards(g, x, t)}
            />
          )}

          {/* 1. SECTION: Forge / Workshop Projects */}
          {activeTab === 'workshop' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left project cards index column */}
              <div className="lg:col-span-4 flex flex-col gap-3 border-r border-outline-variant lg:pr-5">
                <div className="flex items-center gap-2 border-b border-outline-variant pb-1.5">
                  <FolderGit2 className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-body-lg text-on-surface">Active Projects</h3>
                </div>

                <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
                  {PROJECTS.map((proj) => {
                    const isSelected = selectedProject.id === proj.id;
                    return (
                      <div 
                        key={proj.id}
                        onClick={() => { triggerAudio(playClick); setSelectedProject(proj); }}
                        className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all flex flex-col gap-1 select-none ${
                          isSelected 
                            ? 'border-primary bg-primary/5 shadow' 
                            : 'border-outline-variant/60 hover:border-outline bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <span className="font-mono text-[9px] text-outline uppercase tracking-wider">{proj.category}</span>
                        <h4 className="font-display font-bold text-on-surface text-body-md leading-none">{proj.title}</h4>
                        <p className="font-sans text-xs text-on-surface-variant line-clamp-1 mt-1 leading-snug">{proj.shortDesc}</p>
                        
                        <div className="flex justify-between items-center mt-2 pt-1 border-t border-outline-variant/50 font-mono text-[10px] text-outline">
                          <span>XP reward on completion</span>
                          <span className="text-secondary flex items-center gap-0.5 font-bold">
                            Inspect Specs
                            <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right project inspect blueprints terminal */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between flex-wrap gap-2 pb-2.5 border-b border-outline-variant">
                    <div>
                      <span className="font-mono text-[10px] text-primary uppercase tracking-[0.2em]">{selectedProject.category} Blueprint</span>
                      <h2 className="font-display font-bold text-[24px] text-on-surface tracking-tight leading-none mt-0.5">{selectedProject.title}</h2>
                    </div>

                    <div className="flex gap-2">
                      {selectedProject.liveUrl && (
                        <a 
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => triggerAudio(playClick)}
                          className="px-3 py-1.5 bg-secondary text-on-secondary hover:text-white rounded border border-white font-display text-xs flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      )}
                      {selectedProject.codeUrl && (
                        <a 
                          href={selectedProject.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => triggerAudio(playClick)}
                          className="px-3 py-1.5 bg-background hover:bg-surface-container text-on-surface rounded border border-outline font-display text-xs flex items-center gap-1.5"
                        >
                          <Github className="w-3.5 h-3.5" />
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Multi-Tab Description selectors */}
                  <div className="flex gap-2 border-b border-outline-variant/60 py-2.5 overflow-x-auto select-none">
                    {(['problem', 'process', 'exploration', 'outcome'] as const).map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => { triggerAudio(playClick); setProjectTab(tab); }}
                        className={`px-3.5 py-1 rounded font-display text-[10px] uppercase font-bold border transition-colors ${
                          projectTab === tab 
                            ? 'bg-primary text-on-primary border-primary' 
                            : 'bg-background hover:bg-surface-container text-on-surface-variant border-outline-variant'
                        }`}
                      >
                        {tab} specifications
                      </button>
                    ))}
                  </div>

                  {/* Tab contents */}
                  <div className="py-4 font-sans text-xs text-on-surface-variant leading-relaxed min-h-[92px]">
                    {projectTab === 'problem' && (
                      <div>
                        <h4 className="font-display font-semibold text-on-surface text-body-sm uppercase mb-1">Target Impedance / Problem space:</h4>
                        <p className="whitespace-pre-line">{selectedProject.problem}</p>
                      </div>
                    )}
                    {projectTab === 'process' && (
                      <div>
                        <h4 className="font-display font-semibold text-on-surface text-body-sm uppercase mb-1">Architecture & Execution Protocol:</h4>
                        <p className="whitespace-pre-line">{selectedProject.process}</p>
                      </div>
                    )}
                    {projectTab === 'exploration' && (
                      <div>
                        <h4 className="font-display font-semibold text-on-surface text-body-sm uppercase mb-1">Optimization Explorations:</h4>
                        <p className="whitespace-pre-line">{selectedProject.exploration}</p>
                      </div>
                    )}
                    {projectTab === 'outcome' && (
                      <div>
                        <h4 className="font-display font-semibold text-on-surface text-body-sm uppercase mb-1">Results & General Outcomes:</h4>
                        <p className="whitespace-pre-line">{selectedProject.outcome}</p>
                      </div>
                    )}
                  </div>

                  {/* Tech stack Enchantments block */}
                  <div className="mt-4 border-t border-outline-variant/60 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-display font-semibold text-on-surface text-xs uppercase tracking-wide mb-2.5">Enchantments (Stack)</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.techStack.map((tech, i) => (
                          <span key={i} className="px-2.5 py-1 border border-outline-variant bg-[#1c1c19] rounded font-mono text-[10px] text-[#c3cc8c]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-display font-semibold text-on-surface text-xs uppercase tracking-wide mb-2.5">Power Stats Gained</h4>
                      <div className="flex flex-col gap-2">
                        {selectedProject.statsGained.map((stat, i) => (
                          <div key={i} className="flex items-center gap-2 font-mono text-[10px]">
                            <span className="w-24 text-outline truncate">{stat.name}:</span>
                            <span className="text-secondary font-bold">+{stat.value}</span>
                            <div className="flex-grow h-2 bg-surface-container-high rounded-full overflow-hidden">
                              <div className="h-full bg-secondary rounded-full" style={{ width: `${stat.value * 5}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Project specific mini-quest objectives checklist */}
                  <div className="mt-5 border-t border-outline-variant/60 pt-4 select-none">
                    <h4 className="font-display font-semibold text-on-surface text-xs uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-primary" />
                      Quest Objectives list:
                    </h4>
                    
                    <div className="flex flex-col gap-2.5 bg-[#1c1c19] border border-outline-variant p-3.5 rounded">
                      {selectedProject.goals.map((goal, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => handleToggleProjectGoal(selectedProject.id, goal.text)}
                          className="flex items-start gap-2.5 cursor-pointer hover:bg-surface-container pr-2"
                        >
                          <div className={`p-0.5 rounded border mt-0.5 ${
                            goal.done 
                              ? 'bg-secondary border-secondary text-black' 
                              : 'bg-background border-outline-variant text-transparent'
                          }`}>
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </div>
                          
                          <span className={`font-sans text-xs ${
                            goal.done ? 'line-through text-outline' : 'text-on-surface'
                          }`}>
                            {goal.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 font-mono text-[9px] text-outline border-t border-outline-variant/40 pt-2 select-none">
                  <span>Blueprint: {selectedProject.id}</span>
                  <span className="text-primary flex items-center gap-1">
                    System specifications loaded
                    <span className="material-symbols-outlined text-[10px]">check_circle</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. SECTION: Archive / Library Reading bookshelf */}
          {activeTab === 'library' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Books Shelf */}
              <div className="lg:col-span-8 flex flex-col gap-4 border-r border-outline-variant/40 lg:pr-5">
                <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-secondary" />
                    <h3 className="font-display font-semibold text-lg text-on-surface">Spells Archive Shelf</h3>
                  </div>
                  <span className="font-mono text-[10px] text-outline uppercase">{BOOKS.length} Items Indexed</span>
                </div>

                {/* Books filtration row */}
                <div className="flex gap-2.5 flex-wrap overflow-x-auto select-none pt-1">
                  {([
                    { label: 'All Items', filter: 'all' },
                    { label: 'Books', filter: 'book' },
                    { label: 'Courses', filter: 'course' },
                  ] as const).map(({ label, filter }) => (
                    <button 
                      key={filter}
                      onClick={() => { triggerAudio(playClick); setLibraryTypeFilter(filter); }}
                      className={`px-3 py-1 rounded font-display text-[10px] uppercase font-bold border transition-colors ${
                        libraryTypeFilter === filter 
                          ? 'bg-secondary text-on-secondary border-secondary' 
                          : 'bg-background hover:bg-surface-container text-on-surface-variant border-outline-variant'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {BOOKS.filter(b => libraryTypeFilter === 'all' || b.type === libraryTypeFilter).map((book) => {
                    return (
                      <div 
                        key={book.id}
                        onClick={() => handleReadBook(book)}
                        className={`p-4 rounded-lg border-2 hover:bg-surface-container transition-all flex flex-col justify-between cursor-pointer select-none relative overflow-hidden carved-panel ${
                          book.rarity === 'Legendary' 
                            ? 'border-[#ffc19e] bg-[#ffc19e]/5 shadow-[0_0_10px_rgba(255,193,158,0.15)] shadow' 
                            : book.rarity === 'Epic' 
                              ? 'border-primary bg-primary/5' 
                              : 'border-outline-variant bg-surface-container-low'
                        }`}
                      >
                        <div className="absolute top-0 right-0 bg-[#1c1c19] text-[9px] font-mono border-bl border-outline-variant px-2 py-0.5 uppercase tracking-widest text-outline">
                          {book.rarity} item
                        </div>

                        <div>
                          <div className="flex gap-3 items-start">
                            <div className="w-16 h-22 rounded border border-outline bg-background-high flex-shrink-0 overflow-hidden relative shadow-md">
                              <img alt={book.imageAlt} src={book.imageUrl} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="min-w-0">
                              <span className="font-mono text-[9px] text-outline uppercase tracking-wider block">{book.category}</span>
                              <h4 className="font-display font-semibold text-on-surface text-body-md truncate leading-tight mt-0.5">{book.title}</h4>
                              <span className="font-sans text-[11px] text-on-surface-variant italic">by {book.author}</span>
                              
                              {/* Stars rating */}
                              <div className="flex gap-0.5 mt-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i} className={`material-symbols-outlined text-[13px] ${i < book.stars ? 'text-primary' : 'text-outline/35'}`}>
                                    star_rate
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Quote preview block */}
                          {book.quote && (
                            <p className="font-mono text-[10px] text-secondary mt-3 bg-background border border-outline-variant p-2 rounded leading-relaxed border-l-4 border-l-[#eb9800]">
                              "{book.quote}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t border-outline-variant/60 mt-4.5 pt-2 font-mono text-[9px] text-[#eb9800]">
                          <span>Catalog #: {book.id}</span>
                          <span className="text-secondary flex items-center gap-1">
                            Read Spell Scroll
                            <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Lessons Extracted Card */}
              <div className="lg:col-span-4 flex flex-col gap-3.5">
                <div className="p-4 rounded-lg bg-[#1c1c19] border border-outline-variant flex flex-col gap-3.5 shadow-inner">
                  <h4 className="font-display font-semibold text-xs text-secondary uppercase tracking-widest flex items-center gap-1.5 select-none">
                    <span className="material-symbols-outlined text-[15px] text-secondary">psychology</span>
                    Lessons Extracted
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Core operational spell scrolls synthesized from Jiya's active reading and study journey:
                  </p>
                  <ul className="flex flex-col gap-3">
                    {BOOK_LESSONS.map((lesson, idx) => (
                      <li key={idx} className="font-sans text-xs text-on-surface-variant flex gap-2 items-start leading-snug">
                        <span className="text-secondary font-bold mt-0.5">•</span>
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

              {/* Book inspecting deep drawer popup */}
              <AnimatePresence>
                {selectedBook && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="p-5 rounded-lg bg-surface-container-high border-2 border-outline-variant select-none relative carved-panel mt-3"
                  >
                    <div className="absolute top-2.5 right-2.5">
                      <button 
                        onClick={() => { triggerAudio(playClick); setSelectedBook(null); }}
                        className="text-outline hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-5 items-start">
                      <div className="w-24 h-32 rounded border-2 border-primary/40 bg-background-highest flex-shrink-0 overflow-hidden shadow-2xl relative">
                        <img alt={selectedBook.imageAlt} src={selectedBook.imageUrl} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-grow">
                        <h4 className="font-display font-extrabold text-[20px] text-on-surface tracking-tight leading-none">{selectedBook.title}</h4>
                        <div className="flex gap-4 mt-1 flex-wrap">
                          <span className="font-sans text-xs text-on-surface-variant italic">by {selectedBook.author}</span>
                          <span className="font-mono text-[10px] text-primary uppercase">Classification: {selectedBook.category}</span>
                          <span className="font-mono text-[10px] text-secondary uppercase">Level requirement: 1</span>
                        </div>

                        <p className="font-sans text-xs text-on-surface-variant leading-relaxed mt-3.5 bg-background p-3.5 rounded border border-outline-variant/60 max-w-3xl">
                          {selectedBook.summary}
                        </p>

                        <div className="flex gap-4 items-center justify-between mt-4 pb-1 pt-1.5 border-t border-outline-variant flex-wrap font-mono text-[10px] text-outline">
                          <span>Discovered scroll rewards: 20 XP & 10G</span>
                          <button 
                            onClick={() => { triggerAudio(playClick); setSelectedBook(null); }}
                            className="px-4 py-1 bg-surface-container-highest border border-outline hover:bg-surface-container-high text-on-surface hover:text-white rounded text-xs"
                          >
                            Close Spell scroll
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

            {/* 3. SECTION: Day In The Life */}
            {activeTab === 'life' && (
              <DayInTheLife 
                onClose={() => { triggerAudio(playClick); handleSelectTab('home'); }}
                soundEnabled={soundEnabled}
              />
            )}
          {/* 4. SECTION: Guild Hall / Milestone achievements */}
          {activeTab === 'progress' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Skill Mastery Tree & Stats */}
              <div className="lg:col-span-5 flex flex-col gap-4 border-r border-outline-variant lg:pr-5">
                <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
                  <Award className="w-5 h-5 text-blue-300" />
                  <h3 className="font-display font-semibold text-body-lg text-on-surface">Skills Mastery</h3>
                </div>

                <div className="p-4 rounded-lg bg-[#1c1c19] border border-outline-variant flex flex-col gap-3 shadow-inner">
                  <span className="font-mono text-[9px] text-outline uppercase tracking-wider block">CORE POWER LEVEL INT/STR</span>
                  
                  {/* Skill items slider logs */}
                  {[
                    {
                      label: "Full-Stack Development (React/Next.js/NestJS)",
                      count: 92,
                      barBg: "bg-primary"
                    },
                    {
                      label: "Backend Engineering (Node.js/APIs)",
                      count: 90,
                      barBg: "bg-secondary"
                    },
                    {
                      label: "AI & Automation (Gemini/Agents/NLP)",
                      count: 85,
                      barBg: "bg-purple-400"
                    },
                    {
                      label: "Databases (PostgreSQL/MongoDB)",
                      count: 88,
                      barBg: "bg-blue-400"
                    },
                    {
                      label: "Security & System Design",
                      count: 82,
                      barBg: "bg-emerald-400"
                    }
                  ].map((sk, idx) => (
                    <div key={idx} className="flex flex-col gap-1 font-mono text-[10px]">
                      <div className="flex justify-between items-center text-on-surface-variant font-semibold">
                        <span>{sk.label}</span>
                        <span className="text-white font-bold">{sk.count}%</span>
                      </div>
                      <div className="h-2 bg-background-high border border-outline-variant rounded p-[1px]">
                        <div className={`h-full ${sk.barBg} rounded`} style={{ width: `${sk.count}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lessons Learned Card */}
                <div className="p-3.5 bg-secondary/[0.04] border border-secondary/35 rounded-md">
                  <h4 className="font-display font-semibold text-xs text-secondary uppercase tracking-wide flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Lessons Learned on Outages:
                  </h4>
                  <ul className="list-disc pl-4 text-xs font-sans text-on-surface-variant mt-2 space-y-1.5 leading-relaxed">
                    {LESSONS_LEARNED.map((l) => (
                      <li key={l.id}>{l.text}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Achievements & Years timeline */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between pb-2 border-b border-outline-variant flex-wrap gap-2 select-none">
                    <div>
                      <span className="font-mono text-[9px] text-outline uppercase tracking-widest font-bold">Progress Timeline Coordinates</span>
                      <h3 className="font-display font-bold text-lg text-on-surface leading-none mt-0.5">Guild Progression</h3>
                    </div>

                    {/* Timeline slider filters */}
                    <div className="flex gap-1 border border-outline-variant rounded p-0.5 bg-[#1c1c19]">
                      {[2023, 2024, 2025, 2026].map((yr) => (
                        <button 
                          key={yr} 
                          onClick={() => { triggerAudio(playClick); setTimelineYearFilter(yr); setSelectedCertificate(null); }}
                          className={`px-2.5 py-1 rounded font-mono text-[9px] transition-colors font-bold ${
                            timelineYearFilter === yr 
                              ? 'bg-secondary text-on-secondary shadow font-extrabold' 
                              : 'bg-transparent text-outline hover:text-white'
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Certifications Segment based on selected years filter */}
                  <div className="mt-4 flex flex-col gap-3">
                    <h4 className="font-display font-semibold text-xs text-on-surface uppercase tracking-wide">
                      Guild progression checklist ({timelineYearFilter}):
                    </h4>
                    
                    {(() => {
                      const filteredCerts = CERTIFICATES.filter(c => c.date.includes(String(timelineYearFilter)));

                      if (filteredCerts.length === 0) {
                        return (
                          <div className="py-8 bg-[#1c1c19] rounded border border-dashed border-outline-variant text-center select-none">
                            <span className="material-symbols-outlined text-outline text-[32px] animate-pulse">lock</span>
                            <p className="font-mono text-[10px] text-outline mt-1.5 uppercase tracking-widest">Wandering the wilderness (No certificates locked in {timelineYearFilter})</p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {filteredCerts.map((cert) => {
                            const isSel = selectedCertificate?.id === cert.id;
                            return (
                              <div 
                                key={cert.id}
                                onClick={() => { triggerAudio(playClick); setSelectedCertificate(cert); }}
                                className={`p-3 rounded border-2 cursor-pointer bg-surface-container-low transition-all flex gap-3 items-center select-none ${
                                  isSel ? 'border-primary shadow bg-[#1c1c19]' : 'border-outline-variant hover:border-outline'
                                }`}
                              >
                                <div className="p-2 border rounded" style={{ borderColor: cert.badgeColor + '50', backgroundColor: cert.badgeColor + '10', color: cert.badgeColor }}>
                                  <span className="material-symbols-outlined text-[20px]">{cert.icon}</span>
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-display font-bold text-xs text-on-surface truncate leading-none">{cert.title}</h4>
                                  <span className="font-sans text-[11px] text-on-surface-variant">{cert.issuer}</span>
                                  <span className="font-mono text-[9px] text-outline block mt-1">{cert.date}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Achievements list */}
                  <div className="mt-5 border-t border-outline-variant/60 pt-4">
                    <h4 className="font-display font-semibold text-xs text-on-surface uppercase tracking-wide mb-2.5">Major Achievements:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ACHIEVEMENTS.map((ach) => (
                        <div 
                          key={ach.id}
                          className="bg-[#1c1c19] border border-outline-variant/60 p-3 rounded flex gap-3 items-start select-none group"
                        >
                          <div className="p-2 bg-yellow-950 text-primary border border-primary/20 rounded mt-0.5 group-hover:animate-bounce">
                            <span className="material-symbols-outlined text-[18px]">
                              {ach.icon === 'code' ? 'code' : 
                               ach.icon === 'school' ? 'school' : 
                               ach.icon === 'handshake' ? 'handshake' : 
                               ach.icon === 'rocket' ? 'rocket_launch' : 
                               ach.icon}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-display font-bold text-xs text-on-surface">{ach.title}</h4>
                            <p className="font-sans text-[11px] text-on-surface-variant leading-snug mt-0.5">{ach.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 font-mono text-[9px] text-outline border-t border-outline-variant/40 pt-2 select-none">
                  <span>Engineer profile synchronized</span>
                  <span className="text-primary flex items-center gap-1">
                    Achievement archive verified
                    <span className="material-symbols-outlined text-[10px]">verified</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 5. SECTION: Digital Garden thoughts map */}
          {activeTab === 'garden' && (
            <MindMap 
              onGrantReward={(g, x, t) => claimRewards(g, x, t)}
              clickedNodesCount={clickedNodes}
              onSetClickedNode={handleSetClickedNode}
            />
          )}

          {/* 6. SECTION: Stars constellation observatory */}
          {activeTab === 'observatory' && (
            <ConstellationPanel 
              onGrantReward={(g, x, t) => claimRewards(g, x, t)}
              unlockedStars={unlockedStars}
              onUnlockStar={(sId) => setUnlockedStars([...unlockedStars, sId])}
              onClose={() => { triggerAudio(playClick); handleSelectTab('home'); }}
            />
          )}

          {/* 7. SECTION: Cave Shop / Secret treasures */}
          {activeTab === 'cave' && (
            <ExtrasShop 
              currentGold={gold}
              unlockedPurchases={unlockedPurchases}
              onPurchase={(i, c) => handlePurchaseItem(i, c)}
              onAdjustGold={handleAdjustGold}
              onGrantReward={(g, x, t) => claimRewards(g, x, t)}
            />
          )}

          {/* 9. SECTION: Wizard's Lab Sandbox */}
          {activeTab === 'lab' && (
            <WizardLab 
              currentGold={gold}
              soundEnabled={soundEnabled}
              triggerAudio={triggerAudio}
              claimRewards={(g, x, t) => claimRewards(g, x, t)}
              addNotification={addNotification}
            />
          )}

          {/* 8. SECTION: Stats & Trophies */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Character Sheet & XP Gauge */}
              <div className="lg:col-span-5 flex flex-col gap-4 border-r border-[#31312c] lg:pr-5">
                <div className="flex items-center gap-2 border-b border-outline-variant pb-2 select-none">
                  <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                  <h3 className="font-display font-semibold text-body-lg text-on-surface">CHARACTER SHEETS</h3>
                </div>

                {/* 1. JIYA.EXE PROFILE (PERMANENT) */}
                <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant flex flex-col gap-3.5 shadow-inner relative overflow-hidden">
                  <div className="absolute top-2 right-2 font-mono text-[7px] text-outline tracking-wider select-none uppercase">
                    SYS-REFS: g
                  </div>

                  {/* Character avatar and details */}
                  <div className="flex items-center gap-4 border-b border-outline-variant/60 pb-3">
                    <div className="w-14 h-14 rounded-lg border-2 border-primary bg-background overflow-hidden flex-shrink-0 relative shadow-lg">
                      <img 
                        alt="Jiya Avatar Portrait" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDD7FMhUjA0kK9i-HW1opUvIWfO0k-2u--boOJ15vOlu25X9PjrZFGxjNnCn3KOjFjXFALox177-d_jE3ZXjMa8TNUy-wEVB1YsdFUbWsWGIF6XEhBkGEM3XuLKUAdQixwxmGyHl7l03_k7yFpPJTHLIgB7gm7QZLb0mvBHCUpIdZDuLYTs3wFDj7Pue6t94P2hNvBMUnZCk_Bh1D77o4IGN-usyOSnK-tHX6Yct3GD6GYSGuTxedmMmeXCzjqd5CTB7jZUZXeFJs"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-md text-[#f2ca50] tracking-wide">JIYA.EXE</h4>
                      <div className="font-mono text-[9px] uppercase text-secondary font-bold select-none tracking-widest mt-0.5">
                        {unlockedPurchases.includes('legendary-cape') ? '👑 ARCHITECT OVERSEER' : '🔮 SORCERER ENGINEER'}
                      </div>
                      <div className="font-mono text-[8px] mt-1 text-outline">
                        Status: Permanent Portfolio Profile
                      </div>
                    </div>
                  </div>

                  {/* Static Profile XP Gauge */}
                  <div className="flex flex-col gap-1 font-mono text-[9.5px]">
                    <div className="flex justify-between items-center text-on-surface-variant font-bold select-none">
                      <span>PROFILE ALIGNMENT (LEVEL 22)</span>
                      <span className="text-primary font-bold">1,820 / 2,200 EXP</span>
                    </div>

                    <div className="h-3 bg-[#131311] border border-outline-variant/65 rounded p-[1px] relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-sm"
                        style={{ width: '82.7%' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[7.5px] text-white font-extrabold text-glow tracking-widest leading-none select-none">
                        82.7% SYNCHRONIZED
                      </div>
                    </div>
                  </div>

                  {/* Power Stats Gained from projects */}
                  <div className="border-t border-outline-variant/60 pt-3 flex flex-col gap-2">
                    <span className="font-mono text-[8px] text-outline uppercase tracking-wider block select-none">POWER STATS SPECTRUM</span>
                    
                    {[
                      { label: "AI Engineering", val: 15, base: "psychology", color: "text-purple-400" },
                      { label: "UI/UX Magic", val: 18, base: "auto_awesome", color: "text-emerald-400" },
                      { label: "System Design", val: 12, base: "analytics", color: "text-blue-400" },
                      { label: "Canvas Algorithms", val: 10, base: "polyline", color: "text-yellow-200" },
                      { label: "Terminal Mechanics", val: 8, base: "terminal", color: "text-secondary" },
                      { label: "Creative Scripting", val: 6, base: "border_color", color: "text-orange-300" }
                    ].map((st, i) => (
                      <div key={i} className="flex items-center justify-between font-mono text-[9.5px] bg-[#131311] border border-outline-variant/40 rounded px-2.5 py-1 hover:bg-[#1a1a17] transition-colors">
                        <div className="flex items-center gap-1.5 text-on-surface-variant">
                          <span className={`material-symbols-outlined text-[12px] ${st.color}`}>
                            {st.base}
                          </span>
                          <span>{st.label}</span>
                        </div>
                        <span className={`font-bold ${st.color}`}>+{st.val} STR/INT</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. VISITOR.EXE DOSSIER (ACTIVE GAMEPLAY) */}
                <div className="p-4 rounded-lg bg-surface-container-high border-2 border-secondary/35 flex flex-col gap-3.5 shadow-md relative overflow-hidden">
                  <div className="absolute top-2 right-2 font-mono text-[7px] text-secondary tracking-wider select-none uppercase">
                    SYS-REFS: VISITOR.EXE
                  </div>

                  <div className="flex items-center gap-3 border-b border-outline-variant/60 pb-3 select-none">
                    <div className="w-10 h-10 rounded bg-[#131311] border border-secondary/40 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[24px]">person</span>
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-sm text-secondary tracking-wide uppercase">VISITOR.EXE</h4>
                      <div className="font-mono text-[9px] text-white font-bold leading-none mt-1">
                        Rank: {getVisitorTitle(level)}
                      </div>
                    </div>
                  </div>

                  {/* Visitor XP bar */}
                  <div className="flex flex-col gap-1 font-mono text-[9.5px]">
                    <div className="flex justify-between items-center text-on-surface-variant font-bold select-none">
                      <span>GAMEPLAY PROGRESS (LEVEL {level})</span>
                      <span className="text-[#ffe088]">{xp} / {getLevelXpCap(level)} PT</span>
                    </div>

                    <div className="h-4 bg-[#11110f] border border-outline-variant/60 rounded p-[1px] relative overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (xp / getLevelXpCap(level)) * 100)}%` }}
                        className="h-full bg-gradient-to-r from-secondary to-yellow-400 rounded-sm"
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-extrabold text-glow tracking-widest leading-none select-none">
                        {((xp / getLevelXpCap(level)) * 100).toFixed(1)}% ALIGNED
                      </div>
                    </div>
                  </div>

                  {/* Pledge Allegiance Game Loop */}
                  <div className="text-center mt-1">
                    <button 
                      onClick={() => {
                        if (gold >= 50) {
                          triggerAudio(playCoin);
                          setGold(g => g - 50);
                          claimRewards(0, 150, "Pledge Allegiance! Exchanged 50 Gold for +150 EXP!", true);
                        } else {
                          triggerAudio(playClick);
                          addNotification("Need more Gold! Exchanging requires 50 Gold.", 0, 0, "lock");
                        }
                      }}
                      className="w-full py-2 bg-secondary hover:bg-secondary/90 text-on-secondary font-mono font-bold text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 rounded transition-all cursor-pointer shadow active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[13px]">military_tech</span>
                      PLEDGE ALLEGIANCE (-50 Gold for +150 EXP)
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-secondary/[0.04] border border-secondary/30 rounded-md">
                  <h4 className="font-display font-semibold text-xs text-secondary uppercase tracking-widest flex items-center gap-1.5 select-none">
                    <span className="material-symbols-outlined text-[14px]">query_stats</span>
                    REAL-TIME METRICS
                  </h4>
                  <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[10px] text-outline select-none">
                    <div>Regions Visited: <span className="text-white font-bold">{visitedSectors.length} / 8</span></div>
                    <div>Easter Eggs Found: <span className="text-white font-bold">{unlockedAchievements.includes('secret-seeker') ? '1' : '0'}</span></div>
                    <div>Trophies Won: <span className="text-white font-bold">{unlockedAchievements.length} / 4</span></div>
                    <div>Shop Purchases: <span className="text-white font-bold">{unlockedPurchases.length} / 4</span></div>
                  </div>
                </div>

                {/* Daily Streak Card inside Dossier */}
                <div onClick={() => { triggerAudio(playClick); setShowStreakModal(true); }} className="p-3.5 bg-gradient-to-br from-orange-950/15 to-transparent border border-orange-500/30 hover:border-orange-500/60 rounded-md cursor-pointer transition-all hover:bg-orange-950/5 group">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-semibold text-xs text-orange-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
                      <span className="material-symbols-outlined text-[15px] text-orange-500 animate-pulse">local_fire_department</span>
                      DAILY STREAK TELEMETRY
                    </h4>
                    <span className="material-symbols-outlined text-[14px] text-outline group-hover:text-orange-400 transition-colors">open_in_new</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 font-mono text-[10px]">
                    <div>Active Count: <span className="text-orange-200 font-bold text-xs">{streakCount} Day{streakCount > 1 ? 's' : ''}</span></div>
                    <div>Check-in Status: <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm select-none ${streakClaimedToday ? 'bg-orange-950 border border-orange-500/20 text-orange-400' : 'bg-surface-container border border-outline-variant text-outline animate-pulse'}`}>{streakClaimedToday ? 'COMPLETED' : 'PENDING'}</span></div>
                  </div>

                </div>
              </div>

              {/* Right Column: Achievements Dashboard Grid */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between pb-2 border-b border-outline-variant select-none flex-wrap gap-2">
                    <div className="flex gap-4">
                      <button
                        onClick={() => { triggerAudio(playClick); setStatsSubTab('trophies'); }}
                        className={`text-left pb-1.5 transition-all relative ${statsSubTab === 'trophies' ? 'text-primary font-bold border-b-2 border-primary' : 'text-outline hover:text-white font-medium'}`}
                      >
                        <span className="font-mono text-[8px] uppercase tracking-widest block leading-none">VALLEY REWARDS</span>
                        <h3 className="font-display text-base leading-tight mt-1">Dossier Trophies</h3>
                      </button>

                      <button
                        onClick={() => { triggerAudio(playClick); setStatsSubTab('secrets'); }}
                        className={`text-left pb-1.5 transition-all relative ${statsSubTab === 'secrets' ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-outline hover:text-white font-medium'}`}
                      >
                        <span className="font-mono text-[8px] uppercase tracking-widest block leading-none">GRID DETECTION</span>
                        <h3 className="font-display text-base leading-tight mt-1">Hidden Logs</h3>
                      </button>
                    </div>

                    {statsSubTab === 'trophies' ? (
                      <span className="font-mono text-[9px] border border-outline-variant rounded px-2.5 py-0.5 bg-[#1c1c19] text-primary tracking-widest uppercase font-bold">
                        {unlockedAchievements.length} / 4 UNLOCKED
                      </span>
                    ) : (
                      <span className="font-mono text-[9px] border border-secondary/30 rounded px-2.5 py-0.5 bg-secondary/15 text-secondary tracking-widest uppercase font-bold">
                        {discoveredSecrets.length} / {SECRET_SECTORS.length} FOUND
                      </span>
                    )}
                  </div>

                  {statsSubTab === 'trophies' && (
                    <div className="animate-fadeIn">
                      {/* Interactive Achievements Checklist */}
                  <div className="mt-4 flex flex-col gap-3">
                    <h4 className="font-display font-semibold text-xs text-on-surface uppercase tracking-wider flex items-center gap-1.5 select-none">
                      <span className="material-symbols-outlined text-secondary text-[16px]">stars</span>
                      INTERACTIVE SECTOR TARGETS (Visitor Achievements):
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {INTERACTIVE_ACHIEVEMENTS.map((ach) => {
                        const isUnlocked = unlockedAchievements.includes(ach.id);
                        
                        // Formulate progress tracker label
                        let progressText = "";
                        if (ach.id === 'cartographer') progressText = `${visitedSectors.length}/5 regions`;
                        if (ach.id === 'grand-architect') progressText = `${inspectedTabs.length}/4 specs`;
                        if (ach.id === 'secret-seeker') progressText = isUnlocked ? "Unlocked" : "Explore Map";
                        if (ach.id === 'spell-binder') progressText = isUnlocked ? "Unlocked" : "Read Books";

                        return (
                          <div 
                            key={ach.id}
                            className={`p-3.5 rounded border-2 flex gap-3 items-center relative transition-all min-h-[92px] ${
                              isUnlocked 
                                ? 'bg-[#ffe49a]/5 border-primary shadow-[0_0_8px_rgba(242,202,80,0.15)] select-none' 
                                : 'bg-surface-container-low border-outline-variant/60 saturate-50 select-none'
                            }`}
                          >
                            <div className="absolute top-1 right-2 font-mono text-[7px] text-outline tracking-widest uppercase">
                              {ach.xpReward >= 120 ? '⭐ EPIC' : 'COMMON'}
                            </div>

                            <div className={`p-2.5 border rounded-lg flex-shrink-0 ${
                              isUnlocked 
                                ? 'bg-primary/20 text-primary border-primary shadow-[0_0_8px_rgba(242,202,80,0.3)]' 
                                : 'bg-[#1c1c19] border-outline text-outline'
                            }`}>
                              <span className="material-symbols-outlined text-[20px] block">
                                {ach.icon}
                              </span>
                            </div>

                            <div className="flex-grow min-w-0">
                              <h5 className={`font-display font-extrabold text-xs tracking-wide leading-none ${isUnlocked ? 'text-primary' : 'text-on-surface'}`}>
                                {ach.title}
                              </h5>
                              <p className="font-sans text-[10px] text-on-surface-variant leading-snug mt-1.5">
                                {ach.desc}
                              </p>

                              <div className="flex items-center justify-between font-mono text-[8px] text-outline mt-2 border-t border-outline-variant/50 pt-1">
                                <span className={isUnlocked ? 'text-secondary font-semibold' : 'text-outline'}>
                                  {isUnlocked ? 'CLAIMED Rewards' : `REQ: ${progressText}`}
                                </span>
                                <span className="font-bold flex items-center gap-0.5">
                                  {isUnlocked ? (
                                    <span className="text-secondary flex items-center gap-0.5">
                                      <span className="material-symbols-outlined text-[9px]">verified</span> UNLOCKED
                                    </span>
                                  ) : (
                                    <span className="text-primary flex items-center gap-0.5">
                                      <span className="material-symbols-outlined text-[9px]">lock</span> LOCKED
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* XP Synchronization Log */}
                  <div className="mt-6 border-t border-outline-variant/60 pt-4">
                    <div className="flex items-center justify-between mb-3 select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[16px]">history_edu</span>
                        <h4 className="font-display font-semibold text-xs text-on-surface uppercase tracking-wider">
                          XP Chronicles (Telemetry Log)
                        </h4>
                      </div>
                      <button 
                        onClick={() => {
                          triggerAudio(playClick);
                          setXpLog([]);
                        }}
                        className="font-mono text-[8px] uppercase tracking-wider text-outline hover:text-red-400 transition-colors flex items-center gap-1 bg-[#1a1a17] border border-outline-variant/40 hover:border-red-950 rounded px-2 py-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[11px]">delete_sweep</span>
                        Purge Telemetry
                      </button>
                    </div>

                    <div className="bg-[#151512] rounded border border-outline-variant/50 p-2 max-h-[196px] overflow-y-auto flex flex-col gap-2 custom-scrollbar">
                      {xpLog.length === 0 ? (
                        <div className="text-center py-8 text-outline font-mono text-[10px] uppercase select-none">
                          No recent XP telemetry entries. Accomplish actions to logging values!
                        </div>
                      ) : (
                        xpLog.map((log) => {
                          const isQuest = log.source.includes('Quest') || log.source.includes('Completed');
                          const isAch = log.source.includes('Achievement') || log.source.includes('Unlocked');
                          const isExpl = log.source.includes('Explored') || log.source.includes('Region') || log.source.includes('Sector');
                          const isMsg = log.source.includes('Msg') || log.source.includes('Contact') || log.source.includes('Transmitted');
                          
                          let sourceIcon = 'auto_awesome';
                          let iconColor = 'text-purple-400';
                          if (isQuest) { sourceIcon = 'verified'; iconColor = 'text-amber-400'; }
                          else if (isAch) { sourceIcon = 'emoji_events'; iconColor = 'text-primary'; }
                          else if (isExpl) { sourceIcon = 'explore'; iconColor = 'text-sky-400'; }
                          else if (isMsg) { sourceIcon = 'mail'; iconColor = 'text-emerald-400'; }

                          return (
                            <div 
                              key={log.id} 
                              className="bg-[#1c1c19] border border-outline-variant/30 hover:border-outline-variant/70 rounded p-2.5 flex items-center justify-between gap-3 text-[10px] font-mono transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-7 h-7 rounded bg-[#252520] border border-outline-variant/60 flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                                  <span className="material-symbols-outlined text-[15px]">
                                    {sourceIcon}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-white font-bold truncate leading-tight select-none">{log.source}</div>
                                  <div className="text-[8px] text-outline flex items-center flex-wrap gap-x-1.5 gap-y-0.5 mt-1 select-none">
                                    <span className="bg-[#242420] text-outline border border-outline-variant/30 px-1 py-0.2 rounded-sm font-semibold">{log.timestamp}</span>
                                    <span className="flex items-center gap-0.5">
                                      <span className="material-symbols-outlined text-[11px] leading-none text-secondary">{log.weatherIcon}</span>
                                      <span className="text-on-surface-variant font-medium">{log.weatherName}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-shrink-0 text-right select-none">
                                <div className="text-primary font-bold text-glow text-[11px] leading-tight">
                                  +{log.totalXp} XP
                                </div>
                                {log.bonusXp > 0 && (
                                  <div className="text-[7.5px] text-secondary font-bold leading-none mt-0.5 whitespace-nowrap">
                                    (+{log.bonusXp} Weather bonus)
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Hidden Logs Tab: tracks Secret Sectors found on world map, hint decoding mechanism */}
              {statsSubTab === 'secrets' && (
                <motion.div 
                  key="secrets"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 flex flex-col gap-4 animate-fadeIn"
                >
                  {/* Atmospheric Signal Decoder Telematry */}
                  <div className="p-4 rounded-lg border-2 border-dashed bg-[#131311] border-orange-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-mono text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                        <span className="material-symbols-outlined text-[15px] animate-pulse">radar</span>
                        Atmospheric Signal Decoder
                      </h4>
                      <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed mt-1.5 max-w-lg">
                        {visitedSectors.length >= 3 ? (
                          <span className="text-secondary font-medium">✨ Sub-quantum frequencies fully decrypted! High-altitude coordinates have unlocked all secret exploration hints.</span>
                        ) : (
                          <span>🔒 Decryption algorithm: LOCKED. Surface scans show insufficient spatial logs. Visit more map regions to decrypt secrets telemetry.</span>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 font-mono text-[9px] flex-shrink-0 min-w-[130px] border border-outline-variant/30 rounded p-2.5 bg-[#181815]">
                      <div className="flex justify-between items-center text-outline font-semibold">
                        <span>DECRYPTION PROGRESS</span>
                        <span className="text-white font-bold">{Math.min(100, Math.round((visitedSectors.length / 3) * 100))}%</span>
                      </div>
                      <div className="h-2 bg-background-high border border-outline-variant rounded-sm p-[1px] w-full mt-1.5">
                        <div 
                          className={`h-full rounded-sm ${visitedSectors.length >= 3 ? 'bg-secondary animate-pulse' : 'bg-orange-500'}`} 
                          style={{ width: `${Math.min(100, (visitedSectors.length / 3) * 100)}%` }} 
                        />
                      </div>
                      <div className="text-[8px] text-outline text-right mt-1">
                        Map sectors scanned: {visitedSectors.length}/3
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {SECRET_SECTORS.map((sec) => {
                      const isDiscovered = discoveredSecrets.includes(sec.id);
                      const hintsUnlocked = visitedSectors.length >= 3;

                      return (
                        <div 
                          key={sec.id}
                          className={`p-4 rounded border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                            isDiscovered 
                              ? 'bg-[#1e2e22]/15 border-secondary/35 shadow-[0_0_8px_rgba(34,197,94,0.06)]' 
                              : 'bg-surface-container-low border-outline-variant/65'
                          }`}
                        >
                          <div className="flex items-start md:items-center gap-3.5">
                            {/* Mystical icon box */}
                            <div className={`p-3 border rounded-lg flex-shrink-0 mt-1 md:mt-0 ${
                              isDiscovered 
                                ? 'bg-secondary/15 text-secondary border-secondary/30 shadow-[0_0_8px_rgba(34,197,94,0.2)]' 
                                : 'bg-[#151512] border-outline text-outline'
                            }`}>
                              <span className="material-symbols-outlined text-[19px] block leading-none">
                                {isDiscovered ? sec.icon : 'help'}
                              </span>
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className={`font-display font-extrabold text-xs tracking-wide leading-none ${isDiscovered ? 'text-secondary' : 'text-outline/40'}`}>
                                  {isDiscovered ? sec.name : 'Unknown Mystical Energy Singularity'}
                                </h4>
                                <span className={`font-mono text-[8px] border rounded px-1.5 py-0.2 select-none uppercase font-bold tracking-wider ${
                                  isDiscovered 
                                    ? 'border-secondary/20 bg-secondary/10 text-secondary' 
                                    : 'border-outline-variant bg-[#1a1a17] text-outline/40'
                                }`}>
                                  {isDiscovered ? sec.coords : 'X: ?? Y: ??'}
                                </span>
                              </div>
                              
                              <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed mt-2 select-text">
                                {isDiscovered ? sec.description : 'Coordinate data is highly classified. Interacting with unknown phenomena on the home WorldMap will log coordinates here.'}
                              </p>

                              {/* Decoding Hint Block */}
                              {!isDiscovered && (
                                <div className="mt-2.5 p-2.5 rounded bg-[#131311] border border-outline-variant/40 flex items-start gap-2 max-w-xl">
                                  <span className="material-symbols-outlined text-[13px] text-orange-400 mt-0.5 animate-bounce">tips_and_updates</span>
                                  <div className="min-w-0">
                                    <div className="font-mono text-[8.5px] text-outline uppercase font-semibold">COORDINATES HINT METRIC</div>
                                    <p className="text-[10.5px] font-sans text-on-surface-variant mt-0.5 leading-relaxed select-text">
                                      {hintsUnlocked ? (
                                        <span className="text-orange-200 select-text font-medium">{sec.hint}</span>
                                      ) : (
                                        <span className="text-outline/40 italic font-mono select-none">Decryption coordinates matrix is locked. Scan {3 - visitedSectors.length} more regions in Jiya's village to retrieve the passcode.</span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Decoding visual status badge */}
                          <div className="flex-shrink-0 flex items-center md:justify-end gap-2 text-right border-t border-outline-variant/20 pt-2 md:pt-0 md:border-0 min-w-[100px]">
                            {isDiscovered ? (
                              <div className="flex items-center gap-1.5 font-mono text-[9px] text-secondary font-bold select-none">
                                <span className="material-symbols-outlined text-[15px]">verified</span>
                                DECODED (+120XP)
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 font-mono text-[9px] text-outline font-medium select-none">
                                <span className="material-symbols-outlined text-[14px]">lock</span>
                                ENCRYPTED
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

                  {/* Historic Career Accomplishments */}
                  <div className="mt-6 border-t border-outline-variant/60 pt-4">
                    <h4 className="font-display font-semibold text-xs text-secondary uppercase tracking-widest flex items-center gap-1.5 select-none mb-2.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">military_tech</span>
                      HISTORIC GUILD ACCOMPLISHMENTS (Jiya’s Career Milestones):
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3">
                      {ACHIEVEMENTS.map((ach) => (
                        <div 
                          key={ach.id}
                          className="bg-[#1c1c19] border border-outline-variant/60 p-3.5 rounded flex gap-3.5 items-start select-none group"
                        >
                          <div className="p-2.5 bg-yellow-950 text-primary border border-primary/20 rounded mt-0.5 group-hover:animate-bounce flex-shrink-0">
                            <span className="material-symbols-outlined text-[18px]">
                              {ach.icon === 'code' ? 'code' : ach.icon === 'school' ? 'school' : ach.icon === 'handshake' ? 'group' : 'rocket_launch'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="font-mono text-[7px] text-primary tracking-widest block font-extrabold uppercase select-none">HISTORIC RANK</span>
                            <h4 className="font-display font-extrabold text-xs text-glow text-primary leading-tight mt-0.5">{ach.title}</h4>
                            <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">{ach.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 font-mono text-[9px] text-outline border-t border-[#31312c] pt-2 select-none">
                  <span>Sync status: active achievements roster</span>
                  <span className="text-primary flex items-center gap-1">
                    System synchronizations fully optimized
                    <span className="material-symbols-outlined text-[10px]">check_circle</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Active Quests Lists sidebar & Customizable Planner (Acts as tutorial and keeps visitor on loop!) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
          
          {/* Active Objectives */}
          <div className="md:col-span-7 bg-surface-container border-2 border-outline-variant p-4.5 rounded-lg carved-panel flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-outline-variant pb-1.5 flex-wrap gap-2 select-none">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffe088] text-[20px]">emoji_events</span>
                  <h3 className="font-display font-semibold text-body-lg text-on-surface uppercase">Active Quest Log Tracker</h3>
                </div>
                <span className="font-mono text-[10px] text-primary">{questsList.filter(q => q.completed).length}/{questsList.length} QUESTS WON</span>
              </div>

              {/* Dynamic Quest List items */}
              <div className="flex flex-col gap-2.5 max-h-[290px] overflow-y-auto pr-1 mt-3.5 select-none font-sans text-xs">
                {questsList.map((q) => (
                  <div 
                    key={q.id}
                    className={`p-3 bg-background border border-outline-variant/60 rounded flex items-center justify-between group transition-colors ${
                      q.completed ? 'opacity-55' : 'hover:bg-background/90'
                    }`}
                  >
                    <div 
                      onClick={() => handleToggleQuest(q.id)}
                      className="flex items-start gap-2.5 cursor-pointer flex-grow min-w-0 pr-4"
                    >
                      <div className={`p-0.5 rounded border mt-0.5 ${
                        q.completed ? 'bg-secondary border-secondary text-black' : 'border-outline-variant text-transparent bg-background'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>

                      <span className={`leading-snug truncate ${q.completed ? 'line-through text-outline' : 'text-on-surface font-semibold'}`}>
                        {q.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-4.5 flex-shrink-0 font-mono text-[10px]">
                      <div className="flex gap-2">
                        <span className="text-secondary font-bold">+{q.goldReward}G</span>
                        <span className="text-primary font-bold">+{q.xpReward} XP</span>
                      </div>

                      {q.type === 'custom' && (
                        <button 
                          onClick={() => handleDeleteQuest(q.id)}
                          className="text-outline hover:text-red-400 p-0.5"
                          title="Erase customize objective"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Quest Adder Forms */}
            <form onSubmit={handleAddCustomQuest} className="mt-4 pt-4 border-t border-outline-variant flex gap-2">
              <input 
                type="text" 
                value={newQuestText}
                onChange={(e) => setNewQuestText(e.target.value)}
                placeholder="Cast custom training spell/todo objective here..."
                maxLength={45}
                className="flex-grow px-3 py-1.5 bg-background text-on-surface text-xs rounded border border-outline-variant/60 focus:outline-none focus:border-primary font-mono"
              />
              <button 
                type="submit"
                className="press-start-btn px-4 bg-primary text-on-primary hover:bg-primary/95 rounded font-mono font-bold text-xs uppercase flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                ADD
              </button>
            </form>
          </div>

          {/* 5. Contact terminal letter box */}
          <div className="md:col-span-5 bg-surface-container border-2 border-outline-variant p-4.5 rounded-lg carved-panel flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-outline-variant pb-1.5 select-none">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-400 text-[20px]">terminal</span>
                  <h3 className="font-display font-semibold text-body-lg text-on-surface uppercase">Guild Comm Terminal</h3>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[9px]">
                  <span className="text-outline">SIG:</span>
                  <span className="text-green-400 font-extrabold animate-pulse">STABLE 90%</span>
                </div>
              </div>
              
              {isTransmitting ? (
                <div className="my-6 p-4 bg-background border border-primary/20 rounded flex flex-col gap-3 font-mono text-xs select-none">
                  <div className="flex justify-between items-center text-primary font-bold">
                    <span>TRANSMITTING SPELL SIGNAL...</span>
                    <span>{transmissionProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-low border border-outline-variant/60 p-[1px] rounded overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-[#facc15] transition-all duration-700 rounded-sm"
                      style={{ width: `${transmissionProgress}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-outline leading-snug">
                    {transmissionProgress < 35 ? "Modulating wave packets..." : 
                     transmissionProgress < 70 ? "Routing payload through guild gateway..." : 
                     "Establishing final link handshake..."}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendContactMessage} className="mt-3.5 flex flex-col gap-3 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-outline leading-none font-bold uppercase tracking-wider">CALLSIGN</label>
                      <input 
                        type="text" 
                        value={contactMessage.name}
                        onChange={(e) => setContactMessage({ ...contactMessage, name: e.target.value })}
                        required
                        placeholder="Wanderer name..." 
                        className="px-2.5 py-1.5 bg-background text-on-surface border border-outline-variant rounded focus:outline-none focus:border-primary text-xs font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-outline leading-none font-bold uppercase tracking-wider">COMMUNICATION RUNE</label>
                      <input 
                        type="email" 
                        value={contactMessage.email}
                        onChange={(e) => setContactMessage({ ...contactMessage, email: e.target.value })}
                        required
                        placeholder="mail@host.com" 
                        className="px-2.5 py-1.5 bg-background text-on-surface border border-outline-variant rounded focus:outline-none focus:border-primary text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Quick Quest Buttons */}
                  <div className="flex flex-col gap-1 mt-1">
                    <label className="text-[9px] text-outline leading-none font-bold uppercase tracking-wider">PRESET QUESTS</label>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {[
                        { label: 'Job Offer', prefill: "Hello Jiya,\n\nI'd like to discuss an engineering opportunity at our guild. Here are the parameters:\n" },
                        { label: 'Collaboration', prefill: "Hello Jiya,\n\nI have a project idea and would love to co-op with you. Let's build something epic:\n" },
                        { label: 'Freelance', prefill: "Hello Jiya,\n\nI'd like to commission a freelance quest. Here's what we need help with:\n" },
                        { label: 'Say Hi', prefill: "Hello Jiya,\n\nJust sending a friendly ping from a fellow developer wanderer! Keep up the awesome work!\n" }
                      ].map((btn, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            triggerAudio(playClick);
                            setContactMessage({ ...contactMessage, body: btn.prefill });
                          }}
                          className="px-2 py-1 bg-[#1c1c19] hover:bg-primary/15 border border-outline-variant hover:border-primary/50 text-[9px] text-on-surface-variant hover:text-primary rounded cursor-pointer transition-all active:scale-95"
                        >
                          [ {btn.label} ]
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-outline leading-none font-bold uppercase tracking-wider">TRANSMISSION PAYLOAD</label>
                    <textarea 
                      rows={3}
                      value={contactMessage.body}
                      onChange={(e) => setContactMessage({ ...contactMessage, body: e.target.value })}
                      required
                      placeholder={transceiverPlaceholder}
                      className="px-2.5 py-1.5 bg-background text-on-surface border border-outline-variant rounded focus:outline-none focus:border-primary resize-none text-xs font-mono"
                    />
                  </div>

                  <div className="flex justify-between items-center mt-1 pt-2 border-t border-outline-variant/40">
                    <span className="text-[8px] text-outline uppercase font-mono">Claims Quest Rewards on send</span>
                    <button 
                      type="submit"
                      className="press-start-btn py-2 px-4.5 bg-secondary hover:bg-secondary-container hover:text-white rounded text-on-secondary font-mono font-bold tracking-widest text-xs uppercase flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Emit Signal
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Transmission Status & Info panels - fills the empty dead space */}
            <div className="mt-4 pt-4 border-t border-outline-variant flex flex-col gap-3 font-mono text-[10px]">
              
              <div className="grid grid-cols-2 gap-3">
                {/* Reward Preview Card */}
                <div className="border border-primary/20 bg-primary/3 p-2.5 rounded text-left">
                  <span className="font-display font-extrabold text-[9px] text-[#ffe088] tracking-wider block uppercase mb-1">Quest Reward</span>
                  <div className="flex flex-col gap-0.5 text-on-surface font-semibold text-[10px]">
                    <span className="text-secondary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      +50 GOLD
                    </span>
                    <span className="text-primary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      +50 XP
                    </span>
                    <span className="text-purple-300 flex items-center gap-1 text-[9px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      "First Contact"
                    </span>
                  </div>
                </div>

                {/* Transmission Status Box */}
                <div className="border border-outline-variant/60 bg-background p-2.5 rounded text-left">
                  <span className="font-display font-extrabold text-[9px] text-outline tracking-wider block uppercase mb-1">Comm Status</span>
                  <div className="flex flex-col gap-1 text-[9.5px]">
                    <div className="flex items-center gap-1 text-on-surface-variant font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Network: ONLINE
                    </div>
                    <div className="text-outline">
                      Latency: ~24 Hours
                    </div>
                  </div>
                </div>
              </div>

              {/* Character Portrait & Accepting Status */}
              <div className="flex items-center gap-3 bg-surface-container-high/40 border border-outline-variant/30 p-2.5 rounded-md">
                <div className="w-10 h-10 rounded-full border border-primary overflow-hidden bg-background flex-shrink-0">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDD7FMhUjA0kK9i-HW1opUvIWfO0k-2u--boOJ15vOlu25X9PjrZFGxjNnCn3KOjFjXFALox177-d_jE3ZXjMa8TNUy-wEVB1YsdFUbWsWGIF6XEhBkGEM3XuLKUAdQixwxmGyHl7l03_k7yFpPJTHLIgB7gm7QZLb0mvBHCUpIdZDuLYTs3wFDj7Pue6t94P2hNvBMUnZCk_Bh1D77o4IGN-usyOSnK-tHX6Yct3GD6GYSGuTxedmMmeXCzjqd5CTB7jZUZXeFJs" 
                    alt="Guild Master portrait" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-display font-extrabold text-[10px] text-primary leading-tight">GUILD MASTER JIYA</div>
                  <div className="text-outline text-[9px] leading-tight mt-0.5">Accepting Quests: ONLINE</div>
                  <div className="flex flex-wrap gap-1.5 mt-1 font-mono text-[8px] uppercase">
                    <span className="px-1 bg-surface-container-highest border border-outline-variant rounded text-on-surface-variant font-bold">Full-Time</span>
                    <span className="px-1 bg-surface-container-highest border border-outline-variant rounded text-on-surface-variant font-bold">Internship</span>
                    <span className="px-1 bg-surface-container-highest border border-outline-variant rounded text-on-surface-variant font-bold">Freelance</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Persistent Bottom visual spacer metadata footer as requested in "Tactile RPG visual rules" (anti-slop, clean and honest) */}
      <footer className="w-full text-center py-6 border-t border-outline-variant mt-12 bg-surface-container select-none text-[10px] font-mono text-outline">
        <p>© 2026 JIYA.EXE. ALL QUISTS REGISTERED SECURELY ON LOCAL SPECTRUM.</p>
        <div className="flex items-center justify-center gap-6 mt-1 flex-wrap">
          <span>COORDINATES RECLAIMED: 8 sectors found</span>
          <span>SYSTEM CHIP-SET: Vite + React 19 + Tailwind v4 + Web Audio API</span>
          <span>DESIGN CONCEPT: 16-BIT CARVED-BORDER RPG COMPENDIUM</span>
        </div>
      </footer>
    </div>
  );
}
