# History map list analytics (Cloudflare Worker + D1)

Counts which lists are opened. Standalone folder: it can move to its own repo or sit next to another Worker (for example a podcast relay) without touching the site.

- `POST /list-view` with `{"list":"<catalog key>"}` adds 1 to a counter for today (UTC).
- Stored in D1 table `list_views(day, list, count)`. Nothing else: no IP, user agent, cookie, identifier or time of day.
- Only keys in `allowed-lists.json` are accepted. It is generated from `docs/site/catalog.json` by `python3 scripts/sync_allowed_lists.py`; a test and the deploy job fail when it is out of date.
- Only requests from `https://history.baruchiro.com` (and the GitHub Pages address) are accepted.
- The site sends the key only on explicit list selection, once per list per page load, and never from browsers marked as excluded, with Do Not Track, or automation.
- Address: `https://history-map-analytics.baruchiro.workers.dev`.
- Deploy: GitHub Actions on merge to master (`.github/workflows/deploy-analytics-worker.yml`), secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (the Account ID is not secret). No token in code.
- Read the counts: `npx wrangler d1 execute history-map-analytics --remote --command "SELECT list, SUM(count) c FROM list_views GROUP BY list ORDER BY c DESC"`.
