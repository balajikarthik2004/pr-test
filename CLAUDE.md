# PR Guardrails: strict PR rules + AI code review

This repo is a proven template for a gated pull-request pipeline. Use it to set up the
same system in another project. Everything is enforced by CI and GitHub branch
protection. Nothing relies on someone remembering a rule.

## The flow

```
feat/* ──PR──► dev ──promote──► test ──promote──► main
         gate 1       gate 2   (QA)    gate 3
```

- Every change enters through a PR from a feature branch into `dev`. That PR gets the
  full gate: PR rules, lint, format, types, tests, build, security and AI review.
- `dev → test` and `test → main` are **promotion PRs**, opened by `promote.yml`. Checks
  re-run on the combined code. QA tests on `test`. The tester approves `test → main`.
- Nothing merges automatically. Passing checks only unlock the merge button. A human
  approves and a human clicks merge.

## How it fits together

Each workflow job reports a **status check named after its job `name:`**. Branch
protection lists those names as required. The merge button unlocks only when all of
them are green, there is 1 approval, and every review conversation is resolved.

| File | Job / role | What it enforces |
|---|---|---|
| `.github/workflows/pr-hygiene.yml` | `title` | Conventional Commits; subject 10-72 chars, lowercase start, no trailing period |
| | `description` | Template headings `## What`, `## Why`, `## How tested`, `## Risk / rollback` present and filled; at least 80 chars |
| | `linked-issue` | `#123` or `ABC-456` in title or body (skipped on promotion PRs) |
| | `not-wip` | Not a draft; no `wip` / `do not merge` in the title |
| | `size` | At most 800 changed lines and 50 files, excluding lockfiles and generated files; the `large-pr` label waives it (skipped on promotion PRs) |
| `.github/workflows/ci.yml` | `verify` | `npm ci` → lint → format:check → typecheck → test:cov → build |
| | `security` | gitleaks (secrets), Semgrep (SAST), `npm audit --audit-level=high` |
| `.github/workflows/codeql.yml` | `analyze` | CodeQL when repo variable `HAS_ADVANCED_SECURITY=true`; otherwise a no-op that reports green |
| `.github/workflows/ai-review.yml` | `ai-review` | Claude review. **Advisory, not a required check** |
| `.github/workflows/promote.yml` | manual | Opens or updates the `dev→test` / `test→main` PR with release notes. Never merges |
| `.github/review-guide.md` | AI policy | What Claude looks for, in priority order, plus the hard rules |
| `.github/pull_request_template.md` | template | Pre-fills the four sections `description` checks for |
| `.github/CODEOWNERS` | reviewers | Enforced only in `prod` protection mode |
| `scripts/setup-branch-protection.sh` | GitHub settings | Protects `dev`/`test`/`main` and sets merge styles, via `gh api` |
| `scripts/seed-test-pr.sh` | testing | Opens a PR with planted defects: `lint`, `hygiene`, `huge`, `bugs`, `clean` |
| `eslint.config.js`, `.prettierrc.json`, `tsconfig.json`, `vitest.config.ts` | tool config | Lint rules, formatting, strict TS, coverage thresholds (80% lines/functions/statements, 70% branches) |
| `.gitattributes` | line endings | Forces LF, so Windows CRLF can't break scripts or Prettier |

## Branch protection (set by the script, not stored in the repo)

`./scripts/setup-branch-protection.sh <owner/repo> [solo|team|prod]`

| Setting | `dev` | `test` | `main` |
|---|---|---|---|
| Required checks | the 8 below | same | same |
| Require branch up to date (`strict`) | yes | yes | yes |
| Approvals | 1 | 1 | 1 |
| Dismiss stale approvals, last pusher can't approve | yes | yes | yes |
| Conversations must be resolved | yes | yes | yes |
| Linear history | **yes** (squash) | **no** (merge commit) | **no** (merge commit) |
| CODEOWNERS review, enforce on admins | `prod` only | `prod` only | `prod` only |

The required check list is
`verify, security, analyze, title, description, linked-issue, not-wip, size`.

Repo-level settings: squash and merge-commit on, rebase off, auto-merge off, delete
branch on merge on. The default branch must be `dev`.

Modes: `solo` = 0 approvals (for a single-account sandbox only), `team` = 1 approval,
`prod` = team + CODEOWNERS + admins can't bypass.

## AI reviewer (Claude)

- Uses `anthropics/claude-code-action@v1` with `--model claude-sonnet-5` (low cost).
  Switch to `claude-opus-5-5` for deeper reviews.
- Auth is a subscription token, with no API key: `claude setup-token`, then store it as
  the repo secret `CLAUDE_CODE_OAUTH_TOKEN`. With an API key, use
  `anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}` instead.
