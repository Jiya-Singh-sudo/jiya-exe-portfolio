import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GardenNode } from '../types';
import { GARDEN_NODES } from '../data';
import { playClick, playXPChime } from '../utils/sound';

interface MindMapProps {
  onGrantReward: (gold: number, xp: number, text: string) => void;
  clickedNodesCount: string[];
  onSetClickedNode: (nodeId: string) => void;
}

const getNodeColorClass = (group: GardenNode['group'], active: boolean) => {
  switch (group) {
    case 'engineering': return { hex: '#22c55e', border: 'border-emerald-500/70 hover:border-emerald-400', text: 'text-emerald-300', particleHex: '#4ade80' };
    case 'ai': return { hex: '#3b82f6', border: 'border-blue-500/70 hover:border-blue-400', text: 'text-blue-300', particleHex: '#60a5fa' };
    case 'life': return { hex: '#ec4899', border: 'border-pink-500/70 hover:border-pink-400', text: 'text-pink-300', particleHex: '#f472b6' };
    case 'productivity': return { hex: '#eab308', border: 'border-yellow-500/70 hover:border-yellow-400', text: 'text-yellow-300', particleHex: '#facc15' };
    case 'creative': return { hex: '#14b8a6', border: 'border-teal-500/70 hover:border-teal-400', text: 'text-teal-300', particleHex: '#2dd4bf' };
    default: return { hex: '#4d4635', border: 'border-outline-variant', text: 'text-on-surface', particleHex: '#ffffff' };
  }
};

const getNodeColor = (group: GardenNode['group']) => {
  switch (group) {
    case 'root': return 'bg-primary border-white fill-primary';
    case 'engineering': return 'bg-emerald-500 border-emerald-400 fill-emerald-500';
    case 'ai': return 'bg-blue-500 border-blue-400 fill-blue-500';
    case 'life': return 'bg-pink-500 border-pink-400 fill-pink-400';
    case 'productivity': return 'bg-yellow-500 border-yellow-300 fill-yellow-400';
    case 'creative': return 'bg-teal-500 border-teal-400 fill-teal-400';
    default: return 'bg-outline';
  }
};

const getNodeBorderClass = (group: GardenNode['group'], active: boolean) => {
  if (active) return 'border-primary bg-surface-container-high text-primary';
  switch (group) {
    case 'root': return 'border-white bg-[#1c1c19] text-on-surface';
    case 'engineering': return 'border-emerald-500/70 hover:border-emerald-400 bg-[#061c0d]/80 text-emerald-300';
    case 'ai': return 'border-blue-500/70 hover:border-blue-400 bg-[#071329]/80 text-blue-300';
    case 'life': return 'border-pink-500/70 hover:border-pink-400 bg-[#240614]/80 text-pink-300';
    case 'productivity': return 'border-yellow-500/70 hover:border-yellow-400 bg-[#211a03]/80 text-yellow-300';
    case 'creative': return 'border-teal-500/70 hover:border-teal-400 bg-[#03211b]/80 text-teal-300';
    default: return 'border-outline-variant bg-background text-on-surface';
  }
};

