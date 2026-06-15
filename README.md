# Onboarding SDK

This guide is for developers working on the SDK itself. For usage instructions, see the [API docs repo](https://github.com/payroll-integrations-inc/api-docs/).

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/)

## Setup

```bash
git clone <repo-url>
cd onboarding-sdk
pnpm install
```

## Development & Testing

Start the dev server to run the testbed app in your browser:

```bash
pnpm dev
```

The testbed app lets you exercise the SDK against any backend environment. The available environments are defined in [src/testbed/constants.ts](src/testbed/constants.ts) and include local, qa, dev, demo, and prod targets.

To test onboarding:

1. Open the application at `http://localhost:5173/`
2. In the environment dropdown, select the environment you are testing against
3. In the URL field, paste a valid onboarding URL with its token parameter
4. Click `Bootstrap`

## Automated Tests

Automated tests use [Vitest](https://vitest.dev/) with a jsdom environment. Coverage is collected automatically.

```bash
pnpm test
```

Test files live alongside source files and are named `*.spec.ts`. The primary test suite is [src/main.spec.ts](src/main.spec.ts).

## Building

```bash
pnpm build
```

Output is written to [dist/](dist/). The library is built in both ES module (`onboarding-sdk.js`) and UMD (`onboarding-sdk.umd.cjs`) formats.

## Releasing new versions

To release a new version:

1. Create a new commit updating the version in `package.json`, and merge it to development
2. Create a PR merging development -> main
3. Once merged, create a new tag of the format `vX.Y.Z` or `vW.X.Y-alpha.Z` that matches the version in `package.json`

## Commit Messages

A git hook (`githooks/prepare-commit-msg`) automatically prepends the ticket ID from your branch name to each commit message. Branches should be named in the format `PI-1234` or `PI-1234-description`.

> The hook is marked deprecated — conventional commits format (`feat: description`, `fix: description`) is preferred going forward.

## Project Structure

| Path | Purpose |
|---|---|
| `src/main.ts` | SDK entry point — exports `bootstrap` |
| `src/interfaces.ts` | TypeScript types and interfaces |
| `src/constants.ts` | Default values (host URL, selectors, message source) |
| `src/main.spec.ts` | Unit tests |
| `src/testbed/` | Local dev app for manual testing |
| `dist/` | Build output (not committed) |
| `githooks/` | Git hooks installed via `prepare` script |
