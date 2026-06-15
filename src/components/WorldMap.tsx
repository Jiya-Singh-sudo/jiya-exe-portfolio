import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playClick, playCoin } from '../utils/sound';
import { WeatherOverlay } from './WeatherOverlay';
import { DialogGreeting } from './DialogGreeting';

interface LocationConfig {
  id: string;
  name: string;
  badge: string;
  icon: string;
  coords: string;
  textColor: string;
  desc: string;
  levelRequired: number;
}

const WORLD_LOCATIONS: LocationConfig[] = [
  { 
    id: 'workshop', 
    name: 'WORKSHOP', 
    badge: 'Active Projects', 
    icon: 'construction', 
    coords: 'X: 32 Y: 26', 
    textColor: 'text-primary', 
    desc: 'Where engineering concepts are structured, APIs forged, and code compiled into production-ready web servers.', 
    levelRequired: 1 
  },
  { 
    id: 'library', 
    name: 'LIBRARY', 
    badge: 'Knowledge Base', 
    icon: 'menu_book', 
    coords: 'X: 85 Y: 22', 
    textColor: 'text-secondary', 
    desc: 'Ancient compendiums of developer reading checklists, course outlines, notes and philosophy scrolls.', 
    levelRequired: 1 
  },
  { 
    id: 'life', 
    name: 'DAY IN THE LIFE', 
    badge: 'Routines & Habit Flow', 
    icon: 'favorite', 
    coords: 'X: 60 Y: 20', 
    textColor: 'text-orange-300', 
    desc: 'Hourly schedule tracker detailing slow coffee-fuel mornings, hyper-focus build blocks, gym grids, and daily night diaries.', 
    levelRequired: 1 
  },
  { 
    id: 'progress', 
    name: 'PROGRESS', 
    badge: 'Milestones & Timeline', 
    icon: 'trending_up', 
    coords: 'X: 23 Y: 58', 
    textColor: 'text-blue-300', 
    desc: 'Dossiers cataloging professional cloud certifications, award badges, and general engineering lessons learned.', 
    levelRequired: 1 
  },
  { 
    id: 'garden', 
    name: 'DIGITAL GARDEN', 
    badge: 'Thoughts & Nodes', 
    icon: 'eco', 
    coords: 'X: 68 Y: 58', 
    textColor: 'text-emerald-300', 
    desc: 'An interactive topological force-graph connecting design tokens, databases, AI vector systems, and custom prompting patterns.', 
    levelRequired: 1 
  },
  { 
    id: 'observatory', 
    name: 'OBSERVATORY', 
    badge: 'Roadmap & goals', 
    icon: 'star', 
    coords: 'X: 88 Y: 62', 
    textColor: 'text-purple-300', 
    desc: 'A celestial constellation mapping Jiya’s deep future aspirations, community impact markers, and target technologies.', 
    levelRequired: 1 
  },
  { 
    id: 'lab', 
    name: 'EXPERIMENTS LAB', 
    badge: 'Prototypes Sandbox', 
    icon: 'science', 
    coords: 'X: 46 Y: 58', 
    textColor: 'text-amber-400', 
    desc: 'An experimental playground containing short sandbox scripts, LLM vector prompts, and local utility widgets.', 
    levelRequired: 1 
  },
  { 
    id: 'cave', 
    name: 'EXTRAS', 
    badge: 'Treasures & Potions', 
    icon: 'sports_esports', 
    coords: 'X: 36 Y: 86', 
    textColor: 'text-rose-400', 
    desc: 'Secret local grotto. Exchange hard-earned Gold coins for focus stamina potions, wisdom scrolls, or rare capes.', 
    levelRequired: 1 
  },
];

interface WorldMapProps {
  onSelectSection: (sectionId: string) => void;
  activeQuests: { id: string; text: string; type: string; completed: boolean }[];
  onFoundEasterEgg: (rewardText: string, goldAmount: number) => void;
  weatherId: string;
  onDiscoverSecret?: (secretId: string, label: string) => void;
  discoveredSecrets?: string[];
  // Dialogue Greeting props
  showIntroDialog?: boolean;
  introRewardClaimed?: boolean;
  onStartQuest?: () => void;
  onGrantReward?: (gold: number, xp: number, text: string) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ 
  onSelectSection, 
  activeQuests, 
  onFoundEasterEgg, 
  weatherId, 
  onDiscoverSecret, 
  discoveredSecrets = [],
  showIntroDialog = false,
  introRewardClaimed = false,
  onStartQuest,
  onGrantReward
}) => {
  const [localWeatherOverride, setLocalWeatherOverride] = useState<'sync' | 'clear' | 'rain' | 'snow' | 'fog'>('sync');
  const [hoveredLoc, setHoveredLoc] = useState<string | null>(null);
  const [fountainClicks, setFountainClicks] = useState(0);
  const [boatClicks, setBoatClicks] = useState(0);
  const [campClicks, setCampClicks] = useState(0);
  const [zoomingTo, setZoomingTo] = useState<string | null>(null);

  const activeWeatherId = localWeatherOverride === 'sync' ? weatherId : localWeatherOverride;

  const isQuestTarget = (locId: string) => {
    if (locId === 'workshop') return activeQuests.some(q => q.id === 'explore-workshop' && !q.completed);
    if (locId === 'library') return activeQuests.some(q => q.id === 'read-library' && !q.completed);
    if (locId === 'garden') return activeQuests.some(q => q.id === 'nodes-garden' && !q.completed);
    if (locId === 'observatory') return activeQuests.some(q => q.id === 'summon-observatory' && !q.completed);
    if (locId === 'cave') return activeQuests.some(q => q.id === 'buy-potion' && !q.completed);
    return false;
  };

  const handleLocationClick = (locId: string) => {
    if (zoomingTo) return;
    playClick();
    setZoomingTo(locId);
    
    setTimeout(() => {
      onSelectSection(locId);
      setZoomingTo(null);
    }, 750);
  };

  const handleFountainClick = () => {
    playCoin();
    const count = fountainClicks + 1;
    setFountainClicks(count);
    if (count === 3) {
      onFoundEasterEgg("Fountain of Fortune! You tossed 10G and found Jiya's sunken glowing debug crystal! Claimed +50G!", 40);
      onDiscoverSecret?.('fountain', 'The Sunken Crystal Fountain');
    } else {
      onFoundEasterEgg(`You tossed a shiny copper coin into the village fountain... Splash!`, 0);
    }
  };

  const handleBoatClick = () => {
    playCoin();
    setBoatClicks(prev => prev + 1);
    if (boatClicks === 0) {
      onFoundEasterEgg("Lake Expedition! You fished in the pixel hollow row-boat and pulled out +15G!", 15);
      onDiscoverSecret?.('boat', 'The Pixel Hollow Boat');
    } else {
      onFoundEasterEgg("The row-boat floats calmly in the lake reflections...", 0);
    }
  };

  const handleCampfireClick = () => {
    playClick();
    setCampClicks(prev => prev + 1);
    if (campClicks % 3 === 0) {
      onFoundEasterEgg("Campfire folklore: 'Legend says Jiya initializes her projects with exactly 90-minute hyper-focus slots!' Gained +10G!", 10);
      onDiscoverSecret?.('campfire', 'The Whispering Campfire Wood');
    } else {
      onFoundEasterEgg("The campfire logs crackle, casting cozy pixel shadows on the forest tree line...", 0);
    }
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playCoin();
    onFoundEasterEgg("Celestial Zenith Star discovery! You decoded high-altitude golden telemetry: 'Build with pure intent!' Gained +15G!", 15);
    onDiscoverSecret?.('star', 'The Celestial Zenith Star');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 2D Landscape Map Node (Hidden under mobile layout to enforce touch density) */}
      <div className="relative w-full aspect-[3/2] overflow-hidden border-2 border-outline-variant rounded-lg shadow-2xl hidden md:block select-none bg-[url('/assets/map_bg.png')] bg-[length:100%_100%] bg-no-repeat bg-center">
        
        {/* Dynamic Weather System Particle Overlay */}
        <WeatherOverlay weatherId={activeWeatherId} />

        {/* Dynamic Weather Tuner HUD Panel */}
        <div className="absolute top-4 right-4 z-30 bg-background/90 border border-outline-variant/80 rounded-md p-1.5 flex items-center gap-2 shadow-lg backdrop-blur-md select-none">
          <div className="px-1.5 py-0.5 border-r border-outline-variant/50 flex flex-col justify-center text-left">
            <span className="font-mono text-[7px] text-outline uppercase tracking-wider block leading-none">AEROSOL SYSTEM</span>
            <span className="font-display font-extrabold text-[8px] text-secondary leading-none uppercase tracking-widest block mt-0.5">Atmosphere Mod</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => { playClick(); setLocalWeatherOverride('sync'); }}
              className={`px-2 py-1 rounded text-[10px] font-mono leading-none transition-all flex items-center gap-1 cursor-pointer ${
                localWeatherOverride === 'sync'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-[#1e1e1a] text-outline hover:text-white hover:bg-[#2a2a22]'
              }`}
              title="Synchronize to real-time chronological forecast"
            >
              <span className="material-symbols-outlined text-[12px] animate-spin-slow">sync</span>
              <span>AUTO</span>
            </button>

            <button
              onClick={() => { playClick(); setLocalWeatherOverride('clear'); }}
              className={`p-1.5 rounded transition-all flex items-center justify-center cursor-pointer ${
                localWeatherOverride === 'clear'
                  ? 'bg-amber-500 text-black font-bold shadow-sm'
                  : 'bg-[#1e1e1a] text-outline hover:text-amber-400 hover:bg-[#2a2a22]'
              }`}
              title="Force Clear Skies (1.0x XP)"
            >
              <span className="material-symbols-outlined text-[13px]">wb_sunny</span>
            </button>

            <button
              onClick={() => { playClick(); setLocalWeatherOverride('rain'); }}
              className={`p-1.5 rounded transition-all flex items-center justify-center cursor-pointer ${
                localWeatherOverride === 'rain'
                  ? 'bg-indigo-500 text-white font-bold shadow-sm'
                  : 'bg-[#1e1e1a] text-outline hover:text-indigo-400 hover:bg-[#2a2a22]'
              }`}
              title="Force Electric Rainstorm (1.25x XP)"
            >
              <span className="material-symbols-outlined text-[13px]">thunderstorm</span>
            </button>

            <button
              onClick={() => { playClick(); setLocalWeatherOverride('snow'); }}
              className={`p-1.5 rounded transition-all flex items-center justify-center cursor-pointer ${
                localWeatherOverride === 'snow'
                  ? 'bg-sky-450 text-black font-bold shadow-sm'
                  : 'bg-[#1e1e1a] text-outline hover:text-sky-300 hover:bg-[#2a2a22]'
              }`}
              title="Force Aether Blizzard (1.2x XP)"
            >
              <span className="material-symbols-outlined text-[13px]">ac_unit</span>
            </button>

            <button
              onClick={() => { playClick(); setLocalWeatherOverride('fog'); }}
              className={`p-1.5 rounded transition-all flex items-center justify-center cursor-pointer ${
                localWeatherOverride === 'fog'
                  ? 'bg-purple-500 text-white font-bold shadow-sm'
                  : 'bg-[#1e1e1a] text-outline hover:text-purple-300 hover:bg-[#2a2a22]'
              }`}
              title="Force Arcane Fog (1.15x XP)"
            >
              <span className="material-symbols-outlined text-[13px]">blur_on</span>
            </button>
          </div>
        </div>

        {/* Dialogue Greeting Overlay */}
        <AnimatePresence>
          {showIntroDialog && onStartQuest && onGrantReward && (
            <div className="absolute left-6 top-6 z-30 w-72 md:w-80">
              <DialogGreeting 
                onStartQuest={onStartQuest}
                onGrantReward={onGrantReward}
                earnedGold={introRewardClaimed}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Cinematic Map Panning Zoom Wrapper */}
        <motion.div 
          className="w-full h-full relative"
          animate={zoomingTo ? {
            scale: 2.3,
            x: zoomingTo === 'workshop' ? '18%' : 
               zoomingTo === 'library' ? '-38%' : 
               zoomingTo === 'life' ? '-10%' : 
               zoomingTo === 'progress' ? '28%' : 
               zoomingTo === 'garden' ? '-18%' : 
               zoomingTo === 'observatory' ? '-40%' : 
               zoomingTo === 'lab' ? '4%' : 
               zoomingTo === 'cave' ? '12%' : 0,
            y: zoomingTo === 'workshop' ? '24%' : 
               zoomingTo === 'library' ? '28%' : 
               zoomingTo === 'life' ? '30%' : 
               zoomingTo === 'progress' ? '-12%' : 
               zoomingTo === 'garden' ? '-12%' : 
               zoomingTo === 'observatory' ? '-15%' : 
               zoomingTo === 'lab' ? '-12%' : 
               zoomingTo === 'cave' ? '-40%' : 0,
          } : { scale: 1, x: 0, y: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Invisible interactive fountain click-secret overlay coordinates */}
          <motion.div 
            whileHover={{ scale: 1.15 }}
            onClick={handleFountainClick}
            className="absolute left-[50.5%] top-[46.5%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group select-none z-25 flex flex-col items-center"
            title="The Town Square Water Fountain"
          >
            <div className="w-16 h-16 rounded-full border-2 border-transparent hover:border-cyan-400 group-hover:bg-cyan-500/10 flex items-center justify-center transition-all">
              <span className="material-symbols-outlined text-[18px] text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">waves</span>
            </div>
          </motion.div>

          {/* Animated Jiya character sprite standing next to the Town Fountain */}
          <div className="absolute left-[37.5%] top-[44.5%] -translate-x-1/2 -translate-y-1/2 select-none z-20 pointer-events-none flex flex-col items-center">
            <motion.div 
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              {/* Hair */}
              <div className="w-3.5 h-3.5 bg-[#211611] rounded-full relative">
                {/* Cute Scarf face overlap */}
                <div className="absolute bottom-[-1px] left-0.5 w-2.5 h-1.5 bg-[#f5dfb8] rounded-b-sm" />
                {/* Eyes */}
                <div className="absolute bottom-[2px] left-1 w-0.5 h-0.5 bg-[#422213] rounded-full" />
                <div className="absolute bottom-[2px] right-1 w-0.5 h-0.5 bg-[#422213] rounded-full" />
              </div>
              {/* Cozy Dark Sweater body */}
              <div className="w-4.5 h-4 bg-[#23351d] rounded-b-md relative mt-[-1px]">
                {/* Gold Scarf strip */}
                <div className="w-3.5 h-1 bg-[#f2bc3d] mx-auto rounded-sm mt-[-1px] shadow-sm" />
                {/* Orange backpack straps */}
                <div className="absolute left-0.5 top-0 w-0.5 h-4 bg-[#c85623]" />
                <div className="absolute right-0.5 top-0 w-0.5 h-4 bg-[#c85623]" />
              </div>
              {/* Tiny boots block */}
              <div className="flex gap-1.5 mt-[-1px]">
                <div className="w-1.5 h-1 bg-[#802213] rounded-sm" />
                <div className="w-1.5 h-1 bg-[#802213] rounded-sm" />
              </div>
            </motion.div>
            
            {/* Micro Sprite Shadow */}
            <div className="w-5 h-1.5 bg-black/35 rounded-full mt-0.5 blur-xs" />
            
            {/* Speech bubble showing welcome indicators on hover */}
            <div className="absolute bottom-full mb-1 border-2 border-primary/80 bg-background/95 px-1.5 py-0.5 rounded font-mono text-[7px] font-bold text-primary tracking-wider whitespace-nowrap opacity-75 leading-none transition-all group-hover:opacity-100 select-none shadow">
              JIYA LVL 22
            </div>
          </div>

          {/* Invisible interactive Rowboat click secret overlay coordinates */}
          <motion.div 
            whileHover={{ scale: 1.15 }}
            onClick={handleBoatClick}
            className="absolute left-[79%] top-[82.5%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group select-none z-25 flex flex-col items-center"
            title="Fisherman's Rowing Boat"
          >
            <div className="w-16 h-12 rounded border-2 border-transparent hover:border-sky-450 group-hover:bg-sky-500/10 flex items-center justify-center transition-all">
              <span className="material-symbols-outlined text-[15px] text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity">directions_boat</span>
            </div>
          </motion.div>

          {/* Campfire logs bonfire click-secret right inside camper van campsites */}
          <motion.div 
            whileHover={{ scale: 1.15 }}
            onClick={handleCampfireClick}
            className="absolute left-[36%] top-[85.5%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group select-none z-25 flex flex-col items-center"
            title="The Wood Campfire"
          >
            <div className="w-9 h-9 rounded-full border-2 border-transparent hover:border-orange-400 group-hover:bg-orange-500/10 flex items-center justify-center transition-all">
              <span className="material-symbols-outlined text-[15px] text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">local_fire_department</span>
            </div>
          </motion.div>

          {/* Dynamic stars/sun and Jiya's Celestial Zenith Star secret in sky */}
          <div className="absolute top-4 right-12 flex gap-3 items-center z-20">
            <div className="w-1 h-1 bg-white rounded-full animate-ping opacity-25" />
            
            <motion.div 
              whileHover={{ scale: 1.35 }}
              onClick={handleStarClick}
              className="w-5.5 h-5.5 rounded-full border border-yellow-500/30 bg-yellow-950/40 hover:bg-yellow-900/65 flex items-center justify-center cursor-pointer select-none transition-colors"
              title="The Celestial Zenith Star"
            >
              <span className="material-symbols-outlined text-yellow-300 text-[11px] animate-pulse">star</span>
            </motion.div>

            <div className="w-1 h-1 bg-white rounded-full animate-pulse opacity-25 delay-200" />
          </div>

          {/* Map Pins */}
          {WORLD_LOCATIONS.map((loc) => {
            const isHovered = hoveredLoc === loc.id;
            const isTarget = isQuestTarget(loc.id);

            let pos = "left-[50%] top-[40%]";
            if (loc.id === 'workshop') pos = "left-[32%] top-[26%]";
            if (loc.id === 'life') pos = "left-[60%] top-[20%]";
            if (loc.id === 'library') pos = "left-[85%] top-[22%]";
            if (loc.id === 'progress') pos = "left-[23%] top-[58%]";
            if (loc.id === 'lab') pos = "left-[46%] top-[58%]";
            if (loc.id === 'garden') pos = "left-[68%] top-[58%]";
            if (loc.id === 'observatory') pos = "left-[88%] top-[62%]";
            if (loc.id === 'cave') pos = "left-[36%] top-[86%]";

            return (
              <div 
                key={loc.id} 
                className={`absolute ${pos} z-20`}
                style={{ transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setHoveredLoc(loc.id)}
                onMouseLeave={() => setHoveredLoc(null)}
              >
                <div className="relative flex flex-col items-center">
                  
                  {/* FLOATING HOVER TOOLTIP */}
                  <AnimatePresence>
                    {isHovered && !zoomingTo && (
                      <motion.div
                        id={`tooltip-${loc.id}`}
                        initial={{ opacity: 0, y: 12, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.9 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute bottom-full mb-3 w-52 bg-[#121310]/98 border-2 border-primary rounded-lg p-2.5 shadow-[0_6px_22px_rgba(0,0,0,0.95)] shadow-primary/20 backdrop-blur-md pointer-events-none text-center z-50 flex flex-col gap-1"
                      >
                        <span className="font-mono text-[8px] text-secondary uppercase tracking-[0.2em] font-extrabold">{loc.badge}</span>
                        <h5 className="font-display font-extrabold text-xs text-glow text-primary uppercase tracking-wide">{loc.name}</h5>
                        <p className="font-sans text-[10px] text-on-surface-variant leading-snug line-clamp-3">{loc.desc}</p>
                        <div className="flex items-center justify-between mt-1 text-[8px] font-mono text-outline border-t border-outline-variant/60 pt-1">
                          <span>GRID Coords: {loc.coords}</span>
                          <span className="text-secondary font-bold font-mono">LVL REQ: {loc.levelRequired}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Pin Circle Glowing Ripple */}
                  {isHovered && (
                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-12 bg-primary/10 rounded-full border border-primary/20 animate-ping pointer-events-none select-none z-0" />
                  )}

                  {/* Marker Pointer wrapper */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleLocationClick(loc.id)}
                    className="cursor-pointer flex flex-col items-center group relative z-10"
                  >
                    {/* Active Quest banner arrow */}
                    {isTarget && (
                      <div className="absolute -top-9 bg-primary text-on-primary font-mono text-[8px] font-bold tracking-widest uppercase border border-white py-0.5 px-2 rounded-sm shadow-md z-35 animate-bounce flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        <span>QUEST ACTIVE</span>
                      </div>
                    )}

                    {/* Highly polished, Cozy 16-bit Signboard marker button overlay */}
                    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border-2 transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.55)] cursor-pointer group select-none whitespace-nowrap bg-black/85 ${
                      isHovered || isTarget
                        ? 'border-primary text-primary scale-105 shadow-[0_4px_15px_rgba(255,214,90,0.35)] ring-1 ring-primary/45'
                        : 'border-[#4a3b32] text-stone-300'
                    }`}>
                      <span className={`material-symbols-outlined text-[15px] transition-colors ${
                        isHovered || isTarget ? 'text-primary' : 'text-stone-400'
                      }`}>
                        {loc.icon}
                      </span>
                      <div className="flex flex-col text-left leading-none">
                        <span className="font-display text-[9px] font-extrabold tracking-wider uppercase">
                          {loc.id === 'cave' ? 'EXTRAS' : loc.id === 'life' ? 'DAY IN THE LIFE' : loc.id === 'progress' ? 'PROGRESS' : loc.id === 'lab' ? 'EXPERIMENTS LAB' : loc.id === 'garden' ? 'DIGITAL GARDEN' : loc.id.replace(/\s*\(.*\)/g, '').toUpperCase()}
                        </span>
                        <span className="font-mono text-[7px] text-stone-400 mt-0.5 group-hover:text-stone-300 transition-colors">
                          {loc.id === 'workshop' && 'My Projects'}
                          {loc.id === 'life' && 'A peek into my world'}
                          {loc.id === 'library' && 'Books, Courses, Notes'}
                          {loc.id === 'progress' && 'Not Perfection'}
                          {loc.id === 'lab' && 'Ideas in progress'}
                          {loc.id === 'garden' && 'Thoughts & Ideas'}
                          {loc.id === 'observatory' && 'Goals & Aspirations'}
                          {loc.id === 'cave' && 'Fun stuff I love'}
                        </span>
                      </div>
                    </div>

                  </motion.div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Static Ambient Instructions overlay */}
        <div className="absolute top-4 left-4 bg-background/80 border border-outline-variant rounded-md px-3 py-1.5 z-10 font-mono text-[9px] text-outline select-none pointer-events-none">
          <span>SPATIAL CONSTRAINTS: JIYA.EXE ENGINE v2.0A</span>
          <span className="block mt-0.5 text-primary">● CLICK SECTOR TO INIT SYNC PROTOCOL</span>
        </div>
      </div>

      {/* Village Map Logbook (Grid touch view suitable for mobile screens + detailed browser read) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-outline-variant pb-1.5 flex-wrap gap-2 select-none">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">map</span>
            <h4 className="font-display font-semibold text-on-surface text-headline-sm uppercase tracking-wider">Village Map Logbook</h4>
          </div>
          <span className="font-mono text-outline text-[10px] tracking-wide uppercase">{WORLD_LOCATIONS.length} Sectors Connected</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WORLD_LOCATIONS.map((loc) => {
            const hasQuest = isQuestTarget(loc.id);
            return (
              <motion.div 
                whileHover={{ y: -3 }}
                key={loc.id}
                onClick={() => handleLocationClick(loc.id)}
                className={`p-4 rounded-lg cursor-pointer border-2 transition-all flex flex-col justify-between carved-panel relative overflow-hidden group ${
                  hasQuest 
                    ? 'border-primary bg-primary/5 shadow' 
                    : 'border-[#3D3D35] hover:border-[#55554D] bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                {/* Active Quest banner label */}
                {hasQuest && (
                  <div className="absolute -top-1 -right-1 bg-primary text-on-primary font-mono text-[8px] font-bold uppercase tracking-widest py-0.5 px-2 rounded-bl select-none animate-pulse">
                    Active Target
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2.5">
                    <span className={`material-symbols-outlined text-[24px] ${hasQuest ? 'text-primary animate-pulse' : 'text-on-surface-variant group-hover:text-primary transition-colors'}`}>
                      {loc.icon}
                    </span>
                    <div>
                      <h4 className="font-display font-semibold text-on-surface select-none text-body-md group-hover:text-primary transition-colors">{loc.name}</h4>
                      <span className="font-mono text-[9px] text-outline uppercase select-none tracking-wider">{loc.badge}</span>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant min-h-[44px] mt-2.5 leading-relaxed flex-grow">
                    {loc.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-outline-variant mt-3.5 pt-2 font-mono text-[9px] text-outline select-none">
                  <span>Pin: {loc.coords}</span>
                  <span className="text-secondary flex items-center gap-1 font-bold">
                    Enter Location
                    <span className="material-symbols-outlined text-[10px] font-bold">arrow_forward</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
