import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShopItem } from '../types';
import { SHOP_ITEMS } from '../data';
import { playClick, playCoin } from '../utils/sound';

interface ExtrasShopProps {
  currentGold: number;
  unlockedPurchases: string[];
  onPurchase: (itemId: string, cost: number) => void;
  onAdjustGold: (amount: number) => void;
  onGrantReward: (gold: number, xp: number, text: string) => void;
}

export const ExtrasShop: React.FC<ExtrasShopProps> = ({
  currentGold,
  unlockedPurchases,
  onPurchase,
  onAdjustGold,
  onGrantReward
}) => {
  const [items, setItems] = useState<ShopItem[]>(SHOP_ITEMS);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [rollWager, setRollWager] = useState<number>(15);
  const [rolling, setRolling] = useState(false);
  const [diceResults, setDiceResults] = useState<{ d1: number; d2: number } | null>(null);
  const [diceLogs, setDiceLogs] = useState<string>("");

  const isPurchased = (itemId: string) => unlockedPurchases.includes(itemId);

  const handleBuy = (item: ShopItem) => {
    if (isPurchased(item.id)) return;
    if (currentGold < item.cost) {
      playClick();
      alert("Not enough Gold, Adventurer! Go complete standard quests or play the Dice log to acquire G.");
      return;
    }

    onPurchase(item.id, item.cost);
    playCoin();
    setSelectedItem(null);
    onGrantReward(0, 100, `Purchased: ${item.name}! Claimed +100 bonus EXP!`);
  };

  const handleRollDice = () => {
    if (currentGold < rollWager) {
      playClick();
      alert("You lack enough Gold to submit this wager!");
      return;
    }

    playClick();
    setRolling(true);
    setDiceResults(null);
    onAdjustGold(-rollWager);

    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setDiceResults({ d1, d2 });
      setRolling(false);
      playCoin();

      const sum = d1 + d2;
      const win = d1 === d2;

      if (win) {
        const reward = rollWager * 3;
        onAdjustGold(reward);
        setDiceLogs(`SUCCESS! CRITICAL DOUBLE [${d1}, ${d2}]! You multiplied your wager by x3 and acquired +${reward}G!`);
        onGrantReward(0, 50, `Won standard Critical Double! +50 EXP!`);
      } else if (sum >= 8) {
        const reward = Math.floor(rollWager * 1.5);
        onAdjustGold(reward);
        setDiceLogs(`VICTORY! High scale aggregate [${d1} + ${d2} = ${sum}]! Reclaimed +${reward}G!`);
      } else {
        setDiceLogs(`MISSED! Weak roll [${d1} + ${d2} = ${sum}]. The goblins pocketed your wager.`);
      }
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Secret Cave Store Items */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
          <span className="material-symbols-outlined text-rose-400 text-[22px]">storefront</span>
          <h3 className="font-display font-semibold text-lg text-on-surface">Jiya's Cave Shop</h3>
        </div>

        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          Welcome traveler! Here you can trade Gold extracted from achievements or quests to unlock powerful boosters or secret modules!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {items.map((item) => {
            const bought = isPurchased(item.id);
            return (
              <div 
                key={item.id}
                onClick={() => { playClick(); setSelectedItem(item); }}
                className={`p-3 rounded-lg border-2 cursor-pointer hover:bg-surface-container transition-all flex items-start gap-3 select-none carved-panel ${
                  selectedItem?.id === item.id 
                    ? 'border-primary bg-surface-container-high' 
                    : bought 
                      ? 'border-outline-variant opacity-60 bg-surface-container-low' 
                      : 'border-outline-variant bg-surface-container-low'
                }`}
              >
                <div className={`p-2.5 rounded-md ${bought ? 'bg-background text-outline' : 'bg-primary/10 text-primary'}`}>
                  <span className="material-symbols-outlined text-[24px]">
                    {item.icon}
                  </span>
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-display font-semibold text-body-md text-on-surface truncate">{item.name}</h4>
                    {bought && (
                      <span className="text-[8px] bg-secondary/15 text-secondary border border-secondary px-1 rounded uppercase font-mono font-bold font-light">Owned</span>
                    )}
                  </div>
                  <p className="font-sans text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">{item.desc}</p>
                  
                  <div className="flex items-center justify-between border-t border-outline-variant/50 mt-2.5 pt-1 font-mono text-[10px]">
                    <span className="text-outline">Rarity Item</span>
                    <span className="text-primary font-bold">{bought ? 'Acquired' : `${item.cost} G`}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected inspect modal */}
        <AnimatePresence mode="wait">
          {selectedItem && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-lg bg-surface-container-highest border border-primary/40 relative mt-2"
            >
              <div className="absolute top-2 right-2">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="text-outline hover:text-white"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded bg-primary/25 border border-primary text-primary">
                  <span className="material-symbols-outlined text-[28px]">{selectedItem.icon}</span>
                </div>

                <div className="flex-grow">
                  <h4 className="font-display font-bold text-on-surface text-base">{selectedItem.name}</h4>
                  <div className="flex items-center gap-4 mt-0.5">
                    <span className="font-mono text-xs text-primary">{selectedItem.cost} GOLD COINS</span>
                    <span className="font-mono text-[10px] text-outline uppercase">Effect: {selectedItem.id === 'legendary-cape' ? 'Class Upgrade' : 'Boost'}</span>
                  </div>

                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed mt-2.5 bg-background/50 p-2.5 rounded border border-outline-variant/60">
                    {selectedItem.id === 'wisdom-scroll' && isPurchased('wisdom-scroll') ? (
                      <span className="text-secondary block font-mono text-[11px]">
                        [DECRYPTED CRIME LOG]: "Outage incident 2024-F4. We dropped a nested Postgres lock by running recursive maps inside a transaction. Lessons learned: NEVER map async aggregates without a solid connection timeout! Gained eternal wisdom."
                      </span>
                    ) : (
                      <span>{selectedItem.desc}</span>
                    )}
                  </p>

                  <div className="flex justify-between items-center mt-4 pt-1.5 border-t border-outline-variant">
                    <span className="font-mono text-[9px] text-outline">Gained bonus XP on acquisition</span>
                    {isPurchased(selectedItem.id) ? (
                      <button 
                        disabled
                        className="px-4 py-1.5 rounded bg-outline/20 text-outline border border-outline-variant/50 font-display text-xs cursor-not-allowed"
                      >
                        Item Acquired
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleBuy(selectedItem)}
                        className="press-start-btn px-5 py-1.5 rounded bg-primary hover:bg-primary/95 text-on-primary border border-white font-mono font-bold text-xs uppercase"
                      >
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mini-Game Segment */}
      <div className="lg:col-span-5 p-4 rounded-lg bg-surface-container-low border border-outline-variant flex flex-col justify-between carved-panel">
        <div>
          <div className="flex items-center gap-2 border-b border-outline-variant pb-1.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">casino</span>
            <h3 className="font-display font-semibold text-body-lg text-on-surface">Dice Quest Wagering</h3>
          </div>

          <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed mt-2">
            Low on G? Throw some wager down and roll the RPG dice. Triple multiplier on doubles, and 1.5x on score aggregate ≥ 8!
          </p>

          <div className="flex items-center gap-3 mt-4">
            <span className="font-mono text-outline text-xs">WAGER:</span>
            {[10, 15, 25, 50].map((w) => (
              <button 
                key={w}
                onClick={() => { playClick(); setRollWager(w); }}
                className={`px-2.5 py-1 rounded font-mono text-xs border ${
                  w === rollWager 
                    ? 'bg-secondary text-on-secondary border-white font-bold' 
                    : 'bg-background hover:bg-surface-container-high text-on-surface-variant border-outline-variant'
                }`}
              >
                {w}G
              </button>
            ))}
          </div>

          {/* Dice Roller Display */}
          <div className="flex justify-center gap-6 py-6 my-4 bg-background/50 rounded border border-outline-variant/60 relative overflow-hidden">
            {rolling ? (
              <div className="flex gap-6">
                {[1, 2].map((i) => (
                  <motion.div 
                    key={i}
                    animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 0.35 }}
                    className="w-14 h-14 bg-surface-container-highest border-2 border-primary text-primary flex items-center justify-center rounded-lg shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[26px]">rotate_right</span>
                  </motion.div>
                ))}
              </div>
            ) : diceResults ? (
              <div className="flex gap-6">
                <motion.div 
                  initial={{ scale: 0.2, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-14 h-14 bg-surface-container-high border-2 border-primary text-primary flex items-center justify-center font-display font-bold text-2xl rounded-lg shadow-lg select-none"
                >
                  {diceResults.d1}
                </motion.div>
                <motion.div 
                  initial={{ scale: 0.2, rotate: 45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-14 h-14 bg-surface-container-high border-2 border-primary text-primary flex items-center justify-center font-display font-bold text-2xl rounded-lg shadow-lg select-none"
                >
                  {diceResults.d2}
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-4 select-none">
                <span className="material-symbols-outlined text-outline text-[40px] animate-pulse">casino</span>
                <p className="font-mono text-[10px] text-outline mt-1.5 uppercase tracking-widest">Submit wager to throw</p>
              </div>
            )}
          </div>
        </div>

        <div>
          {diceLogs && (
            <div className="p-2 bg-background border border-outline-variant rounded mb-3 text-center">
              <p className="font-mono text-[9px] text-secondary leading-normal">{diceLogs}</p>
            </div>
          )}

          <button 
            disabled={rolling}
            onClick={handleRollDice}
            className={`w-full press-start-btn py-2 bg-secondary text-on-secondary hover:bg-secondary-container hover:text-white rounded font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 ${
              rolling ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">rotate_right</span>
            Wager {rollWager}G & Spin Dice
          </button>
        </div>
      </div>
    </div>
  );
};
