# Repository-first event-list pipeline

Historical map and reviewed list contributions, 18 November 2026. Static frontend in docs/; data-only source lists in lists/.

## Product direction

Agents research lists and submit data-only GitHub pull requests. Structural checks run automatically. A maintainer reviews historical claims, dates, coordinates, licensing and suspicious content before merging. Approved source files can then build a frontend catalog. A future backend/MCP uses the same list contract but adds authentication, authorization and review states.

This is not a manually maintained map editor and is not yet a running shared service.

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
- `.github/workflows/validate-lists.yml`: draft read-only PR check using the base revision's validator, not proposed scripts.
- `tests/`: compiler and contribution regression tests.
- `SKILL.md`: contributor-agent research guidance.
- `CONTRIBUTING.md`: submission and human review requirements.
- `docs/architecture.md`: frontend adapter, review and future MCP plan.

The generated catalog has `schemaVersion: 1` and a list of entries containing `key`, `title`, `kind`, and `library`. Each `library` is a compiled map-compatible bundle. The catalog itself is NOT a current map import file. The standalone frontend in docs/ reads that generated catalog. It contains no private-library data and does not change the existing private map.

## Important limits

Validation is structural, not factual or a security certification. It does not fetch or authenticate source URLs. The agent and reviewer must inspect sources and provenance. The included Apollo example reuses one event from the map's existing sourced dataset; it is not a newly researched list.

Each compiled list stays within the prototype's current 14,500-byte personal library budget. The repository catalog may contain up to 200 list files; that is not a claim that all files can fit together in the current personal library. The present local-import UI allows imports only into an empty library. It must not be used to overwrite existing work.

The workflow has not run on GitHub. Bootstrap trusted scripts and review rules on the chosen base branch before enabling contributions. Choose required checks and required content/code reviews separately. A PR can edit a pull_request workflow; code ownership and branch/ruleset review are required, not supplied by YAML. Keep fork permissions restricted, secrets absent and runners GitHub-hosted. CI minutes may be billable depending on repository/account settings; this scaffold has not enabled or spent them.

This project has no backend or MCP listener. The existing hosted private map remains separate.

Sources inspected:
- https://github.com/baruchiro/skills
- https://www.baruchiro.com/blog/ideas/historical-map-timeline
- https://docs.github.com/en/actions/reference/security/secure-use
- https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target
- https://github.com/actions/checkout/releases

## Static site

GitHub Pages serves docs/. After approved list changes, rebuild the tracked catalog with `python3 scripts/check_contributions.py lists --out /tmp/catalog-new.json` and copy that reviewed output to docs/site/catalog.json. Catalog rebuild/publish is deliberately a maintainer step, not automatic acceptance of unreviewed data. Run a local HTTP server at docs/ to preview the frontend. No package install or external map service is used.
