#!/usr/bin/env python3
"""Enforce a verified Firebase access gate on every deployed learning HTML page.

All learning pages are hidden before content can render. Pages already loading the
central /js/guard.js rely on that guard to confirm the verified Firebase UID. Any
other learning page receives /js/learning-auth-gate.js directly. This runs only
against the generated _site tree during Pages deployment.
"""

from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

LEARNING_ROOTS = (
    "wortschatz",
    "fragen-A1",
    "fragen",
    "verben",
    "verben-A1",
    "verben-bereich",
    "irregulaere-verben",
    "perfekt",
    "grammatik",
    "finnisch",
)

CENTRAL_GUARD_MARKERS = (
    "/js/guard.js",
    "/js/learning-auth-gate.js",
)

HIDE_STYLE = (
    '<style id="sp-learning-auth-hide">'
    'html:not([data-sp-learning-auth="ok"]){visibility:hidden!important}'
    '</style>'
)
GATE_SCRIPT = '<script type="module" src="/js/learning-auth-gate.js?v=2"></script>'


def insert_before_head_end(html: str, block: str) -> str:
    if "</head>" in html:
        return html.replace("</head>", block + "\n</head>", 1)
    if "</body>" in html:
        return html.replace("</body>", block + "\n</body>", 1)
    if "</html>" in html:
        return html.replace("</html>", block + "\n</html>", 1)
    return html + "\n" + block + "\n"


def inject(html: str) -> tuple[str, str]:
    has_hide = 'id="sp-learning-auth-hide"' in html
    has_central_guard = any(marker in html for marker in CENTRAL_GUARD_MARKERS)
    has_secure_gate = "/js/learning-auth-gate.js" in html

    blocks: list[str] = []
    if not has_hide:
        blocks.append(HIDE_STYLE)
    # A page that does not load the new central guard must receive the secure
    # Firebase UID gate even when it contains an old inline requireLogin() call.
    if not has_central_guard and not has_secure_gate:
        blocks.append(GATE_SCRIPT)

    if not blocks:
        return html, "already-secure"
    mode = "hide-only" if has_central_guard else "secure-gate"
    return insert_before_head_end(html, "\n".join(blocks)), mode


def main(site_arg: str = "_site") -> int:
    site = Path(site_arg).resolve()
    if not site.exists():
        raise SystemExit(f"Site directory does not exist: {site}")

    # Firebase Functions are server-side source code. The Pages workflow copies
    # the repository into _site first, so remove this directory from the static
    # artifact before anything is uploaded to GitHub Pages.
    server_functions = site / "functions"
    if server_functions.exists():
        shutil.rmtree(server_functions)

    already_secure: list[str] = []
    hide_only: list[str] = []
    gate_injected: list[str] = []
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
            except Exception as exc:
                unreadable.append(f"{rel}: {exc}")
                continue

            updated, mode = inject(html)
            if updated != html:
                path.write_text(updated, encoding="utf-8")
            if mode == "already-secure":
                already_secure.append(rel)
            elif mode == "hide-only":
                hide_only.append(rel)
            else:
                gate_injected.append(rel)

    report = {
        "version": 2,
        "scanned_html": scanned,
        "already_secure": len(already_secure),
        "guard_pages_hidden": len(hide_only),
        "secure_gate_injected": len(gate_injected),
        "unreadable": unreadable,
        "guard_pages_hidden_paths": hide_only,
        "secure_gate_injected_paths": gate_injected,
    }
    report_path = site / "learning-auth-audit.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(
        "Learning secure auth audit:",
        f"scanned={scanned}",
        f"already_secure={len(already_secure)}",
        f"guard_pages_hidden={len(hide_only)}",
        f"secure_gate_injected={len(gate_injected)}",
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
