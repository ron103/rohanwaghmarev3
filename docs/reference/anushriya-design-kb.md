# Design reference: anushriya.com

Taken from the live site on 2026-10-31 (desktop at 1024px, mobile at 375px). Values come from computed styles and the shipped CSS bundle, not from eyeballing screenshots.
**Use this as a reference for design language only.** The new site uses Rohan's own content and identity, and copies none of her copy, illustrations, avatar, or case-study visuals.

---

## 1. Stack

| Layer | What it uses |
|---|---|
| Build | Vite single-page app (`/assets/index-*.js`, `/assets/index-*.css`, `<div id="root">`) |
| UI | React with `react-router-dom` (client-side routes) |
| Styling | **Tailwind CSS v4.2.1** with `@theme` tokens, plus a small set of hand-written CSS classes |
| Motion | `motion` (Framer Motion), CSS keyframes, and `prefers-reduced-motion` fallbacks everywhere |
| Realtime | **Ably** for live presence: "You and N others are here right now" |
| Backend | `/api/notes`, for anonymous notes on the "Secret Feelings" canvas |
| Analytics | Google Analytics (gtag) |
| Fonts | Google Fonts: **Fraunces** (variable: opsz, wght, SOFT, WONK) and **Google Sans Flex** (variable: opsz, wght) |

Routes: `/`, `/about`, `/work` (redirects to `/work/databricks`), `/work/{databricks,hadrius,zeda,unicef,airbus}`, `/articles` (plus `/articles/{ai,process,questions}`), `/playground` (redirects to `/products`), `/resume`, `/site-info`.

---

## 2. Typography

### Families
- **Display / serif:** `Fraunces, Georgia, serif`, with `font-variation-settings: "SOFT" 100, "WONK" 0`. SOFT 100 rounds the terminals; WONK 0 turns off the quirky glyphs. It loads with `display=block`, so the page waits for it instead of flashing a fallback.
- **Text / sans:** `"Google Sans Flex", -apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`, loaded with `display=swap`.
- **Mono** (only in the playground 3D cards): `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace`.

Google Fonts URLs:
```
https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..700,100,0&display=block
https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@9..144,100..1000&display=swap
```

### Type scale (computed)

All serif headings use letter-spacing **−0.015em** (for example, −0.84px at 56px).

| Role | Font | Size | Weight | Line-height | Color |
|---|---|---|---|---|---|
| Home H1 ("Hi, I'm …") | Fraunces | 56px (38px on mobile) | 600 | 1.04 (58.24px) | `#2e2e33` |
| Home H1 tagline (rotating line) | Fraunces | 56px | **300** | 1.04 | `#2e2e33` at **40% opacity** |
| Case study H1 | Fraunces | 72px | 600 | 1.04 | `#2e2e33` |
| Case study H2 | Fraunces | 40px | 300 | — | `#2e2e33` |
| Case study H3 | Fraunces | 24px | 300 | — | `#2e2e33` |
| About page H1 | Fraunces | ~34px | 600 | — | `#2e2e33` |
| About section titles ("experience", lowercase) | Fraunces | ~22px | 300 | — | zinc-500 |
| Featured work title | Fraunces | 34px | 300 | 1.05 | `#2e2e33` |
| Article card quote | Fraunces | 30px | 300 | 1.22 | `#2e2e33` |
| Playground card title | Fraunces | 28px | 300 | 1.5 | `#2e2e33` |
| Big stat number ("86%") | Fraunces | 26px (40px+ on case pages) | 300 | 1.0 | `#3a3a40` |
| Footer email (giant) | Fraunces | ~64px (fluid) | 600 | 1.05 | `#f1f0ec` on dark |
| "Say hi" dialog title | Fraunces | 24px | 600 | 1.5 | `#2e2e33` |
| Nav item | Sans | 15px | 400 | 1.5 | zinc-500 |
| Section label ("Work", "Playground (6)") | Sans | 15px | 500 | 1.5 | zinc-500 |
| Body / meta label ("Currently") | Sans | 16px | **600** | 1.5 | `#3a3a40` |
| Body value | Sans | 16px | 400 | 1.5 | zinc-500 |
| Intro paragraph | Sans | 15.5px | 400 | 1.55 | zinc-500 |
| Article meta ("Designing for AI · Oct 2025") | Sans | 15px | 500 | 1.5 | zinc-400; the dot is zinc-300 |
| Stat caption / footer © | Sans | 13px | 400 | 1.5 | zinc-500 |
| Tooltip / margin tip | Sans | 12–13px | 400 | 1.3 | `#71717a` |
| Badge ("YC23") | Sans | 12px | 500 | 1.4 | zinc-500 on `black/5%`, radius 2px, padding 2px 6px |
| Button ("Say hi") | Sans | 14px | 500 | — | zinc-800 |

