import React, { useState } from 'react';
import { DAY_SEGMENTS } from '../data';
import { playClick } from '../utils/sound';

interface DayInTheLifeProps {
  onClose?: () => void;
  soundEnabled?: boolean;
}

const iconMap: Record<string, string> = {
  morning: '☀️',
  work: '💻',
  evening: '🌆',
  night: '🌙',
};

const segmentSubtitles: Record<string, string> = {
  morning: 'Focus & Plan',
  work: 'Build & Create',
  evening: 'Unwind & Learn',
  night: 'Reflect & Journal',
};

const galleryImages = [
  { url: '/GATE_study.png', alt: 'GATE & Study' },
  { url: '/food_hobby.png', alt: 'Food & Hobby' },
  { url: '/Developing.png', alt: 'Projects & Coding' },
  { url: '/swimming_hobby.png', alt: 'Swimming & Reflection' },
  { url: '/reading_hobby.png', alt: 'Reading & AI' },
  { url: '/chess_hobby.png', alt: 'Chess & Strategy' },
  { url: '/dancing_hobby.png', alt: 'Dancing & Creative Time' },
];

export default function DayInTheLife({ onClose, soundEnabled = true }: DayInTheLifeProps) {
  const [activeSegmentId, setActiveSegmentId] = useState<string>('morning');

  const triggerSound = () => {
    if (soundEnabled) {
      playClick();
    }
  };

  const activeSegment = DAY_SEGMENTS.find(s => s.id === activeSegmentId) || DAY_SEGMENTS[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-red-500 animate-pulse select-none">❤️</span>
          <div>
            <h2 className="font-display font-bold text-2xl text-on-surface tracking-wide uppercase">DAY IN THE LIFE</h2>
            <p className="text-xs text-on-surface-variant font-sans">A peek into my world</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded border border-outline-variant hover:border-primary text-outline hover:text-white transition-colors cursor-pointer flex items-center justify-center w-8 h-8"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Grid split container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* Left Sidebar (Day segment select cards) */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <div className="flex flex-col gap-2.5">
            {DAY_SEGMENTS.map((seg) => {
              const isSelected = activeSegmentId === seg.id;
              return (
                <div
                  key={seg.id}
                  onClick={() => {
                    triggerSound();
                    setActiveSegmentId(seg.id);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-3 select-none ${isSelected
                    ? 'border-primary bg-primary/5 shadow-[0_0_12px_rgba(242,202,80,0.12)]'
                    : 'border-outline-variant bg-surface-container-low hover:bg-surface-container'
                    }`}
                >
                  <div className="text-2xl group-hover:scale-110 transition-transform">
                    {iconMap[seg.id] ?? '⏰'}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className={`font-display font-bold text-sm leading-tight ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                      {seg.title}
                    </h4>
                    <p className="text-[9px] text-outline uppercase font-mono tracking-wider mt-0.5">
                      {segmentSubtitles[seg.id] ?? seg.id}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Back button */}
          {onClose && (
            <button
              onClick={onClose}
              className="mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-outline-variant rounded-lg text-xs font-mono text-outline hover:text-white hover:border-outline transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              Back to Map
            </button>
          )}
        </div>

        {/* Right Main Detailed View */}
        <div className="md:col-span-8 flex flex-col gap-5">

          {/* Top Card (Horizontal Layout) */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 md:p-6 flex flex-col lg:flex-row gap-5 items-stretch justify-between">
            <div className="flex-grow flex flex-col justify-center min-w-0 pr-0 lg:pr-4">
              <span className="text-primary font-mono text-[10px] uppercase tracking-wider font-bold">
                Daily Block Overview
              </span>
              <h3 className="font-display font-bold text-xl text-on-surface leading-tight mt-1 mb-3">
                {activeSegment.title}
              </h3>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                {activeSegment.desc}
              </p>
            </div>

            <div className="w-full lg:w-72 h-36 lg:h-auto rounded-lg overflow-hidden border border-outline-variant/60 flex-shrink-0 relative">
              <img
                src={activeSegment.imageUrl}
                alt={activeSegment.imageAlt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Bottom Cards Row (Timeline logs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeSegment.logs.map((log, index) => (
              <div
                key={index}
                className="bg-surface-container border border-outline-variant/40 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between min-h-[135px] transition-all duration-200 hover:border-outline-variant/80 hover:bg-surface-container-high/40"
              >
                {/* Time & Title info */}
                <div className="z-10 relative">
                  <span className="font-mono text-[10px] text-primary font-bold bg-[#3c2f00] border border-primary/20 px-2 py-0.5 rounded">
                    {log.time}
                  </span>
                  <h4 className="font-sans font-bold text-sm text-on-surface mt-2.5">
                    {log.title}
                  </h4>
                  <p className="font-sans text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                    {log.desc}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex justify-between items-center mt-4 z-10 relative border-t border-outline-variant/30 pt-2">
                  <span className={`font-mono text-[9px] uppercase tracking-wider font-semibold ${log.statusText === 'Active' ? 'text-primary animate-pulse' : 'text-outline'
                    }`}>
                    {log.statusText}
                  </span>
                </div>

                {/* Backing semi-transparent material symbol */}
                <span className="material-symbols-outlined text-[64px] absolute right-2 bottom-1 text-primary/5 select-none pointer-events-none z-0">
                  {log.icon}
                </span>
              </div>
            ))}
          </div>

          {/* Snapshots Gallery */}
          <div className="mt-2">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-outline mb-2.5">
              random snapshot from my life
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border border-outline-variant hover:border-primary hover:scale-105 transition-all duration-200 cursor-pointer shadow-sm"
                  onClick={() => {
                    triggerSound();
                    if (i < 4) {
                      setActiveSegmentId(DAY_SEGMENTS[i].id);
                    }
                  }}
                  title={img.alt}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
