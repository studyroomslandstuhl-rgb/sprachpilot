#!/usr/bin/env python3
"""Inject a lightweight login gate into every deployed learning HTML page.

The source lessons may use different historical guard/progress systems. This script
adds authentication only where no existing login guard is present. It runs against
`_site` during GitHub Pages deployment, so one forgotten HTML file cannot become a
public task merely because its source omitted `/js/guard.js`.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

LEARNING_ROOTS = (
    "wortschatz",
    "fragen-A1",
    "fragen",
    "verben",
    "verben-A1",
    "verben-bereich",
    "perfekt",
    "grammatik",
    "finnisch",
)

# Any of these means the page already performs (or imports) the central auth check.
AUTH_MARKERS = (
    "/js/learning-auth-gate.js",
    "/js/guard.js",
    "/js/guard-v10.js",
    "requireLogin(",
)

GATE_TAG = '<script type="module" src="/js/learning-auth-gate.js?v=1"></script>'


def inject(html: str) -> tuple[str, bool]:
    if any(marker in html for marker in AUTH_MARKERS):
        return html, False
    if "</body>" in html:
        return html.replace("</body>", GATE_TAG + "\n</body>", 1), True
    if "</html>" in html:
        return html.replace("</html>", GATE_TAG + "\n</html>", 1), True
    return html + "\n" + GATE_TAG + "\n", True


def main(site_arg: str = "_site") -> int:
    site = Path(site_arg).resolve()
    if not site.exists():
        raise SystemExit(f"Site directory does not exist: {site}")

    protected_existing: list[str] = []
    injected: list[str] = []
    unreadable: list[str] = []
    scanned = 0

    for root_name in LEARNING_ROOTS:
        root = site / root_name
        if not root.exists():
            continue
        for path in sorted(root.rglob("*.html")):
            scanned += 1
            rel = path.relative_to(site).as_posix()
            try:
                html = path.read_text(encoding="utf-8")
            except Exception as exc:  # deployment audit must make failures visible
                unreadable.append(f"{rel}: {exc}")
                continue

            updated, changed = inject(html)
            if changed:
                path.write_text(updated, encoding="utf-8")
                injected.append(rel)
            else:
                protected_existing.append(rel)

    report = {
        "version": 1,
        "scanned_html": scanned,
        "already_protected": len(protected_existing),
        "gate_injected": len(injected),
        "unreadable": unreadable,
        "injected_paths": injected,
    }
    report_path = site / "learning-auth-audit.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(
        "Learning auth audit:",
        f"scanned={scanned}",
        f"already_protected={len(protected_existing)}",
        f"injected={len(injected)}",
        f"unreadable={len(unreadable)}",
    )

    if unreadable:
        print("ERROR: Some learning HTML files could not be audited:")
        for item in unreadable:
            print(" -", item)
        return 2

    if scanned == 0:
        print("ERROR: No learning HTML files were found; refusing a silently unprotected deploy.")
        return 3

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1] if len(sys.argv) > 1 else "_site"))
