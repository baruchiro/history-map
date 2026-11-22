# Product release gates

Reusable checklist for a developer, product reviewer or marketer preparing an app for publication. Apply it to the actual released build, not only a branch, screenshot, SDK capability or proposed architecture. The product owner approves release and merges contributions.

## 1. Identify the build and its creator

- Record repository, commit, artifact or deployed URL and verification time.
- Show a readable creator credit naming Baruch, with an About or contact route to https://www.baruchiro.com/ . Test it at the narrowest supported size, without hiding content or controls.
- Do not imply that an unfinished prototype, generated screenshot or local test is the released app.

## 2. Make usage measurable, then read it

- Use the intended existing PostHog project when authorized. Verify project, endpoint, event names and actual receipt. A configured token or successful HTTP submission alone is not receipt proof.
- Define what each event means and what it cannot establish. Distinguish per-page activity, sessions, people, acquisition source, successful task completion and conversations. Do not silently introduce persistent identity to count people.
- Send only approved, bounded properties. No secrets, search text, lists, message content, private URLs, raw state or automatic recording in usage events. Conversation storage is a separate gate below.
- Preserve existing privacy choices, internal/test exclusions and automation guards. A hostname or application-identity change can reset local exclusions; verify again on the destination before testing.
- Inspect what the service actually stores, including server-enriched fields. Never promise no IP/location collection merely because the application did not put those fields in its payload.
- Verify one labelled synthetic event outside normal activity totals where authorized. Inspect received event/properties, verify exclusion cases locally with intercepted network, and avoid manufacturing normal visitor counts to prove instrumentation.
- Provide a repeatable aggregate analysis query, time window, timezone, interpretation and next product action. Do not stop at adding an SDK or collecting counts that nobody reviews.
- Do not enable replay, autocapture, new identity collection, paid plans or new external services by implication. Resolve actual scope/cost gaps separately; continue unblocked implementation.

## 3. Conversation apps: consent and investigation

Map-only products mark this gate not applicable. For a conversation product, UI tests without a working model and storage path do not pass this gate.

- Explain before collection what is stored, why it is stored, who can inspect it and how long it stays. Consent to usage counts is not consent to conversation storage or model training.
- Implement a real choice and verify both accepted and declined paths. Declining conversation investigation must not quietly upload text elsewhere.
- Define minimal conversation records, access controls, retention and a supported deletion route. Never put raw conversation text in ordinary usage events or repository logs.
- Distinguish on-device history from a consent-based investigation store. Verify storage receipt and permitted retrieval using synthetic conversation text, and verify deletion. A settings label or proposed database is not implementation proof.
- Verify the real model path separately from a dummy response. Keep persistent credentials out of app bundles, analytics, screenshots, repository history and shared artifacts.
- Any required hosting, secret transfer or external database must fit the owner's authorization and verified costs. Prepared code can be reviewed while those effects remain held; do not claim the feature active.

## 4. Sharing and publication

- Test the exact deployed URL or installable artifact. Preserve existing data and explain update/signing limits before asking for an install that could erase it.
- For shared views, open two different links and verify their state after reload. If previews must show each actual map/comparison, verify two corresponding pasted-link previews on the intended channel, not only Open Graph tags or a screenshot of the app.
- Review real mobile pixels, keyboard/touch interactions, error states and creator-credit readability. Passing code tests do not replace this check.
- Separate code contribution, owner merge, deployment, measurement receipt, release approval and promotional posting. Approval for one is not automatic approval for the rest.
- Before publishing copy, verify the destination/audience and approved words. A launch gate being met does not itself send a message or authorize spend.

## Evidence handoff

Every release handoff should state:

1. Build/commit and usable URL or delivered artifact.
2. What changed, which checks ran and decisive visual evidence.
3. Analytics receipt and analysis query/window, with synthetic activity separate.
4. Creator/About/contact proof.
5. Conversation consent/storage/real-model proof, or not applicable.
6. Share-preview and install/update proof where required.
7. Exact remaining blocker, owner action and who owns follow-through.

Use **verified**, **prepared but not released**, **blocked**, or **not applicable**. Avoid a blanket "done" when only one layer is complete.

## History-map application

- Usage capture is already enabled on the current GitHub Pages site. `docs/analytics.js` implements seven event types, at most once per type per page load, with per-page random identity. It does not count unique people or repeat visits across page loads.
- Inspect aggregate receipt with [analytics queries](analytics-queries.sql). Query access keys stay outside the repository. Recheck actual properties and keep existing server-side IP/location handling distinct from the collector's fixed properties.
- Creator/contact credit exists in the live source. Larger credit/control polish remains a separate UI proposal, not a reason to claim no credit exists.
- Publication attribution, custom-host allowlisting and UI polish are distinct proposals. Local tests or open PRs do not mean they are live. Reconcile collector changes and rerun combined checks before owner merge/release.
- Domain activation, production-origin validation, internal exclusion on the new origin and state-specific social previews are independent gates. A custom domain alone does not solve previews: a `#` fragment is not sent to the server.
- No chat interface or conversation investigation store is part of this map. Do not add one merely to satisfy a cross-product template.

## References

- https://posthog.com/docs/product-analytics
- https://posthog.com/docs/sql
- https://ogp.me/
- https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment
