# rohanwaghmarev3

Rohan Waghmare's portfolio, v3. A white, grainy "lab notebook": Newsreader for the voice, Geist for the UI, Geist Mono for numbers, one ink-blue accent, and the Golden Gate in orange.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Where things live

| Path | What |
|---|---|
| `src/app/globals.css` | Tokens (`@theme`), paper grain, progressive-blur top bar, highlight mark, keyframes, page transitions |
| `src/app/layout.tsx` | Fonts, top bar, the white sheet that reveals the sticky night footer, mobile dock, cursor prompt, toasts, grain |
| `src/components/` | `top-bar`, `say-hi`, `mobile-dock`, `footer` (node graph + copy email), `cursor` (streaming cursor label), `magnetic`, `profile-card` (photo + Golden Gate), `page` (route wrapper, section label, placeholder) |
| `src/lib/site.ts` | Links, nav, email, and the Pacific-time status lines |
| `src/content/work.ts` | Case studies: copy, stats, pipeline diagrams, traces and code notes |
| `docs/` | Design reference, direction board and interaction plan |

## Conventions

- Links and buttons get the hand cursor automatically. Add `cursor-grab` to draggable things for the open/closed hand.
- Add `data-cursor="label"` to anything clickable to get the streaming cursor label.
- Use `<Portrait size={…} />` for Rohan's photo (cropped to the face).
- If styles look stale in `npm run dev`, stop the server and delete `.next` (Turbopack keeps a disk cache). Don't run `npm run build` while the dev server is running.
- Wrap each route in `<Page>` so navigations fade between pages.
- Use `<Placeholder label="…">` for anything not built yet.

## Build phases

0. Foundation (done)
1. Home: streaming tagline, badge pile, trace waterfall, rolling numbers (done)
2. About: portrait reflow, git-log timeline, physics tool shelf, Ask Rohan (done)
3. Work: pipeline diagram, before/after slider, trace replay (done)
4. Projects, Notes, Resume, 404
5. Presence, ⌘K palette, real RAG, sound
