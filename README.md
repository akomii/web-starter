# {{PROJECT_NAME}}

<!-- template:start -->

> **This repo was generated from the `web-starter` template.** Run the one-time setup before anything else:
>
> ```sh
> bun install      # installs deps and git hooks
> bun run init     # fills in name, slug, author, owner; strips this banner; self-deletes
> ```
>
> `init` reads your `git remote` to guess the slug, prompts for the rest, and rewrites the placeholders (`{{PROJECT_NAME}}`, `{{REPO_SLUG}}`, `{{DESCRIPTION}}`, `{{AUTHOR}}`, `{{OWNER}}`) across the repo. After it runs, review the diff, commit, then do the one-time GitHub steps under [Repository settings](#repository-settings).

<!-- template:end -->

[![Verify](https://github.com/{{REPO_SLUG}}/actions/workflows/verify.yml/badge.svg)](https://github.com/{{REPO_SLUG}}/actions/workflows/verify.yml)
[![CodeQL](https://github.com/{{REPO_SLUG}}/actions/workflows/scan-codeql.yml/badge.svg)](https://github.com/{{REPO_SLUG}}/actions/workflows/scan-codeql.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/{{REPO_SLUG}}/badge)](https://securityscorecards.dev/viewer/?uri=github.com/{{REPO_SLUG}})
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)
[![Release](https://img.shields.io/github/v/release/{{REPO_SLUG}})](https://github.com/{{REPO_SLUG}}/releases)

# {{DESCRIPTION}}

## Stack

bun workspaces monorepo, Vue 3 + TypeScript (Vite), Vitest, ESLint (flat) + Prettier, lefthook with shared hooks from aktin-github-scripts, tag-driven releases via git-cliff, and a hardened GitHub Actions pipeline (CI, CodeQL, Scorecard, dependency review, SBOM, build attestations).

## Getting started

Prerequisites: [bun](https://bun.sh) on PATH (the version is pinned in `.bun-version`). The shared git hooks need `python3`, `gitleaks`, `actionlint`, `hadolint` and `shellcheck` on PATH. A missing tool fails the commit, hadolint and shellcheck are only called when a Dockerfile or shell script is staged.

```sh
bun install        # deps + git hooks
bun run dev        # start the web app (apps/web)
bun run test       # unit tests with coverage
bun run typecheck  # vue-tsc
bun run lint       # eslint
bun run format     # prettier
bun run build      # production build
```

The coverage report lands in `apps/web/coverage/index.html`.

Commits must follow [Conventional Commits](https://www.conventionalcommits.org), enforced by the commit-msg hook:

```
<type>(<optional scope>): <subject>
```

Allowed types are `feat fix docs style refactor perf test chore`, the subject starts lowercase and has no trailing period, every line of the message stays at most 100 characters. Cut a release by pushing a `vX.Y.Z` tag, for example `git tag v1.0.0 && git push origin v1.0.0`.

## Repository settings

Generating a repo from a template copies files and branches only, never settings, so these one-time steps stay manual. Do them after `bun run init`. What the workflows and rules do once they are set up is described in [.github/workflows/README.md](.github/workflows/README.md).

| Setting                           | Where and what to do                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Why                                                                                                             |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Branch ruleset on `main`          | Settings → Rules → Rulesets → New ruleset → New branch ruleset. Name `default`, enforcement status Active, target the default branch. Bypass list: Organization admin. A repository under a personal account has no organisation admin, add Repository admin instead, otherwise the only maintainer cannot merge their own pull requests. Rules: restrict deletions, block force pushes, require signed commits, require a pull request (1 approval, code owner review, dismiss stale approvals on push, approval of the most recent push, all conversations resolved, squash only), require the status checks `verify / verify` and `review / review`, require CodeQL code scanning results (security alerts high or higher, alerts errors) | Keeps unreviewed, unsigned or broken code off `main`                                                            |
| Tag ruleset on `v*`               | Same screen, New tag ruleset. Name `release-tags`, enforcement status Active, target `refs/tags/v*`. Rules: restrict creations, updates and deletions. Bypass list: admins and maintainers only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Releases are tag-driven, without the rule anyone with push access can cut one                                   |
| Workflow permissions              | Settings → Actions → General → Read repository contents and packages permissions, do not allow GitHub Actions to create or approve pull requests                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Every workflow declares its own `permissions`, the release workflow requests `contents: write` itself           |
| Fork PR approval                  | Settings → Actions → General, require approval for all external contributors                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Keeps untrusted fork code from running workflows before a maintainer has looked                                 |
| Pull request creation             | Settings → General, in the dropdown under "Pull requests" select Collaborators only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Only people with access to the repository can open pull requests                                                |
| Merge settings                    | Settings → General → Pull Requests. Allow squash merging only, default to the pull request title with a blank message, always suggest updating pull request branches, auto-delete head branches                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | One conventional subject per PR lands on `main`, which is what git-cliff reads for the release notes            |
| Commit sign-off                   | Settings → General, require contributors to sign off on web-based commits                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Commits made in the browser carry the same attribution as local ones                                            |
| Immutable releases                | Settings → General → Releases, select Enable release immutability                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | A published release, its files and its tag cannot be changed afterwards                                         |
| Code scanning                     | Runs from `scan-codeql.yml`, keep "Default setup" off in Settings → Advanced Security                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Default setup conflicts with the advanced workflow                                                              |
| Secret scanning + push protection | Settings → Advanced Security, on by default for public repos                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Blocks committed credentials                                                                                    |
| Dependabot alerts                 | Settings → Advanced Security, enable Dependabot alerts and security updates                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `dependabot.yml` only schedules version updates, the vulnerability alerts and auto-fix PRs are separate toggles |
| Labels                            | Issues → Labels. Delete `duplicate` and `invalid`, add `critical` (`B60205`, "Blocking release or core functionality") and `minor` (`FEF2C0`, "Low impact issue")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Same triage labels in every repo                                                                                |
| Template toggle                   | Leave "Template repository" off if this repo was made from the template                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Prevents re-templating                                                                                          |
| Housekeeping                      | Settings → General. Set description and topics, untick Wikis and Projects if unused                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Discoverability, fewer places for stale content                                                                 |

### Private repositories

In a private repository CodeQL and the dependency review need GitHub Code Security, and artifact attestations need GitHub Enterprise Cloud. Without Code Security the check `review / review` and the CodeQL rule cannot pass, so no pull request can be merged. Without Enterprise Cloud the release fails. To release without SBOM and attestations, add the input `attest: false` to the job `build` in `.github/workflows/release.yml`:

```yaml
build:
  needs: verify
  permissions:
    contents: read
    id-token: write
    attestations: write
  uses: aktin/aktin-github-scripts/.github/workflows/build-web.yml@main
  with:
    attest: false
```

### Optional: integration branch `dev`

Only if features should collect on `dev` before a release lands on `main`. Feature PRs then squash into `dev` and `dev` merges into `main` with a merge commit, so the two never diverge and `main` keeps mirroring the released state.

1. Create `dev` from `main`.
2. Add a branch ruleset `dev` like `default`, with the target `refs/heads/dev` and the same bypass list. Rules: restrict deletions, block force pushes, require signed commits, require a pull request (1 approval, all conversations resolved, squash only), require the status checks `verify / verify` and `review / review`.
3. In the ruleset `default` target `refs/heads/main` explicitly instead of the default branch and allow merge commits only.
4. In Settings → General → Pull Requests also allow merge commits.
5. In `.github/dependabot.yml` add `target-branch: dev` to every entry, for example:

   ```yaml
   - package-ecosystem: bun
     directory: /
     target-branch: dev
   ```

The workflows already run their checks on pull requests into `dev`.

## How the infra works

| Component                  | What it does                                                                                                                                                                                                                                                                                                          | Why                                                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| bun monorepo               | `apps/*` + `packages/*`, one lockfile, shared tooling at the root                                                                                                                                                                                                                                                     | Add a backend (`apps/api`) or shared code (`packages/shared`) later without reworking the setup                       |
| ESLint (flat) + Prettier   | ESLint owns correctness, Prettier owns formatting                                                                                                                                                                                                                                                                     | No rule conflicts, one formatter of record                                                                            |
| Vitest + coverage          | Unit tests with an 80% line gate (`thresholds`)                                                                                                                                                                                                                                                                       | Regressions surface locally and in CI                                                                                 |
| lefthook + shared hooks    | All hooks come from aktin-github-scripts. pre-commit formats and lints staged files, scans for secrets with gitleaks, lints staged workflows, Dockerfiles and shell scripts and rejects data files, large files and oversized commits, commit-msg enforces Conventional Commits, pre-push runs typecheck, test, build | Catch problems locally, keep history parseable for the changelog                                                      |
| GitHub workflows and rules | Verify, CodeQL, dependency review, Scorecard, release, Dependabot and the rulesets on `main`, the optional `dev` and tags `v*`. What each one does and when it runs is described in [.github/workflows/README.md](.github/workflows/README.md)                                                                        | Repeats the checks of the hooks where `--no-verify` cannot skip them, adds the security scans and builds the releases |
| Pinned bun                 | Runtime version fixed in `.bun-version`                                                                                                                                                                                                                                                                               | Same runtime locally and in CI                                                                                        |

## Project structure

```
apps/web/          Vue 3 + Vite app (the default workspace)
packages/          shared packages (add as needed)
.github/workflows/ verify, CodeQL, dependency review, Scorecard, release and their README.md
SECURITY.md         security policy
scripts/init.ts    one-time template initializer (removed after first run)
```

## Adding a backend or shared package

Create `apps/api` or `packages/shared` with its own `package.json`, extend `tsconfig.base.json`, and the root workspace globs pick it up. Root scripts (`build`, `test`, `typecheck`) fan out to every workspace.

## License

Apache-2.0. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
