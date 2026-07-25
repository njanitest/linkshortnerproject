# Authentication

## Rules

1. Clerk is the **only** authentication method in this app. Never introduce another auth library, custom session/cookie handling, or a competing auth provider.
2. `/dashboard` is a protected route — users must be signed in to access it. Enforce this both:
   - In `proxy.ts` via `clerkMiddleware`'s route protection (e.g. `auth.protect()` for matched dashboard routes).
   - Server-side in the page/layout and in any Server Action / Route Handler / DAL function under `/dashboard` by re-checking `auth()` (per root `AGENTS.md` non-negotiable #3).
3. If a signed-in user visits the home page (`/`), redirect them to `/dashboard`. Check auth state server-side (e.g. `auth()` in the page/layout) and use `redirect()` from `next/navigation`.
4. Sign in and sign up must always open as **modals**, never as full dedicated pages. Use Clerk's modal components/props (e.g. `<SignInButton mode="modal">`, `<SignUpButton mode="modal">`) rather than navigating to `/sign-in` or `/sign-up` routes.

## Notes

- Auth/session logic (`clerkMiddleware`) lives in `proxy.ts`, not `middleware.ts`.
- `ClerkProvider` wraps the app in [app/layout.tsx](../app/layout.tsx).