Pattern: **serif carries the voice, set big and light (300); bold serif (600) is only for the page's main H1 and names. Sans handles UI and body text at 13–16px.** Two type families, one ink color, hierarchy from weight and opacity.

---

## 3. Color

### Core palette (the whole site uses about 8 colors)

| Token | Value | Use |
|---|---|---|
| Ink | `#2e2e33` | All primary text. Tailwind's `black`, `gray-900` and `zinc-900` are all remapped to it. **No pure black anywhere.** |
| Ink-2 | `#3a3a40` (zinc-800) | Labels, stat numbers, button text |
| Zinc-700 | `oklch(37% .013 285.8)` | Menu row text |
| Muted | zinc-500 `oklch(55.2% .016 285.9)` (≈ `#71717a`) | Body and secondary text, nav |
| Faint | zinc-400 `oklch(70.5% .015 286)` | Article meta |
| Hairline | zinc-300 / `#E4E3DE` | Separator dots, card outlines |
| Paper | `#ffffff` with a grain overlay (reads as ≈ `#f3f3f2`) | Page background |
| **Bone / card** | **`#F1F0EC`** | Cards, the "Say hi" pill, playground cards |
| Bone hover | `#ECEAE4` | Card hover |
| Footer | `#2E2E33` | Dark footer revealed under the page |
| **Accent: "poppy"** | **`#c8402a`** | The only saturated color: focus rings, active-nav flower, cue dots, numbered labels, caret |
| Poppy fill | `#f9ece8` | Hover background for every interactive element |
| Poppy fill (dark) | `#503231` | Hover fill on the dark footer |
| Poppy highlight | `rgba(200,64,42,.18)`, `.30` on hover | Marker highlight under key phrases |

Small extras: amber/orange flower colors in the presence avatars; green-600 for "Approved"-type states in case-study mockups.

### Color rules
- Monochrome, warm-neutral base; one red-orange accent used sparingly.
- **Every hover state uses the same move:** background becomes `poppy-fill` and text becomes `poppy`.
- Focus: `outline: 2px solid #c8402a; outline-offset: 2px` on every focusable element. Cards use offset 4px.

---

## 4. Texture and surface

- **Paper grain over the whole page.** A fixed, full-screen layer with an SVG `feTurbulence` noise (baseFrequency .85, 3 octaves, 220px tile) at `opacity: .16; mix-blend-mode: multiply; pointer-events: none; z-index: 2147483000`. This turns white into a warm paper tone and is the signature of the look.
  ```css
  .paper-grain{position:fixed;inset:0;pointer-events:none;z-index:2147483000;opacity:.16;mix-blend-mode:multiply;background-size:220px 220px;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.18  0 0 0 0 0.18  0 0 0 0 0.2  0 0 0 1.4 -0.2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
  ```
- **Image loader ("paper-breath"):** the same noise at 160px, pulsing between opacity .5 and .22 over 2.4s on a `#F1F0EC` placeholder until the media loads.
- **Cards are flat.** They use no drop shadows: just a bone fill or a 1px inset outline (`box-shadow: inset 0 0 0 1px #E4E3DE`). Media inside cards gets `inset 0 0 0 1px rgba(0,0,0,.1)`.
- Shadows are kept for floating things only: popover, stickers, the mobile dock, and the page sheet.

