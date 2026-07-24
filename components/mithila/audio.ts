"use client";

// Tiny crossfading audio manager (zero deps). One music slot + one ambient slot.
type Slot = { el: HTMLAudioElement | null; target: number };

const music: Slot = { el: null, target: 0 };
const ambient: Slot = { el: null, target: 0 };
let muted = false;
/** Duck is applied only in tick() — music.target always stays the real walking volume. */
let musicDucked = false;
const MUSIC_DUCK = 0.14;
let raf = 0;

function tick() {
  raf = 0;
  let busy = false;
  for (const s of [music, ambient]) {
    if (!s.el) continue;
    const base = muted ? 0 : s.target;
    // Only the music slot ducks under minigames; ambient uses its own target.
    const goal = s === music && musicDucked && !muted ? base * MUSIC_DUCK : base;
    const v = s.el.volume;
    // Snap back to full volume faster when unducking so walking doesn't stay quiet
    const rate = s === music && !musicDucked && v < goal ? 0.18 : 0.06;
    const nv = v + (goal - v) * rate;
    s.el.volume = Math.max(0, Math.min(1, Math.abs(nv - goal) < 0.005 ? goal : nv));
    if (s.el.volume !== goal) busy = true;
    if (s.el.volume === 0 && s.target === 0 && s !== ambient) {
      s.el.pause();
      s.el.src = "";
      s.el = null;
    }
  }
  if (busy && !raf) raf = requestAnimationFrame(tick);
}

function pump() {
  if (!raf) raf = requestAnimationFrame(tick);
}

export const audio = {
  playMusic(src: string, { loop = true, volume = 0.9 } = {}) {
    if (music.el && music.el.src.endsWith(src)) {
      music.target = volume;
      pump();
      return;
    }
    if (music.el) {
      fadeOutAndKill(music.el);
    }
    const el = new Audio(src);
    el.loop = loop;
    el.volume = 0;
    el.play().catch(() => {});
    music.el = el;
    music.target = volume;
    this.duckAmbient(true);
    pump();
  },
  stopMusic() {
    musicDucked = false;
    music.target = 0;
    this.duckAmbient(false);
    pump();
  },
  /** Soften BGM under minigames / side-games / sequences only. Walking stays at full target. */
  duckMusic(duck: boolean) {
    if (musicDucked === duck) {
      if (duck) pump();
      return;
    }
    musicDucked = duck;
    pump();
  },
  startAmbient(src: string) {
    if (ambient.el) return;
    const el = new Audio(src);
    el.loop = true;
    el.volume = 0;
    el.play().catch(() => {});
    ambient.el = el;
    ambient.target = 0.35;
    pump();
  },
  duckAmbient(duck: boolean) {
    if (ambient.el) {
      ambient.target = duck ? 0.06 : 0.35;
      pump();
    }
  },
  setMuted(m: boolean) {
    muted = m;
    pump();
  },
  stopAll() {
    musicDucked = false;
    music.target = 0;
    if (ambient.el) ambient.target = 0;
    pump();
  },
};

// ---------- tiny synth SFX (no audio files needed) ----------
let actx: AudioContext | null = null;
function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!actx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    actx = new AC();
  }
  if (actx.state === "suspended") actx.resume().catch(() => {});
  return actx;
}

function blip(freq: number, dur: number, type: OscillatorType, vol: number, delay = 0) {
  const c = ctx();
  if (!c || muted) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime + delay);
  g.gain.linearRampToValueAtTime(vol, c.currentTime + delay + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + delay + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + delay);
  o.stop(c.currentTime + delay + dur + 0.05);
}

export const sfx = {
  tap: () => blip(660, 0.08, "triangle", 0.12),
  wiggle: () => blip(420, 0.1, "sine", 0.14),
  spark: () => {
    blip(880, 0.12, "sine", 0.16);
    blip(1320, 0.18, "sine", 0.12, 0.07);
  },
  gateRattle: () => {
    blip(120, 0.1, "square", 0.1);
    blip(95, 0.12, "square", 0.09, 0.09);
  },
  gateOpen: () => {
    blip(392, 0.25, "triangle", 0.16);
    blip(523, 0.25, "triangle", 0.16, 0.14);
    blip(659, 0.4, "triangle", 0.18, 0.28);
  },
  solve: () => {
    blip(523, 0.15, "sine", 0.18);
    blip(659, 0.15, "sine", 0.18, 0.1);
    blip(784, 0.3, "sine", 0.2, 0.2);
  },
  giggle: () => {
    blip(900, 0.07, "sine", 0.14);
    blip(1100, 0.07, "sine", 0.13, 0.08);
    blip(950, 0.09, "sine", 0.12, 0.16);
  },
  transform: () => {
    blip(440, 0.5, "sine", 0.12);
    blip(554, 0.5, "sine", 0.12, 0.15);
    blip(659, 0.6, "sine", 0.14, 0.3);
    blip(880, 0.9, "sine", 0.14, 0.5);
  },
};

function fadeOutAndKill(el: HTMLAudioElement) {
  const iv = setInterval(() => {
    el.volume = Math.max(0, el.volume - 0.08);
    if (el.volume <= 0) {
      el.pause();
      el.src = "";
      clearInterval(iv);
    }
  }, 50);
}
