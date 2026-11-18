# Historical map and event-list contributions

Live map: https://baruchiro.github.io/history-map/

Historical map and reviewed list contributions, 18 November 2026. Static frontend in docs/; data-only source lists in lists/.

## Product direction

Agents research lists and submit data-only GitHub pull requests. Structural checks run automatically. A maintainer reviews historical claims, dates, coordinates, licensing and suspicious content before merging. Approved source files can then build a frontend catalog. A backend or MCP interface is exploratory, not the next required architecture. Any future service needs authentication, authorization and review states.

The live site is a static catalog reader. It is not a shared map editor or a backend service.

## Run locally

Python 3 only, no package installation:

```sh
python3 -m unittest discover -s tests -v
python3 scripts/check_contributions.py lists --out catalog.json
python3 scripts/event_lists.py compile lists/spaceflight-launches-sample.json --out local-map-bundle.json
python3 scripts/event_lists.py validate local-map-bundle.json
```

Outputs are created exclusively. Existing files are never silently overwritten.

## Included

- `lists/*.json`: one source list per file, ready for data-only contributions.
- `schema/event-list-v1.schema.json`: versioned contribution contract for agents and future API clients.
- `scripts/event_lists.py`: strict compiler to the existing map's collections/items contract.
- `scripts/check_contributions.py`: file, size, duplicate and shape checks plus a generated catalog.
- `.github/workflows/validate-lists.yml`: read-only PR check using the base revision's validator, not proposed scripts.
- `tests/`: compiler and contribution regression tests.
- `SKILL.md`: contributor-agent research guidance.
- `CONTRIBUTING.md`: submission and human review requirements.
- `docs/architecture.md`: frontend adapter, review and future MCP plan.

The generated catalog has `schemaVersion: 1` and a list of entries containing `key`, `title`, `kind`, and `library`. Each `library` is a compiled map-compatible bundle. The catalog itself is NOT a current map import file. The standalone frontend in docs/ reads that generated catalog. It contains no private-library data and does not change the existing private map.

## Important limits

Validation is structural, not factual or a security certification. It does not fetch or authenticate source URLs. The agent and reviewer must inspect sources and provenance. The included Apollo example reuses one event from the map's existing sourced dataset; it is not a newly researched list.

Each compiled list stays within the prototype's current 14,500-byte personal library budget. The repository catalog may contain up to 200 list files; that is not a claim that all files can fit together in the current personal library. The present local-import UI allows imports only into an empty library. It must not be used to overwrite existing work.

The trusted scripts and workflow are published on the default branch. Contribution CI passed its first real data-only smoke-test PR, including the 27 regression tests and catalog validation. Configure review rules before accepting outside contributions. Choose required checks and required content/code reviews separately. A PR can edit a pull_request workflow; code ownership and branch/ruleset review are required, not supplied by YAML. Keep fork permissions restricted, secrets absent and runners GitHub-hosted. Use standard GitHub-hosted runners for the public repository. No paid runners or services are part of this project.

This project has no backend or MCP listener. The existing hosted private map remains separate.

Sources inspected:
- https://github.com/baruchiro/skills
- https://www.baruchiro.com/blog/ideas/historical-map-timeline
- https://docs.github.com/en/actions/reference/security/secure-use
- https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target
- https://github.com/actions/checkout/releases

## Static site

GitHub Pages serves docs/. After approved list changes, rebuild the tracked catalog with `python3 scripts/check_contributions.py lists --out /tmp/catalog-new.json` and copy that reviewed output to docs/site/catalog.json. Catalog rebuild/publish is deliberately a maintainer step, not automatic acceptance of unreviewed data. Run a local HTTP server at docs/ to preview the frontend. No package install or external map service is used.

## Historical territories

An optional year-driven Cliopatria layer covers 3400 BCE to 2024 CE. Boundaries are approximate reconstructions with source date intervals, not annual interpolation. Choose a year directly; no historical-empire preset is presented as an extent claim. See [provenance, limits and reproduction](docs/borders.md). Event lists remain independent of territory data.

## Sharing a view and contributing

The view URL fragment preserves the year, selected lists, range/cumulative mode, historical-territory visibility, map extent, search and selected public item. It contains no personal-library data. Search text is part of the shared link; review it before sharing. Invalid or unknown URL parameters are ignored. The site includes a copyable contribution prompt and links to the contributor skill, schema and sample. Contributions remain subject to review and maintainer catalog publication.

URL-state checks: `node --test tests/view-state.test.cjs`

## Project handoff and parallel agents

Start with [AGENTS.md](AGENTS.md), the [principles folder](principles/), [project status](project/STATUS.md), [decisions](project/DECISIONS.md) and [backlog](project/BACKLOG.md). These are project-only conclusions, not raw conversations. The [natural-language query corpus](stories/README.md) separates maintainer direction, hypotheses, actual UI support and future acceptance stories. The commercial direction and conversational/inline view are experiments, not a validated business or deployed MCP service.
