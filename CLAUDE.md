# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BookNook is a SvelteKit 2.x + TypeScript frontend for a booking management system. It's deployed as a static site on GitHub Pages with custom domain (booknook.no) and connects to a backend API at `https://booknook-backend-cr3h.onrender.com`.

## Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm run test             # Run all tests (integration + unit)
npm run test:unit        # Vitest unit tests only
npm run test:integration # Playwright E2E tests only

# Code Quality
npm run check            # TypeScript + Svelte type checking
npm run lint             # Prettier + ESLint validation
npm run format           # Auto-format with Prettier

# Deployment
npm run deploy           # Build and deploy to GitHub Pages
```

## Architecture

### State Management (src/stores/)
Svelte writable stores manage global state:
- `auth.ts` - Authentication state (`isAuthenticated`, `isAdminUser`), login/logout functions, token persistence to localStorage
- `modal.ts` - Modal visibility and dynamic content
- `includePastBookings.ts` - Booking filter preference

### API Layer (src/lib/api/)
- `config.ts` - API_BASE_URL configuration
- `users.ts` - User CRUD operations
- `bookings.ts` - Booking CRUD operations
- `globalOnMount.ts` - App initialization hook that checks auth and fetches initial data

All API calls use Bearer token authentication from localStorage.

### Authentication Flow
1. `globalOnMount()` runs on app load in root layout
2. Checks for auth token in localStorage
3. Redirects to `/login` if not authenticated
4. User data and token cached in localStorage
5. Logout clears storage and redirects

### Component Structure (src/lib/components/)
- `calendar/` - Schedule-X calendar integration for booking display
- `modal/` - Reusable modal overlay system
- `newBooking/` - Booking creation form
- `myBookings/` - User's booking list

### Routing (src/routes/)
SvelteKit file-based routing:
- `/` - Home page with calendar
- `/login`, `/register` - Authentication pages
- `/minside` - User profile and bookings
- `/admin` - Admin dashboard

### Types (src/types/)
TypeScript interfaces: `User.ts`, `Booking.ts`, `ScheduleXEvent.ts`

## Key Dependencies
- **schedule-x** - Calendar UI library with Svelte integration
- **@sb1/ffe-*** - SpareBank 1's FFE design system components

## Deployment
Static adapter builds to `build/` directory. GitHub Actions workflow deploys on push to `main` branch. Uses 404.html fallback for SPA routing on GitHub Pages.
