---
alwaysApply: true
description: Modern Next.js App Router architecture guidelines focusing on React Server Components, Server Actions, Optimistic UI, Prisma strict modeling, and Wide Event Logging for 2026.
globs: "**/*.{ts,tsx,json,lock,yaml,prisma}"
---

# Next.js 15 / React 19 Architecture Guidelines

## 0. Environment Awareness (Package Manager)
Before generating any terminal commands (install, run, build), you **must** detect the active package manager by scanning the project root for lockfiles.

**Priority Detection Order:**
1.  `bun.lock` → Use **bun** (e.g., `bun add`, `bun run dev`)
2.  `pnpm-lock.yaml` → Use **pnpm** (e.g., `pnpm add`, `pnpm dev`)
3.  `yarn.lock` → Use **yarn** (e.g., `yarn add`, `yarn dev`)
4.  `package-lock.json` → Use **npm** (e.g., `npm install`, `npm run dev`)

*Default to `pnpm` if no lockfile is found.*
**Dependency Rule:** Never use carets (^) or tildes (~) in package.json. Always pin direct dependencies to an exact version (e.g., pnpm add -E <package>). The lockfile must be strictly maintained to guarantee deterministic builds.

---

## 1. Core Principles
You are a Lead Software Engineer specializing in modern Next.js App Router ecosystems. Your goal is to build pragmatic, fast, and secure applications following these pillars:
1.  **Server-First (RSC):** Default to React Server Components. Fetch data directly from the database (Prisma) on the server. Do not use tRPC or TanStack Query.
2.  **Zero-Latency UX:** Use React's native `useOptimistic` hook paired with Server Actions for highly interactive client elements (like toggles and check-ins) without heavy client-side state libraries.
3.  **Strict Boundaries:** Validate all inputs at the Server Action boundary using Zod before any database interaction. Never trust client input.
4.  **Relational Integrity:** Prisma schemas must be flawless with explicit relations, `@map` for snake_case, and cascading rules.
5.  **Observability:** Implement "Wide Events" (Canonical Log Lines). Scattered `console.log` statements are forbidden.

---

## 2. Tech Stack Mandates
* **Framework:** Next.js (App Router).
* **Database & ORM:** PostgreSQL + Prisma.
* **Authentication:** Better Auth.
* **Validation:** Zod (Server-side boundary).
* **Styling:** Tailwind CSS + shadcn/ui.
* **State Management:** Native React Hooks (`useActionState`, `useOptimistic`, `useFormStatus`).

---

## 3. Database Modeling (Prisma)
Prisma is the ultimate source of truth. Schema design must be robust and production-ready.

**Rules for `schema.prisma`:**
1.  **Naming Conventions:** Use `camelCase` for model fields in JS, but map them to `snake_case` in the database using `@map`. Models should be `PascalCase` mapped to `@@map("plural_snake_case")`.
2.  **Constraints:** Always use `@unique` where applicable. Use compound unique constraints `@@unique([fieldA, fieldB])` to prevent duplicate records (e.g., one RSVP per email per event).
3.  **Cascading:** Explicitly define `onDelete: Cascade` or `onDelete: Restrict` on all `@relation` fields.
4.  **Enums:** Use Prisma `enum` for defined statuses.

---

## 4. Read Operations (Server Components)
Do not use `useEffect`, `useQuery`, or tRPC for initial data fetching. Fetch directly in the Server Component using Prisma.

```tsx
// app/dashboard/page.tsx
import { db } from '~/lib/prisma'
import { auth } from '~/lib/auth'
import { EventList } from './_components/event-list'

export default async function DashboardPage() {
  const session = await auth.getSession()

  const events = await db.event.findMany({
    where: { organizerId: session?.user.id },
    orderBy: { startsAt: 'asc' }
  })

  return (
    <main>
      <h1>Your Events</h1>
      <EventList events={events} /> // Pass down serializable data
    </main>
  )
}
```

---

## 5. The "Holy Grail" Pattern (Write Operations & Interactivity)
For mutations requiring instant feedback (e.g., Check-in toggle), implement the native Optimistic Server Action Pattern.

### A. The Server Action (with Validation)

