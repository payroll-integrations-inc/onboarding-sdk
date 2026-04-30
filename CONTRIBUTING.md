# Contributing to the Onboarding SDK

This guide is for developers working on the SDK itself.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/)

## Setup

```bash
git clone <repo-url>
cd onboarding-sdk
pnpm install
```

## Development

Start the dev server to run the testbed app in your browser:

```bash
pnpm dev
```

The testbed app lets you exercise the SDK against any backend environment. The available environments are defined in [src/testbed/constants.ts](src/testbed/constants.ts) and include local, qa, dev, demo, and prod targets.

## Testing

Tests use [Vitest](https://vitest.dev/) with a jsdom environment. Coverage is collected automatically.

```bash
pnpm test
```

Test files live alongside source files and are named `*.spec.ts`. The primary test suite is [src/main.spec.ts](src/main.spec.ts).

## Building

```bash
pnpm build
```

Output is written to [dist/](dist/). The library is built in both ES module (`onboarding-sdk.js`) and UMD (`onboarding-sdk.umd.cjs`) formats.

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
