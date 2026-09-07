# Project Architecture — Flowchart

Grounded in the actual code layout: `proxy.ts`, `app/dashboard`, `app/l/[shortCode]`, `data/links.ts`, `db/schema.ts`.

```mermaid
flowchart TD
    subgraph Client["Client (Browser)"]
        Dashboard["app/dashboard/page.tsx<br/>+ create/edit/delete dialogs"]
        Redirector["/l/&lt;shortCode&gt; link click"]
    end

    subgraph Edge["Edge — proxy.ts"]
        Proxy["clerkMiddleware<br/>protects /dashboard(.*)"]
    end

    subgraph Server["Server (Next.js App Router)"]
        Actions["app/dashboard/actions.ts<br/>createLinkAction / updateLinkAction / deleteLinkAction<br/>(zod validation + auth() check)"]
        Route["app/l/[shortCode]/route.ts<br/>GET handler → 302 redirect"]
    end

    subgraph DataLayer["Data Access Layer"]
        DAL["data/links.ts<br/>getLinksForCurrentUser / getLinkByShortCode /<br/>createLinkForCurrentUser / updateLinkForCurrentUser /<br/>deleteLinkForCurrentUser"]
    end

    subgraph External["External Services"]
        Clerk["Clerk\nauth()"]
        DB["Neon Postgres\ndb/schema.ts (links table)\nvia Drizzle ORM"]
    end

    Dashboard -- "server action call" --> Actions
    Redirector -- "GET /l/:shortCode" --> Proxy
    Proxy -- "not matched (public route)" --> Route
    Dashboard -- "page request" --> Proxy
    Proxy -- "auth.protect()" --> Clerk
    Proxy -- "authorized" --> Actions

    Actions -- "auth()" --> Clerk
    Actions --> DAL
    Route --> DAL
    DAL -- "Drizzle query builder" --> DB

    Actions -- "revalidatePath('/dashboard')" --> Dashboard
    Route -- "302 redirect to target URL" --> Redirector
```

## Layers

- **Client** — `app/dashboard/page.tsx` renders the user's links and hosts the create/edit/delete dialogs; a short link visit hits `/l/[shortCode]`.
- **Edge (`proxy.ts`)** — `clerkMiddleware` protects `/dashboard(.*)`; the public redirect route bypasses it.
- **Server** — `app/dashboard/actions.ts` are Server Actions that validate input with `zod`, re-check `auth()`, then call the data layer; `app/l/[shortCode]/route.ts` is a Route Handler that looks up the short code and issues a redirect.
- **Data Access Layer** — `data/links.ts` centralizes all Drizzle queries and always scopes user data by `userId`.
- **External services** — Clerk for authentication, Neon Postgres (via Drizzle) for the `links` table.