---

## 5. Layout

- **Container:** `max-width: 1440px; margin: auto; padding-inline: 40px` (20px on mobile). The header's right padding is `max(40px, calc((100vw - 1440px)/2 + 40px))`.
- **Home hero:** a two-column grid, `minmax(0,1fr) 320px`, with a 72px gap and a vertical hairline between the columns. Top padding is **224px** (100px plus the safe area on mobile); bottom padding is 96px.
  - Left: H1 plus the rotating tagline, then a 3-column meta row ("Currently / Previously / Fellowship"), each column a bold label above a muted value.
  - Right: a circular avatar (~96px) with a white ring and soft shadow, a bold "So glad you're here", a two-line intro, and a row of 18px icon links (location glyph · LinkedIn · X · GitHub · Resume) with tooltips.
- **Section rhythm:** each section starts with a small label row (a 12px poppy flower icon, the label at 15px/500 zinc-500, and an optional count "(6)"). Top padding is `pt-40` (160px) between sections, and `pt-16` for the first one after the hero.
- **Featured work card:** full width, `bg #F1F0EC`, radius 20px, padding 28px 40px 40px, two columns 6/6. Left side: a company logo plus name and badge, a serif title at 34px/300, a one-line sub, three stats (number in serif plus a 13px caption), and a "Read the case study" link with a flower icon. Right side: an animated isometric SVG illustration.
- **Playground grid:** 3 columns, gap ~16px. Each card is `bg #F1F0EC`, radius 16px, with 4px padding around a 12px-radius media frame, then the title (serif 28/300) and a one-line description (truncated with an ellipsis).
- **Articles grid:** 3 columns. Each card is outline-only (`inset 0 0 0 1px #E4E3DE`), radius 16px, padding 20px. It holds a **serif quote at 30px/300** with key phrases marker-highlighted, and the meta line at the bottom. Quotes **cycle**: words fade and blur in, and the highlight sweeps in.
- **Inner pages (About, Work, Articles, Playground)** share one template: a **left sticky sub-nav** (about 200px wide, vertically centered in the viewport) and a content column of about 480–560px starting near x≈290. The active sub-nav item has ink text plus a small poppy flower; inactive items are zinc-400. Each item has an icon (About) or a two-line name plus role (Work).
- **About page body:** the text wraps around a circular portrait (`shape-outside` circle). Key phrases get a poppy underline-highlight. The experience list puts a logo, company and role on the left and dates right-aligned in zinc-400; award tags are poppy text on a poppy-fill tag. Section titles are lowercase serif.
- **Case study page:** a big H1 (72px/600) with one word highlighted, then a 4-up meta grid (Company / Role / Timeline / Scope; 12px muted label over 13px ink value), a row of 40px+ serif stats, and numbered sub-sections ("02" in poppy at 12px, then an H3 in serif 24/300, body at 14px in gray-500, and an illustration card on the right).

### Page-reveal footer (signature)
- The page content sits on a **white sheet** with `border-bottom-left/right-radius: 64px` (40px on mobile) and a shadow of `0 24px 50px -24px rgba(0,0,0,.25), 0 1px 0 rgba(0,0,0,.05)`, at z-index 2.
- Underneath, a `position: sticky; bottom: 0` footer in **`#2E2E33`** with a height of 480px (380px on mobile) is **revealed as you scroll**.
- The footer has a **twinkling star field** (`.meadow-star`: opacity .25→1 and scale .7→1, in poppy, amber and white), the **giant serif email** (click to copy, then shows a "Copied" state), small social icons, the presence flowers, and "© 2026" in the bottom right.
- The page scrolls inside a full-viewport `div.overflow-y-auto.no-scrollbar` (the scrollbar is hidden), not the body.

---

## 6. Components

