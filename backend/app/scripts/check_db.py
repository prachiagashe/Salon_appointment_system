"""Verify the MySQL connection is live.

Usage (from the backend/ directory):
    python -m app.scripts.check_db
    # or
    python app/scripts/check_db.py
"""

import sys
from pathlib import Path

# Allow running as a plain script: python app/scripts/check_db.py
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from sqlalchemy import text

from app.core.config import settings
from app.database import engine


def main() -> int:
    print(f"Connecting to: {settings.DB_USER}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}")
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT VERSION()"))
            version = result.scalar_one()
            conn.execute(text("SELECT 1"))
        print(f"SUCCESS - MySQL is live. Server version: {version}")
        return 0
    except Exception as exc:
        print(f"FAILED - {type(exc).__name__}: {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
