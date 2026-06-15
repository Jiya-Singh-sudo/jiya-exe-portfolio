import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playClick } from '../utils/sound';

interface DialogGreetingProps {
  onStartQuest: () => void;
  earnedGold: boolean;
  onGrantReward: (gold: number, xp: number, text: string) => void;
}

const DIALOGUE_LINES = [
  {
    title: "HI, I'M JIYA!",
    text: "MMost adventures begin with a map. Mine usually begin with a bug, a notebook, and a terrible idea that somehow works.\nWhat follows is a trail of experiments, products, and lessons learned along the way.",
    avatarState: "default"
  },
  {
    title: "THE QUEST LOG",
    text: "II built this interactive portfolio as a gamified Quest Log. Navigating locations on the World Map will unlock projects, certificate badges, books summaries, and secret dev logs!",
    avatarState: "explain"
  },
  {
    title: "ACTIVE OBJECTIVES",
    text: "YYou will notice 'Active Objectives' appearing in your tracker. Completing tasks like inspecting projects or reading book summaries awards you Gold (G) and Experience Points (EXP)!",
    avatarState: "excited"
  },
  {
    title: "READY, TRAVELER?",
    text: "LLet's kickstart your journey. Press start below to accept your first tutorial quest and claim a gold reward! Good luck exploring!",
    avatarState: "ready"
  }
];

export const DialogGreeting: React.FC<DialogGreetingProps> = ({ onStartQuest, earnedGold, onGrantReward }) => {
  const [lineIdx, setLineIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const currentLine = DIALOGUE_LINES[lineIdx];

  // Typewriter effect
  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < currentLine.text.length) {
        setDisplayedText((prev) => prev + currentLine.text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [lineIdx]);

  const handleNext = () => {
    playClick();
    if (isTyping) {
      // Skip typewriter animation
      setDisplayedText(currentLine.text);
      setIsTyping(false);
    } else if (lineIdx < DIALOGUE_LINES.length - 1) {
      setLineIdx((prev) => prev + 1);
    } else {
      // Trigger start event
      if (!earnedGold) {
        onGrantReward(100, 150, "Completed 'Introductions' objective! Gained 100G and 150 EXP!");
      }
      onStartQuest();
    }
  };

  const handlePrevious = () => {
    playClick();
    if (lineIdx > 0) {
      setLineIdx((prev) => prev - 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="bg-surface-container border-2 border-outline-variant p-5 rounded-lg carved-panel relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none select-none">
        <span className="material-symbols-outlined text-[100px] font-bold">chat_bubble</span>
      </div>

      {/* <div className="absolute -top-0.5 left-4 bg-background px-2 border-x border-outline-variant z-10">
        <span className="font-label-sm text-[10px] text-secondary uppercase tracking-[0.2em]">Dialogue HUD</span>
      </div> */}

      <div className="flex gap-4 items-start md:items-center">
        {/* Animated Avatar State */}
        <div className="flex-shrink-0 w-16 h-16 border-2 border-primary rounded-lg overflow-hidden bg-surface-container-highest flex items-center justify-center relative">
          <img 
            alt="Jiya small portrait"
            className="w-full h-full object-cover select-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDD7FMhUjA0kK9i-HW1opUvIWfO0k-2u--boOJ15vOlu25X9PjrZFGxjNnCn3KOjFjXFALox177-d_jE3ZXjMa8TNUy-wEVB1YsdFUbWsWGIF6XEhBkGEM3XuLKUAdQixwxmGyHl7l03_k7yFpPJTHLIgB7gm7QZLb0mvBHCUpIdZDuLYTs3wFDj7Pue6t94P2hNvBMUnZCk_Bh1D77o4IGN-usyOSnK-tHX6Yct3GD6GYSGuTxedmMmeXCzjqd5CTB7jZUZXeFJs"
          />
          {lineIdx === 3 && (
            <div className="absolute inset-0 bg-primary/10 animate-pulse pointer-events-none" />
          )}
        </div>

        <div className="flex-grow">
          <h3 className="font-display font-semibold text-primary text-headline-sm flex items-center gap-2">
            {currentLine.title}
            {lineIdx === 3 && (
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-secondary animate-ping" />
            )}
          </h3>
          <div className="min-h-[72px] mt-1 pr-6">
            <p className="font-sans text-on-surface-variant text-body-md leading-relaxed whitespace-pre-line selection:bg-primary/30">
              {displayedText}
              {isTyping && <span className="inline-block w-2.5 h-4 ml-0.5 bg-primary animate-pulse align-middle" />}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 border-t border-outline-variant pt-3">
        <div className="flex gap-1.5">
          {DIALOGUE_LINES.map((_, i) => (
            <div 
              key={i} 
              onClick={() => { playClick(); setLineIdx(i); }} 
              className={`w-5 h-2.5 border rounded-sm cursor-pointer transition-all duration-200 ${
                i === lineIdx ? 'bg-primary border-primary w-8' : 'bg-surface-container-highest border-outline'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {lineIdx > 0 && (
            <button 
              onClick={handlePrevious}
              className="px-3 py-1 bg-surface-container-highest hover:bg-surface-container-high text-on-surface hover:text-white rounded border border-outline font-display text-xs transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              Back
            </button>
          )}

          <button 
            onClick={handleNext}
            className="press-start-btn px-4 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-1"
          >
            {lineIdx === DIALOGUE_LINES.length - 1 ? (
              <>
                <span className="material-symbols-outlined text-[14px] font-bold">play_arrow</span>
                Press Start
              </>
            ) : (
              <>
                Next
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
