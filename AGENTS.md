
# Agent Instructions — Link Shortener Project

This is a URL shortener built with the Next.js App Router, Clerk auth, Neon Postgres via Drizzle ORM, and Tailwind v4 + shadcn/base-ui components.

For detailed guidelines on specific topics, refer the modular documentation in the [docs/](docs/) directory.

> **MANDATORY — read before writing any code:** It is critically important that you ALWAYS read the relevant individual instructions file(s) below in FULL, BEFORE generating or modifying any code in that area — not after, not in parallel, not from memory of a prior read in this conversation. If a task touches more than one area (e.g. an auth-gated page with UI), read every applicable doc first. If you are unsure whether a doc applies, read it anyway before proceeding. Never guess at, assume, or reconstruct a rule from these docs — treat un-read docs as unknown territory that must be checked first. Skipping this step is not acceptable under any circumstance.

- [docs/authentication.md](docs/authentication.md) — Clerk auth rules, protected routes, and modal sign-in/sign-up.
- [docs/ui-components.md](docs/ui-components.md) — shadcn/ui usage rules; no custom UI primitives.

## Quick non-negotiables

1. Use `proxy.ts`, never `middleware.ts`.
2. `params`/`searchParams` are Promises — always `await` them.
3. Every Server Action / Route Handler / DAL function touching user data re-checks `auth()` and resource ownership server-side, regardless of proxy-level protection.
4. Never build SQL by string concatenation — use Drizzle's query builder.
5. Keep `"use client"` scoped to the smallest interactive component.
6. Don't enable or rely on `cacheComponents`/`'use cache'`/`cacheLife`/`cacheTag` unless a task explicitly turns on `cacheComponents` in `next.config.ts` first.
7. Don't adopt experimental/`unstable_*` APIs (e.g. `unstable_instant`) speculatively — see the vendored-docs note above.
8. Run `npm run lint` before considering a change complete.
