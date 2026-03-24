# Clear Signing Playground - Implementation Plan

## Phase 1: Project Scaffolding & Configuration (Sequential)

**Goal**: Set up Vite + React + TypeScript project with all tooling and dependencies.

**Creates**:
- `package.json` — Vite React TS project with deps: `@sourcifyeth/clear-signing` (git dep: `github:sourcifyeth/clear-signing`), `viem`, `react`, `react-dom`, Tailwind CSS v4, ESLint (copied from clear-signing lib), Prettier, IBM Plex fonts
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — Strict TypeScript inspired by the library's config
- `vite.config.ts` — Vite React plugin
- `eslint.config.js` — Based on clear-signing lib's config with needed deps
- `.prettierrc` — Prettier config
- `.gitignore` — Ignore `node_modules/`, `dist/`, `.claude/`, `src/generated/*.json`, and other standard entries
- `index.html` — Entry HTML
- `src/main.tsx` — React entry point
- `src/App.tsx` — Minimal shell
- `src/app.css` — Tailwind imports + Sourcify theme (Cerulean Blue `#2b50aa`, Light Coral `#ff858d`, IBM Plex Sans/Mono fonts, global styles)

**Validation**: `npm install` succeeds, `npm run build` succeeds, `npx tsc --noEmit` passes, ESLint passes

**Commit**: Git commit all Phase 1 files

---

## Phase 2: Build Infrastructure - Registry Index (Sequential)

**Goal**: Pre-build script to generate the ERC-7730 registry index using `createGitHubRegistryIndex()` with dev caching.

**Creates**:
- `scripts/build-index.ts` — Calls `createGitHubRegistryIndex()`, writes JSON to `src/generated/registry-index.json`, caches with timestamp (skips rebuild if <1 week old in dev)
- `src/generated/.gitkeep` — Keep directory tracked
- `package.json` updates — Add `build:index` script, integrate into `prebuild`

**Reads**: `@sourcifyeth/clear-signing` exports for `createGitHubRegistryIndex` and `RegistryIndex` types

**Validation**: `npm run build:index` generates the index file, caching works on re-run, `npm run build` still succeeds

**Commit**: Git commit Phase 2 files

---

## Phase 3: Core Services (Parallel — 3 sub-tasks)

**Goal**: Implement blockchain interaction layer and data providers.

### 3A — Viem Client & Chain Config
- `src/config/chains.ts` — Chain type definition, fetch chains from `chainid.network/chains.json`, extract RPC for chain ID 1, architecture extensible for multi-chain
- `src/services/viemClient.ts` — Create viem `PublicClient` for Ethereum mainnet using RPC from chains list, with fallback. Extensible for user-provided RPCs later.
- `src/hooks/useChains.ts` — React hook to load chains with loading state

### 3B — ExternalDataProvider
- `src/services/externalDataProvider.ts` — Implements `ExternalDataProvider` interface:
  - `resolveEnsName`: viem `getEnsName()` for reverse resolution
  - `resolveToken`: viem multicall for ERC-20 `name()`, `symbol()`, `decimals()`
  - `resolveNftCollectionName`: viem `readContract` calling `name()` on NFT contract
  - `resolveLocalName`: not implemented

### 3C — Transaction Service & Example Data
- `src/services/transactionService.ts` — Fetch tx by hash via viem, transform to library's `Transaction` type
- `src/data/exampleTransactions.ts` — 4-6 real mainnet tx hashes for contracts in the registry. Find mainnet contract addresses from the `context` field in descriptor files at `LedgerHQ/clear-signing-erc7730-registry`, then find real transaction hashes from Etherscan for those contracts (Uniswap V3, Lido stETH, Aave V3, WETH, 1inch, etc.)

**Validation**: TypeScript compiles, build succeeds, code review for viem usage correctness

**Commit**: Git commit Phase 3 files

---

## Phase 4: UI Components (Sequential, depends on Phase 3)

**Goal**: Build all React components with Sourcify-inspired styling, mobile-first.

