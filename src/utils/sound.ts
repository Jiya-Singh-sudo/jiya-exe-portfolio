// Lazy initialization of Web Audio Context to bypass browser auto-play blocks
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported on this browser', e);
    }
  }
  // Resume if suspended (browsers suspend it by default)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a satisfying retro wood click sound
 */
export function playClick(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(450, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.08);
}

/**
 * Plays a classic RPG double-chime coin pick-up sound
 */
export function playCoin(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // High-pitched double square wave pulses
  const playPulse = (freq: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0.06, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  playPulse(880, now, 0.08); // Note A5
  playPulse(1318.51, now + 0.06, 0.16); // Note E6 (gives that gorgeous arcade coin effect)
}

/**
 * Plays a pleasant ascending note sweep for XP gain
 */
export function playXPChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.04);

    gain.gain.setValueAtTime(0.08, now + idx * 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.15);

    osc.start(now + idx * 0.04);
    osc.stop(now + idx * 0.04 + 0.15);
  });
}

/**
 * Plays an upbeat chord progression indicating quest and objective completion
 */
export function playQuestSuccess(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // C major triad leading to high, bright note
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const oscType = idx === notes.length - 1 ? 'triangle' : 'sine';
    osc.type = oscType;
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0.1, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.25);
  });
}

/**
 * Plays a glorious level-up arpeggio with high energy
 */
export function playLevelUpChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Dynamic scale: C, D, E, G, A, high C
  const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25, 783.99, 1046.50];

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.06);

    gain.gain.setValueAtTime(0.12, now + idx * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

    osc.start(now + idx * 0.06);
    osc.stop(now + idx * 0.06 + 0.3);
  });
}

// Active weather sound state
let activeWeatherType: string | null = null;
let activeWeatherNodes: any[] = [];
let weatherGainNode: GainNode | null = null;
let savedSoundEnabled = true;

/**
 * Creates and starts a procedural weather synthesizer loop
 */
