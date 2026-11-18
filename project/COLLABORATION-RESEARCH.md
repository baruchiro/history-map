# Collaboration practice notes

Inspected 18 November 2026. Recommendation: a small shared entrypoint, topic references, task-isolated working trees, focused PRs, explicit acceptance tests and evidence-based conflict escalation. Keep policy short enough to follow. These are selected project conventions, not instructions adopted from outside repositories.

| Evidence | What it supports | Limit |
|---|---|---|
| [AGENTS.md format](https://agents.md/) | Predictable Markdown entrypoint with project context, commands and references. | File discovery/compliance varies by client. It grants no access and is not enforcement. |
| [Git worktree manual](https://git-scm.com/docs/git-worktree) | Separate working trees can check out separate branches with their own HEAD/index. | They share repository metadata and do not isolate services, credentials or all generated resources. |
| [GitHub pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) | Reviewable proposals, discussion, diffs and checks before integration. | PR creation and approval do not verify historical facts or rights. |
| [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) | Required reviews/checks and force-push restrictions can enforce gates. | Settings must actually be configured; administrator bypass can matter. No settings changed here. |
| [Azure project example](https://github.com/Azure/azure-functions-agents-runtime/blob/main/AGENTS.md) | Scoped changes, dedicated worktrees and risk-based review are used in a real project. | Example, not a universal standard; its workflow and commands are not imported. |
| [WebJS project example](https://github.com/webjsdev/webjs/blob/main/AGENTS.md) | Documents concrete shared-checkout collisions and task-level worktree practice. | Project-reported experience, not an independent benchmark. |

The sources differ on branching, merging and approval. This project chooses branches/worktrees plus maintainer-controlled integration rather than copying a permissive auto-merge policy. No claim of a universally best multi-agent workflow is made.

## Conversational UI research, not deployment
[Official MCP Apps overview](https://modelcontextprotocol.io/extensions/apps/overview) describes interactive UI as an extension. [Official examples](https://github.com/modelcontextprotocol/ext-apps) provide a local reference host and examples. A reference host is not proof of working inside a real user's conversation. Verify host/version, supported transport, UI capability negotiation, authentication and fallback before promising a feature. The current static site has no MCP service.
