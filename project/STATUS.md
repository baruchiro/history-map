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

### Settings refinement, 2026-11-18
Settings now open on content controls, with a compact content/display/about switcher. Time modes have visual selected states, boundaries have a labeled switch, and contributor instructions/source detail require secondary reveals. Reopening settings resets disclosure to content, without resetting map or shared URL state. Tested actual controls and rendered pixels at narrow portrait, portrait, desktop and landscape. Physical device and new-user comprehension tests remain outstanding.

### Year ranges alongside single years, 2026-11-19
Event records now support an optional endYear, so an entity with a sourced active span stays visible at every selected year inside its range (nearby-year mode) or from its start year onward (cumulative mode). Point events keep the ±25-year window and their existing IDs and shared links; only the two academy records edited with sourced spans changed identity, and a legacy-ID alias map keeps old shared-link selections resolving to the successor records. Sura 225–1033 is the span stated in its source; Pumbedita 259–1040 uses the founding circa 260 from the Pumbedita Academy entry and the explicit 1040 closure with Hezekiah Gaon's death from the Hezekiah Gaon entry (Jewish Encyclopedia), with the 1046 and circa-1058 complications disclosed in the event text. Compiler, JSON schema, time-semantics module and label/search/timeline plumbing enforce and display the range; regression tests cover span visibility, ID stability and invalid ranges. Fades, growing symbols and per-entity styling are explicitly deferred. This supersedes the earlier "point events, not lifetimes" display note.

### Event orientation and collections, 2026-11-19
Timeline now shows event-position ticks with grouped hit targets, an event chooser for dense intervals, and direct year/event jumps. Visible map events receive short clickable titles with measured collision avoidance and a six-title ceiling. Collection selection is searchable checkboxes with year spans; no fixed two-list limit. Shared views preserve many-list/empty selections and still read legacy pairs. Public catalog still has three reviewed lists;8-list UI behavior is tested using synthetic local/browser-only entries, not eight real published sources.

### Relevant timeline extent, 2026-11-19
Default axis now spans1455–1969for the selected sample lists, not3400BCE–2024. Collection/search changes refit the axis; manual/shared outside years remain exact. This supersedes treating modern-end crowding as unavoidable.

### Source-backed collections, 2026-11-19
Seven catalog lists now include four new collections: 18 Segula entries, 13 Oral Torah entries, and two connected 12-entry kingdoms/Second Temple routes. These are 55 entries with 48 distinct event titles, not a complete archive. The Hebrew collections page records sources, selection bias, approximate point/year representation and chronological disputes. The high-school connection refers only to selected state-sector Second Temple topics. Fresh visits show Segula and Oral Torah at 1488; existing shared views retain their state.

### Sages and philosophers lists, 2026-11-19
Two new reviewed lists for a requested shareable view: sages-and-academies (14 events, Yavne through Rambam in Fustat, anchored to academies and sages with approximate Mesopotamian coordinates flagged as traditional) and great-philosophers (17 events, Confucius to Wittgenstein, anchored to school foundings and publications). Every event cites an opened source (Britannica or Wikipedia); disputed years and reference-point cities are marked in each event. Overlaps with oral-torah-centers (Mishnah ~200/220, Bavli formation 500/550) are intentional cross-references with both anchors disclosed. Collections page updated with the sources and selection bias. Eleven catalog lists total.
### Non-obstructive boundary status, 2026-11-19
The approximate-boundary status is now inside Display settings rather than floating over the map. It remains live for selected territories. The map itself no longer carries this persistent overlay; source caveats remain accessible.

### Concurrent global opening, 2026-11-19
Fresh views compare spaceflight1957–1977(16events) with African independence1956–1977(20events) at1962. The legend explicitly distinguishes simultaneity from causation, without asserting absolute historical independence. Both source scopes and capital/launch-site representation caveats are visible. Nine collections total. Identical factual entries selected from multiple lists are merged only when kind/year/date/title/place/coordinates/source/description match exactly; memberships remain attached. Distinct sources or descriptions are not merged.

### Explicit event-time semantics, 2026-11-19
Fresh views again default to the nearby-year window. A visible timeline control distinguishes the inclusive ±25-year event window from cumulative events up to the selected year. The displayed date span and event-label years make clear that these are point events, not lifetimes or continuous academy activity. Legacy cumulative links retain their mode rather than silently changing their meaning. Regression covers the 1180 Mishneh Torah event being absent at 1922 in nearby-year mode.

### Cached Wikipedia background, 2026-11-19
Optional explicit language/page-ID references can replace independently authored general descriptions. A small same-origin snapshot cache supplies attributed introductory background separately from reviewed event dates/places and caveats. One Hebrew Maimonides sample is included, with revision/retrieval/license metadata and a missing-cache fallback. No visitor Wikimedia request, auto-refresh, bulk migration or lifespan display is added. Source-date disagreements remain qualified rather than silently reconciled.

### Nearby-year only, list legend and creator credit, 2026-11-19
The cumulative time mode is removed at the maintainer's request; the map always shows the ±25-year window, stated as a settings caption. Old mode=all shared links open in nearby-year mode with year, lists, framing and selections preserved. A dynamic legend row decodes every selected list by its actual map color and shape; timeline ticks carry the same per-list colors and shapes. Excess timeline prose removed; a one-line creator credit (baruchiro.com, contact via the site) sits under the timeline. Smoke suites refreshed: data-driven catalog counts, coordinate tap where Sputnik 1 and Soyuz 19 share Baikonur coordinates (co-located pin tap selection is a known limitation, not fixed here), label geometry scoped to the background rect, and the archived floating selection hint assertion replaced with a no-territory-in-URL check.