// Coordinate positioning of all nodes inside the 980x740 whimsical radial container
const getNodeCoordinates = (nodeId: string) => {
  switch (nodeId) {
    // Center
    case 'jiya': return { x: 500, y: 370 };

    // Left Branches
    case 'engineering': return { x: 350, y: 135 };
    case 'life': return { x: 350, y: 350 };
    case 'creativity': return { x: 350, y: 575 };

    // Right Branches
    case 'ai': return { x: 650, y: 175 };
    case 'productivity': return { x: 650, y: 495 };

    // Engineering leaves (at X: 140)
    case 'security': return { x: 140, y: 30 };
    case 'system-design': return { x: 140, y: 65 };
    case 'clean-code': return { x: 140, y: 100 };
    case 'backend-arch': return { x: 140, y: 135 };
    case 'apis': return { x: 140, y: 170 };
    case 'databases': return { x: 140, y: 205 };
    case 'scalability': return { x: 140, y: 240 };

    // Life leaves (at X: 140)
    case 'personal-growth': return { x: 140, y: 295 };
    case 'fitness': return { x: 140, y: 330 };
    case 'books': return { x: 140, y: 365 };
    case 'travel': return { x: 140, y: 400 };
    case 'finance': return { x: 140, y: 435 };
    case 'food': return { x: 140, y: 470 };

    // Creativity leaves (at X: 140)
    case 'photography': return { x: 140, y: 525 };
    case 'writing': return { x: 140, y: 560 };
    case 'ui-design': return { x: 140, y: 595 };
    case 'storytelling': return { x: 140, y: 630 };
    case 'side-projects': return { x: 140, y: 665 };

    // AI leaves (at X: 840)
    case 'automation': return { x: 840, y: 40 };
    case 'gemini-api': return { x: 840, y: 85 };
    case 'ai-agents': return { x: 840, y: 130 };
    case 'prompt-eng': return { x: 840, y: 175 };
    case 'nlp': return { x: 840, y: 220 };
    case 'rag': return { x: 840, y: 265 };
    case 'embeddings': return { x: 840, y: 310 };

    // Productivity leaves (at X: 840)
    case 'learning-systems': return { x: 840, y: 380 };
    case 'atomic-habits': return { x: 840, y: 425 };
    case 'deep-work': return { x: 840, y: 470 };
    case 'second-brain': return { x: 840, y: 515 };
    case 'focus-systems': return { x: 840, y: 560 };
    case 'goal-tracking': return { x: 840, y: 605 };

    default: return { x: 500, y: 370 };
  }
};

const drawBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
  const ctrlX = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${ctrlX} ${y1}, ${ctrlX} ${y2}, ${x2} ${y2}`;
};

export const MindMap: React.FC<MindMapProps> = ({ onGrantReward, clickedNodesCount, onSetClickedNode }) => {
  const [selectedNode, setSelectedNode] = useState<GardenNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleNodeClick = (node: GardenNode) => {
    playClick();
    setSelectedNode(node);

    if (!clickedNodesCount.includes(node.id) && node.id !== 'jiya') {
      onSetClickedNode(node.id);
      const updatedListLen = clickedNodesCount.length + 1;

      onGrantReward(10, 30, `Discovered Garden Node: ${node.label}! Gained +10G and 30 EXP!`);

      if (updatedListLen === 3) {
        onGrantReward(50, 100, `Completed 'Audit Systems Nodes' Quest! Gained +50G and +100 EXP!`);
        playXPChime();
      }
    }
  };

  const handleBackToMap = () => {
    playClick();
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const renderConnectionPath = (fromId: string, toId: string, group: GardenNode['group']) => {
    const from = getNodeCoordinates(fromId);
    const to = getNodeCoordinates(toId);

    const isFromActive = hoveredNode === fromId || selectedNode?.id === fromId;
    const isToActive = hoveredNode === toId || selectedNode?.id === toId;
    const isActive = isFromActive || isToActive;

    const colorClass = getNodeColorClass(group, isActive);
    const path = drawBezierPath(from.x, from.y, to.x, to.y);

    return (
      <g key={`${fromId}-${toId}`}>
        {/* Outer ambient glow path */}
        <path
          d={path}
          fill="none"
          stroke={colorClass.hex}
          strokeWidth="3.5"
          strokeOpacity={isActive ? 0.35 : 0.08}
          className="transition-all duration-300"
        />
        {/* Core connection path */}
        <path
          d={path}
          fill="none"
          stroke={colorClass.hex}
          strokeWidth="1.5"
          strokeOpacity={isActive ? 0.8 : 0.25}
          className="transition-all duration-300"
        />
        {/* Glowing firefly dot animated path */}
        <motion.circle
          r="2"
          fill={isActive ? '#ffffff' : colorClass.particleHex}
          animate={{ opacity: isActive ? 1 : 0.4 }}
        >
          <animateMotion
            dur={`${4 + Math.random() * 3}s`}
            repeatCount="indefinite"
            path={path}
          />
        </motion.circle>
      </g>
    );
  };

  const leftBranchToLeavesMap = [
    { branch: 'engineering', leaves: ['security', 'system-design', 'clean-code', 'backend-arch', 'apis', 'databases', 'scalability'] },
    { branch: 'life', leaves: ['personal-growth', 'fitness', 'books', 'travel', 'finance', 'food'] },
    { branch: 'creativity', leaves: ['photography', 'writing', 'ui-design', 'storytelling', 'side-projects'] }
  ];

  const rightBranchToLeavesMap = [
    { branch: 'ai', leaves: ['automation', 'gemini-api', 'ai-agents', 'prompt-eng', 'nlp', 'rag', 'embeddings'] },
    { branch: 'productivity', leaves: ['learning-systems', 'atomic-habits', 'deep-work', 'second-brain', 'focus-systems', 'goal-tracking'] }
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Header section matching screenshot 2 layout */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-1 select-none">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-emerald-400 text-[24px]">eco</span>
          <div>
            <h3 className="font-display font-bold text-headline-sm text-on-surface uppercase tracking-wide">DIGITAL GARDEN</h3>
            <p className="font-sans text-[11px] text-outline">Thoughts & Ideas</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-outline uppercase hidden sm:inline">{clickedNodesCount.length}/31 Nodes Audited</span>
          <button
            onClick={handleBackToMap}
            className="w-9 h-9 border border-outline-variant hover:border-primary rounded flex items-center justify-center text-outline hover:text-primary transition-colors bg-background/50"
            title="Back to Map"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      <p className="font-sans text-xs text-on-surface-variant leading-relaxed select-none">
        Unlike projects, this page shows how my mind is connected. Click on branch or leaf nodes to explore ideas, research, and interests.
      </p>

      {/* Coordinate-Free Layout Viewport Box */}
      <div className="relative bg-[#0a0a0a] rounded-lg border-2 border-outline-variant min-h-[720px] overflow-x-auto flex items-center justify-center carved-panel select-none">

        {/* Background Forest Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none select-none"
          style={{ backgroundImage: "url('/dark-forest-bg.png')" }}
        />

        {/* Dark fantasy ambient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/80 pointer-events-none select-none" />

        {/* Unified 980px wide relative mindmap container */}
        <div className="relative w-[980px] h-[700px] flex-shrink-0">

          {/* SVG Connection Paths Render Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Center-to-Branch Paths */}
            {renderConnectionPath('jiya', 'engineering', 'engineering')}
            {renderConnectionPath('jiya', 'life', 'life')}
            {renderConnectionPath('jiya', 'creativity', 'creative')}
            {renderConnectionPath('jiya', 'ai', 'ai')}
            {renderConnectionPath('jiya', 'productivity', 'productivity')}

            {/* Left Branch-to-Leaf Paths */}
            {leftBranchToLeavesMap.map(bGroup =>
              bGroup.leaves.map(leafId =>
                renderConnectionPath(bGroup.branch, leafId, GARDEN_NODES.find(n => n.id === bGroup.branch)!.group)
              )
            )}

            {/* Right Branch-to-Leaf Paths */}
            {rightBranchToLeavesMap.map(bGroup =>
              bGroup.leaves.map(leafId =>
                renderConnectionPath(bGroup.branch, leafId, GARDEN_NODES.find(n => n.id === bGroup.branch)!.group)
              )
            )}
          </svg>

          {/* Absolute Nodes Render Layer */}
          {GARDEN_NODES.map((node) => {
            const coords = getNodeCoordinates(node.id);
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode === node.id;
            const isVisited = clickedNodesCount.includes(node.id) || node.id === 'jiya';
            const isBranch = ['engineering', 'ai', 'productivity', 'creativity', 'life'].includes(node.id);
            const colorClass = getNodeColorClass(node.group, isSelected || isHovered);

            if (node.id === 'jiya') {
              // Center Avatar
              return (
                <motion.div
                  key="jiya"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute cursor-pointer select-none"
                  style={{ left: `${coords.x}px`, top: `${coords.y}px`, transform: 'translate(-50%, -50%)', zIndex: 30 }}
                  onClick={() => handleNodeClick(node)}
                >
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      className="absolute inset-0 bg-violet-500/20 rounded-full blur-2xl pointer-events-none"
                      animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />

                    <div className="w-[84px] h-[84px] md:w-[94px] md:h-[94px] rounded-full overflow-hidden border-[5px] border-violet-300 shadow-[0_0_24px_rgba(167,139,250,0.35)] bg-[#1c1c1f]">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDD7FMhUjA0kK9i-HW1opUvIWfO0k-2u--boOJ15vOlu25X9PjrZFGxjNnCn3KOjFjXFALox177-d_jE3ZXjMa8TNUy-wEVB1YsdFUbWsWGIF6XEhBkGEM3XuLKUAdQixwxmGyHl7l03_k7yFpPJTHLIgB7gm7QZLb0mvBHCUpIdZDuLYTs3wFDj7Pue6t94P2hNvBMUnZCk_Bh1D77o4IGN-usyOSnK-tHX6Yct3GD6GYSGuTxedmMmeXCzjqd5CTB7jZUZXeFJs"
                        alt="Jiya"
                        className="w-full h-full object-cover select-none"
                      />
                    </div>

                    <div className="mt-2 px-3 py-0.5 bg-black/80 text-white text-[10px] uppercase font-mono font-extrabold rounded-full border border-violet-400/50 shadow">
                      JIYA
                    </div>
                  </div>
                </motion.div>
              );
            }

            if (isBranch) {
              // Branch Cards
              return (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`absolute cursor-pointer select-none transition-all duration-300 w-[125px] h-[36px] md:h-[40px] flex items-center justify-center rounded-3xl border-2 font-display font-bold text-xs tracking-wide ${getNodeBorderClass(node.group, isSelected || isHovered)
                    }`}
                  style={{
                    left: `${coords.x}px`,
                    top: `${coords.y}px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 15,
                    boxShadow: isSelected || isHovered ? `0 0 22px 3px ${colorClass.hex}60` : `0 4px 12px rgba(0,0,0,0.4)`
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(node)}
                >
                  <span className={`tracking-wider ${isSelected || isHovered ? 'text-white' : colorClass.text}`}>
                    {node.label}
                  </span>
                </motion.div>
              );
            }

            // Leaf Node Cards
            return (
              <motion.div
                key={node.id}
                whileHover={{ scale: 1.03 }}
                className={`absolute cursor-pointer select-none transition-all duration-200 w-[115px] h-[28px] md:h-[30px] flex items-center justify-center rounded-2xl border ${isSelected || isHovered
                  ? 'border-primary bg-surface-container-high text-primary font-bold shadow-[0_0_12px_rgba(242,202,80,0.2)]'
                  : isVisited
                    ? 'border-outline/40 text-on-surface-variant bg-[#141416]/95 hover:border-outline hover:text-white shadow-md'
                    : 'border-outline-variant/40 text-outline bg-[#0f0f10]/90 hover:border-outline-variant hover:text-on-surface-variant shadow'
                  }`}
                style={{ left: `${coords.x}px`, top: `${coords.y}px`, transform: 'translate(-50%, -50%)', zIndex: 12 }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(node)}
              >
                <span className="font-sans text-[10px] text-center truncate px-2 font-medium tracking-wide">
                  {node.label}
                </span>
              </motion.div>
            );
          })}

        </div>

      </div>

      {/* Selected thought inspection overlay slide */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="p-4 rounded-lg bg-surface-container-high border-2 border-outline-variant relative carved-panel"
          >
            <div className="absolute top-2.5 right-2.5">
              <button
                onClick={() => setSelectedNode(null)}
                className="text-outline hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex gap-3 items-center">
              <span className={`w-3.5 h-3.5 rounded-full ${getNodeColor(selectedNode.group)}`} />
              <div>
                <span className="font-mono text-[9px] text-outline uppercase tracking-wider">Group: {selectedNode.group}</span>
                <h4 className="font-display font-semibold text-on-surface text-base">{selectedNode.label}</h4>
              </div>
            </div>

            <p className="font-sans text-xs text-on-surface-variant leading-relaxed mt-2.5 bg-background p-3 rounded border border-outline-variant/50">
              {selectedNode.description}
            </p>

            <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-outline border-t border-outline-variant/40 pt-2 select-none">
              <span>Coordinates: {selectedNode.group.toUpperCase()}-SECTOR</span>
              <span className="text-secondary select-all font-bold">Audited: True</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom controls and Garden Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 border-t border-outline-variant/40 pt-3">
        <button
          onClick={handleBackToMap}
          className="px-4 py-2 border border-outline-variant hover:border-primary text-outline hover:text-primary rounded-lg text-xs font-display font-semibold transition-colors flex items-center gap-1.5 bg-background/50 select-none"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Map
        </button>

        <p className="font-sans italic text-[11px] text-outline leading-relaxed max-w-lg text-center sm:text-right">
          "Not everything here is fully grown. Some ideas are seeds, some are experiments, and some may become the next project."
        </p>
      </div>
    </div>
  );
};
