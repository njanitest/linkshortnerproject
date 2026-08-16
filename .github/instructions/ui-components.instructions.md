---
description: Read this file before implementing or modifying UI components in the project.
---

# UI Components

## Rules

1. All UI elements in this app use **shadcn/ui**. Never hand-roll a custom component (button, input, dialog, card, dropdown, etc.) when a shadcn equivalent exists.
2. Add new primitives via the shadcn CLI (e.g. `npx shadcn@latest add <component>`) so they land in `components/ui/` with the project's configured style, rather than writing them by hand.
3. Only build custom components to compose or arrange existing shadcn primitives (e.g. feature-specific layouts). The underlying interactive elements must still be shadcn components.
4. Do not bypass shadcn by installing a different component library or writing raw unstyled HTML for interactive elements (buttons, forms, modals, menus, etc.).
5. Keep generated shadcn components in `components/ui/` unmodified beyond what the CLI produces, aside from project-specific styling already established in [app/globals.css](../app/globals.css).

## Notes

- Project config: [components.json](../components.json) — style `base-nova`, base color `neutral`, icons via `lucide`.
- Aliases: `@/components`, `@/components/ui`, `@/lib`, `@/hooks` (see `components.json`).
