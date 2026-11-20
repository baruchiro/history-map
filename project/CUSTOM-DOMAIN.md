# Custom-domain preparation

Proposed host: `history.baruchiro.com`. This document and the collector allowlist prepare a reviewed migration. They do not configure or verify a custom domain, DNS, certificate or production receipt.

## Current verified deployment

As checked 20 November 2026, GitHub Pages publishes `master:/docs` using branch-based publication (`build_type: legacy`), with no custom domain. The existing URL is https://baruchiro.github.io/history-map/ . The source tree has no CNAME file.

Scripts, styles, collections and catalog/border fetches use relative paths. Shared view URLs are built from the current location. These support deployment at the new hostname's root, subject to actual end-to-end validation.

## Scope of this proposal

The collector permits the exact HTTPS root of the proposed hostname, in addition to the existing GitHub project path. Preview hosts, HTTP and unrelated paths remain excluded. Existing consent/exclusion, DNT/GPC, automation, fixed payload and per-page event limits are unchanged. This does not add publication attribution, which is a separate proposal.

No CNAME file is included: merging preparation must not silently configure a hostname or start a claim before the authorized domain operators agree the execution sequence. No workflow, account setting, DNS record, merge rule or service is changed.

## Execution gates

1. Repository owner reviews and merges preparation. Contributors do not merge. Reconcile collector changes against any other pending analytics proposal without losing its guards.
2. Authorized domain operator verifies account/zone ownership and conflicting records. Where appropriate, verify the domain in the owner's GitHub account with the exact GitHub-generated TXT record, not an invented value.
3. Owner or specifically authorized operator configures the custom hostname in Pages **before DNS**. For branch publication GitHub's settings UI creates a CNAME commit. Because that writes the publishing branch, coordinate it explicitly with the owner's merge-only rule. An owner-reviewed CNAME PR may instead be prepared as a distinct activation step once the execution scope is settled. Do not do both blindly.
4. Authorized DNS operator adds only `history` CNAME to `baruchiro.github.io`, without a repository suffix. Leave apex, www, mail and unrelated records untouched. Proxy choice requires checking the actual account state.
5. Verify DNS, certificate and HTTPS enforcement when available. GitHub documents up to 24 hours for propagation and HTTPS availability. Read all map assets at the new root; exercise list selection, map gestures, timeline, details and share/reload. Check old links and their hash state after redirects. Do not assume a successful HTML response proves the app works.
6. The new hostname has separate browser storage: re-establish internal opt-out before internal use, including assistant test sessions. Keep synthetic measurement receipt separate from normal usage. Verify the collector, privacy guards and any approved attribution against the intended existing project.

## Not solved by the domain move

A view encoded only after `#` is not sent to the server. State-specific social previews still need crawler-readable state-specific HTML and an image matching the actual shared map. A generic image or client-side meta-tag change is not acceptance. Demonstrate two different real pasted links with distinct correct previews and correct opened states before claiming this requirement complete.

## Sources

- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages
- https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment
