import { createPublicClient, http } from "viem";
import type { PublicClient } from "viem";
import { mainnet } from "viem/chains";
import type { ChainConfig } from "../config/chains";

export function createClient(config: ChainConfig): PublicClient {
  const rpcUrl: string | undefined = config.rpcUrls[0];

  return createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl),
  });
}
