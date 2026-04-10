# OnSpot RSVP

OnSpot RSVP is a lightweight event RSVP and check-in app built with Next.js App Router. The goal is simple: ship the smallest useful version of "the simplest possible Partiful" without dragging in architecture that the product does not need.

The project leans hard into server-first React, thin client boundaries, and pragmatic UX. Database reads happen in React Server Components, mutations flow through Server Actions, and interactive client surfaces stay small and focused.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- PostgreSQL
- Prisma
- Better Auth
- Zod
- Tailwind CSS v4
- shadcn/ui patterns
- Base UI primitives
- Biome
- Bun

## Architecture Notes

### Server-First by Default

This codebase prefers React Server Components for reads and Server Actions for writes. That keeps data access close to the database, avoids unnecessary client-side orchestration, and reduces the amount of JavaScript shipped to the browser.

Input validation happens at the mutation boundary with Zod, and fallible async work is normalized through the shared `tryCatch` utility for explicit result handling.

### Data Fetching & State Strategy: Native App Router vs. tRPC & TanStack Query

Given my strong background in the T3 Stack, my initial instinct was to reach for tRPC and TanStack Query to guarantee end-to-end type safety and handle client-side state. However, I deliberately chose to avoid them.

The project brief requested a lightweight tool, essentially "the simplest possible Partiful". Introducing the boilerplate required for tRPC, such as routers, context, and client-side providers, would be an over-engineering trap for an application of this scope.

Instead, I fully embraced the modern Next.js App Router paradigm, directly addressing the evaluation criteria around server versus client component decisions. By using React Server Components for direct database reads, I get the same native end-to-end type safety while drastically reducing the client-side JavaScript bundle, which matters for a fast-loading public RSVP page.

For highly interactive client elements, such as an admin check-in toggle that needs zero-latency feedback, the common reflex would be TanStack Query with optimistic updates. Instead, I use React's native `useOptimistic` hook paired with Server Actions. That gives the interface the immediate, snappy behavior expected in high-interactivity flows without paying the architectural cost of a heavier client-side state management library.

This is a deliberate choice: prefer modern React and App Router primitives first, and only introduce extra abstraction when the product actually earns it.

### UI Primitives: shadcn/ui Patterns with Base UI vs. Radix UI

While shadcn/ui provides excellent rapid scaffolding for a polished, accessible interface, its default reliance on Radix UI primitives can sometimes introduce heavier abstraction layers, extensive context providers, and complex `asChild` prop-drilling.

For this project, I kept the shadcn/ui design patterns and Tailwind integration so the product could move quickly without burning time on custom CSS from scratch, but I backed interactive components with **Base UI** primitives instead of Radix.

Base UI provides a leaner DOM footprint and a more straightforward API surface. For a lightweight, public-facing RSVP flow where time-to-interactive and bundle size matter, that tradeoff fits the project better while still preserving strong accessibility guarantees.

### Deterministic Builds & Dependency Management

Nothing is more frustrating for a reviewer than a "works on my machine" scenario caused by a silent upstream package update over the weekend. To guarantee a 100% reproducible environment, I enforced strict deterministic builds.

All direct dependencies in the package.json are explicitly pinned to exact versions (no carets ^ or tildes ~), and the transitive dependency tree is strictly locked via the committed lockfile. This ensures that the application you run today is mathematically identical to the one I built, eliminating "ghost bugs" from minor package bumps.

To maintain security without sacrificing determinism, in a production environment, this exact-pinning strategy would be paired with automated dependency updates (e.g., Dependabot or Renovate) to catch and patch CVEs through the CI/CD pipeline.

## Local Development

This repository uses `bun` as the package manager because `bun.lock` is present in the project root.

### 1. Install dependencies

```bash
bun install
```

### 2. Create your environment file

Copy `.env.example` to `.env` and fill in the required values.

Required variables:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_GITHUB_CLIENT_ID`
- `BETTER_AUTH_GITHUB_CLIENT_SECRET`

The GitHub OAuth callback configured in the app is:

```text
http://localhost:3000/api/auth/callback/github
```

### 3. Prepare the database

For local development:

```bash
bun run db:generate
```

That script currently runs `prisma migrate dev`, which also regenerates the Prisma client.

### 4. Start the app

```bash
bun run dev
```

The app will be available at `http://localhost:3000`.

## Available Scripts

```bash
bun run dev
bun run build
bun run start
bun run preview
bun run check
bun run check:write
bun run check:unsafe
bun run typecheck
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:studio
```

## Project Structure

```text
prisma/                  Prisma schema and migrations
src/app/                 App Router routes, layouts, and Server Actions
src/app/api/auth/        Better Auth route handler
src/components/          UI and client components
src/server/better-auth/  Better Auth configuration and session helpers
src/server/db.ts         Prisma client singleton
src/utils/try-catch.ts   Shared async result wrapper
src/env.ts               Environment variable validation
```

## Current Foundation

The repository already includes the core platform pieces:

- Better Auth wired to Prisma
- PostgreSQL access through Prisma
- Environment validation with Zod
- Server Action form handling
- Tailwind v4 styling
- Base UI plus shadcn-style component patterns

The product direction is a focused RSVP and check-in workflow built on top of that foundation while keeping client boundaries thin and performance-oriented.