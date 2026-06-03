# CLAUDE.md — andrewcolumbus.github.io

Personal website for Andrew Columbus, founder of Immersivegroup. A single
self-contained `index.html` (HTML + inline CSS + inline vanilla JS) styled as an
iOS 6 app screen, deployed via GitHub Pages at `https://andrewcolumbus.github.io`.

## Hard rule: every list row (tab) must have an image

Each row in the grouped table views shows an **iOS 6-era app-icon tile** on the left
(a glossy rounded square holding a logo image, or an emoji). When adding a new row, it
**must** include an icon. Do not ship a row without one.

Images are **hosted locally in this repo** (so GitHub Pages serves them) — never
hot-linked from a favicon service or other external URL. Download/produce the asset,
place it in the repo, and reference it with a relative path.

### Current row → image map

| Row | Image (relative path) | Source |
|-----|-----------------------|--------|
| Profile avatar | `icons/headshot.jpg` | Provided by Andrew |
| Age | emoji 🎂 (`&#127874;`) | inline emoji |
| Based | emoji 📍 (`&#128205;`) | inline emoji |
| Immersivegroup (Work + Contact) | `icons/immersivegroup.png` | immersive-group.com favicon |
| Royalston Square | `icons/anticstudios.png` | Antic Studios (anticstudios.com) logo |
| Luxedo | `icons/luxedo.png` | favicon |
| IUPUI (Education row) | `icons/iupui.png` | IU trident |
| IUPUI popup image | `icons/IUPUI.jpeg` | Provided by Andrew |
| LinkedIn | `icons/linkedin.png` | linkedin.com favicon |
| Instagram | `icons/instagram.png` | instagram.com favicon |
| Royalston → Events by Entourage | `icons/entourage.svg` | generated monogram (no favicon available) |
| Royalston → North Loop | `icons/northloop.png` | northloop.org favicon |
| Royalston → KSTP | `icons/kstp.png` | kstp.com favicon |

### How icon tiles are coded

- Logo tile: `<span class="app-icon"><img class="fav" src="icons/NAME.png" alt=""></span>`
- Emoji tile: `<span class="app-icon emoji">&#EMOJI;</span>`
- `class="fav"` on the `<img>` wires it to the JS fallback (a neutral gray square shows
  if the file ever fails to load).
- The popup uses `<img class="alert-logo" ...>` (larger, no tile).

### Fetching new icons

Prefer Clearbit (`https://logo.clearbit.com/<domain>?size=256`), fall back to the Google
favicon service (`https://www.google.com/s2/favicons?sz=128&domain=<domain>`). Normalize
to PNG with `sips -s format png in.png --out out.png`. If no favicon exists, generate a
simple monogram SVG like `icons/entourage.svg`.

## Local preview

```bash
python3 -m http.server 8765   # then open http://localhost:8765/index.html
```

## Notes

- This repo lives under `~/Documents/Code/` as a standalone git repo (remote:
  `andrewcolumbus.github.io`). It is not part of the Immersiveserver monorepo.
- Birthday easter egg: the Age row only celebrates (confetti + toast) on June 8;
  it is a plain row every other day.
