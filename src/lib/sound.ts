"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny UI sounds synthesized with Web Audio (no files). Off by default; the
 * choice is remembered per browser. Calls are no-ops when sound is off or the
 * browser blocks audio.
 */

type Kind = "tick" | "pop" | "open" | "success";

const KEY = "rw-sound";
const listeners = new Set<() => void>();
let enabled = false;
let loaded = false;
let ctx: AudioContext | null = null;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    enabled = localStorage.getItem(KEY) === "on";
  } catch {}
}

export function isSoundOn() {
  load();
  return enabled;
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  listeners.forEach((l) => l());
  if (on) play("success");
}

export function useSoundOn() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    isSoundOn,
    () => false,
  );
}

// Frequencies and envelopes for each sound, kept soft and short.
const voices: Record<Kind, { f: number[]; dur: number; type: OscillatorType; gain: number }> = {
  tick: { f: [1800], dur: 0.035, type: "triangle", gain: 0.05 },
  pop: { f: [520, 780], dur: 0.09, type: "sine", gain: 0.08 },
  open: { f: [440, 660], dur: 0.12, type: "sine", gain: 0.06 },
  success: { f: [660, 990], dur: 0.16, type: "sine", gain: 0.07 },
};

export function play(kind: Kind) {
  if (!isSoundOn() || typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && kind !== "success") return;
  try {
    ctx ??= new AudioContext();
    const v = voices[kind];
    const now = ctx.currentTime;
    v.f.forEach((freq, i) => {
      const t = now + i * (v.dur * 0.6);
      const osc = ctx!.createOscillator();
      const g = ctx!.createGain();
      osc.type = v.type;
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(v.gain, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + v.dur);
      osc.connect(g).connect(ctx!.destination);
      osc.start(t);
      osc.stop(t + v.dur + 0.02);
    });
  } catch {}
}
