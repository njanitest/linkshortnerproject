---
description: Read this file to understand how to fetch data in the project.
---
# Data Fetching Instructions
This project uses best practices and guidelines for fetching data in our Next.js application. Adhering to these instructions will ensure consistency, maintainability, and performance across the codebase.

## 1. Use Server Components for Data Fetching
In Next.js, ALWAYS use Server Components to fetch data. NEVER use Client components to fetch data.

## 2. Data Fetching Methods
ALWAYS use helper functions in the `/data` directory to fetch data. NEVER fetch data directly in a component or page.

ALL helper functions in the `/data` directory should use drizzle ORM for database interactions.