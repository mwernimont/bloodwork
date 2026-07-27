# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

Monorepo split into `frontend/` and `backend/`. `backend/` is currently empty — no framework has been chosen yet.

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
