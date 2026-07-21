# Contributing

## Prerequisites

[bun](https://bun.sh) is the package manager and runtime. The version is pinned in `.bun-version`.

```sh
bun install
```

This installs dependencies and sets up the git hooks (via lefthook).

## Development

```sh
bun run dev        # start the web app (apps/web)
bun run test       # unit tests with coverage
bun run typecheck  # vue-tsc
bun run lint       # eslint
bun run format     # prettier
bun run build      # production build
```

## Commits

Messages follow [Conventional Commits](https://www.conventionalcommits.org),
enforced by commitlint through the `commit-msg` hook.

## Pull requests

Make sure `bun run lint`, `bun run typecheck`, and `bun run test` pass. The
pre-push hook runs those plus the build.

## Releases

Push a `vX.Y.Z` tag. The release workflow builds the bundle, generates the
changelog and notes, produces an SBOM and attestations, and publishes the
GitHub Release.
