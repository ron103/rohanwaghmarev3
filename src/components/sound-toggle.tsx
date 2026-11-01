"use client";

import { Volume2, VolumeX } from "lucide-react";
import { setSound, useSoundOn } from "@/lib/sound";

/** Footer switch for UI sounds. Off by default. */
export function SoundToggle() {
  const on = useSoundOn();
  return (
    <button
      type="button"
      onClick={() => setSound(!on)}
      aria-pressed={on}
      className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:bg-white/10 hover:text-night-blue"
    >
      {on ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
      sound {on ? "on" : "off"}
    </button>
  );
}
