# GameVault — UI/UX Improvement Ideas

A working list of improvements beyond the current visual redesign. Grouped by theme, each entry notes the rough effort and why it'd help. Treat this as a backlog to pull from, not a commitment — nothing here is scheduled.

## Discovery & Browsing

- **Sort controls on Home** — by rating, release date, name, popularity. Right now the grid only reflects RAWG's default ordering; a sort dropdown next to the search bar is a quick, high-value add.
- **Genre/platform filters** — already called out as a "Future Implementation" in the README. Filter chips above the grid, backed by RAWG's `genres`/`platforms` query params.
- **Search-as-you-type suggestions** — a dropdown of matching titles under the search bar (reusing the existing debounce pattern in `TopBar.jsx`) so users don't have to submit and scan the full grid for one title.
- **Recently viewed games** — small strip or section remembering the last few games a user opened, stored in `localStorage` (no backend change needed).
- **Empty search state** — "No games matched '...'" with a suggestion to clear filters, instead of just an empty grid.

## Game Details

- **Screenshots/media gallery** — RAWG's `/games/{id}/screenshots` endpoint isn't used yet; a small carousel would make the details view feel much less text-heavy.
- **Release date, developer, publisher** — RAWG returns these; currently dropped in `gameService.fetchGameDetails`'s response shaping.
- **Similar/related games** — RAWG exposes a `/games/{id}/suggestions` endpoint; a "More like this" row at the bottom of the details view would extend browsing sessions.
- **Store links** — RAWG returns `stores` (Steam/PlayStation/Xbox/etc. links); useful for a "where to buy/play" row.

## Library & Personal Data

- **Sort/filter within Profile** — library sections are currently unsorted insertion order; sort by rating or alphabetically would help once a library grows past a handful of games.
- **Written reviews, not just a 0–100 slider** — a short free-text field alongside the numeric rating (schema already has room in `reviews`, would need a new field + endpoint).
- **Library stats** — a small stats strip on Profile (total games, average rating, genre breakdown) makes the page feel like *your* page instead of a fixed four-column layout.
- **Bulk actions** — select multiple games in a library section to move status or remove in one action, for users with large libraries.
- **Export library** — a "download as JSON/CSV" button; low effort, occasionally very useful, and a nice trust signal (your data isn't locked in).

## Onboarding & Empty States

- **First-run guidance** — right now a brand-new account lands on an empty Profile with four "No games in this category" messages and no next step. A one-line CTA ("Browse games to start your library →" linking Home) would close that gap.
- **Skeleton loaders beyond Home** — Home already has a card skeleton; Profile's library fetch and the GameDetails modal both fall back to bare spinners/"Loading..." text. Matching skeletons would make loads feel faster and more consistent.

## Accessibility

- **Skip-to-content link** — a visually-hidden "Skip to games" link as the first focusable element, standard for keyboard users.
- **`prefers-reduced-motion` support** — none of the Framer Motion animations currently check this; users with vestibular sensitivity get the full motion regardless of their OS setting.
- **ARIA live regions** — search result counts and toast notifications aren't announced to screen readers today; both are good `aria-live="polite"` candidates.
- **Full contrast audit** — the light/dark tokens were checked for the accent and negative colors during the theme work, but a pass with an automated tool (axe, Lighthouse) across every page/state would catch anything missed.

## Feedback & Resilience

- **Retry affordance on failed fetches** — right now a failed games/details fetch shows a toast or nothing; a "Try again" button in the failed area (not just a toast) gives users a direct next step.
- **Inline form validation timing** — Register's password checklist is great; extending real-time validation feedback (not just on-submit) to Login and Account Settings would be consistent.
- **Network-offline state** — no explicit handling today if the user loses connectivity mid-session; a small banner ("You're offline — showing cached data") would be a meaningful resilience win for a library app people may check on the go.

## Personalization

- **Avatar / profile picture** — currently only a username shows; even a simple choose-from-a-set avatar (no upload pipeline needed) would make profiles feel less identical.
- **Accent color picker** — now that theming is token-driven, letting a user pick their own accent color (stored per-user or in `localStorage`) is a relatively small extension of the existing theme system.

## Mobile

- **Bottom tab bar on small screens** — the top bar is workable but cramped under ~480px; a bottom nav (Home / Search / Profile) is a more standard mobile pattern and easier to thumb-reach.
- **Swipe-to-close on the GameDetails modal** — a natural mobile gesture that the current click-outside/Esc/× pattern doesn't cover.
- **PWA installability** — a manifest + minimal service worker would let users "install" GameVault to their home screen; low effort relative to the payoff for a personal-library app people return to often.

## Micro-interactions

- **Status-change confirmation** — moving a game to "Played" currently just updates the dropdown silently; a small celebratory micro-animation (or even just a toast: "Added to Played 🎮") would give the action more weight.
- **Hover preview on cards** — a brief delayed tooltip/peek (genre, short blurb) on card hover before committing to opening the full modal, for faster browsing.
- **Animated route transitions** — page changes are currently instant cuts; even a simple fade/slide between routes (Framer Motion's `AnimatePresence` at the router level) would make navigation feel more considered.

## Trust & Data Freshness

- **RAWG outage fallback** — `gameService` calls aren't cached; if RAWG is slow/down, every page depending on it currently just fails. A short-lived cache (even in-memory on the server) would make the app resilient to upstream hiccups.
