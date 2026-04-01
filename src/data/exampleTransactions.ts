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
      "0x675a2e96e48b77e5d8edc16bfc4dc2ea7547f950edb76fdeff40e8af250d897e",
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
      "0xb0bd1c520f3b43405bb23f94f2a7f18e0fd0b671dc606516f3d0f9c9a199b608",
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
      "0xc8b5160898209df85207b18194b1e3a672b8e6c59548a434fa2de798b3a686f2",
    contractName: "AggregationRouterV6",
  },
  {
    name: "Aave V3 Borrow",
    description: "Borrow assets from the Aave V3 lending pool",
    txHash:
      "0x78117e5a10483522f88edc342f9482b6c33da2f60afb27d4329a128acd6f5c6c",
    contractName: "Aave Pool V3",
  },
];
