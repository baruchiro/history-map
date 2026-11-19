# Wikipedia introductory excerpts, local prototype

A list event may reference a specific Wikipedia page with `wikipedia: {language, pageId}`. A separately authored general description is no longer required when that reference exists. Event title, reviewed year/place/coordinates, source and uncertainty remain independent. Existing authored text remains the fallback, including when a cached excerpt is unavailable.

Language policy: prefer the reviewed Hebrew article for the same subject; when unavailable, retain a clearly labeled English original. Never silently translate or select a same-name article automatically. The prototype uses the Hebrew Maimonides article, page 647251, resolved through the English article language link and explicitly labeled Hebrew. Source conflict is preserved: the Hebrew intro states birth 1138 and death December 13, whereas the English source permits birth 1135/1138 and states death December 12. Our authored note now states the birth dispute and death year only. The verbatim attributed excerpt is not silently edited to reconcile source disagreement. This is not an automatic migration of every list.

## Explicit maintenance refresh

Run `python scripts/snapshot_wikipedia.py lists --out docs/site/wikipedia-intros.json`, review the returned excerpt/source/revision/timestamp/license, then rebuild the catalog with the existing contribution checker into a new output file. This script performs network reads only when explicitly run. Public page loads read only the same-origin snapshot JSON, not Wikimedia. No scheduled refresh, new service or CI behavior is introduced.

The snapshot stores the first nonempty paragraph of the plain-text lead, capped at 1200 characters. MediaWiki may lose paragraph boundaries, so the UI calls it an introductory excerpt. Source page, revision ID observed at retrieval, UTC retrieval time, extraction method and CC BY-SA 4.0 attribution are retained. The cache is not a promise of a permanently current encyclopedia or a historical verification of the event metadata. No images or returned HTML are embedded.

Refresh is fail-closed: missing/disambiguation pages or invalid replies stop the refresh, leaving the prior cache untouched. Missing runtime cache does not prevent the map from loading and leaves the authored event/source visible. A reference-only item still has its reviewed title/source when no cached excerpt is available.

Before publishing this prototype, review language and article identity, the excerpt and license metadata, and the small compiler/schema change. Existing catalog format supports references as optional fields; old lists stay valid. No lifespan model is added.
