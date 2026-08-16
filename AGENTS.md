
# Agent Instructions — Link Shortener Project

This is a URL shortener built with the Next.js App Router, Clerk auth, Neon Postgres via Drizzle ORM, and Tailwind v4 + shadcn/base-ui components.

## Quick non-negotiables

1. **Never use `middleware.ts`** — it is deprecated in the version of Next.js used by this project. Always use `proxy.ts` instead.
2. `params`/`searchParams` are Promises — always `await` them.
3. Every Server Action / Route Handler / DAL function touching user data re-checks `auth()` and resource ownership server-side, regardless of proxy-level protection.
4. Never build SQL by string concatenation — use Drizzle's query builder.
5. Keep `"use client"` scoped to the smallest interactive component.
6. Don't enable or rely on `cacheComponents`/`'use cache'`/`cacheLife`/`cacheTag` unless a task explicitly turns on `cacheComponents` in `next.config.ts` first.
7. Don't adopt experimental/`unstable_*` APIs (e.g. `unstable_instant`) speculatively — see the vendored-docs note above.
8. Run `npm run lint` before considering a change complete.