export function startWeatherAmbience(weatherType: string, soundEnabled: boolean): void {
  savedSoundEnabled = soundEnabled;
  if (activeWeatherType === weatherType && activeWeatherNodes.length > 0) {
    // Just maintain structure or update volume setting
    updateWeatherSoundToggle(soundEnabled);
    return;
  }

  // Stop any current running ambience
  stopWeatherAmbience();
  activeWeatherType = weatherType;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Initialize master gain for weather sounds (soft defaults)
  weatherGainNode = ctx.createGain();
  weatherGainNode.gain.setValueAtTime(soundEnabled ? 0.04 : 0, now);
  weatherGainNode.connect(ctx.destination);

  try {
    if (weatherType === 'rain') {
      // Create white noise buffer for rain
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      // Filter to shape raw white noise into deep ambient rain
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, now);

      // Low frequency oscillator to simulate rain gustiness
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.25, now); // 0.25 Hz

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(150, now); // Modulate cutoff frequency by 150 Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      
      noiseNode.connect(filter);
      filter.connect(weatherGainNode);

      lfo.start(now);
      noiseNode.start(now);

      activeWeatherNodes.push(noiseNode);
      activeWeatherNodes.push(lfo);

      // Rhythmic raindrops crackle (electric patter sound)
      const crackleOsc = ctx.createOscillator();
      crackleOsc.type = 'triangle';
      crackleOsc.frequency.setValueAtTime(8, now); // 8 Hz low clicking speed

      const crackleGain = ctx.createGain();
      crackleGain.gain.setValueAtTime(0.12, now);

      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(1000, now);

      crackleOsc.connect(highpass);
      highpass.connect(crackleGain);
      crackleGain.connect(weatherGainNode);

      crackleOsc.start(now);
      activeWeatherNodes.push(crackleOsc);

    } else if (weatherType === 'snow') {
      // Wind sound using white noise + highly resonant bandpass filter modulated by LFO
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(8, now); // High Q for whistle resonance
      filter.frequency.setValueAtTime(400, now);

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.08, now); // Slow sweeping wind speed

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(220, now); // Sweep filter between 180Hz and 620Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      noiseNode.connect(filter);
      filter.connect(weatherGainNode);

      lfo.start(now);
      noiseNode.start(now);

      activeWeatherNodes.push(noiseNode);
      activeWeatherNodes.push(lfo);

    } else if (weatherType === 'fog') {
      // Deep, mystical low frequency breathing drone
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(65.41, now); // C2

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(98.00, now); // G2

      const osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(130.81, now); // C3

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(140, now);

      // LFO to slowly modulate volume of high voice to feel like undulating fog
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.05, now); // Very slow breath

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.03, now);

      const osc3Gain = ctx.createGain();
      osc3Gain.gain.setValueAtTime(0.05, now);

      lfo.connect(lfoGain);
      lfoGain.connect(osc3Gain.gain);

      osc1.connect(lowpass);
      osc2.connect(lowpass);
      osc3.connect(osc3Gain);
      osc3Gain.connect(lowpass);

      lowpass.connect(weatherGainNode);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      lfo.start(now);

      activeWeatherNodes.push(osc1);
      activeWeatherNodes.push(osc2);
      activeWeatherNodes.push(osc3);
      activeWeatherNodes.push(lfo);

    } else if (weatherType === 'clear') {
      // Light positive warm hum (sunny summery notes)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(130.81, now); // C3

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(196.00, now); // G3

      const osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(246.94, now); // B3

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      const filterLfo = ctx.createOscillator();
      filterLfo.type = 'sine';
      filterLfo.frequency.setValueAtTime(0.12, now);

      const filterLfoGain = ctx.createGain();
      filterLfoGain.gain.setValueAtTime(60, now);

      filterLfo.connect(filterLfoGain);
      filterLfoGain.connect(filter.frequency);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);

      filter.connect(weatherGainNode);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      filterLfo.start(now);

      activeWeatherNodes.push(osc1);
      activeWeatherNodes.push(osc2);
      activeWeatherNodes.push(osc3);
      activeWeatherNodes.push(filterLfo);
    }
  } catch (err) {
    console.warn('Failed to start procedural weather sound synthesis:', err);
  }
}

/**
 * Stop weather ambient loops with smooth gain fade-out
 */
export function stopWeatherAmbience(): void {
  const ctx = getAudioContext();
  const now = ctx?.currentTime || 0;

  if (weatherGainNode && ctx) {
    try {
      weatherGainNode.gain.cancelScheduledValues(now);
      weatherGainNode.gain.setValueAtTime(weatherGainNode.gain.value, now);
      weatherGainNode.gain.linearRampToValueAtTime(0, now + 0.15);
    } catch (e) {}
  }

  // Delay actual stops slightly to match smooth linear fade
  const nodesToClean = [...activeWeatherNodes];
  const activeGainToClean = weatherGainNode;
  
  activeWeatherNodes = [];
  weatherGainNode = null;

  setTimeout(() => {
    nodesToClean.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    try {
      activeGainToClean?.disconnect();
    } catch (e) {}
  }, 180);
}

/**
 * Update weather volume based on absolute global sound enabled checkbox
 */
export function updateWeatherSoundToggle(soundEnabled: boolean): void {
  savedSoundEnabled = soundEnabled;
  const ctx = getAudioContext();
  if (!ctx || !weatherGainNode) {
    // If enabled but loop is fully blank, trigger fresh startup
    if (soundEnabled && activeWeatherType) {
      startWeatherAmbience(activeWeatherType, true);
    }
    return;
  }

  const now = ctx.currentTime;
  try {
    weatherGainNode.gain.cancelScheduledValues(now);
    weatherGainNode.gain.setValueAtTime(weatherGainNode.gain.value, now);
    weatherGainNode.gain.linearRampToValueAtTime(soundEnabled ? 0.04 : 0, now + 0.25);
  } catch (err) {}
}