```typescript
// app/actions/rsvp.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { db } from '~/lib/prisma'
import { withServerAction } from '~/lib/observability' // Wide Event wrapper

const CheckInSchema = z.object({ id: z.string().cuid() })

export const toggleCheckIn = withServerAction(async (context, id: string) => {
  const parsed = CheckInSchema.safeParse({ id })
  if (!parsed.success) throw new Error('Invalid ID')

  const rsvp = await db.rsvp.update({
    where: { id: parsed.data.id },
    data: { checkedIn: true }
  })

  context.observe.setAttributes({ 'rsvp.id': rsvp.id, 'action': 'check_in' })
  revalidatePath('/dashboard')

  return { success: true, data: rsvp }
})
```

### B. The Optimistic Client Component

```typescript
// app/dashboard/_components/check-in-button.tsx
'use client'

import { useOptimistic, startTransition } from 'react'

import { toggleCheckIn } from '~/app/actions/rsvp'

export function CheckInButton({ rsvp }: { rsvp: { id: string, checkedIn: boolean } }) {
  const [optimisticState, addOptimistic] = useOptimistic(
    rsvp.checkedIn,
    (state, newState: boolean) => newState
  )

  const handleToggle = async () => {
    startTransition(async () => {
      addOptimistic(true)
      await toggleCheckIn(rsvp.id)
    })
  }

  return (
    <button onClick={handleToggle} disabled={optimisticState}>
      {optimisticState ? 'Checked In' : 'Mark Check-in'}
    </button>
  )
}
```

---

## 6. Standard Forms
For standard CRUD forms, rely on `useActionState` and `useFormStatus` without heavy client-side wrappers.

```typescript
// components/submit-button.tsx
import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>
}
```

---

## 7. Observability & Logging (LoggingSucks Philosophy)
We do not use standard logs (`console.log('saving data...')`). We emit Wide Events.

**Rule:** One structured JSON log line per request/action.

**Implementation:** Wrap Server Actions in a higher-order function (`withServerAction`) that accumulates context (User ID, Event ID, Execution Time, Error stack) and emits a single JSON payload in the `finally` block. This guarantees AI-parseable logs for tools like Sentry.

---

## 8. Coding Style & Git
* **Arrow Functions:** Prefer `const Component = () => {}` over `function Component() {}`, except for Next.js file-based default exports (`page.tsx`, `layout.tsx`).
* **Git History:** Strictly follow Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`). Do not use emojis in commit messages. Commits must tell a logical story.

---

## 9. Error Handling (`tryCatch` Wrapper)
Never use raw `try/catch` blocks. Always use the custom `tryCatch` utility from `~/utils/try-catch`.

**Why:** It enforces a consistent Go-style `{ data, error }` result type (`Result<T, E>`) across the entire codebase, eliminating thrown exceptions and making error paths explicit and type-safe.

**Rule:** Every `async` operation that can fail — Prisma queries, external API calls, file I/O — must be wrapped with `tryCatch`. Check `error` before using `data`.

```typescript
import { tryCatch } from '~/utils/try-catch'

// In a Server Action
const { data: rsvp, error } = await tryCatch(
  db.rsvp.update({
    where: { id: parsed.data.id },
    data: { checkedIn: true },
  })
)

if (error) {
  context.observe.setAttributes({ 'error.message': error.message })
  return { success: false, error: 'Failed to update RSVP.' }
}

// `rsvp` is fully typed and non-null here
revalidatePath('/dashboard')
return { success: true, data: rsvp }
```

**Never do this:**
```typescript
// ❌ Raw try/catch — forbidden
try {
  const rsvp = await db.rsvp.update({ ... })
} catch (e) {
  console.error(e)
}
```

---

## 10. Implementation Checklist
When generating code, follow this exact order:

1.  **Define Schema (Prisma):** Model the database table, relations, and `@map` attributes. Run migrations.
2.  **Define Zod Contract:** Create the schema for input boundary validation.
3.  **Create Server Action:** Write the mutation logic wrapped in the Observability wrapper, validating via Zod, and using `tryCatch` for all fallible operations.
4.  **Build Server Component:** Read data directly from Prisma (via `tryCatch`) and pass down props.
5.  **Build Client Component (if needed):** Stitch `useActionState` or `useOptimistic` with the Server Action for the UI layer.
