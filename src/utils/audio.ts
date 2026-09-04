/**
 * Synthesized Ambient Audio for Dunhuang Stargazing Experience
 * Uses Web Audio API to produce subtle wind, desert silence, and bronze chime
 */

let audioCtx: AudioContext | null = null;
let isPlaying = false;
let masterGain: GainNode | null = null;
let windNoiseNode: AudioNode | null = null;

export function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function playDunhuangChime(freq = 432) {
  try {
    initAudioContext();
    if (!audioCtx || !masterGain) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Pentatonic Dunhuang frequencies
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    // Subtle detune for ancient bell resonance
    osc.detune.setValueAtTime(2, audioCtx.currentTime);

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 3.5);
  } catch (e) {
    console.warn('Audio playback not supported or user has not interacted yet', e);
  }
}

export function toggleDunhuangAmbient(): boolean {
  try {
    initAudioContext();
    if (!audioCtx || !masterGain) return false;

    if (isPlaying) {
      if (windNoiseNode) {
        (windNoiseNode as any).disconnect?.();
        windNoiseNode = null;
      }
      isPlaying = false;
      return false;
    }

    // Generate gentle pink noise for desert breeze
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.05;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to warm desert wind sound
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, audioCtx.currentTime);

    const windGain = audioCtx.createGain();
    windGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(windGain);
    windGain.connect(masterGain);

    whiteNoise.start();
    windNoiseNode = whiteNoise;
    isPlaying = true;
    return true;
  } catch (e) {
    console.warn('Ambient sound toggle error', e);
    return false;
  }
}
