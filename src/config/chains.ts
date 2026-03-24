export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrls: string[];
}

export type ChainsData = {
  name: string;
  chain: string;
  chainId: number;
  rpc: string[];
  faucets: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  infoURL: string;
  shortName: string;
  networkId: number;
  slip44?: number;
  ens?: { registry: string };
  explorers?: { name: string; url: string; standard: string }[];
}[];

export const SUPPORTED_CHAIN_IDS: readonly number[] = [1] as const;

export const DEFAULT_CHAIN_ID = 1;

export async function fetchChainConfigs(): Promise<ChainConfig[]> {
  const response = await fetch("https://chainid.network/chains.json");

  if (!response.ok) {
    throw new Error(
      `Failed to fetch chain configs: ${response.status.toString()} ${response.statusText}`,
    );
  }

  const data: ChainsData = (await response.json()) as ChainsData;

  const supportedSet = new Set(SUPPORTED_CHAIN_IDS);

  const configs: ChainConfig[] = [];

  for (const entry of data) {
    if (!supportedSet.has(entry.chainId)) {
      continue;
    }

    const rpcUrls = entry.rpc.filter(
      (url) => url.startsWith("https://") && !url.includes("${"),
    );

    configs.push({
      chainId: entry.chainId,
      name: entry.name,
      rpcUrls,
    });
  }

  return configs;
}
