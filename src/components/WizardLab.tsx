import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, Sliders, Key, Scroll, Check, Loader2, Volume2, Coins, Flame } from 'lucide-react';
import { useGameStore } from '../store/game-store';

interface WizardLabProps {
  currentGold: number;
  soundEnabled: boolean;
  triggerAudio: (soundFn: () => void) => void;
  claimRewards: (gold: number, xp: number, actionName: string, notify?: boolean) => void;
  addNotification: (text: string, xpAmt?: number, goldAmt?: number, icon?: string) => void;
}

export const WizardLab: React.FC<WizardLabProps> = ({
  currentGold,
  soundEnabled,
  triggerAudio,
  claimRewards,
  addNotification
}) => {
  // Synth states
  const [waveform, setWaveform] = useState<OscillatorType>('triangle');
  const [frequency, setFrequency] = useState<number>(440);
  const [duration, setDuration] = useState<number>(0.25);
  const [lfoSpeed, setLfoSpeed] = useState<number>(5);
  const [lfoDepth, setLfoDepth] = useState<number>(0);
  const [oscilloscopeActive, setOscilloscopeActive] = useState<boolean>(false);

  // Gemini states
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('jiya_custom_gemini_key') || '';
  });

  const soundPlaysCount = useGameStore(state => state.soundPlaysCount);
  const setSoundPlaysCount = useGameStore(state => state.setSoundPlaysCount);
  const usedOscillators = useGameStore(state => state.usedOscillators);
  const setUsedOscillators = useGameStore(state => state.setUsedOscillators);
  const hasUsedGemini = useGameStore(state => state.hasUsedGemini);
  const setHasUsedGemini = useGameStore(state => state.setHasUsedGemini);

  const recordPlay = (oscType: OscillatorType) => {
    setSoundPlaysCount(prev => prev + 1);
    if (!usedOscillators.includes(oscType)) {
      setUsedOscillators([...usedOscillators, oscType]);
    }
  };
  const [scenario, setScenario] = useState<string>('Debugging a memory leak in production servers');
  const [tone, setTone] = useState<string>('cyberpunk');
  const [generating, setGenerating] = useState<boolean>(false);
  const [questResult, setQuestResult] = useState<string>('');
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(false);

  const getToneName = (t: string) => {
    switch (t) {
      case 'cyberpunk': return 'Neo-Cyberpunk';
      case 'eldritch': return 'Gothic Eldritch';
      case 'comedy': return '16-Bit Comedy';
      case 'fantasy': return 'High Guild Fantasy';
      default: return t;
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('jiya_custom_gemini_key', apiKey);
    addNotification('Gemini API Key saved to Local Storage!', 0, 0, 'key');
  };

  // Sound Synthesizer function
  const playCustomSynth = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveform;
      osc.frequency.setValueAtTime(frequency, now);

      // Connect LFO modulation if active
      if (lfoSpeed > 0 && lfoDepth > 0) {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(lfoSpeed, now);
        lfoGain.gain.setValueAtTime(lfoDepth, now);
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + duration);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.start(now);
      osc.stop(now + duration);
      recordPlay(waveform);

      // Trigger visual oscilloscope pulse
      setOscilloscopeActive(true);
      setTimeout(() => setOscilloscopeActive(false), duration * 1000);
    } catch (e) {
      console.warn('Web Audio Play failed:', e);
    }
  };

  // Play pre-programmed retro templates
  const playRecipe = (recipe: 'laser' | 'mana' | 'bass' | 'chime') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      if (recipe === 'laser') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.3);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.3);
        recordPlay('sawtooth');
      } else if (recipe === 'mana') {
        // Fast triple pulse sweep
        const notes = [587.33, 698.46, 880, 1174.66]; // D5, F5, A5, D6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          gain.gain.setValueAtTime(0.1, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.18);
        });
        recordPlay('triangle');
      } else if (recipe === 'bass') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
        recordPlay('square');
      } else if (recipe === 'chime') {
        const notes = [523.25, 659.25, 783.99, 1318.51]; // C5, E5, G5, E6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          gain.gain.setValueAtTime(0.08, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.25);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.25);
        });
        recordPlay('sine');
      }
      setOscilloscopeActive(true);
      setTimeout(() => setOscilloscopeActive(false), 450);
    } catch (err) {}
  };

  // Procedural Offline RPG Generator Fallback
  const generateOfflineScroll = (scen: string, activeTone: string): string => {
    const formattedScen = scen.trim() || 'Undertaking general coding quests';
    
    switch (activeTone) {
      case 'cyberpunk':
        return `### ⚡ CYBERPUNK CHRONICLE: RUNTIME LOGS
**Dossier**: DE-MEM-LEAK-2049
**Target Action**: \`${formattedScen}\`

**System Diagnosticians Alert**:
1. Deep-sector memory heaps are overflowed. Virtual memory partitions are melting.
2. The core AI subnet detects an anomaly in the garbage collection loop. Buffer arrays are locked.
3. Decrypt the memory cells and purge the orphaned nodes before system core containment fails.

**[Quest Goals]**
- [ ] Audit variable declarations for unclosed stream references.
- [ ] Inject diagnostic probes inside the active process node.
- [ ] Reboot local container and flash new memory-pruning indices.

**Reward Allocation**: +20 Gold, +120 EXP. Config status complete.`;

      case 'eldritch':
        return `### 🔮 ELDRITCH GRIMOIRE: THE MADNESS OF CODE
**Tome Ledger**: ARCH-CURSE-666
**Sorrowful Pursuit**: "${formattedScen}"

**Forbidden Chronicles**:
1. A shadowy corruption seeps into the library stacks. The console bleeds warning lines.
2. Whispers of un-allocated processes murmur from the hardware void, devouring CPU cycles.
3. Cleanse the cursed script and seal the portal before the heap leaks into the physical realm.

**[Sacred Rituals]**
- [ ] Offer three debug breakpoints to the syntax daemon.
- [ ] Cast memory-pruning spells over the looping grimoire blocks.
- [ ] Banish the lingering ghosts of unreleased variables.

**Pact Seals**: +20 Gold, +120 EXP. The stars are aligned.`;

      case 'comedy':
        return `### 🎮 16-BIT RETRO COMEDY: TYPOS & TEARS
**Quest Title**: NO-MONEY NO-FUN
**Bizarre Bug**: "${formattedScen}"

**Humorous Logs**:
1. Code compiling results: 0 errors, 1 warnings, 456 unexplainable slowdowns.
2. The system scheduler went out to buy coffee and forgot to release the stack variables.
3. Smash keyboard rapidly to clear cache. Pray to the compiler deities.

**[Funny Tasks]**
- [ ] Locate the intern who left console.log("here") 50 times.
- [ ] Put a comment saying // "DO NOT TOUCH, MAGIC WORKS HERE" to fix memory.
- [ ] Turn it off and turn it back on again.

**Guild Loot**: +20 Gold, +120 EXP. Go buy an espresso.`;

      case 'fantasy':
      default:
        return `### 🏰 HIGH GUILD FANTASY: SPELL BOOK SECRETS
**Guild Registry**: CASTLE-WALLS-78
**Heroic Objective**: "${formattedScen}"

**Royal Proclamations**:
1. The castle's digital matrix towers are surrounded by static dust particles.
2. A magical memory draft is draining the wizarding servers' pool. Mana reserves are dropping.
3. Purify the code streams and defend the central database keep.

**[Royal Decrees]**
- [ ] Forge composite database indices in the iron kiln.
- [ ] Deploy guards (try-catch shields) around critical spell functions.
- [ ] Purge redundant entities from the memory pool.

**Knight Rewards**: +20 Gold, +120 EXP. Long live the code.`;
    }
  };

  // AI Prompt Synthesizer
  const handleGenerateQuest = async () => {
    setGenerating(true);
    setRewardClaimed(false);
    setQuestResult('');

    try {
      // 1. Attempt backend generation via /api/gemini
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario,
          tone,
        }),
      });

      if (!response.ok) {
        throw new Error('Backend synthesis failed');
      }

      const data = await response.json();
      const generatedText = data.response;

      if (generatedText) {
        setQuestResult(generatedText);
        
        // Dynamic +20 XP reward for the first use of Gemini
        if (!hasUsedGemini) {
          setHasUsedGemini(true);
          addNotification('AI Generation success! +20 XP first use bonus!', 20, 0, 'sparkles');
          claimRewards(0, 20, 'First time using Gemini Prompt Scroll Matrix', false);
        } else {
          addNotification('Scroll Synthesized via Gemini AI!', 30, 0, 'sparkles');
          claimRewards(0, 30, 'Synthesized quest matrix using Gemini API', false);
        }
        return;
      } else {
        throw new Error('No content returned from backend');
      }
    } catch (backendErr) {
      console.warn('Backend API failed, trying direct client fallback...', backendErr);

      // 2. Client fallback using user apiKey in localStorage (if set)
      if (apiKey && apiKey !== 'placeholder_key') {
        try {
          const prompt = `You are a retro 16-bit RPG narrator. Generate a funny and detailed quest outline for a developer based on this coding task: "${scenario}". Use the style of tone "${tone}" (Gamer style). 
Format your output exactly as a retro markdown scroll containing:
- A title
- A narrative background (1-2 sentences)
- A bulleted list of 3 actionable programming tasks representing the subquests
- A reward summary listing +20 Gold and +120 EXP.
Keep it compact and clean.`;

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
              }),
            }
          );

          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (generatedText) {
            setQuestResult(generatedText);
            addNotification('Scroll Synthesized via Local Key!', 30, 0, 'sparkles');
            claimRewards(0, 30, 'Synthesized quest matrix using local Gemini API key', false);
            return;
          }
        } catch (localErr) {
          console.error('Local client-side API call failed:', localErr);
        }
      }

      // 3. Offline fallback
      addNotification('AI Generation failed. Falling back to offline scroll...', 0, 0, 'error');
      const res = generateOfflineScroll(scenario, tone);
      setQuestResult(res);
    } finally {
      setGenerating(false);
    }
  };

  const handleClaimQuestRewards = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);
    addNotification('Quest completed successfully! Gained +20 Gold and +120 EXP!', 120, 20, 'verified');
    claimRewards(20, 120, `Completed Wizard Lab Quest: "${scenario}"`, false);
    triggerAudio(() => playRecipe('chime'));
  };

  // Quick helper to show active oscillator notes
  const getNoteName = (freq: number) => {
    if (freq < 150) return 'Sub-Bass (C2)';
    if (freq < 250) return 'Deep Bass (F2)';
    if (freq < 350) return 'Midrange (E3)';
    if (freq < 500) return 'Concert pitch (A4)';
    if (freq < 800) return 'Treble (G5)';
    return 'High sweep (C6)';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: 8-Bit Retro Synth Instrument */}
      <div className="lg:col-span-5 flex flex-col gap-4 border-r border-[#31312c] lg:pr-5">
        <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
          <Sliders className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-body-lg text-on-surface">8-BIT SYNTH ENGINE</h3>
        </div>

        {/* Oscilloscope screen visualization */}
        <div className="h-32 bg-[#0c0d0a] border-2 border-outline-variant rounded-lg relative overflow-hidden flex items-center justify-center shadow-inner">
          <div className="absolute top-2 left-2 text-[8px] font-mono text-outline uppercase tracking-widest select-none">
            SYNTH SIGNAL OUTPUT
          </div>
          
          <AnimatePresence>
            {oscilloscopeActive ? (
              <motion.svg 
                key="active-wave"
                className="w-full h-16 stroke-primary fill-none stroke-[3]"
                viewBox="0 0 100 20"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                exit={{ opacity: 0 }}
              >
                <motion.path 
                  d={
                    waveform === 'sine' 
                      ? "M 0 10 Q 12 0 25 10 T 50 10 T 75 10 T 100 10"
                      : waveform === 'square'
                        ? "M 0 18 L 0 2 L 25 2 L 25 18 L 50 18 L 50 2 L 75 2 L 75 18 L 100 18"
                        : waveform === 'sawtooth'
                          ? "M 0 18 L 25 2 L 25 18 L 50 2 L 50 18 L 75 2 L 75 18 L 100 2"
                          : "M 0 10 L 12 2 L 25 18 L 37 2 L 50 18 L 62 2 L 75 18 L 87 2 L 100 10"
                  }
                  animate={{
                    x: [-5, 5, -5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.35,
                    ease: "linear"
                  }}
                />
              </motion.svg>
            ) : (
              <div className="w-full border-t border-dotted border-outline-variant opacity-35" />
            )}
          </AnimatePresence>

          <div className="absolute bottom-2 right-2 text-[8px] font-mono text-[#f2ca50] uppercase select-none">
            {getNoteName(frequency)} | {frequency}Hz | {waveform.toUpperCase()}
          </div>
        </div>

        {/* Waveform Toggles */}
        <div className="flex flex-col gap-1.5 select-none">
          <span className="font-mono text-[9px] text-outline uppercase tracking-wider block">Wave Oscillator Shape</span>
          <div className="grid grid-cols-4 gap-1.5">
            {(['sine', 'square', 'sawtooth', 'triangle'] as const).map((shape) => (
              <button
                key={shape}
                onClick={() => { triggerAudio(() => playRecipe('chime')); setWaveform(shape); }}
                className={`py-1.5 px-1 rounded border font-mono text-[9px] font-bold uppercase transition-all cursor-pointer text-center ${
                  waveform === shape
                    ? 'bg-primary border-primary text-on-primary shadow-sm'
                    : 'bg-[#181815] border-outline-variant text-outline hover:text-white hover:bg-surface-container'
                }`}
              >
                {shape === 'sine' ? '∿ Sine' : shape === 'square' ? '⊓ Sq' : shape === 'sawtooth' ? '⧄ Saw' : '∧ Tri'}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders panel */}
        <div className="bg-surface-container-low border border-outline-variant p-4.5 rounded-lg flex flex-col gap-4 shadow-sm select-none">
          {/* Freq Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[9px] font-mono font-bold">
              <span className="text-outline uppercase">Carrier Frequency</span>
              <span className="text-primary">{frequency} Hz</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="1500" 
              value={frequency} 
              onChange={(e) => setFrequency(parseInt(e.target.value))}
              className="w-full accent-primary h-1.5 bg-[#141411] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Duration Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[9px] font-mono font-bold">
              <span className="text-outline uppercase">Decay Time</span>
              <span className="text-primary">{duration.toFixed(2)}s</span>
            </div>
            <input 
              type="range" 
              min="0.05" 
              max="1.00" 
              step="0.05"
              value={duration} 
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-full accent-primary h-1.5 bg-[#141411] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* LFO Speed Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[9px] font-mono font-bold">
              <span className="text-outline uppercase">Modulation (LFO Speed)</span>
              <span className="text-[#f2ca50]">{lfoSpeed} Hz</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="20" 
              value={lfoSpeed} 
              onChange={(e) => setLfoSpeed(parseInt(e.target.value))}
              className="w-full accent-[#f2ca50] h-1.5 bg-[#141411] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* LFO Depth Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[9px] font-mono font-bold">
              <span className="text-outline uppercase">Modulation Depth</span>
              <span className="text-[#f2ca50]">{lfoDepth} Hz</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="500" 
              value={lfoDepth} 
              onChange={(e) => setLfoDepth(parseInt(e.target.value))}
              className="w-full accent-[#f2ca50] h-1.5 bg-[#141411] rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Cast sound Spell */}
        <button
          onClick={playCustomSynth}
          className="w-full font-display font-black text-xs uppercase py-3 px-4 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/95 hover:to-emerald-500 text-on-primary rounded border border-white/20 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" />
          Cast Sonic Spell
        </button>

        {/* Sound Recipe Macros */}
        <div className="flex flex-col gap-1.5 select-none">
          <span className="font-mono text-[9px] text-outline uppercase tracking-wider block">Spell Recipes (Sound Templates)</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => playRecipe('laser')}
              className="p-2 border border-outline-variant bg-[#181815] hover:bg-surface-container rounded font-mono text-[10px] text-orange-400 hover:text-white transition-all cursor-pointer text-left flex items-center gap-2 group"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>Laser Burst</span>
            </button>
            <button
              onClick={() => playRecipe('mana')}
              className="p-2 border border-outline-variant bg-[#181815] hover:bg-surface-container rounded font-mono text-[10px] text-cyan-400 hover:text-white transition-all cursor-pointer text-left flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              <span>Mana Recharge</span>
            </button>
            <button
              onClick={() => playRecipe('bass')}
              className="p-2 border border-outline-variant bg-[#181815] hover:bg-surface-container rounded font-mono text-[10px] text-purple-400 hover:text-white transition-all cursor-pointer text-left flex items-center gap-2"
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-500" />
              <span>Sub-Bass Boom</span>
            </button>
            <button
              onClick={() => playRecipe('chime')}
              className="p-2 border border-outline-variant bg-[#181815] hover:bg-surface-container rounded font-mono text-[10px] text-yellow-400 hover:text-white transition-all cursor-pointer text-left flex items-center gap-2"
            >
              <Volume2 className="w-3.5 h-3.5 text-yellow-400" />
              <span>Healing Sweep</span>
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Gemini AI Quest Scroll Matrix */}
      <div className="lg:col-span-7 flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
            <Scroll className="w-5 h-5 text-secondary" />
            <h3 className="font-display font-semibold text-body-lg text-on-surface">GEMINI PROMPT SCROLL MATRIX</h3>
          </div>

          {/* API Key Panel */}
          <form onSubmit={handleSaveKey} className="bg-surface-container-low border border-outline-variant p-3.5 rounded-lg flex flex-col md:flex-row gap-2 items-end shadow-sm">
            <div className="flex-grow flex flex-col gap-1 w-full">
              <span className="font-mono text-[8px] text-outline uppercase tracking-wider block">Gemini API Key Config (Optional)</span>
              <div className="relative">
                <input 
                  type="password"
                  placeholder="Paste your GEMINI_API_KEY (stored locally)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-[#121310] border border-outline-variant rounded px-2.5 py-1.5 text-xs font-mono text-white placeholder-outline focus:outline-none focus:border-secondary"
                />
                <Key className="absolute right-2.5 top-2 w-4 h-4 text-outline pointer-events-none" />
              </div>
            </div>
            <button 
              type="submit"
              className="px-4 py-1.5 bg-secondary hover:bg-secondary/95 text-on-secondary border border-[#ffd55a]/25 rounded text-xs font-mono font-bold tracking-wider uppercase cursor-pointer w-full md:w-auto shadow whitespace-nowrap"
            >
              Save Key
            </button>
          </form>

          {/* Scenario Input */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[8px] text-outline uppercase tracking-wider block">Spell Matrix Focus (Coding Scenario)</span>
            <textarea
              rows={2}
              placeholder="What programming task are you working on today?"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded p-3 text-xs text-on-surface focus:outline-none focus:border-primary font-mono leading-relaxed shadow-sm resize-none"
            />
          </div>

          {/* Tone Selector */}
          <div className="flex flex-col gap-1.5 select-none">
            <span className="font-mono text-[8px] text-outline uppercase tracking-wider block">In-Game Scroll Tone</span>
            <div className="grid grid-cols-4 gap-2">
              {(['cyberpunk', 'eldritch', 'comedy', 'fantasy'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { triggerAudio(() => playRecipe('chime')); setTone(t); }}
                  className={`py-1.5 px-2 rounded border font-mono text-[8px] font-bold uppercase transition-all cursor-pointer text-center ${
                    tone === t
                      ? 'bg-secondary border-secondary text-on-secondary shadow-sm'
                      : 'bg-[#181815] border-outline-variant text-outline hover:text-white hover:bg-surface-container'
                  }`}
                >
                  {getToneName(t)}
                </button>
              ))}
            </div>
          </div>

          {/* Action Generate button */}
          <button
            onClick={handleGenerateQuest}
            disabled={generating}
            className="w-full font-display font-black text-xs uppercase py-3 px-4 bg-gradient-to-r from-secondary to-amber-500 hover:from-secondary/95 hover:to-amber-400 text-on-secondary rounded border border-white/20 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-on-secondary" />
                Synthesizing Scroll Matrices...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-on-secondary" />
                Forge AI Quest Scroll
              </>
            )}
          </button>

          {/* Scroll Result Screen */}
          <AnimatePresence>
            {questResult && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-[#faf6e9] text-[#2c1d11] p-5.5 rounded-lg border-2 border-[#b89b72] shadow-xl relative font-sans text-xs scroll-paper min-h-48 overflow-y-auto leading-relaxed max-h-72 select-text"
              >
                {/* Parchment background detail styling */}
                <div className="absolute top-2 right-2 text-[9px] font-mono text-[#b89b72] tracking-wider font-bold select-none uppercase">
                  QUEST SCROLL
                </div>
                
                {/* Generated content rendering */}
                <div className="scroll-content whitespace-pre-wrap font-mono prose prose-stone max-w-none">
                  {questResult}
                </div>

                {/* Complete Quest Button */}
                <div className="mt-5 border-t border-[#b89b72]/40 pt-4 flex justify-end">
                  <button
                    onClick={handleClaimQuestRewards}
                    disabled={rewardClaimed}
                    className={`px-4.5 py-2 rounded font-display text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow ${
                      rewardClaimed
                        ? 'bg-stone-300 text-stone-500 border border-stone-400/35 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-700 to-green-600 hover:from-emerald-600 hover:to-green-500 text-white border border-[#ffffff]/25 cursor-pointer'
                    }`}
                  >
                    {rewardClaimed ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Quest Complete
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Execute and Claim Rewards
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

    </div>
  );
};
