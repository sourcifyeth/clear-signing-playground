# CLAUDE.md

## Project overview

Clear Signing Playground — a React web app for trying out the `@sourcifyeth/clear-signing` library, which implements [EIP-7730](https://eips.ethereum.org/EIPS/eip-7730) clear signing (human-readable transaction previews).

## Tech stack

- **React 19** + **TypeScript** (strict) + **Vite**
- **Tailwind CSS v4** with Sourcify-inspired theme (Cerulean Blue / Light Coral, IBM Plex fonts)
- **viem** for Ethereum RPC calls
- **`@sourcifyeth/clear-signing`** as a git dependency (pinned to a commit hash in package.json). The library builds at install time via its `prepare` script.

## Key commands

```bash
npm run dev             # Start dev server
npm run build           # Full build (index + tsc + vite)
npm run build:index     # Rebuild ERC-7730 registry index
npm run build:index:force  # Force rebuild (ignores cache)
npm run lint            # ESLint
npm run format          # Prettier
```

## Validation

There are no tests. Validate with:
- `npm run build` (includes `tsc -b`)
- `npx eslint .` (must have 0 errors)

## TypeScript strictness

The tsconfig is very strict. Watch out for:
- `noUncheckedIndexedAccess` — array/object index access returns `T | undefined`
- `exactOptionalPropertyTypes` — cannot assign `undefined` to optional props
- `noPropertyAccessFromIndexSignature` — must use bracket notation for index sigs
- `verbatimModuleSyntax` — use `import type` for type-only imports

## Architecture

### Registry index (build-time)
`scripts/build-index.ts` calls `createGitHubRegistryIndex()` from the library to fetch ERC-7730 descriptor metadata from the LedgerHQ registry on GitHub. Output goes to `src/generated/registry-index.json` (gitignored). Cached for 1 week in dev; use `--force` to rebuild.

### Chain configuration
Chains are fetched at runtime from `https://chainid.network/chains.json`. Currently only Ethereum mainnet (chain ID 1) is supported, but the architecture is extensible to multi-chain via `SUPPORTED_CHAIN_IDS` in `src/config/chains.ts`.

### Services (`src/services/`)
- `viemClient.ts` — creates a viem `PublicClient` from chain config RPCs
- `externalDataProvider.ts` — implements the library's `ExternalDataProvider` (ENS resolution, ERC-20 token metadata, NFT collection names via viem)
- `transactionService.ts` — fetches raw transactions and converts to the library's `Transaction` format

### Components (`src/components/`)
Mobile-first, Sourcify-themed UI. Key components:
- `ClearSigningDisplay` — renders the library's `DisplayModel` (supports both flat `DisplayField` and `DisplayFieldGroup`)
- `ViewToggle` — animated toggle between raw tx view and clear signing view
- `ExampleTransactions` — preset mainnet transaction chips

### App flow
1. Load chains from chainid.network → create viem client
2. User enters tx hash or picks an example
3. Fetch raw tx → show raw view → short delay → format with library → animate to clear signing view

## Updating the library

The `@sourcifyeth/clear-signing` dependency is pinned to a git commit hash. To update:
1. Get the latest commit: `git ls-remote https://github.com/sourcifyeth/clear-signing.git HEAD`
2. Update the hash in `package.json`
3. `rm -rf node_modules/@sourcifyeth/clear-signing && npm install`
4. Check for type changes in `node_modules/@sourcifyeth/clear-signing/dist/types.d.ts`

## Known TODOs

- Proxy resolution (EIP-1967) for proxy contract descriptor lookup
- Multi-chain support (currently mainnet only)
- User-provided RPC endpoints