**Components**:
- `src/components/Header.tsx` — App name, "Ethereum Mainnet" badge, links to GitHub repo (https://github.com/sourcifyeth/clear-signing-playground) + https://sourcify.dev/, responsive
- `src/components/TransactionInput.tsx` — Hash input + submit button, remains visible when results shown
- `src/components/ExampleTransactions.tsx` — Selectable example tx chips/cards, clicking fills input and auto-submits
- `src/components/RawTransactionView.tsx` — Raw tx data display (to, from, value, data), monospace, truncated calldata with expand
- `src/components/ClearSigningDisplay.tsx` — Renders DisplayModel: interpolatedIntent → intent → fields. Metadata behind collapsible. Warnings shown. rawCalldataFallback with warning if applicable
- `src/components/ViewToggle.tsx` — Toggle between Raw and Clear Signing views with fancy animation (slide/morph transition)
- `src/components/MetadataPopover.tsx` — Collapsible metadata display
- `src/components/LoadingSpinner.tsx` — Loading states
- `src/components/WarningBanner.tsx` — Warning display for fallback/errors

**Validation**: TypeScript compiles, build succeeds, code review for component quality, accessibility, responsive design

**Commit**: Git commit Phase 4 files

---

## Phase 5: App Integration & Polish (Sequential, depends on Phase 4)

**Goal**: Wire everything together, add animations, finalize README.

**Modifies**:
- `src/App.tsx` — Main orchestration: state management (tx hash, raw tx, DisplayModel, loading, active view), flow (input → fetch raw → show raw → delay → animate to clear signing), error handling, website loading state (chains.json fetch)
- `src/app.css` — Animation keyframes for view toggle transition
- `README.md` — Project description, setup/dev instructions, TODO for proxy resolution implementation

**Validation**: Full build succeeds, ESLint passes, code review for integration quality and all user flows

**Commit**: Git commit Phase 5 files

---

## Key Technical Decisions

- **Styling**: Tailwind CSS v4 with Sourcify-inspired theme (Cerulean Blue `#2b50aa`, Light Coral `#ff858d`, IBM Plex Sans/Mono)
- **RPC**: viem library, chains loaded from chainid.network/chains.json, Ethereum mainnet only for now but extensible
- **Registry Index**: Pre-built at build time via `createGitHubRegistryIndex()`, cached for 1 week in dev
- **No tests**: Validation via code review + build commands
- **Mobile-first**: All components designed for mobile first, scaled up for desktop

## Library API Reference

### Main Functions
- `format(transaction, externalDataProvider?, options?)` → `Promise<DisplayModel>`
- `formatTypedData(typedData, domain, externalDataProvider?, options?)` → `Promise<DisplayModel>`
- `createGitHubRegistryIndex(githubSource?)` → `Promise<RegistryIndex>`

### Transaction Type
```typescript
interface Transaction {
  chainId: number
  from?: string
  to?: string
  value?: string | number
  data?: string
}
```

### DisplayModel Type
```typescript
interface DisplayModel {
  intent: string | Record<string, string>
  fields: DisplayField[]
  interpolatedIntent?: string
  metadata: { owner?: string; contractName?: string; deployed?: { blockNumber: number } }
  rawCalldataFallback?: boolean
  warnings: Warning[]
}
```

### ExternalDataProvider Interface
```typescript
interface ExternalDataProvider {
  resolveLocalName?(address: string, options?: { expectedType?: "external" | "contract" }): Promise<string | undefined>
  resolveEnsName?(address: string, options?: { expectedType?: "external" | "contract" }): Promise<string | undefined>
  resolveToken?(tokenAddress: string): Promise<{ name: string; symbol: string; decimals: number } | undefined>
  resolveNftCollectionName?(contractAddress: string): Promise<string | undefined>
}
```

### FormatOptions (descriptorResolverOptions)
```typescript
// GitHub resolver (default)
{ type: "github"; index?: RegistryIndex; githubSource?: GitHubSource }

// Embedded resolver
{ type: "embedded"; index: RegistryIndex; descriptorDirectory: string }
```
