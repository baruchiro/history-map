# Architecture and remaining work

## Stage 1: repository contributions

Agent -> source list JSON -> pull request -> structural check -> human source/content review -> merge -> generated catalog -> frontend reader.

Implemented locally: source contract, map-bundle compiler, catalog builder, data checks, regression tests, contributor guidance and draft PR workflow. Not implemented remotely: any repository, running CI, branch protections, approved contributions, merge or deployment.

The catalog builder emits one entry per list. A frontend adapter can let the user select two entries and render their compiled event arrays without editing events. The existing local personal library is separate and must not be overwritten. IDs are deterministic for stable list/event identity; changed event titles/dates/places generate new IDs. A future update protocol needs explicit event IDs and version history.

No catalog reader has yet been wired into the hosted map, and no claim is made that a PR will appear there automatically. A standalone map repository can include the map source and static compiled catalog. Map publishing/deployment and the user's local library remain separate decisions.

## Stage 2: backend and MCP

Keep the list contract, but add a durable store, review queue and versioned API. Suggested operations are submit-list, validate-list, get-submission-status and read-approved-lists. Submission produces a draft pending review, never an automatically published record. MCP is an interface to these operations, not the authority system itself.

Before implementation choose: service owner and hosting; authentication provider; per-user and per-project write/read permissions; whether submissions are public; reviewer identity; rate and payload limits; abuse/reporting route; deletion and retention; audit history; and whether anonymous reads are allowed. Do not deploy an unauthenticated write endpoint or treat a source URL as a trusted command.

No MCP protocol-version or transport claim is made in this scaffold. Select and verify the then-current official SDK/security guidance before building that layer. No listener, credentials or paid service exists here.

## Validation boundaries

The current compiler checks integer years (-5000..2100 excluding zero), geographic coordinate bounds, HTTPS source URL shape without credentials, string limits, list membership, duplicate identifiers, and final compact UTF-8 byte size. The contribution checker additionally enforces one list per regular slug-named JSON file, matching keys, duplicate JSON-key rejection, no symlinks/subdirectories, 64 KiB source files and a 200-file catalog limit.

It does not establish historical truth, licensing, source authorship, safety of linked pages, complete absence of malicious prose, or correct cross-calendar mapping. Those need evidence and review. It never fetches links or executes contributed content.

## CI safety rationale

The draft uses pull_request, explicit contents:read, no secrets/caches, no self-hosted runner, no writeback, and a full-SHA-pinned checkout action. The validator runs from the base revision; proposed scripts are not executed by the declared validation steps. Ordinary data PRs may change only lists/*.json. Repository review rules must protect workflow changes, since a PR workflow itself can be modified. The initial bootstrap needs special maintainer review because the base validator does not yet exist in an empty repository.

References inspected 18 November 2026:
- https://docs.github.com/en/actions/reference/security/secure-use
- https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target
- https://github.com/actions/checkout/releases

The checkout pin was resolved directly from the official actions/checkout v7.0.1 tag to 3d3c42e5aac5ba805825da76410c181273ba90b1. This does not replace dependency review or future updates.
