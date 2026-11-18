# Project status

Updated 18 November 2026. This is a concise project handoff, not a conversation archive.

## Working today
- Public static map: https://baruchiro.github.io/history-map/
- Reviewed public JSON catalog, selectable event lists, year timeline, event details/source links and approximate year-based historical boundaries.
- Full-viewport map with floating accessible icon controls; touch pinch/pan; hidden advanced panels; direct year entry and exact shared-view URL state. Native-share API routing with explicit copy fallback. No forced landscape.
- Data-only list contribution contract, compiler, validation workflow and manual maintainer review/catalog publication.
- Thirty Python regression tests and six JavaScript URL-state tests at the mobile simplification milestone.

## Not delivered
No general natural-language query engine, server, MCP endpoint, authenticated shared editing, in-chat widget integration, analytics, customer interviews or validated business model. The original personal-library prototype is separate; public site changes do not import or publish personal data.

## Next entrypoints
- [Decisions](DECISIONS.md): settled direction and what remains exploratory.
- [Backlog](BACKLOG.md): bounded next work and acceptance gates.
- [Stories](../stories/README.md): cumulative natural-language product requests, including unsupported hypotheses.
- [Principles](../principles/product.md) and [AGENTS.md](../AGENTS.md): project working agreements.

The mobile milestone was browser-tested on the deployed site using emulated touch at four viewport sizes, with no JavaScript page errors. This is not yet physical-device testing, a real OS share-sheet test or evidence that new users understand the UI. Native-share data forwarding/cancel/failure are tested with browser API stubs.
