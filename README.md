# **PROJECT_NAME**

<!-- template:start -->

> **This repo was generated from the `web-starter` template.** Run the one-time
> setup before anything else:
>
> ```sh
> bun install      # installs deps and git hooks
> bun run init     # fills in name, slug, author, owner; strips this banner; self-deletes
> ```
>
> `init` reads your `git remote` to guess the slug, prompts for the rest, and
> rewrites the placeholders (`__PROJECT_NAME__`, `__REPO_SLUG__`,
> `__DESCRIPTION__`, `__AUTHOR__`, `__OWNER__`) across the repo. After it runs,
> review the diff, commit, then do the one-time GitHub steps under
> [Repository settings](#repository-settings).

<!-- template:end -->

[![CI](https://github.com/__REPO_SLUG__/actions/workflows/ci.yml/badge.svg)](https://github.com/__REPO_SLUG__/actions/workflows/ci.yml)
[![CodeQL](https://github.com/__REPO_SLUG__/actions/workflows/codeql.yml/badge.svg)](https://github.com/__REPO_SLUG__/actions/workflows/codeql.yml)
[![coverage](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/__REPO_SLUG__/gh-pages/coverage.json)](https://github.com/__REPO_SLUG__/actions/workflows/coverage-badge.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/__REPO_SLUG__/badge)](https://securityscorecards.dev/viewer/?uri=github.com/__REPO_SLUG__)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)
[![Release](https://img.shields.io/github/v/release/__REPO_SLUG__)](https://github.com/__REPO_SLUG__/releases)

# **DESCRIPTION**

## Stack

bun workspaces monorepo, Vue 3 + TypeScript (Vite), Vitest, ESLint (flat) +
Prettier, lefthook + commitlint, tag-driven releases via git-cliff, and a
hardened GitHub Actions pipeline (CI, CodeQL, Scorecard, dependency review,
SBOM, build attestations).

## Getting started

```sh
bun install        # deps + git hooks
bun run dev        # start the web app (apps/web)
bun run test       # unit tests with coverage
bun run typecheck  # vue-tsc
bun run lint       # eslint
bun run format     # prettier
bun run build      # production build
```

Commits must follow [Conventional Commits](https://www.conventionalcommits.org)
(enforced on commit). Cut a release by pushing a `vX.Y.Z` tag.

## Repository settings

These are one-time GitHub settings the code cannot set for you. Do them after
`bun run init`.

- **Branch protection on `main`.** Settings → Branches. Require a pull request
  and require the `CI` check. Why: keeps unreviewed or broken code off `main`.
- **Let Actions bypass that protection.** Same screen, add GitHub Actions (or
  the release bot) to the bypass list. Why: the release workflow pushes a
  `chore(release)` commit (changelog + version) back to `main`. Without the
  bypass that push is rejected and the release stops.
- **Workflow permissions: read and write.** Settings → Actions → General. Why:
  the release workflow creates the GitHub Release and pushes the changelog
  commit.
- **Code scanning.** Free on public repos (CodeQL runs from `codeql.yml`).
  Private repos need GitHub Advanced Security for the alerts to appear.
- **Secret scanning + push protection.** Settings → Code security. On by
  default for public repos. Why: blocks committed credentials.
- **Coverage badge.** Nothing to do. The `coverage-badge` workflow creates the
  `gh-pages` branch on the first push to `main`; the badge resolves after that.
- **Template toggle off.** If this repo was itself created from the template,
  leave the "Template repository" setting off so it is not re-templated.

## How the infra works (and why)

- **bun monorepo** (`apps/*`, `packages/*`). One lockfile, shared tooling at the
  root. Why: add a backend (`apps/api`) or shared code (`packages/shared`)
  later without reworking the setup.
- **ESLint (flat) + Prettier.** ESLint owns correctness, Prettier owns
  formatting. Why: no rule conflicts, one formatter of record.
- **lefthook + commitlint.** pre-commit formats and lints staged files,
  commit-msg enforces Conventional Commits, pre-push runs typecheck + test +
  build. Why: catch problems locally and keep history machine-parseable for the
  changelog.
- **CI** (`ci.yml` → reusable `verify.yml`). Runs on push and PR to `main`,
  cancels superseded runs, least-privilege token. Why: fast, safe feedback.
- **Security scans.** CodeQL (SAST), dependency-review (blocks vulnerable deps
  in PRs), OpenSSF Scorecard (posture score), secret scanning. All surface in
  the Security tab. Why: catch code and supply-chain issues early.
- **Coverage badge.** Vitest emits a JSON summary; `coverage-badge.yml` computes
  the percentage and publishes a shields endpoint to `gh-pages`. Why: a live
  badge with no third-party service.
- **Releases** (`release.yml`, tag-driven). Push `vX.Y.Z` → git-cliff builds the
  changelog and notes, the version bump + changelog are committed back, a
  CycloneDX SBOM and SLSA build/SBOM attestations are generated, and the bundle
  - SBOM are attached to the GitHub Release. Why: reproducible, auditable
    releases straight from commit history.
- **Dependabot.** Weekly npm updates (dev deps grouped) and grouped
  github-actions updates. Why: stay patched; grouping actions avoids partial
  bumps that break paired steps (e.g. CodeQL).
- **SHA-pinned actions.** Every action is pinned to a full commit SHA with a
  version comment. Why: a moved tag cannot swap the code under you. Dependabot
  updates the SHAs.
- **Pinned bun** (`.bun-version`). Same runtime locally and in CI.

## Project structure

```
apps/web/          Vue 3 + Vite app (the default workspace)
packages/          shared packages (add as needed)
.github/workflows/ CI, CodeQL, Scorecard, dependency-review, coverage-badge, release
scripts/init.ts    one-time template initializer (removed after first run)
```

## Adding a backend or shared package

Create `apps/api` or `packages/shared` with its own `package.json`, extend
`tsconfig.base.json`, and the root workspace globs pick it up. Root scripts
(`build`, `test`, `typecheck`) fan out to every workspace.

## License

Apache-2.0. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
