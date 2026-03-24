export interface ExampleTransaction {
  name: string;
  description: string;
  txHash: string;
  contractName: string;
}

/**
 * Example mainnet transactions for well-known DeFi protocols.
 * Each hash corresponds to a real Ethereum mainnet transaction that
 * interacts with a contract covered by the ERC-7730 registry.
 */
export const exampleTransactions: ExampleTransaction[] = [
  {
    name: "Uniswap V3 Swap",
    description: "Token swap on the Uniswap V3 SwapRouter02",
    txHash:
      "0x05c2c10410696f9a808d0059aa11cfd9616309117c3e294cfed2dd1ac8729874",
    contractName: "UniswapV3Router02",
  },
  {
    name: "Lido stETH Submit",
    description: "Stake ETH via Lido to receive stETH",
    txHash:
      "0x450c5259de51e99ad030963694108287f28d6114e3c74d2bebb8b2c4a5e962ff",
    contractName: "stETH",
  },
  {
    name: "Aave V3 Supply",
    description: "Supply assets to the Aave V3 lending pool",
    txHash:
      "0x161eb2ae91cc0dafe91e723b7147fa7c3b4b74f1437b3c9c3df8075cf4c31986",
    contractName: "Aave Pool V3",
  },
  {
    name: "WETH Deposit",
    description: "Wrap ETH into WETH (Wrapped Ether)",
    txHash:
      "0x7fd3cca7ea85567a7741fed3d6ca181d1ffd6e8002e6771d15c8911ebfde872d",
    contractName: "WETH",
  },
  {
    name: "1inch Swap",
    description: "Token swap via 1inch Aggregation Router V6",
    txHash:
      "0x5b7436fc0e9a0e53428d340742bbb7b794036dae25a0be7f909a30756121bb16",
    contractName: "AggregationRouterV6",
  },
  {
    name: "Aave V3 Borrow",
    description: "Borrow assets from the Aave V3 lending pool",
    txHash:
      "0x6a616c9af331e404c41924973a49ad0acffbc986bd4cfff8f6d15cae40f36726",
    contractName: "Aave Pool V3",
  },
];
