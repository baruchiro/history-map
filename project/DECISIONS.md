# Decision log

Keep accepted decisions separate from research and implementation details. New entries state date, status, reason, consequence and what they supersede. Do not add raw private conversations as evidence.

| ID | Date | Status | Decision and consequence |
|---|---|---|---|
| D01 | 2026-11-18 | Accepted | Static frontend reads a reviewed GitHub JSON catalog. Keep research/list contributions data-only; maintainers review facts/rights and explicitly publish the generated catalog. No backend required for this stage. |
| D02 | 2026-11-18 | Accepted | Public map stays separate from personal libraries and the original prototype. Do not publish or overwrite private lists. |
| D03 | 2026-11-18 | Accepted | Map-first mobile simplicity takes priority over adding visible features. Hide advanced controls, support actual pan/pinch and preserve exact shared views. Supersedes a dense first-screen control layout and prominent ambiguous Persia preset. |
| D04 | 2026-11-18 | Accepted | Preserve modular project knowledge: short AGENTS entrypoint, principles folder, status/decisions/backlog and query corpus. No raw conversation archive in the public repository. |
| D05 | 2026-11-18 | Direction, unvalidated | Explore commercial value through a concrete problem, potential payer and small demand test. No proven customer, market or business model is claimed. |
| D06 | 2026-11-18 | Exploration | Let a person's own assistant choose a useful map/comparison/timeline and potentially show an interactive view in chat. Investigate MCP Apps and host support before architecture commitment. No server or connector is authorized by this entry. |
| D07 | 2026-11-18 | Accepted process | Accumulate natural-language product query stories over time, preserving provenance and supported/planned distinctions. Hypotheses are not observed demand and stories are not automatically executable tests. |

| D08 | 2026-11-18 | Accepted | Full-viewport map with floating icon controls supersedes the first map-first framed layout. Native share where supported, explicit copy fallback, background-only title toggle and accessible icon labels. Preserve map gestures and exact links. |

## 2026-11-18: Settings are a control surface
Maintainer feedback: the full-viewport direction works, but settings still contain too much text. Content/display/about now split everyday controls from documentation. Time modes use selected visual choices; the boundary layer uses a labeled switch. Contributor prompts and long methods remain discoverable through secondary reveals, not the explorer's default route. No new data access or product feature is implied.

## 2026-11-19: Event cues and searchable collections
Maintainer asked for event-position marks instead of blind scrubbing, short event labels without overcrowding, and a searchable checkbox collection instead of two fixed lists. Timeline marks use selected-list/search results across the full scale, independent of the current25-year window. Closely packed hit areas group into an event chooser. Picking a cue jumps to that event/year, panning only if needed. Map labels prioritize the active event, try collision-free positions and omit excess titles; markers and full accessible event details remain.
Collection rows show name and min/max event years. Search matches list names or contained event titles/places/years. Selection is unlimited by UI count, not a promise of tested infinite catalog performance. Shared-state v1 adds optional catalog-validated lists; old a/b pairs remain readable. Explicit empty selection survives reload. No private-library loading or upload is introduced.

## 2026-11-19: Relevant timeline extent
Maintainer rejected the empty millennia default. Timeline bounds now derive from selected/search-matching events. Changing collections/search brings an out-of-range current year to the nearest event endpoint. Explicit exact-year entry and shared links preserve their year and extend the axis to include it, so BCE exploration and old links are not silently clamped. Single-year sets receive one year of padding either side within supported bounds; empty sets disable the slider around the retained year. Year zero is skipped while scrubbing. No nonlinear scale or new range controls.

## 2026-11-26: Nearby-year window follows the timeline span
Maintainer feedback on the 1933-1945 WWII list (screen recording): on a short timeline, point events from other years clutter the map and hide the year-by-year progression. The nearby-year window now scales with the visible timeline span: min(25, round(span/50)) years on each side. A 12-year list shows a point event only in its own year; timelines beyond roughly 1250 years keep the original ±25-year context unchanged. Span records (endYear) are unchanged. Supersedes the fixed ±25-year window in the 2026-11-19 nearby-year entry; the single nearby-year mode itself is unchanged.

## 2026-11-26: Timeline year scale follows available width
Maintainer feedback (same recording): while scrubbing, the selected year is readable only in the year chip above the map, and the axis shows just its two ends. The timeline now renders intermediate year labels whose density follows the rendered width (1/2/5-style steps, end labels kept, year zero skipped), so the current year is readable on the axis itself on wide screens and the axis stays minimal on narrow ones. The labels are decorative; the slider keeps its accessible value text.

## 2026-11-26: Timeline ticks keep their shape and stop hiding each other
Maintainer feedback (same recording): the rail's markers hide one another, and the second list's square marker is indistinguishable from a circle at pill size. Rail ticks are now true shapes (7px circle vs 7px square) matching the map pins and legend, a second stacked lane keeps same-year or touching marks visible instead of dropping them (the cluster count badge still conveys the rest), and the count badges sit above the tick lanes instead of covering them. Tick horizontal positions still encode exact years; hit-area clustering is unchanged. The rail grows 8px and the strip-anchored overlays rise with it.

## 2026-11-19: Single nearby-year window, visible list legend, creator credit
Maintainer removed the cumulative "all events up to the year" mode: the map always shows the inclusive ±25-year window, and the settings drawer only states it. Legacy mode=all links now open in nearby-year mode, superseding the earlier "legacy cumulative links retain their mode" note; year, lists, framing and selections in those links are unchanged. A timeline legend names each selected list with the same color and shape as its map markers (first selected list circles, second squares, as before) at a readable size, and timeline ticks use the same per-list colors and shapes instead of two fixed colors. The hardcoded two-list comparison note and the timeline's explanatory prose are removed. A one-line creator credit links to the maintainer's own site (baruchiro.com) for contact.
