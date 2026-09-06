"""
Plot a bar chart of how many links were created per month over the last 12 months.

Reads DATABASE_URL from the project's .env file (or the environment), queries the
`links` table in the Neon Postgres database directly, and saves a PNG bar chart.

Usage:
    python plot_monthly_links.py [--env-file PATH] [--output PATH] [--db-url URL]
"""

from __future__ import annotations

import argparse
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import matplotlib

matplotlib.use("Agg")  # no display available when run from a terminal/agent
import matplotlib.pyplot as plt
import psycopg2
from dotenv import load_dotenv


def find_default_env_file(start: Path) -> Path | None:
    """Walk up from `start` looking for a .env file, since this script lives
    several directories deep inside .agents/skills/."""
    current = start.resolve()
    for candidate in [current, *current.parents]:
        env_path = candidate / ".env"
        if env_path.is_file():
            return env_path
    return None


def month_start(dt: datetime) -> datetime:
    return dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


def add_months(dt: datetime, delta: int) -> datetime:
    month_index = dt.month - 1 + delta
    year = dt.year + month_index // 12
    month = month_index % 12 + 1
    return dt.replace(year=year, month=month)


def last_12_months(reference: datetime) -> list[datetime]:
    """Return the 12 month-start datetimes ending with the current month, oldest first."""
    current_month = month_start(reference)
    earliest_month = add_months(current_month, -11)
    return [add_months(earliest_month, i) for i in range(12)]


def ensure_sslmode(db_url: str) -> str:
    """Neon requires SSL; add sslmode=require if the connection string doesn't already specify one."""
    if "sslmode=" in db_url:
        return db_url
    separator = "&" if "?" in db_url else "?"
    return f"{db_url}{separator}sslmode=require"


def fetch_monthly_counts(db_url: str, since: datetime) -> dict[tuple[int, int], int]:
    query = """
        SELECT date_trunc('month', created_at AT TIME ZONE 'UTC') AS month, COUNT(*) AS link_count
        FROM links
        WHERE created_at >= %s
        GROUP BY month
        ORDER BY month;
    """
    with psycopg2.connect(db_url) as conn, conn.cursor() as cur:
        cur.execute(query, (since,))
        rows = cur.fetchall()

    return {(month.year, month.month): count for month, count in rows}


def build_chart(months: list[datetime], counts: dict[tuple[int, int], int], output_path: Path) -> None:
    labels = [dt.strftime("%b %Y") for dt in months]
    values = [counts.get((dt.year, dt.month), 0) for dt in months]

    fig, ax = plt.subplots(figsize=(12, 6))
    ax.bar(labels, values, color="#2563eb")
    ax.set_xlabel("Month")
    ax.set_ylabel("Links created")
    ax.set_title("Links Created Per Month (Last 12 Months)")
    ax.tick_params(axis="x", rotation=45)
    for i, value in enumerate(values):
        ax.text(i, value, str(value), ha="center", va="bottom")
    fig.tight_layout()
    fig.savefig(output_path, dpi=150)
    plt.close(fig)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--env-file",
        type=Path,
        default=None,
        help="Path to the .env file containing DATABASE_URL (default: searched upward from this script)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("links-per-month.png"),
        help="Where to save the chart PNG (default: ./links-per-month.png)",
    )
    parser.add_argument(
        "--db-url",
        default=None,
        help="Postgres connection string; overrides DATABASE_URL from the environment/.env file",
    )
    args = parser.parse_args()

    env_file = args.env_file or find_default_env_file(Path(__file__).parent)
    if env_file is not None:
        load_dotenv(dotenv_path=env_file)

    db_url = args.db_url or os.environ.get("DATABASE_URL")
    if not db_url:
        print(
            "DATABASE_URL is not set. Pass --db-url, or make sure it's defined in the .env file "
            f"(looked for one at: {env_file if env_file else 'no .env file found'}).",
            file=sys.stderr,
        )
        return 1

    now = datetime.now(timezone.utc)
    months = last_12_months(now)
    since = months[0]

    counts = fetch_monthly_counts(ensure_sslmode(db_url), since)
    build_chart(months, counts, args.output)

    total = sum(counts.get((dt.year, dt.month), 0) for dt in months)
    print(f"Saved chart with {total} total links across the last 12 months to {args.output.resolve()}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
