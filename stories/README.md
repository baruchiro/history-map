# Product query corpus

`queries.json` is a versioned collection of natural-language intentions and acceptance stories. It is not a query engine, a completed demand study or an executable conversational test suite.

## Provenance and status
- `maintainer-direction`: a project-only paraphrase of requested behavior, not a verbatim conversation or customer interview.
- `hypothesis`: an invented example for discovery/testing. Never count it as customer demand.
- `observed-consented`: reserve for a voluntarily supplied query with explicit permission for public inclusion. No such records are included initially.
- `support`: `manual-ui`, `partial` or `planned`. Manual UI support does not mean the website understands natural language.
- `automation`: `executable-component-tests`, `browser-manual` or `acceptance-story-only`. State the actual coverage, not an implied end-to-end language test.

## Add a story
Give it a stable ID, original language, intent, expected view, acceptance criteria, data/uncertainty/privacy limits and explicit provenance/support/automation. A real query needs publication consent and removal of identifying/private context. Do not store raw chats, account identifiers, private reading lists or analytics payloads. Link an implementation PR/test when available. Keep incompatible interpretations as separate cases rather than pretending the request is precise.

Examples should ask what someone wants to understand, not merely mirror schema fields. Add negative cases: unavailable sources, uncertain chronology, invalid dates, unsupported host and private data. A human reviews historical correctness independently from structural tests.

See [backlog](../project/BACKLOG.md) for collection and automation work. The corpus itself is intentionally small until real evidence guides expansion.
