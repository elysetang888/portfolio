# Elyse Tang — Portfolio

Personal portfolio site for product roles. Scroll-driven home page with two project case-study subpages, plain HTML/CSS/JS — no framework, no build step.

Live at: https://elysetang888.github.io/portfolio/

## Structure
- `index.html` — home page: intro, project teasers (thumbnail + link), contact
- `swats-up.html` / `cranes.html` — full case studies for each project
- `css/styles.css` — design system + layout
- `js/main.js` — scroll-reveal animations + nav scroll-spy
- `fonts/` — self-hosted Archivo variable font
- `assets/media/` — drop real screenshots/video here (see `assets/media/README.md`)

## Local dev
```
python3 -m http.server 8000
```
then open http://localhost:8000/

## Deploy
Push to `main`; GitHub Pages (Settings → Pages → Deploy from branch → `main` / root) rebuilds automatically.
