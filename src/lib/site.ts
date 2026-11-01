export const site = {
  name: "Rohan Waghmare",
  role: "Software Developer",
  email: "waghmarerohan30@gmail.com",
  location: "Bay Area, home",
  timeZone: "America/Los_Angeles",
  links: {
    linkedin: "https://linkedin.com/in/rohanwaghmare",
    github: "https://github.com/ron103",
    // x: "https://x.com/…", // no account yet; restore here, then add the icon back in profile-card, say-hi and footer
    resume: "/resume",
  },
};

export const nav = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
] as const;

// Minute-of-day windows in Pacific time. Placeholder lines until Rohan writes his own.
export const statusLines: [start: number, end: number, line: string][] = [
  [0, 420, "Probably asleep. The agents are still running."],
  [420, 540, "First chai of the day. It's a slow one."],
  [540, 720, "Deep in a training run. Watching the loss go down."],
  [720, 810, "Lunch, and reading someone else's paper."],
  [810, 1020, "Shipping something at SAP."],
  [1020, 1140, "Out for a walk while an eval finishes."],
  [1140, 1320, "Building side projects. Probably breaking them."],
  [1320, 1440, "Winding down. One more PR, then sleep."],
];

export function statusFor(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timeZone,
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const minute = h * 60 + m;
  return statusLines.find(([s, e]) => minute >= s && minute < e)?.[2] ?? statusLines[0][2];
}

export function pacificTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: site.timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
