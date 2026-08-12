# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working mode

This is a guidance-only project by default: analyze, explain, and propose — do not write or edit code unless explicitly directed to do so in the request.

## Note

Despite the name, this is a writing app, not a medical/health app. "Bloodwork" is just the project name — don't assume health-domain semantics (patients, test results, panels, etc.) when reasoning about the data model.

## Repository structure

Monorepo split into `frontend/` and `backend/`. A root `package.json` exists solely to run both together in dev (see below) — no shared code lives at the root.

### Running everything together

From the repo root:

```sh
npm run dev
```

This starts Postgres (`docker compose up -d` in `backend/`), the backend (`nodemon`), and the frontend (`vite`) concurrently, with labeled/colored output per process. Requires a working Docker daemon (this project uses Colima, not Docker Desktop) — `colima start` if `docker info` fails to connect.

## Backend (`backend/`)

Node/Express API backed by Postgres, run via Docker Compose. No ORM — raw SQL through `pg`. No linter, formatter, or test runner configured yet.

### Commands

Run from `backend/`:

```sh
docker compose up -d   # start Postgres (must be running before the API)
npm run dev              # start the API with nodemon (auto-restarts on .js changes)
npm run start             # start the API without auto-restart
docker compose down     # stop Postgres
```

### Architecture

- **Entry point**: `src/server.js` — sets up Express, `express.json()`, `cors` (currently locked to `http://localhost:5173`, the Vite dev origin — update if the frontend port changes), and mounts routers.
- **Routes**: one file per resource in `src/routes/` (e.g. `health.js`, `projects.js`), each exporting a `Router` instance mounted in `server.js`.
- **DB access**: `src/db/index.js` exports a `pg.Pool`-backed `query(text, params)` helper. Always use parameterized queries (`$1`, `$2`, ...) — never string-concatenate values into SQL.
- **Migrations**: plain numbered `.sql` files in `src/db/migrations/` (`001_init.sql`, `002_add_projects.sql`, ...), each a forward-only step. There is no migration tracking tool yet — files are applied by hand and are not re-run automatically:
  ```sh
  docker exec -i backend-db-1 psql -U bloodwork -d bloodwork < src/db/migrations/00N_name.sql
  ```
  Write `CREATE TABLE IF NOT EXISTS` (as the existing migrations do) so re-running a file is harmless. Never edit an already-applied migration file — add a new one instead.
- **Local Postgres**: `docker-compose.yml` runs `postgres:16` with dev credentials (`bloodwork`/`dev`), matched by `.env`/`.env.example` (`DATABASE_URL`). Data persists in a named Docker volume across restarts.

### Conventions

- Route handlers wrap DB calls in try/catch and respond `500` with `{ status: "error", message }` on failure.
- List endpoints return `{ status: "ok", content: [...] }`; single-resource creates/deletes return the row directly.

## Frontend (`frontend/`)

Vue 3 + Vite SPA scaffolded with `create-vue` (bare template, no starter/example content), with Vue Router. No linter, formatter, or test runner is configured yet.

### Commands

Run from `frontend/`:

```sh
npm install       # install dependencies
npm run dev       # start dev server (Vite)
npm run build     # production build
npm run preview   # preview a production build locally
```

### Architecture

- **Routing**: routes are declared in `src/router/index.js`; route components live in `src/views/`. `App.vue` is just a `<RouterView />` shell.
- **Styling — two-file SCSS system** in `src/assets/styles/`:
  - `theme.scss` holds variables only (colors, etc.) and emits no CSS of its own. Vite's `css.preprocessorOptions.scss.additionalData` (in `vite.config.js`) auto-injects `@use "theme" as theme;` into **every** SCSS-compiled file — component `<style lang="scss">` blocks and plain `.scss` files alike. Reference vars as `theme.$var-name`. Do **not** add your own `@use "theme"` anywhere — it's already injected and a second `@use` on the same namespace throws a Sass error.
  - `global.scss` holds actual global CSS rules (reset, `body`/`#app` base styles, scrollbar/selection styling, `:root` custom properties) and is imported once, in `main.js`. This is the file to extend for app-wide (non-component-scoped) styles.
  - `@` is aliased to `src/` (see `resolve.alias` in `vite.config.js`).

### Conventions

- In `.vue` single-file components, order blocks `<template>`, then `<script setup>`, then `<style>` — template first.
