# Clear Signing Playground

A web interface for trying out **clear signing** using the [@sourcifyeth/clear-signing](https://github.com/sourcifyeth/clear-signing) library.

Clear signing transforms raw, opaque transaction data into human-readable descriptions by leveraging [EIP-7730](https://eips.ethereum.org/EIPS/eip-7730) descriptors. This playground lets you paste any Ethereum mainnet transaction hash (or pick from example transactions) and see side-by-side how the raw calldata maps to a structured, user-friendly display.

## Setup

```bash
# Install dependencies
npm install

# Build the ERC-7730 registry index (fetches and caches descriptor metadata)
npm run build:index

# Start the dev server
npm run dev
```

## Registry index caching

The `npm run build:index` step fetches the ERC-7730 descriptor registry from GitHub and writes a compact index to `src/generated/registry-index.json`. This file is committed so that `npm run dev` works without a network fetch, but you can re-run `npm run build:index` at any time to pick up newly published descriptors.

## TODO

- **Proxy resolution**: implement EIP-1967 proxy detection to resolve implementation addresses for proxy contracts.

## Links

- [clear-signing library](https://github.com/sourcifyeth/clear-signing)
- [EIP-7730 specification](https://eips.ethereum.org/EIPS/eip-7730)
- [Sourcify](https://sourcify.dev/)
