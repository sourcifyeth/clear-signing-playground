# CLAUDE.md

## Project overview

Clear Signing Playground — a React web app for trying out the `@ethereum-sourcify/clear-signing` library, which implements [EIP-7730](https://eips.ethereum.org/EIPS/eip-7730) clear signing (human-readable transaction previews).

## Tech stack

- **React 19** + **TypeScript** (strict) + **Vite**
- **Tailwind CSS v4** with Sourcify-inspired theme (Cerulean Blue / Light Coral, IBM Plex fonts)
- **viem** for Ethereum RPC calls
- **`@ethereum-sourcify/clear-signing`** from npm.

## Key commands

```bash
npm run dev             # Start dev server
npm run build           # Full build (chain-info + tsc + vite)
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

### Registry index (runtime)

The ERC-7730 registry index is fetched once at app startup via `fetchPrebuiltRegistryIndex()` from the library (see `src/hooks/useRegistryIndex.ts`) and reused for every `format()` call. If the index hasn't loaded yet (or fetch failed), `format()` is called without `index` — the library falls back to re-fetching the prebuilt indexes on each call.

### Chain configuration

Chains are fetched at runtime from `https://chainid.network/chains.json`. Currently only Ethereum mainnet (chain ID 1) is supported, but the architecture is extensible to multi-chain via `SUPPORTED_CHAIN_IDS` in `src/config/chains.ts`.

### Services (`src/services/`)

- `viemClient.ts` — creates a viem `PublicClient` from chain config RPCs
- `externalDataProvider.ts` — implements the library's `ExternalDataProvider` (ENS resolution, ERC-20 token metadata, NFT collection names via viem)
- `transactionService.ts` — fetches raw transactions and converts to the library's `Transaction` format

### Components (`src/components/`)

Mobile-first, Sourcify-themed UI. Key components:

- `ClearSigningDisplay` — renders the library's `DisplayModel` (supports both flat `DisplayField` and `DisplayFieldGroup`)
- `ViewToggle` — toggle between raw tx view and clear signing view (visible only on small screens; large screens show side-by-side)
- `ExampleTransactions` — preset mainnet transaction chips

### App flow

1. Load chains from chainid.network → create viem client
2. In parallel, fetch the prebuilt ERC-7730 registry index once
3. User enters tx hash or picks an example
4. Fetch raw tx → format with library (passing the cached index when available) → show both raw and clear signing views (side-by-side on large screens, tabbed on small screens)

## Updating the library

`@ethereum-sourcify/clear-signing` is a regular npm dependency. To update:

1. `npm install @ethereum-sourcify/clear-signing@latest`
2. Check for type changes in `node_modules/@ethereum-sourcify/clear-signing/dist/types.d.ts`

## Known TODOs

- Proxy resolution (EIP-1967) for proxy contract descriptor lookup
- Multi-chain support (currently mainnet only)
- User-provided RPC endpoints
