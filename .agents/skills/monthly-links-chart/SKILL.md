---
name: monthly-links-chart
description: Generates a bar chart PNG showing how many links were created per month over the last 12 months, by querying the Neon Postgres database directly with the DATABASE_URL from .env. Use this whenever the user asks for link creation trends, monthly link stats, a chart/graph/report of link volume over time, "how many links were created each month", or wants to visualize growth of the URL shortener's `links` table. Also trigger for requests to export this kind of data as an image/PNG.
---

## What this skill does

Runs a bundled Python script (`scripts/plot_monthly_links.py`) that:

1. Reads `DATABASE_URL` from the project's `.env` file (never hardcode or print the connection string).
2. Connects directly to the Neon Postgres database and counts rows in the `links` table (see [db/schema.ts](../../../db/schema.ts)) grouped by calendar month, for the 12 full months up to and including the current month.
3. Fills in any month with zero links created so the chart always has exactly 12 bars, even if some months had no activity.
4. Plots a bar chart with matplotlib — x-axis is the month label (e.g. `Sep 2025`), y-axis is the count of links created that month — and saves it as a PNG.

This is a one-shot reporting script, not application code. It talks to the database directly rather than through Drizzle/the app's server actions, so it must never be wired into `app/` or `data/` — it's a standalone analytics tool run on demand.

## Running it

From the repository root:

```powershell
pip install -r .agents/skills/monthly-links-chart/scripts/requirements.txt
python .agents/skills/monthly-links-chart/scripts/plot_monthly_links.py
```

By default the script looks for `.env` in the repository root and writes the chart to `links-per-month.png` in the current working directory. Both can be overridden:

```powershell
python .agents/skills/monthly-links-chart/scripts/plot_monthly_links.py --env-file path\to\.env --output path\to\chart.png
```

If `python`/`pip` aren't on PATH on the user's machine (this happened during development on this Windows box), try the `py` launcher instead (`py -m pip install ...`, `py scripts\plot_monthly_links.py ...`), and if neither works, tell the user Python needs to be installed before this skill can run.

## Notes for whoever runs this

- The script requires network access to the Neon database and a valid `DATABASE_URL` — if the connection fails, surface the real error rather than swallowing it.
- Months are calculated relative to *today*, not the newest row in the table, so a chart run today always ends with the current month.
- Counts are global across all users, since this is an operational/analytics report, not a per-user dashboard view. If the user asks for a per-user breakdown instead, that's a different request — ask before assuming.
- After running, confirm the output PNG path back to the user and, if you have image-viewing capability, show it to them.
