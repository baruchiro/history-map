# Architecture and remaining work

## Stage 1: repository contributions

Agent -> source list JSON -> pull request -> structural check -> human source/content review -> merge -> generated catalog -> frontend reader.

Published: source contract, map-bundle compiler, catalog builder, data checks, 30 Python regression tests and six URL-state tests, contributor guidance and a read-only PR workflow. GitHub Pages serves the standalone frontend from master/docs. Contribution CI passed its first real data-only smoke-test PR. Required reviews and branch protection are not configured.

The catalog builder emits one entry per list. The static frontend lets visitors select two catalog entries and render their compiled event arrays without editing events. The existing local personal library is separate and must not be overwritten. IDs are deterministic for stable list/event identity; changed event titles/dates/places generate new IDs. A future update protocol needs explicit event IDs and version history.

The standalone site reads docs/site/catalog.json. Approved list changes require a maintainer to rebuild and commit that catalog; unreviewed PR data never appears automatically. The original hosted prototype and its per-viewer personal library remain separate.

## Exploration: backend and MCP, not an approved next stage

Keep the list contract, but add a durable store, review queue and versioned API. Suggested operations are submit-list, validate-list, get-submission-status and read-approved-lists. Submission produces a draft pending review, never an automatically published record. MCP is an interface to these operations, not the authority system itself.

Before implementation choose: service owner and hosting; authentication provider; per-user and per-project write/read permissions; whether submissions are public; reviewer identity; rate and payload limits; abuse/reporting route; deletion and retention; audit history; and whether anonymous reads are allowed. Do not deploy an unauthenticated write endpoint or treat a source URL as a trusted command.

No MCP protocol-version or transport claim is made in this scaffold. Select and verify the then-current official SDK/security guidance before building that layer. No listener, credentials or paid service exists here.

## Validation boundaries

The current compiler checks integer years (-5000..2100 excluding zero), an optional later endYear for sourced span records, geographic coordinate bounds, HTTPS source URL shape without credentials, string limits, list membership, duplicate identifiers, and final compact UTF-8 byte size. The contribution checker additionally enforces one list per regular slug-named JSON file, matching keys, duplicate JSON-key rejection, no symlinks/subdirectories, 64 KiB source files and a 200-file catalog limit.

It does not establish historical truth, licensing, source authorship, safety of linked pages, complete absence of malicious prose, or correct cross-calendar mapping. Those need evidence and review. It never fetches links or executes contributed content.

## CI safety rationale

The workflow uses pull_request, explicit contents:read, no secrets/caches, no self-hosted runner, no writeback, and a full-SHA-pinned checkout action. The validator runs from the base revision; proposed scripts are not executed by the declared validation steps. Ordinary data PRs may change only lists/*.json. Repository review rules must protect workflow changes, since a PR workflow itself can be modified. The initial bootstrap needs special maintainer review because the base validator does not yet exist in an empty repository.

References inspected 18 November 2026:
- https://docs.github.com/en/actions/reference/security/secure-use
- https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target
- https://github.com/actions/checkout/releases

The checkout pin was resolved directly from the official actions/checkout v7.0.1 tag to 3d3c42e5aac5ba805825da76410c181273ba90b1. This does not replace dependency review or future updates.


## Conversational and inline UI exploration

A future assistant could select a map/comparison/timeline using the public data and shared-view contract. MCP Apps is a possible UI interface, conditional on actual host/version capability. Neither this document nor the protocol's existence proves support in a particular assistant. A local reference-host demo is not an in-conversation integration. See [research notes](../project/COLLABORATION-RESEARCH.md) and [query acceptance stories](../stories/README.md). No server, new credentials, paid hosting or connector is implemented or authorized by this design note.
