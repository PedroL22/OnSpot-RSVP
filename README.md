# OnSpot RSVP

Lightweight event RSVP and check-in app built for the Gathering take-home project with Next.js App Router, Prisma, PostgreSQL, Better Auth, and Tailwind CSS.

<img width="1613" height="1076" alt="image" src="https://github.com/user-attachments/assets/45915016-c242-4219-86d9-d75b24639bf4" />


## Setup

1. Install dependencies:

```bash
bun install
```

2. Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_GITHUB_CLIENT_ID=
BETTER_AUTH_GITHUB_CLIENT_SECRET=
```

3. Run the database migration:

```bash
bunx --bun prisma migrate dev
```

4. Seed demo data:

```bash
bun run db:seed
```

5. Start the app:

```bash
bun run dev
```

6. Optional verification commands:

```bash
bun run verify
bun run build
```

## Demo Credentials

- Email: `organizer@onspot.app`
- Password: `OnspotDemo123!`

## Deployed URL

- [https://on-spot-rsvp.vercel.app/](https://on-spot-rsvp.vercel.app/)
- Verified against `/`, `/sign-in`, `/sign-up`, and unauthenticated `/dashboard`.

## What I Built

- Organizer auth with Better Auth email/password flows and protected dashboard routes.
- Event creation with title, description, starts at, location, and optional capacity.
- Public RSVP pages at `/r/[publicId]`.
- Organizer dashboard with event summaries, guest counts, check-in status, and share-link copy actions.
- Organizer event detail pages with RSVP table, manual check-in, CSV export, and activity log.
- Deterministic seed data with one organizer and three realistic review scenarios.

## Stretch Goals I Picked

- `Waitlist`: automatic waitlisting when confirmed capacity is full, plus manual organizer promotion.
- `Activity log`: event activity records for RSVP creation, waitlist joins, promotions, and check-ins.
- Bonus shipped: `CSV export` via a protected per-event guest-list export route.

## What I Cut and Why

- Custom RSVP questions: useful, but it would expand the schema, public form UX, and dashboard rendering surface too much for the timebox.
- Check-in codes: interesting, but manual organizer check-in already proves the event-day workflow.
- Mock email confirmation: intentionally skipped to keep the project focused on the RSVP lifecycle instead of external delivery plumbing.
- Event editing and deletion: valuable for production, but lower priority than shipping create, RSVP, waitlist, and check-in flows solidly.
- Google OAuth: deliberately cut from the timebox because Google Cloud Console setup adds meaningful overhead (consent screen, test users, provider configuration) for limited additional evaluation value. Email/password plus GitHub OAuth already demonstrate both native auth and third-party provider integration while keeping the project focused on the core RSVP flow.

## Trade-offs

### Data Fetching & State Strategy: Native App Router vs. tRPC & TanStack Query

Given my strong background in the T3 Stack, my initial instinct was to reach for tRPC and TanStack Query to guarantee end-to-end type safety and handle client-side state. However, I deliberately chose to avoid them.

The project brief requested a lightweight tool, essentially "the simplest possible Partiful". Introducing the boilerplate required for tRPC (routers, context, client-side providers) would be an over-engineering trap for an application of this scope.

Instead, I fully embraced the modern Next.js App Router paradigm, directly addressing the evaluation criteria regarding server versus client component decisions. By utilizing React Server Components (RSC) for direct database reads, I achieved the same end-to-end type safety natively while drastically reducing the client-side JavaScript bundle—which is crucial for a fast-loading public RSVP page.

Furthermore, for highly interactive client elements—such as the admin "Check-in" toggle that requires zero-latency feedback—reaching for TanStack Query for optimistic updates is a common reflex. Instead, I utilized React's native `useOptimistic` hook paired with Server Actions. This delivers the immediate, snappy UX expected in high-interactivity scenarios without the architectural cost of shipping a heavy client-side state management library.

### UI Primitives: shadcn/ui patterns with Base UI vs. Radix UI

While shadcn/ui provides excellent rapid scaffolding for a polished, accessible interface, its default reliance on Radix UI primitives (which was a massive paradigm shift at the time) can sometimes introduce heavier abstraction layers, extensive context providers, and complex `asChild` prop-drilling.

For this project, I maintained the shadcn/ui design patterns and Tailwind integration but opted to back the interactive components with **Base UI** headless primitives instead of Radix.

Base UI offers a significantly leaner DOM footprint and a more straightforward, modern API surface. For a lightweight, public-facing RSVP page where time-to-interactive and client bundle size are critical, Base UI delivers the necessary WAI-ARIA accessibility guarantees without the abstraction tax. This aligns perfectly with the goal of keeping the React 19 client boundaries as thin and fast as possible.

### Deterministic Builds & Dependency Management

Nothing is more frustrating for a reviewer than a "works on my machine" scenario caused by a silent upstream package update over the weekend. To guarantee a 100% reproducible environment, I enforced strict deterministic builds.

All direct dependencies in the package.json are explicitly pinned to exact versions (no carets ^ or tildes ~), and the transitive dependency tree is strictly locked via the committed lockfile. This ensures that the application you run today is mathematically identical to the one I built, eliminating "ghost bugs" from minor package bumps.

To maintain security without sacrificing determinism, in a production environment, this exact-pinning strategy would be paired with automated dependency updates (e.g., Dependabot or Renovate) to catch and patch CVEs through the CI/CD pipeline.

- I used opaque `publicId` values for share links instead of slugs. They are simpler to expose publicly and decouple routing from mutable event titles.
- I kept Better Auth's generated tables as-is and only enforced the stricter snake_case mapping rules on app-owned domain models. That avoided spending the timebox fighting the auth adapter.

## AI Usage

- T3 Code for agents orchestration and code generation.
- OpenAI Codex (GPT-5.4) for implementation support, refactors, validation passes, and deployment remediation.
- Claude Code (Sonnet 4.6) for some UI design iteration.

## Time Spent

Git history suggests approximately `~8h 30m` of tracked work on this project, based on `~35 commits` grouped into `5` work sessions using a `60-minute` session-gap heuristic.

## If This Were Going to Production at 10x Scale, the First Three Things I Would Change

- Replace per-page RSVP aggregation with dedicated summary queries or read models so dashboard and event counts stay cheap as data grows.
- Add rate limiting, abuse controls, and stronger transactional retry strategy around public RSVP capacity hotspots.
- Add end-to-end coverage plus production-grade observability: tracing, structured sinks, alerting, and deployment health checks.
- Add i18n, I would use a robust i18n library like `next-intl` to support multiple languages.

## Seeded Review Data

The seed script creates:

- `Founders Breakfast`: unlimited capacity.
- `Product Demo Night`: open confirmed spots plus existing waitlist entries, so waitlist promotion can be exercised.
- `Rooftop Afterparty`: full confirmed capacity, so new public RSVPs land on the waitlist immediately.

## Notes

- GitHub OAuth remains optional. Email/password is the primary review path, even though the production deployment currently shows the GitHub button because those OAuth keys are configured there.
