# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + TypeScript + Vite, built via GitHub Actions and deployed as a static site to GitHub Pages (same target as today — `https://thiagoramos28.github.io/fulltbet-triagem/`). Decided explicitly by the user on 2026-09-07, replacing the current build-free static HTML/JS page. Data layer talks to Supabase (Postgres + PostgREST) — may adopt `@supabase/supabase-js` for typed queries in place of raw `fetch`.

## Users

Single user: Thiago, also the developer of the whole `fulltbet` pipeline. He checks this page repeatedly through the day on his phone (he works full-time elsewhere and only glances at live games near key moments), and less frequently on desktop. No other audience — this is a personal tool, not a product for external users.

## Product Purpose

A pre-game screening list ("triagem") for football matches that show a statistical tendency toward a specific event (over 0.5 HT, over 1.5 FT, a favorite not losing, etc.), computed nightly from Fulltrader/Sherlock data. The page is not a betting engine and does not recommend stakes or place bets — its only job is to narrow ~70-130 daily matches down to the ones worth watching live, so Thiago can judge the actual entry moment himself with the match on screen. See the project's own framing (`D:\Projetos\fulltbet\CLAUDE.md`, top section): "the goal is not to beat the market" — the edge lives in the gap between a game's known tendency and how the live odds move once the game starts producing, and that gap only exists if he's watching.

## Positioning

Not a generic odds-comparison or tipster site. Every section (Farol, Sonar, Bússola, Lay 0x1, Lay Visitante Favorito) is backed by an indicator measured and frozen against this project's own historical dataset (documented hypotheses under `docs/hipoteses-congeladas/` in the main repo), not a third-party model. A neighboring product could not copy this without the underlying data pipeline and the measured cuts behind each section.

## Operating Context

- Data is produced by a daily n8n pipeline (writes to Supabase tables `triagem`, `lay0x1_diario`, `lay_visitante_diario`, `regua_confianca`, `ligas_monitoradas`) — this page is a read-only consumer of that pipeline's output, not where data originates.
- Primarily read on a phone, often at a glance, sometimes while a match is live and decisions are time-pressured.
- Alerts for the same events also go to Discord; this page is the browsable/persistent counterpart, with day navigation (hoje/ontem/anteontem) and win/loss tracking per section.
- Public today (anon Supabase key embedded in the page, RLS-restricted to a rolling 3-day read window) — the rebuild keeps read access public; a future login (Supabase Auth) is scoped only to write actions like toggling a monitored league, not to viewing the page.

## Capabilities and Constraints

- Confirmed for this rebuild (v1): visual/craft rewrite only. No new interactive capabilities yet — same sections, same data, same read-only public access, on the new stack.
- Explicitly deferred, not part of v1: an authenticated (Supabase Auth, single user) admin action to toggle `ligas_monitoradas.ativo` from the UI instead of raw SQL; a "favorite/flag this game" feature was floated only as an example of a future capability, not committed.
- Five sections, each independent: Farol, Sonar, Bússola (with a 1–5 star confidence index against its own measured ladder), Lay 0x1, Lay Visitante Favorito (also starred). Each section shows result tracking (bateu/não bateu) once the match finishes.
- Country flags render via 52 embedded WebP data URIs (no runtime CDN dependency, deliberate) — carry this constraint forward or replace with an equivalent self-contained approach.
- `game_stats_liga`/`game_stats_flat` in Supabase separate `casa`/`fora` by design (fixed project-wide analysis rule, see `CLAUDE.md`) — any new stat surfaced on this page must respect that split, never average or compare the two sides directly.
- As of 2026-09-06, a `ligas_monitoradas` curation table filters which leagues reach `triagem`/`lay0x1_diario` at all — this page's game count reflects that filter already, nothing new to build for it in v1.

## Brand Commitments

Existing "instrumento de navegação" identity (redesigned 2026-09-04, still the incumbent visual system): JetBrains Mono, an amber/green/red semáforo for aguardando/bateu/não bateu, embedded flag icons. This rebuild may keep, extend, or deliberately replace this identity — that decision belongs to new-work, not to this file.

## Evidence on Hand

- The current production page (`index.html` in this worktree, deployed at the GitHub Pages URL above) is the incumbent implementation and visual truth to treat as evidence.
- Historical design/UX decisions and measurements live in `D:\Projetos\fulltbet\NEXT_STEPS.md` and `D:\Projetos\fulltbet\docs\` — real measured numbers (card heights, contrast ratios, volume counts), not invented.
- No customer testimonials, pricing, or external brand assets exist or should be fabricated — there is no external audience.

## Product Principles

1. Screening, not prediction — every surfaced number exists to help Thiago decide what to *watch*, never to imply a guaranteed outcome. Copy and visual weight must not read as a promise.
2. Read-heavy, glance-first — most sessions are a quick phone check, not a deep dive; scanability beats density.
3. Small-sample honesty — the underlying dataset is dozens to low hundreds of games per section; the UI must not visually overstate confidence a small sample doesn't support (see the existing star-confidence caveats).
4. Self-contained over convenient — prefer no runtime third-party dependency (fonts/icons/flags) when a self-hosted alternative is reasonable, matching the existing flag-embedding decision.
5. One user, real stakes — this is Thiago's own screening tool for his own decisions; craft and correctness matter more than broad configurability or multi-tenant flexibility.

## Accessibility & Inclusion

No formal standard required (single user), but the existing implementation already fixed a real WCAG AA contrast failure (colored badges unreadable in light mode) during a past polish pass — carry that bar forward, don't regress it.
