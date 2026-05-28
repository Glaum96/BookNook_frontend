# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BookNook is a SvelteKit 2.x + TypeScript frontend for a booking management system. Deployed as a static site on GitHub Pages with custom domain (booknook.no). Backend API at `https://booknook-backend-cr3h.onrender.com`.

## Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run build            # Production build (output: build/)
npm run preview          # Preview production build

# Testing
npm run test             # Run all tests (integration + unit)
npm run test:unit        # Vitest unit tests only (src/**/*.{test,spec}.{js,ts})
npm run test:integration # Playwright E2E tests only (tests/)
npx vitest run src/path/to/file.test.ts   # Run a single unit test file
npx playwright test tests/test.ts         # Run a single Playwright test file

# Code Quality
npm run check            # TypeScript + Svelte type checking
npm run lint             # Prettier + ESLint validation
npm run format           # Auto-format with Prettier

# Deployment
npm run deploy           # Build and deploy to GitHub Pages
```

## Architecture

### State Management (`src/stores/`)
- `auth.ts` — `isAuthenticated`, `isAdminUser` writables; `checkAuth()`, `logOut()`, `redirectToLoginIfNotAuthenticated()`
- `loading.ts` — Granular per-operation loading states. Use `isLoading(key)` to get a derived store for a specific operation, and `setLoading(key, bool)` to update it. Valid keys: `bookings`, `myBookings`, `users`, `login`, `register`, `postBooking`, `deleteBooking`, `updateUser`, `deleteUser`. API functions call `setLoading` internally.
- `modal.ts` — `showModal` (boolean) and `modalContent` (`{ component, props }`). Set both to open a modal with any Svelte component.
- `theme.ts` — 3-state store (`'light' | 'dark' | 'system'`), persisted to localStorage under key `booknook-theme`.
- `includePastBookings.ts` — Boolean filter preference, persisted to localStorage.

### API Layer (`src/lib/api/`)
All API calls use Bearer token from localStorage. The token is stored under the auth key by `auth.ts`.

- `bookings.ts` — `fetchAllBookings()`, `fetchMyBookings(userId, includePast)`, `postBooking(booking)` (returns `{ success, errors? }`), `deleteBooking(id)`
- `users.ts` — `fetchAllUsers()`, `fetchUser(id)`, `updateUser(user)`, `deleteUser(id)`, `getUserFromLocalStorage()`, `addUserToLocalStorage(userId)`
- `rules.ts` — `fetchRules()` (returns `Rule[]`), `toggleRule(id, enabled)`. `Rule` has `id, name, description, enabled, value`.
- `globalOnMount.ts` — Call once in each page's `onMount`. Checks auth, sets admin flag, loads preferences, redirects to `/login` if unauthenticated.
- `config.ts` — Exports `API_BASE_URL`.
- `utils.ts` — `pingApi()` for connectivity check.

### Theming System
Dark mode is implemented with CSS custom properties on `:root` (light) and `[data-theme="dark"]` (dark) in `src/app.css`. The `data-theme` attribute is set on `<html>`.

- `src/app.html` contains an inline script that reads localStorage and sets `data-theme` before first paint (prevents FOUC).
- `src/routes/+layout.svelte` subscribes to the `theme` store and calls `document.documentElement.setAttribute('data-theme', effective)` on changes, resolving `'system'` via `window.matchMedia('(prefers-color-scheme: dark)')`.
- The schedule-x calendar requires a separate `isDark` prop — `calendar.svelte` recreates the `calendarApp` instance when the theme changes.
- All colors in components use CSS variables from `app.css`. Never use hardcoded color values.

### Modal System
Open any Svelte component in the modal from anywhere:
```ts
import { showModal, modalContent } from '../stores/modal'
import MyComponent from './MyComponent.svelte'

showModal.set(true)
modalContent.set({ component: MyComponent, props: { onClose: () => showModal.set(false) } })
```
The modal is rendered in `+layout.svelte` using `<svelte:component>`.

### Authentication Flow
1. Each page calls `globalOnMount()` in `onMount`
2. Checks localStorage for auth token → redirects to `/login` if missing
3. User object cached in localStorage; fetched from API on first load

### Routing (`src/routes/`)
- `/` — Calendar view (all bookings)
- `/minside` — User profile and own bookings
- `/admin` — Admin: manage users, bookings, and toggle booking rules
- `/login`, `/register` — Auth pages

### Types (`src/types/`)
- `User` — `id, name, phoneNumber, email, apartmentNumber, admin`
- `Booking` — `id, startTime, endTime, userId, responsibleName, responsibleNumber` (ISO string dates)
- `ScheduleXEvent` — Schedule-X calendar event shape

## Deployment
Static adapter outputs to `build/`. `index.html` serves as SPA fallback (configured in `svelte.config.js`). GitHub Actions deploys on push to `main`. `app.html` includes a sessionStorage-based redirect handler for GitHub Pages SPA routing.
