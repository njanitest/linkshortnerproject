---
description: Read this file before implementing or modifying server actions or any data mutation logic in the project.
---
# Server Actions Instructions

This project uses Server Actions for ALL data mutations. Adhering to these instructions will ensure consistency, security, and maintainability across the codebase.

## 1. Data Mutation
ALL data mutation in this app MUST be done via Server Actions. NEVER mutate data directly from a Client Component or Route Handler.

## 2. File Location & Naming
Server Actions MUST be called from Client Components. Server Action files MUST be named `actions.ts` and colocated in the same directory as the component that calls them.

## 3. Typed Arguments
ALL data passed to Server Actions MUST have explicit TypeScript types. NEVER type Server Action arguments as `FormData`.

## 4. Validation
ALL data received by a Server Action MUST be validated using `zod` before use.

## 5. Authentication
ALL Server Actions MUST check for a logged-in user via `auth()` before performing any database operation, and MUST stop execution if the user is not authenticated.

## 6. Database Access
Server Actions must NEVER use Drizzle queries directly. ALL database operations MUST go through helper functions in the `/data` directory that wrap Drizzle queries.

## 7. Error Handling
Server Actions must NEVER throw errors. ALL Server Actions MUST catch errors internally and return a plain object with a `success` or `error` property (e.g. `{ success: true, data }` or `{ error: "message" }`) so the calling Client Component can handle it.
