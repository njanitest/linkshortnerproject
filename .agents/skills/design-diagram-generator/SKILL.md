---
name: design-diagram-generator
description: Creates design diagrams (flowchart, sequence diagram, ER diagram, class diagram, state diagram, or architecture/component diagram) for a specific task/feature or for the whole project, rendered as Mermaid diagrams. Always use this skill whenever the user asks for a diagram, wants to visualize a flow, architecture, sequence of calls, data model, or system design, or says things like "draw", "diagram", "visualize the flow", "show me the architecture", "sequence diagram for X" — even if they don't name the exact diagram type up front, since the skill asks for it.
---

## What this skill does

Turns a vague "can you diagram this" request into a concrete Mermaid diagram, grounded in the actual code rather than guesswork, and tells the user how to view it.

## Step 1 — Ask exactly three questions

Before writing anything, ask the user these three questions (batch them together, e.g. with `vscode_askQuestions`, rather than asking one at a time):

1. **Scope** — Is this diagram for a particular task/feature (e.g. "the login flow", "creating a short link"), or for the whole project's architecture?
2. **Participants** — Do they want specific participants/actors/components called out (e.g. `User`, `Browser`, `Server Action`, `Neon DB`, `Clerk`), or should you infer the participants yourself from the code? If they want to name them, get the list confirmed before moving on.
3. **Diagram type** — What kind of diagram: flowchart, sequence diagram, ER diagram, class diagram, state diagram, or architecture/component diagram? If they're not sure, briefly describe what each is good for (flowchart = decision/process steps, sequence = who-calls-whom-in-order, ER = data model/tables, class = types & relationships, state = lifecycle of an entity, architecture = how the big pieces connect) and let them pick.

Don't skip ahead on assumptions — these three answers determine everything that follows. If the user already answered one of these in their original request, don't re-ask it, just confirm your understanding briefly.

## Step 2 — Ground the diagram in real code

Before drawing anything, look at the actual code so the diagram reflects reality, not a generic guess:

- **Task/feature scope**: search for the relevant files (e.g. a server action, route handler, dialog component) with `grep_search`/`file_search`/`semantic_search` and read them to understand the real call order, conditions, and data touched.
- **Whole project scope**: look at the top-level structure (`app/`, `data/`, `db/schema.ts`, `proxy.ts`) to understand the major layers — routes, server actions, data access layer, database, auth — and how they connect.

If participants were user-specified, map them onto what you find in the code (e.g. "Server Action" → `app/dashboard/actions.ts`). If inferred, name them after the real modules/files/functions involved so the diagram is traceable back to the code.

## Step 3 — Generate the diagram

Write valid Mermaid syntax matching the chosen type:

| Diagram type | Mermaid syntax |
|---|---|
| Flowchart | `flowchart TD` (or `LR`) |
| Sequence diagram | `sequenceDiagram` |
| ER diagram | `erDiagram` |
| Class diagram | `classDiagram` |
| State diagram | `stateDiagram-v2` |
| Architecture/component | `flowchart TD` with `subgraph` blocks grouping related nodes (e.g. `subgraph Client`, `subgraph Server`, `subgraph Database`) |

Keep it focused: for a task/feature diagram, only include the steps/participants relevant to that task. For a whole-project diagram, favor one node per layer/module rather than every function, or it becomes unreadable.

Show the diagram inline in your reply as a ` ```mermaid ` fenced code block — VS Code's chat view renders these directly. Then also save it to `docs/diagrams/<short-descriptive-name>.md` (create the folder if needed) wrapped in the same fenced block, so it persists in the repo and the user can revisit it later. Use kebab-case names that describe the content, e.g. `docs/diagrams/create-link-flow.md` or `docs/diagrams/project-architecture.md`.

## Step 4 — Tell the user how to view it

Always close out with viewing instructions, since not everyone has Mermaid rendering set up:

- It's already rendered inline in the chat response — no action needed there.
- To view the saved file later: open it in VS Code and use the Markdown preview (`Ctrl+Shift+V` / `Cmd+Shift+V`). If Mermaid blocks don't render in the built-in preview, mention installing the "Markdown Preview Mermaid Support" extension.
- For a quick shareable/editable view outside VS Code, they can paste the diagram code into [mermaid.live](https://mermaid.live).

## Notes

- This is a documentation/communication aid, not application code — never wire generated diagram files into `app/`, `data/`, or `db/`.
- If the request is ambiguous about whether it's a one-off explanation or something worth persisting, default to saving it under `docs/diagrams/` anyway — it's cheap and useful as project documentation.
