// Sonidos sintetizados con Web Audio: sin ficheros, volumen bajo, apto para ninos.
let ctx = null;
let muted = false;

function ensureContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!ctx) ctx = new AudioContextClass();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function setMuted(value) {
  muted = value;
}

function tone({ freq = 440, slideTo = 0, duration = 0.14, type = "triangle", volume = 0.16, when = 0 }) {
  const audio = ensureContext();
  if (!audio || muted) return;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const t0 = audio.currentTime + when;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, t0);
  if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(t0);
  oscillator.stop(t0 + duration + 0.05);
}

export const sounds = {
  place: () => tone({ freq: 540, duration: 0.08, volume: 0.14 }),
  remove: () => tone({ freq: 300, slideTo: 220, duration: 0.09, volume: 0.12 }),
  crash: () => tone({ freq: 220, slideTo: 80, duration: 0.5, type: "sawtooth", volume: 0.18 }),
  incomplete: () => tone({ freq: 330, slideTo: 262, duration: 0.3, type: "sine", volume: 0.14 }),
  success: () => {
    tone({ freq: 523, duration: 0.13, volume: 0.16 });
    tone({ freq: 659, duration: 0.13, when: 0.12, volume: 0.16 });
    tone({ freq: 784, duration: 0.13, when: 0.24, volume: 0.16 });
    tone({ freq: 1047, duration: 0.3, when: 0.36, volume: 0.18 });
  },
};

const commandTones = {
  start: () => {
    tone({ freq: 392, duration: 0.1, type: "square", volume: 0.09 });
    tone({ freq: 587, duration: 0.12, when: 0.1, type: "square", volume: 0.09 });
  },
  go: () => tone({ freq: 660, duration: 0.09 }),
  stop: () => tone({ freq: 494, slideTo: 330, duration: 0.2 }),
  left: () => tone({ freq: 620, slideTo: 440, duration: 0.14, type: "sine" }),
  right: () => tone({ freq: 440, slideTo: 620, duration: 0.14, type: "sine" }),
  wait: () => tone({ freq: 294, duration: 0.24, type: "sine", volume: 0.1 }),
  hop: () => tone({ freq: 330, slideTo: 880, duration: 0.22, type: "sine" }),
  again2: () => tone({ freq: 587, duration: 0.09, type: "square", volume: 0.09 }),
  again3: () => tone({ freq: 587, duration: 0.09, type: "square", volume: 0.09 }),
  ifSignalGo: () => tone({ freq: 700, slideTo: 880, duration: 0.12, type: "sine", volume: 0.12 }),
  paint: () => tone({ freq: 740, slideTo: 988, duration: 0.13 }),
  moo: () => tone({ freq: 150, slideTo: 105, duration: 0.42, type: "sawtooth", volume: 0.14 }),
  cluck: () => {
    tone({ freq: 950, duration: 0.05, type: "square", volume: 0.09 });
    tone({ freq: 1150, duration: 0.05, when: 0.08, type: "square", volume: 0.09 });
  },
  bridge: () => tone({ freq: 520, slideTo: 660, duration: 0.16 }),
};

export function playCommand(commandId) {
  const play = commandTones[commandId] || commandTones.go;
  play();
}

// Voz que canta cada movimiento (SpeechSynthesis), independiente de los tonos.
let voiceMuted = false;

export function setVoiceMuted(value) {
  voiceMuted = value;
  if (value && typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function say(text) {
  if (voiceMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 1.04;
  utterance.pitch = 1.12;
  window.speechSynthesis.speak(utterance);
}
