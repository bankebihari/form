#!/usr/bin/env python3
"""Build tracker: shows which chunk of PLAN.md is done.

Usage:
    python scripts/plan.py            # show progress
    python scripts/plan.py done 3     # mark chunk 3 complete
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE = os.path.join(ROOT, "scripts", "plan-state.json")

CHUNKS = [
    (1, "Foundation & design system"),
    (2, "Database layer (Mongoose models + seed)"),
    (3, "Shared UI kit"),
    (4, "Public pages"),
    (5, "Request flow (raise request -> WhatsApp)"),
    (6, "Tracking (status, preview lock, release)"),
    (7, "Leads (request a call / book a demo)"),
    (8, "Admin panel"),
    (9, "SEO & performance"),
    (10, "Hardening & handover"),
]


def load():
    if os.path.exists(STATE):
        with open(STATE, encoding="utf-8") as fh:
            return set(json.load(fh).get("done", []))
    return set()


def save(done):
    with open(STATE, "w", encoding="utf-8") as fh:
        json.dump({"done": sorted(done)}, fh, indent=2)


def show(done):
    total = len(CHUNKS)
    print("\n  DocSeva build plan\n  " + "-" * 44)
    for num, title in CHUNKS:
        mark = "[x]" if num in done else "[ ]"
        print(f"  {mark} Chunk {num:>2}  {title}")
    pct = round(len(done) / total * 100)
    bar = "#" * (pct // 5) + "." * (20 - pct // 5)
    print(f"  {'-' * 44}\n  {bar}  {len(done)}/{total} chunks ({pct}%)\n")


def main():
    done = load()
    if len(sys.argv) > 2 and sys.argv[1] == "done":
        for raw in sys.argv[2:]:
            done.add(int(raw))
        save(done)
    show(done)


if __name__ == "__main__":
    main()
