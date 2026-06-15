import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WeatherOverlayProps {
  weatherId: string;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ weatherId }) => {
  // Generate stable random offsets relative to the active weather pattern to keep layout pristine
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, idx) => ({
      id: idx,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 3,
      duration: 1.2 + Math.random() * 2.5,
      opacity: 0.2 + Math.random() * 0.7,
      scale: 0.4 + Math.random() * 1.3,
      drift: -60 + Math.random() * 120,
    }));
  }, [weatherId]); // Re-calculate only when weatherId changes to avoid CPU thrashing

  const renderWeatherContent = () => {
    switch (weatherId) {
      case 'clear':
        return (
          <motion.div
            key="clear-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none"
          >
            {/* Elegant warm golden rays overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-yellow-500/10 mix-blend-screen opacity-70 animate-pulse duration-[8000ms]" />
            
            {/* Ambient solar light dust grains floating upwards */}
            {particles.slice(0, 20).map((p) => (
              <motion.div
                key={`clear-grain-${p.id}`}
                className="absolute rounded-full bg-amber-400"
                style={{
                  left: p.left,
                  bottom: '-12px',
                  width: `${p.scale * 4.5}px`,
                  height: `${p.scale * 4.5}px`,
                  opacity: p.opacity * 0.45,
                  filter: 'blur(0.8px)',
                  boxShadow: '0 0 8px rgba(251, 191, 36, 0.4)',
                }}
                animate={{
                  y: '-480px',
                  x: p.drift * 0.4,
                  opacity: [0, p.opacity * 0.6, 0],
                }}
                transition={{
                  duration: p.duration * 3 + 5,
                  repeat: Infinity,
                  delay: p.delay * 2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        );

      case 'rain':
        return (
          <motion.div
            key="rain-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none bg-indigo-950/15"
          >
            {/* Thunderstorm ambient flicker element */}
            <motion.div 
              animate={{ opacity: [0.1, 0.25, 0.1, 0.4, 0.1, 0.1, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-indigo-500/5 mix-blend-color-dodge" 
            />
            
            {/* Dynamic vertical rain streaks with slight diagonal wind speed */}
            {particles.map((p) => (
              <motion.div
                key={`rain-streak-${p.id}`}
                className="absolute bg-gradient-to-b from-transparent via-indigo-400 to-sky-300 rounded"
                style={{
                  left: p.left,
                  top: '-80px',
                  width: '1.2px',
                  height: `${30 + p.scale * 24}px`,
                  opacity: p.opacity * 0.85,
                }}
                animate={{
                  y: '560px',
                  x: '-35px', // Uniform wind velocity to look natural
                }}
                transition={{
                  duration: p.duration * 0.35 + 0.4, // Falling velocity (fast)
                  repeat: Infinity,
                  delay: p.delay * 0.4,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>
        );

      case 'snow':
        return (
          <motion.div
            key="snow-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none bg-sky-950/[0.05]"
          >
            {/* Frozen landscape glint */}
            <div className="absolute inset-0 bg-white/[0.015] pointer-events-none" />
            
            {/* Fluffy snowflakes with dynamic swaying trajectories */}
            {particles.map((p) => {
              // Different visual types of snowflakes
              const size = 3.5 + p.scale * 5.5;
              return (
                <motion.div
                  key={`snowflake-${p.id}`}
                  className="absolute rounded-full bg-white font-bold flex items-center justify-center pointer-events-none"
                  style={{
                    left: p.left,
                    top: '-20px',
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity: p.opacity * 0.9,
                    boxShadow: '0 0 8px rgba(255, 255, 255, 0.45)',
                  }}
                  animate={{
                    y: '530px',
                    x: [0, p.drift, p.drift / 2, p.drift * 1.2, 0], // Complex natural horizontal swaying
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: p.duration * 2.2 + 3.5, // Gentle slow fall
                    repeat: Infinity,
                    delay: p.delay,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </motion.div>
        );

      case 'fog':
        return (
          <motion.div
            key="fog-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none"
          >
            {/* Bottom-heavy thick mystical ground fog gradient */}
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-purple-950/25 via-purple-900/10 to-transparent mix-blend-color-burn" />
            
            {/* Dynamic horizontal rolling mist clouds */}
            <div className="absolute inset-0 flex items-end">
              {Array.from({ length: 7 }).map((_, idx) => (
                <motion.div
                  key={`fog-cloud-pane-${idx}`}
                  className="absolute rounded-full bg-purple-300/[0.08] backdrop-blur-[4px]"
                  style={{
                    left: `${-25 + idx * 22}%`,
                    bottom: `${-20 + Math.random() * 110}px`,
                    width: `${280 + Math.random() * 220}px`,
                    height: `${90 + Math.random() * 90}px`,
                    filter: 'blur(35px)',
                  }}
                  animate={{
                    x: ['-10%', '20%', '-10%'],
                    y: ['-5px', '12px', '-5px'],
                  }}
                  transition={{
                    duration: 14 + idx * 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Glowing arcane purple spores */}
            {particles.slice(0, 18).map((p) => (
              <motion.div
                key={`fog-spore-${p.id}`}
                className="absolute rounded-full bg-purple-400"
                style={{
                  left: p.left,
                  top: `${110 + p.scale * 160}px`,
                  width: `${2.5 + p.scale * 2.5}px`,
                  height: `${2.5 + p.scale * 2.5}px`,
                  opacity: p.opacity * 0.7,
                  boxShadow: '0 0 10px rgba(168, 85, 247, 0.65)',
                }}
                animate={{
                  x: [0, p.drift * 0.8, 0],
                  y: [0, -40, 0],
                  opacity: [0, p.opacity * 0.7, 0],
                }}
                transition={{
                  duration: p.duration * 2.5 + 4,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderWeatherContent()}
    </AnimatePresence>
  );
};
