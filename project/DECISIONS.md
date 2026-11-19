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