### Top bar
- `position: fixed`; a 3-column grid `1fr auto 1fr`; height ~100px with 16px bottom padding.
- **Progressive blur "glass":** six stacked layers with backdrop blur 1/2/4/8/16/32px, each masked to a band of a vertical gradient, 120px tall. Content fades under it smoothly with no hard edge.
- **Tucks away on scroll down** (`[data-tucked]` sets the bar's contents to opacity 0) and returns when scrolling up or when anything inside it has focus.
- Left: an illustrated avatar logo (a girl's face with a poppy flower) that animates in with `avatar-bloom`: scale .55 and rotate −16° to rest, over .7s with an overshoot curve.
- Center: nav buttons, `h-9 px-3 rounded-10px text-15px zinc-500`, hovering to `poppy-fill`/`poppy`, with `active:scale(.96)`. The active page shows a **poppy flower glyph** before an ink label.
- Right: **presence flowers** (one flower per live visitor, animated in with `visitor-in`, hovering to a dark tooltip saying "You and 2 others are here right now") and the **"Say hi" pill** (`h-9 px-3.5 rounded-full bg #F1F0EC 14px/500` with a hand icon). It is poppy-tinted while open.

### "Say hi" popover
- 200px wide, white, radius 14px, padding 6px; shadow `0 0 0 1px rgba(0,0,0,.06), 0 16px 40px -14px rgba(0,0,0,.25)`.
- A 2×2 grid of social tiles (h-48px, radius 10px, `bg zinc-50`, icon in zinc-500) with a **round mail button overlapping the center**.
- A 1px zinc-100 divider, then rows (Resume, Site info) at 14px in zinc-700 with an icon, radius 4px, hovering to poppy-fill.

### Mobile
- The top bar shrinks to the logo plus a frosted "Say hi" pill (`bg-white/70 backdrop-blur-xl saturate-180%` with a hairline and a soft shadow).
- Navigation moves to a **floating bottom dock**: a white pill with 5 icons (home, person, briefcase, doc, cube); the active one sits on a poppy-fill circle.
- The "Say hi" dialog becomes a bottom sheet (`inset-x-2 bottom-2 rounded-34px bg-white/95 backdrop-blur-2xl`).
- The hero stacks into one column: meta rows stack, and the intro card sits below a hairline with the avatar inline.

### Small details
- **Margin tips:** 13px zinc-500 tooltips that appear under icon links on hover or focus.
- **Interaction-cue dot:** a 6px poppy dot with a soft glow, pulsing (scale 1→1.14 over 2.4s) to mark something interactive.
- **Stickers** (decorative): rounded white cards tilted with `--tilt`, a 6px white border and a layered shadow. On hover they lift 4px and a **page curl** grows in the bottom-right corner (0 to 28px); clicking peels one off with a flying animation.
- **Highlight marker:** `linear-gradient(rgba(200,64,42,.18))` sized to 40% height at 86% from the top, animating from 0% to 100% width; it deepens to .30 on hover.
- **Word-in reveal:** each word animates from opacity 0, blur 6px and translateY .18em to rest, with ease `cubic-bezier(.23,1,.32,1)` and a stagger.
- **Rotating hero tagline:** for example, "Can fly a plane. Can't drive a car." / "Sketches on napkins." / "Built a robot in my living room."
- **Playground 3D cards** (`.xr-*`): stacked panes with perspective that fan apart on hover (`--push` 150px; 110px on mobile).

---

### Hidden interactions (found in the code, then tested in the browser)
- **Cursor prompt:** a small 11px/500 poppy label with letter-spacing .04em, portaled and `position: fixed` at z-index 140. It follows the mouse at an offset, reveals its text **one word at a time** (`revealedWordCount`), and can show a bobbing click icon (scale .96→1.08, 0.92s loop). It only works for `pointerType === "mouse"` and hides on press, leave and cancel.
- **Custom cursor:** a hand-pointer SVG data URI set as `cursor` on clickable elements, `grab`/`grabbing` on draggables, and `zoom-in` on images.
- **Footer meadow:** a seeded grid of flowers (light theme) or `.meadow-star` sparkles (dark theme). On pointer move or press, every item within a radius opens: scale 1, plus a spin, with a delay proportional to its distance. A randomized timer closes it again. The handler ignores pointers over links and buttons.
- **Time-of-day status:** a table of `[startMin, endMin, line]` entries in SF time ("Asleep, probably. Leave a note anyway.", "Second coffee. Please don't judge.").
- **Tile-pop image load:** a checkerboard grid of `#F1F0EC` and `#EAE9E4` tiles. On load each tile runs `progressive-tile-pop` (560ms, `cubic-bezier(.16,1,.3,1)`): a brightness flash, then scale 1.2 and rotate, then scale .2 and fade out, staggered.
- **Draggable About portrait:** a grip handle (⋮⋮) drags the round portrait, and the intro paragraphs re-break line by line around it live (the text is pre-split into lines).
- **Stickers:** `v0` buttons tilted with `--tilt`, playing muted looping video or images. A click adds `.home-sticker-peel`, which flies the sticker up and away, then opens the project.
- **Showcase carousel** (`/products`): an interval auto-advances the active project; a click navigates to `/products#id` after a 560ms exit.
- **Q&A data:** personal questions with answers ("You can fly a plane but you can't drive a car?", "How does your AI define you?").
- **Live presence:** Ably. Up to 5 flower avatars in `#C8402A #e2786a #e8b923 #f08a3c #e85a85 #f3a6b4`, overlapping, that fan out on hover.
- **Toasts:** a Sonner-style toast store, used for "Copied".

## 7. Motion system

| Token | Value |
|---|---|
| Main ease ("out-quint-ish") | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Overshoot (pop-in) | `cubic-bezier(0.2, 0.9, 0.25, 1.12)` |
| Rise / pop for illustrations | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| UI durations | 150ms (buttons), 200ms (cards, nav), 250–300ms (bar, highlight) |
| Press feedback | `active:scale(.96)` (.92 on the mobile pill, .97 on stickers) |

- Illustrations run on scroll-into-view: `rise` (translateY 14px to 0), `pop` (scale .6 to 1), `draw` (SVG stroke-dashoffset), `pulse`, `blink` and `float`, each with a staggered `--d` delay.
- **Every animation has a `prefers-reduced-motion: reduce` fallback**: it shows the final state with no motion.

---

## 8. Iconography and imagery
- 18px outline icons in a Lucide-like stroke style for UI: hand, mail, LinkedIn, X, GitHub, Medium, file, info, briefcase, cube.
- Brand logos are monochrome, ink-colored and small (~16px) next to company names.
- Illustrations are custom SVG: **isometric, monochrome paper-white slabs with poppy-red accents** that animate on view. Product screenshots are rebuilt in code (live HTML mockups), not used as static images.
- The poppy **flower** glyph is the recurring brand mark: on the logo, the active nav item, section labels, link bullets and the presence avatars.

---

## 9. Voice and content patterns
- Short, confident, slightly playful lines: "Can fly a plane. Can't drive a car." and "I reply to everything."
- Outcomes first: three stats per project ("86% completion · 713 activities filed · 38→14 fields per form").
- Personal warmth ("So glad you're here"), live presence, a copy-to-clipboard email, and small toys.
- Few words per screen and a lot of whitespace (section gaps of 160px).

---

## 10. Principles to carry into Rohan's site (without copying)
1. One warm neutral ink (not black) plus **one** accent color, used only for interaction and emphasis.
2. A serif/sans pair: an expressive variable serif at light weight for display, a clean sans for UI.
3. A paper-grain overlay and flat bone-colored cards instead of shadows.
4. A progressive-blur top bar that tucks on scroll; a floating dock on mobile.
5. A content sheet with large rounded bottom corners that reveals a dark footer with a giant contact line.
6. One hover language everywhere (accent-tint fill plus accent text), a consistent focus ring, and press-scale.
7. Motion: a single ease curve, small distances, a reduced-motion fallback for everything.
8. Show work through stats and live-coded illustrations rather than static screenshots.

Choose a **different** accent, serif, logo mark, signature glyph, and taglines so the new site has its own identity.
