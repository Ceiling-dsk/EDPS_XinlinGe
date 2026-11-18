"""Publish daily Work_log counts for the homepage, using only the standard library."""

import argparse
import json
import os
from pathlib import Path
import sqlite3
import sys
from datetime import date, datetime
from tempfile import NamedTemporaryFile
from zoneinfo import ZoneInfo


def database_location():
    if os.environ.get("OKR_DATA_DIR"):
        return Path(os.environ["OKR_DATA_DIR"]) / "okr.db"
    if sys.platform == "darwin":
        return Path.home() / "Library/Application Support/OKRWorkLog/okr.db"
    base = Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local/share"))
    return base / "okr-worklog/okr.db"


def get_counts(database, today):
    # Read from the app's live SQLite snapshot, including committed WAL updates.
    uri = database.expanduser().resolve().as_uri() + "?mode=ro"
    db = sqlite3.connect(uri, uri=True, timeout=5)
    try:
        db.execute("PRAGMA query_only=ON")
        db.execute("BEGIN")
        is_demo = db.execute(
            "SELECT EXISTS(SELECT 1 FROM meta WHERE key='sample_data' AND value='1')"
        ).fetchone()[0]
        if is_demo:
            raise ValueError("This Work_log is marked as containing demo data. No export created.")
        rows = db.execute(
            "SELECT work_date, COUNT(*) FROM entries "
            "WHERE work_date <= ? GROUP BY work_date ORDER BY work_date", (today,)
        )
        counts = {}
        for work_date, count in rows:
            # Only canonical ISO calendar dates and integers can enter the public file.
            if date.fromisoformat(work_date).isoformat() != work_date:
                raise ValueError("Work_log contains an invalid calendar date.")
            counts[work_date] = int(count)
        return counts
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=database_location())
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1]
                        / "assets/activity-data.js")
    args = parser.parse_args()
    today = datetime.now(ZoneInfo("America/Denver")).date().isoformat()
    counts = get_counts(args.database, today)
    payload = json.dumps({"asOf": today, "days": counts}, indent=2, ensure_ascii=True)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile("w", encoding="utf-8", dir=args.output.parent, delete=False) as temp:
        temp.write("window.workLogActivity = " + payload + ";\n")
    os.chmod(temp.name, 0o644)
    os.replace(temp.name, args.output)
    print(f"{sum(counts.values())} entries over {len(counts)} active days, through {today}.")


if __name__ == "__main__":
    try:
        main()
    except (sqlite3.Error, OSError, ValueError) as exc:
        sys.exit(f"Activity export stopped. {exc}")
