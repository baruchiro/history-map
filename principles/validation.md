# Validation and delivery

## Existing executable checks
From the repository root:

```sh
python3 -m unittest discover -s tests -v
node --check docs/app.js
node --test tests/view-state.test.cjs
python3 scripts/check_contributions.py lists
```

Python 3 and Node are sufficient for these checks. No dependency installation, paid runner or external map service is required. Serve `docs/` with a local HTTP server for browser testing. Do not run new contributor scripts before reviewing them.

## Optional browser smoke regression

`scripts/browser_smoke.py` preserves the touch/pan/tap, floating controls, full-viewport, old-link and share-routing checks. It requires Python Playwright and Chrome, separate from the dependency-free core suite. Do not install dependencies without your environment's approval. Set `CHROME_BIN` if Chrome is elsewhere. Run locally with `python3 scripts/browser_smoke.py --out /tmp/history-map-smoke`, or add `--url https://baruchiro.github.io/history-map/` for an authorized live check. Screenshots/results are written only to the selected output directory. Native share is stubbed, not an actual OS sheet test. This script is not wired into contribution CI.

## Visual/interaction acceptance
Test 390×844 and 320×720 portrait, 1280×850 desktop and 844×390 landscape, or document why equivalent coverage is used. Inspect screenshots directly. Exercise actual pointer/touch events for pinch, pan, marker and territory taps; include mouse drag, year entry, drawers and share feedback. Verify no accidental selection after dragging, no horizontal overflow, and usable scrolling outside the map. Browser-emulated touch is useful but does not prove physical iOS/Android behavior.

Shared-view regression must preserve year, lists, mode, borders, search, map extent and public selection. Test BCE, malformed state and portrait map ratios. Do not put private search text in example links. Preserve existing personal-library storage formats if touching the separate prototype.

## Completion
A passing local test is not a deployed feature. For an authorized release, inspect the actual deployed revision and UI, retest key interactions, and report the real URL, revision, test evidence and limitations. Update status, related story support and backlog only to the extent verified. The product query corpus contains acceptance stories, not an executable natural-language test runner.
