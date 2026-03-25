import { createPublicClient, http } from "viem";
import type { PublicClient } from "viem";
import { mainnet } from "viem/chains";
import type { ChainConfig } from "../config/chains";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- config will be used for multi-chain/user RPCs
export function createClient(_config: ChainConfig): PublicClient {
  return createPublicClient({
    chain: mainnet,
    transport: http("https://ethereum-rpc.publicnode.com"),
  });
}
