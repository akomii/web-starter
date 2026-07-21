# {{PROJECT_NAME}}

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
> rewrites the placeholders (`{{PROJECT_NAME}}`, `{{REPO_SLUG}}`,
> `{{DESCRIPTION}}`, `{{AUTHOR}}`, `{{OWNER}}`) across the repo. After it runs,
> review the diff, commit, then do the one-time GitHub steps under
> [Repository settings](#repository-settings).

<!-- template:end -->

[![CI](https://github.com/{{REPO_SLUG}}/actions/workflows/ci.yml/badge.svg)](https://github.com/{{REPO_SLUG}}/actions/workflows/ci.yml)
[![CodeQL](https://github.com/{{REPO_SLUG}}/actions/workflows/codeql.yml/badge.svg)](https://github.com/{{REPO_SLUG}}/actions/workflows/codeql.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/{{REPO_SLUG}}/badge)](https://securityscorecards.dev/viewer/?uri=github.com/{{REPO_SLUG}})
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)
[![Release](https://img.shields.io/github/v/release/{{REPO_SLUG}})](https://github.com/{{REPO_SLUG}}/releases)

# {{DESCRIPTION}}

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

One-time GitHub settings the code cannot set for you. Do them after `bun run init`.

| Setting                           | Where and what to do                                                    | Why                                                                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Branch protection on `main`       | Settings → Branches. Require a pull request and the `CI` check          | Keeps unreviewed or broken code off `main`                                                                                           |
| Actions bypass on `main`          | Same screen, add GitHub Actions to the bypass list                      | The release workflow pushes a `chore(release)` commit back to `main`. Without the bypass that push is rejected and the release stops |
| Workflow permissions              | Settings → Actions → General → Read and write                           | The release workflow creates the GitHub Release and pushes the changelog commit                                                      |
| Code scanning                     | Runs from `codeql.yml`, free on public repos                            | Private repos need GitHub Advanced Security for the alerts to appear                                                                 |
| Secret scanning + push protection | Settings → Code security, on by default for public repos                | Blocks committed credentials                                                                                                         |
| Template toggle                   | Leave "Template repository" off if this repo was made from the template | Prevents re-templating                                                                                                               |

## How the infra works

| Component                | What it does                                                                                                                                        | Why                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| bun monorepo             | `apps/*` + `packages/*`, one lockfile, shared tooling at the root                                                                                   | Add a backend (`apps/api`) or shared code (`packages/shared`) later without reworking the setup |
| ESLint (flat) + Prettier | ESLint owns correctness, Prettier owns formatting                                                                                                   | No rule conflicts, one formatter of record                                                      |
| lefthook + commitlint    | pre-commit formats and lints staged files, commit-msg enforces Conventional Commits, pre-push runs typecheck, test, build                           | Catch problems locally, keep history parseable for the changelog                                |
| CI                       | `ci.yml` calls the reusable `verify.yml` on push and PR, cancels superseded runs, least-privilege token                                             | Fast, safe feedback                                                                             |
| Security scans           | CodeQL, dependency-review, OpenSSF Scorecard, secret scanning, all surfaced in the Security tab                                                     | Catch code and supply-chain issues early                                                        |
| Releases                 | Tag `vX.Y.Z` triggers git-cliff changelog and notes, version bump committed back, CycloneDX SBOM, SLSA attestations, assets attached to the Release | Reproducible, auditable releases from commit history                                            |
| Dependabot               | Weekly npm updates (dev deps grouped) and grouped github-actions updates                                                                            | Stay patched, grouping avoids partial bumps that break paired steps such as CodeQL              |
| SHA-pinned actions       | Every action is pinned to a full commit SHA with a version comment                                                                                  | A moved tag cannot swap the code, Dependabot keeps the SHAs current                             |
| Pinned bun               | Runtime version fixed in `.bun-version`                                                                                                             | Same runtime locally and in CI                                                                  |

## Project structure

```
apps/web/          Vue 3 + Vite app (the default workspace)
packages/          shared packages (add as needed)
.github/workflows/ CI, CodeQL, Scorecard, dependency-review, release
scripts/init.ts    one-time template initializer (removed after first run)
```

## Adding a backend or shared package

Create `apps/api` or `packages/shared` with its own `package.json`, extend
`tsconfig.base.json`, and the root workspace globs pick it up. Root scripts
(`build`, `test`, `typecheck`) fan out to every workspace.

## License

Apache-2.0. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
