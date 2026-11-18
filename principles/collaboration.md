# Parallel work, autonomy and disagreement

## Autonomy inside a task
Agents may choose implementation details, research public sources, add local tests, simplify code and prepare focused proposals within the assigned outcome. Avoid asking about every reversible professional choice. State important assumptions and evidence. The contributor's own user/account authorization and repository permissions still apply.

No instruction here authorizes spending, paid services, outreach, sharing private information, changing permissions, branch protections, credentials or production architecture. A maintainer-authorized release is distinct from local development or a PR. No blanket merge or publication grant is created by this file.

## Start and isolate
- Read current status, open PRs and issues; announce the bounded task, expected files and acceptance criteria in an existing issue or authorized PR. If posting is not authorized, prepare this locally and report it to the maintainer.
- Use one branch and separate worktree/clone per task. Verify repository, worktree path, branch and latest base before editing. Never switch another worker's branch, reset its files or delete its worktree.
- Prefer nonoverlapping file ownership. When work overlaps, agree a sequence or split before both edit the shared surface. A status note is coordination, not a reliable lock.
- Recheck upstream and overlapping PRs before landing. Test the combined result, not only an old branch. Never force-push a shared branch or silently overwrite an intervening commit.

## When agents disagree
1. Identify the exact conflicting requirement, claim or diff. Link the relevant current principle, decision, source and failing/reproduction test.
2. Separate mechanical conflicts from product conflicts. Resolve a mechanical merge only when both intents can be preserved and retested.
3. Prefer evidence and the current explicit maintainer decision over confidence or whichever agent wrote last. Neither agent may silently rewrite a principle to win.
4. If evidence does not settle the product/rights/privacy question, pause that affected change and ask the maintainer with options, tradeoffs and a recommended choice. Continue unrelated work.
5. Record the agreed outcome in the decision log and update affected stories/tests. If a principle changes, explain what it supersedes; no silent reversal.

## Review and handoff
Use a focused PR with intent, files, screenshots for visual changes, checks run and outstanding caveats. Data truth/rights need content review; code and workflows need code review. For policy, schema, CI/security or deployment changes, request maintainer review rather than treating an agent's self-review as approval.

AGENTS.md and this folder are collaboration conventions, not an enforced security boundary. Repository review rules must enforce required checks/reviews separately. This documentation does not configure those settings and makes no claim that they are configured.

Sources and tradeoffs: [practice notes](../project/COLLABORATION-RESEARCH.md).
