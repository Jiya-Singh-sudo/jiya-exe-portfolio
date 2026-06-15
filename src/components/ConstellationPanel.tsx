import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STAR_NODES } from '../data';
import { StarNode } from '../types';
import { playClick, playXPChime } from '../utils/sound';
import { useGameStore } from '../store/game-store';

const CONSTELLATION_LINKS = [
  // Arrow head (pointing upper-left)
  { from: 'dec-arrow-tip', to: 'dec-arrow-base' },      // Rukbat → Arkab (arrowhead)
  // Arrow shaft connecting to central junction
  { from: 'dec-arrow-base', to: 'master-ai' },          // Arkab → Kaus Media (shaft to junction)
  // Left bow curve
  { from: 'dec-arrow-base', to: 'build-products' },     // Arkab → Alnasl (bow upper curve)
  { from: 'build-products', to: 'master-ai' },          // Alnasl → Kaus Media (bow to junction)
  { from: 'build-products', to: 'dec-lower-bow' },      // Alnasl → Rho Sgr (bow lower curve)
  // Upper body (sweeping right)
  { from: 'master-ai', to: 'financial-freedom' },       // Kaus Media → Kaus Borealis
  { from: 'financial-freedom', to: 'software-eng' },    // Kaus Borealis → Phi Sgr
  { from: 'software-eng', to: 'travel' },               // Phi Sgr → Nunki
  // Right side (handle going down)
  { from: 'travel', to: 'dec-tau-sgr' },                // Nunki → Tau Sgr
  // Lower body
  { from: 'master-ai', to: 'dec-body-center' },         // Kaus Media → Albaldah (body center)
  { from: 'dec-body-center', to: 'lifelong-learning' }, // Albaldah → Ascella
  { from: 'dec-tau-sgr', to: 'lifelong-learning' },     // Tau Sgr → Ascella (right meets lower)
  // Bottom prominent star
  { from: 'lifelong-learning', to: 'research-innov' }   // Ascella → Kaus Australis (big bottom star)
];

const STAR_COORDINATES: Record<string, { x: number; y: number }> = {
  // Arrow tip (upper-left) — steep angle pointing up-left
  'dec-arrow-tip':    { x: 18, y: 8 },   // Alpha Sgr (Rukbat) - arrowhead tip
  'dec-arrow-base':   { x: 26, y: 20 },  // Beta Sgr (Arkab) - arrowhead base
  // Left bow curve — distinctly to the left
  'build-products':   { x: 13, y: 44 },  // Gamma 2 Sgr (Alnasl) - left bow star
  'dec-lower-bow':    { x: 17, y: 56 },  // Rho Sgr - lower bow extension
  // Central junction
  'master-ai':        { x: 38, y: 36 },  // Delta Sgr (Kaus Media) - main junction
  // Upper body (sweeping right at ~45°)
  'financial-freedom': { x: 52, y: 22 }, // Lambda Sgr (Kaus Borealis)
  'software-eng':     { x: 63, y: 13 },  // Phi Sgr — pushed higher
  // Right side — pushed further right
  'travel':           { x: 73, y: 25 },  // Sigma Sgr (Nunki)
  'dec-tau-sgr':      { x: 64, y: 38 },  // Tau Sgr - right going down
  // Lower body
  'dec-body-center':  { x: 46, y: 48 },  // Pi Sgr (Albaldah) - center body
  'lifelong-learning': { x: 50, y: 56 }, // Zeta Sgr (Ascella)
  // Bottom prominent star
  'research-innov':   { x: 52, y: 70 }   // Epsilon Sgr (Kaus Australis) - largest star
};

const ASTRONOMICAL_NAMES: Record<string, string> = {
  'dec-arrow-tip': 'Alpha Sagittarii (Rukbat)',
  'dec-arrow-base': 'Beta Sagittarii (Arkab)',
  'build-products': 'Gamma 2 Sagittarii (Alnasl)',
  'dec-lower-bow': 'Rho Sagittarii',
  'master-ai': 'Delta Sagittarii (Kaus Media)',
  'financial-freedom': 'Lambda Sagittarii (Kaus Borealis)',
  'software-eng': 'Phi Sagittarii',
  'travel': 'Sigma Sagittarii (Nunki)',
  'dec-tau-sgr': 'Tau Sagittarii',
  'dec-body-center': 'Pi Sagittarii (Albaldah)',
  'lifelong-learning': 'Zeta Sagittarii (Ascella)',
  'research-innov': 'Epsilon Sagittarii (Kaus Australis)'
};

interface ConstellationPanelProps {
  onGrantReward: (gold: number, xp: number, text: string) => void;
  unlockedStars: string[];
  onUnlockStar: (starId: string) => void;
  onClose?: () => void;
}

export const ConstellationPanel: React.FC<ConstellationPanelProps> = ({
  onGrantReward,
  unlockedStars,
  onUnlockStar,
  onClose
}) => {
  const [selectedStar, setSelectedStar] = useState<StarNode | null>(null);
  const [activeCategory, setActiveCategory] = useState<'career' | 'learning' | 'personal' | 'ai-research'>('career');

  const goals = useGameStore(state => state.goals);
  const setGoals = useGameStore(state => state.setGoals);

  const incrementGoalProgress = (goalId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId && g.progress < 100) {
        const nextProgress = Math.min(100, g.progress + 5);
        if (nextProgress === 100) {
          onGrantReward(50, 100, `Synchronized Goal Mastered: "${g.title}"! Gained +50G & +100 EXP!`);
        } else {
          onGrantReward(2, 10, `Logged study session for "${g.title}" (+5% Progress). Gained +2G & +10 EXP!`);
        }
        return { ...g, progress: nextProgress };
      }
      return g;
    }));
  };
  
  // Combine interactive destiny stars with purely decorative ones
  const [stars] = useState<StarNode[]>(() => {
    const decorativeNodes: StarNode[] = [
      {
        id: 'dec-arrow-tip',
        name: 'Rukbat',
        x: 22, y: 10,
        category: 'personal',
        description: 'Alpha Sagittarii (Rukbat), the tip of the archer\'s arrow pointing toward the heavens.',
        achieved: true,
        isDecorative: true
      },
      {
        id: 'dec-arrow-base',
        name: 'Arkab',
        x: 28, y: 22,
        category: 'personal',
        description: 'Beta Sagittarii (Arkab), the base of the arrowhead connecting to the archer\'s body.',
        achieved: true,
        isDecorative: true
      },
      {
        id: 'dec-lower-bow',
        name: 'Rho Sgr',
        x: 20, y: 62,
        category: 'career',
        description: 'Rho Sagittarii, the lower extension of the archer\'s great bow.',
        achieved: true,
        isDecorative: true
      },
      {
        id: 'dec-body-center',
        name: 'Albaldah',
        x: 44, y: 52,
        category: 'learning',
        description: 'Pi Sagittarii (Albaldah), a bright star in the center of the archer\'s body.',
        achieved: true,
        isDecorative: true
      },
      {
        id: 'dec-tau-sgr',
        name: 'Tau Sgr',
        x: 62, y: 42,
        category: 'learning',
        description: 'Tau Sagittarii, connecting the right side of the constellation downward.',
        achieved: true,
        isDecorative: true
      }
    ];
    return [...STAR_NODES, ...decorativeNodes];
  });

  const handleStarClick = (star: StarNode) => {
    playClick();
    if (selectedStar?.id === star.id) {
      setSelectedStar(null);
    } else {
      setSelectedStar(star);
    }

    if (!star.isDecorative && !star.achieved && !unlockedStars.includes(star.id)) {
      onUnlockStar(star.id);
      onGrantReward(15, 45, `Activated destiny star: ${star.name}! +15G & 45 EXP gained!`);
      playXPChime();
    }
  };

  return (
    <div className="retro-frame flex flex-col md:flex-row min-h-[550px] w-full overflow-hidden text-white rounded">
      
      {/* Left Sidebar Navigation */}
      <div className="w-full md:w-[28%] border-b-4 md:border-b-0 md:border-r-4 border-[#1a1008] bg-[#1b140f] p-5 flex flex-col justify-between select-none">
        <div>
          <h3 className="font-pixel-title text-[9px] leading-relaxed uppercase tracking-wider text-[#ffd65a] mb-5">
            THE STARS I'M REACHING FOR
          </h3>
          
          <div className="flex flex-col gap-2.5 font-pixel-text">
            {(['career', 'learning', 'personal', 'ai-research'] as const).map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    playClick();
                    setActiveCategory(cat);
                    setSelectedStar(null);
                  }}
                  className={`w-full py-2 px-3 border-2 text-left transition-all cursor-pointer text-lg rounded flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-[#140d07] border-[#ffd65a] text-[#ffd65a] shadow-[0_0_8px_rgba(255,214,90,0.25)]'
                      : 'bg-transparent border-transparent text-[#8c7d70] hover:text-[#e8e3d9] hover:bg-[#1a120b]'
                  }`}
                >
                  <span className="text-xl">
                    {cat === 'career' ? '🛠️' : cat === 'learning' ? '📚' : cat === 'personal' ? '🌱' : '🌟'}
                  </span>
                  <span>
                    {cat === 'career' ? 'Building' : cat === 'learning' ? 'Learning' : cat === 'personal' ? 'Life' : 'Impact'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 border-t border-[#5c4028]/40 pt-4">
          <h4 className="font-pixel-title text-[8px] uppercase text-[#ffd65a] mb-3 select-none">
            GOAL OBJECTIVES
          </h4>
          <div className="flex flex-col gap-3 max-h-[170px] overflow-y-auto pr-1">
            {goals.map(goal => (
              <div key={goal.id} className="font-pixel-text text-sm flex flex-col gap-1 select-none">
                <div className="flex justify-between items-center text-xs text-stone-200">
                  <span className="truncate" title={goal.title}>{goal.title}</span>
                  <span className="text-[#ffd65a] font-bold">{goal.progress}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-grow h-2.5 bg-stone-900 border border-stone-850 rounded-sm overflow-hidden relative p-[1px]">
                    <div className="h-full bg-[#ffd65a]" style={{ width: `${goal.progress}%` }} />
                  </div>
                  <button
                    onClick={() => { playClick(); incrementGoalProgress(goal.id); }}
                    disabled={goal.progress >= 100}
                    className="w-5 h-5 flex items-center justify-center bg-[#5c4028] hover:bg-[#ffd65a] hover:text-[#1a1008] text-white border border-[#1a1008] rounded cursor-pointer transition-colors text-[10px] font-bold disabled:opacity-40 disabled:hover:bg-[#5c4028] disabled:hover:text-white"
                    title="Log Study/Work Session (+5% Progress)"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="mt-6 border-2 border-[#5c4028] bg-[#1a1008] text-[#e8e3d9] hover:bg-[#2c1e14] hover:border-[#ffd65a]/60 px-3 py-1.5 text-sm font-pixel-text rounded transition-all cursor-pointer w-full text-center"
          >
            ← Back to Map
          </button>
        )}
      </div>

      {/* Right Graphic Constellation Panel (Dashboard backdrop) */}
      <div className="w-full md:w-[72%] relative min-h-[460px] md:min-h-auto bg-[url('/assets/constellation_background.png')] bg-[length:100%_100%] bg-no-repeat flex flex-col justify-between overflow-hidden">
        {/* Transparent overlay */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

        {/* SVG Constellation Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {CONSTELLATION_LINKS.map((link, idx) => {
            const fStar = stars.find(s => s.id === link.from);
            const tStar = stars.find(s => s.id === link.to);
            if (!fStar || !tStar) return null;

            const fCoords = STAR_COORDINATES[link.from] || { x: fStar.x, y: fStar.y };
            const tCoords = STAR_COORDINATES[link.to] || { x: tStar.x, y: tStar.y };

            const isFromCat = !fStar.isDecorative && fStar.category === activeCategory;
            const isToCat = !tStar.isDecorative && tStar.category === activeCategory;
            const isRelated = selectedStar?.id === link.from || selectedStar?.id === link.to;
            
            let strokeColor = '#ffd65a';
            let strokeOpacity = 0.25;
            let strokeWidth = 1.4;

            if (isRelated) {
              strokeColor = '#ffd65a';
              strokeOpacity = 0.95;
              strokeWidth = 2.4;
            } else if (isFromCat && isToCat) {
              strokeColor = '#ffd65a';
              strokeOpacity = 0.7;
              strokeWidth = 2.0;
            } else if (isFromCat || isToCat) {
              strokeOpacity = 0.4;
              strokeWidth = 1.6;
            }

            return (
              <motion.line
                key={idx}
                x1={`${fCoords.x}%`}
                y1={`${fCoords.y}%`}
                x2={`${tCoords.x}%`}
                y2={`${tCoords.y}%`}
                stroke={strokeColor}
                strokeOpacity={strokeOpacity}
                strokeWidth={strokeWidth}
                strokeDasharray="3 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }}
              />
            );
          })}
        </svg>

        {/* Stars Nodes Layer */}
        <div className="absolute inset-0 z-20">
          {stars.map((star) => {
            const isSelected = selectedStar?.id === star.id;
            const isUnlocked = star.isDecorative || star.achieved || unlockedStars.includes(star.id);
            const isMatchingCategory = !star.isDecorative && star.category === activeCategory;
            const coords = STAR_COORDINATES[star.id] || { x: star.x, y: star.y };

            return (
              <div
                key={star.id}
                className="absolute group"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="flex flex-col items-center relative select-none">
                  {/* Glowing selection ring */}
                  <span 
                    onClick={() => handleStarClick(star)}
                    className={`absolute -inset-4 rounded-full border border-[#ffd65a]/60 opacity-0 transition-all duration-300 cursor-pointer ${
                      isSelected ? 'opacity-100 scale-110 animate-pulse' : 'group-hover:opacity-45'
                    }`} 
                  />

                  {/* Pulsing visual star shape */}
                  <div 
                    onClick={() => handleStarClick(star)}
                    className={`flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      star.id === 'research-innov' ? 'w-12 h-12' : 'w-8 h-8'
                    } ${
                      isSelected
                        ? 'scale-125 text-[#ffd65a] drop-shadow-[0_0_12px_#ffd65a]'
                        : star.id === 'research-innov'
                        ? 'text-[#ffd65a] drop-shadow-[0_0_10px_rgba(255,214,90,0.9)]'
                        : isMatchingCategory
                        ? 'text-[#ffd65a] drop-shadow-[0_0_6px_rgba(255,214,90,0.85)] animate-pulse'
                        : star.isDecorative
                        ? 'text-[#ffd65a]/45 hover:text-[#ffd65a]/80 hover:scale-110 transition-transform'
                        : isUnlocked
                        ? 'text-[#ffd65a]/70 hover:text-[#ffd65a]'
                        : 'text-gray-500/70 hover:text-gray-400'
                    }`}
                  >
                    <span className={`material-symbols-outlined fill-current ${
                      star.id === 'research-innov' ? 'text-3xl' : star.isDecorative ? 'text-[10px]' : 'text-lg'
                    }`}>
                      star
                    </span>
                  </div>

                  {/* Bubble label */}
                  {isMatchingCategory ? (
                    <div 
                      onClick={() => handleStarClick(star)}
                      className={`mt-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black border border-[#ffd65a] text-[#ffd65a] font-pixel-text text-[9px] scale-105 shadow-md cursor-pointer`}
                    >
                      <span className="material-symbols-outlined text-[8px] fill-current animate-pulse">star</span>
                      <span>{star.name}</span>
                    </div>
                  ) : (
                    <span 
                      onClick={() => handleStarClick(star)}
                      className={`mt-1 font-pixel-text whitespace-nowrap transition-opacity cursor-pointer ${
                        star.isDecorative 
                          ? 'text-[#8c7d70]/80 text-[8px] opacity-0 group-hover:opacity-100' 
                          : 'text-[#e8e3d9] opacity-80 text-[10px]'
                      }`}
                    >
                      {star.name}
                    </span>
                  )}

                  {/* Inline Tooltip Dialog Card (Appears above or below the selected node depending on height) */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: coords.y < 35 ? -10 : 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: coords.y < 35 ? -10 : 10, scale: 0.95 }}
                        className={`absolute left-1/2 -translate-x-1/2 z-30 w-52 border-2 border-[#5c4028] bg-[#140d07] p-2.5 rounded shadow-[0_4px_16px_rgba(0,0,0,0.85)] text-left select-text ${
                          coords.y < 35 ? 'top-full mt-3' : 'bottom-full mb-3'
                        }`}
                        style={{
                          outline: '1px solid #1a1008'
                        }}
                      >
                        <div className="flex justify-between items-center border-b border-[#5c4028]/40 pb-1 mb-1.5">
                          <div className="flex flex-col">
                            <span className="font-pixel-title text-[7px] text-[#ffd65a] leading-none uppercase">
                              {star.name}
                            </span>
                            <span className="font-pixel-text text-[6px] text-[#8c7d70] mt-0.5">
                              {ASTRONOMICAL_NAMES[star.id]}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStar(null);
                            }}
                            className="text-[#8c7d70] hover:text-[#e8e3d9] font-pixel-text text-xs leading-none cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="font-pixel-text text-xs text-[#e8e3d9] leading-snug">
                          {star.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between font-pixel-text text-[9px] text-[#8c7d70] border-t border-[#5c4028]/20 pt-1">
                          <span>Coord: {coords.x}x, {coords.y}y</span>
                          {star.isDecorative ? (
                            <span className="text-[#8c7d70] font-bold">★ Celestial</span>
                          ) : isUnlocked ? (
                            <span className="text-[#c3cc8c] font-bold">★ Active</span>
                          ) : (
                            <span className="text-[#ffd65a] font-bold animate-pulse">Activate</span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};