- The Claude GitHub app (https://github.com/apps/claude) must be installed on the repo.
- The prompt makes Claude read `.github/review-guide.md`, fetch `gh pr diff`, and
  comment only on changed lines. Limits: at most 10 inline comments tagged
  `[blocking]`/`[should-fix]`/`[nit]`, 80% confidence floor, one summary comment,
  `--max-turns 25`.
- Tools are restricted to `gh pr view/diff/comment`, inline comments, Read, Grep, Glob.
  Keep it that way: the PR content is untrusted input.
- Skipped: drafts, fork PRs (no secrets), dependency bots, docs-only PRs, and
  promotion PRs (already reviewed on entry to `dev`). A new push cancels the
  in-flight run.
- It gates through **conversation resolution**, not a status check. Every comment must
  be resolved or answered before merge.

## Invariants: do not break these

1. **Check names must match exactly.** The `CHECKS` list in
   `setup-branch-protection.sh` must equal the job `name:` values in the workflows.
   Rename a job without updating it and every PR hangs on "Expected — waiting for
   status".
2. **Required jobs must always report.** Never skip a required job with a job-level
   `if:` or workflow `paths` filters, because a skipped job never reports and blocks
   the PR. Skip inside a step and `exit 0` instead (see `linked-issue`, `size` and
   `codeql.yml`). Only the non-required `ai-review` may use `paths-ignore` or a job `if:`.
3. **Squash only into `dev`. Promotions use "Create a merge commit".** Squashing a
   promotion makes the branches diverge, and every later promotion shows phantom
   conflicts. That is why `required_linear_history` is on for `dev` only.
4. **Promotion PRs are detected by branch names**
   (`base=test,head=dev` or `base=main,head=test`) in `pr-hygiene.yml` and
   `ai-review.yml`. Renaming branches means updating both.
5. **The AI reviewer stays advisory.** Don't add `ai-review` to required checks: a
   quota or outage failure would block every merge.
6. **Tool CI must match the pinned tool versions.** Example: vitest 5 needs Node
   22.12+, while CI runs Node 20, so vitest is pinned to 4.1.x. Check a package's
   `engines` before a major upgrade.
7. **No branch named after a long-lived branch prefix.** Git can't create `test/x`
   while a branch `test` exists. Seed branches use `seed/`.

## Porting to another project

1. Copy `.github/` (workflows, `review-guide.md`, `pull_request_template.md`,
   `CODEOWNERS`), `scripts/`, `.gitattributes` and `CONTRIBUTING.md`.
2. **Adapt `verify` to the stack.** It calls `npm run lint | format:check | typecheck |
   test:cov | build`. For a Node project, add those scripts to `package.json`. For
   another stack (Python, Go, Java), replace the steps in `ci.yml` but **keep the job
   named `verify`**. Do the same for the `npm audit` step in `security` (e.g.
   `pip-audit`, `govulncheck`) and the CodeQL `languages:`.
3. **Adapt `review-guide.md`.** Keep the structure and hard rules. Rewrite "Project
   conventions" for that codebase: money handling, error types, layering rules,
   public API location. This section gives the reviewer most of its value.
4. Rewrite `CODEOWNERS` with the real owners, or teams in an org.
5. Run `npm run verify` (or the equivalent) locally and get it green **before**
   turning on protection.
6. On GitHub:
   - Add collaborators with Write access.
   - Install the Claude GitHub app and set the `CLAUDE_CODE_OAUTH_TOKEN` secret. For an
     org, use an org-owned account, not one person's plan.
   - Run `./scripts/setup-branch-protection.sh <owner/repo> team` (or `prod`).
   - Run `gh repo edit <owner/repo> --default-branch dev`.
   - For a private personal repo, branch protection needs GitHub Pro. It is free for
     public repos and orgs.
7. The AI workflow only runs once `ai-review.yml` is on the **default branch**.
   claude-code-action refuses a workflow file that differs from the default branch's
   copy, so the PR that adds it will show a failed or skipped review.
8. Validate with `seed-test-pr.sh`: `lint` → `verify` fails; `hygiene` → the 4 PR-rule
   checks fail; `huge` → `size` fails until `large-pr` is added; `bugs` → CI passes but
   Claude must flag the 4 planted bugs; `clean` → all green.
9. Roll out in stages on a busy repo: protection + 1 approval → `verify` → hygiene →
   AI review → security blocking.

## Everyday commands

```bash
npm run verify                                   # same gate as CI, locally
npm run format                                   # fix formatting
gh workflow run promote.yml -f hop=dev-to-test   # open the QA promotion PR
gh workflow run promote.yml -f hop=test-to-main  # open the release PR after QA passes
gh pr checks --watch                             # watch a PR's checks
./scripts/seed-test-pr.sh <bugs|lint|hygiene|huge|clean>
```

## Known gaps

- Nothing yet rejects a feature PR opened straight into `test` or `main`. It still runs
  the full gate, but merging it breaks the flow. A guard job that fails unless
  `head=dev` for `base=test` and `head=test` for `base=main` would close this.
  Add it to the required checks.
- In `team` mode, admins can bypass protection with "Merge without waiting for
  requirements". Use `prod` mode to enforce the rules on admins.
- GitHub enforces "1 approval" but not *which* person approves. To require the tester
  on `test → main`, use `prod` mode with the QA team in CODEOWNERS, or a GitHub
  Environment with required reviewers.

## Windows notes

- Run the `.sh` scripts in **Git Bash**, not PowerShell.
- After installing `gh` (`winget install --id GitHub.cli`), restart VS Code so the
  PATH updates. Then run `gh auth login`.
- Set secrets with `gh secret set NAME --repo owner/repo` and paste the value at the
  prompt. Never pass a token as a command argument: it lands in shell history.
