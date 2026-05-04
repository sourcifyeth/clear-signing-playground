import type { PublicClient } from "viem";
import type {
  DescriptorAddressType,
  ExternalDataProvider,
} from "@sourcifyeth/clear-signing";
import chainInfo from "../generated/chain-info.json";

const erc20Abi = [
  {
    type: "function" as const,
    name: "name",
    inputs: [],
    outputs: [{ type: "string" as const }],
    stateMutability: "view" as const,
  },
  {
    type: "function" as const,
    name: "symbol",
    inputs: [],
    outputs: [{ type: "string" as const }],
    stateMutability: "view" as const,
  },
  {
    type: "function" as const,
    name: "decimals",
    inputs: [],
    outputs: [{ type: "uint8" as const }],
    stateMutability: "view" as const,
  },
] as const;

const CONTRACT_TYPES = new Set<DescriptorAddressType>([
  "contract",
  "token",
  "collection",
]);
const EOA_TYPES = new Set<DescriptorAddressType>(["eoa", "wallet"]);

export function createExternalDataProvider(
  client: PublicClient,
): ExternalDataProvider {
  return {
    resolveEnsName: async (
      address: string,
      acceptedTypes?: DescriptorAddressType[],
    ) => {
      try {
        const ensName = await client.getEnsName({
          address: address as `0x${string}`,
        });

        if (!ensName) {
          return null;
        }

        let typeMatch = true;

        const needsContractCheck =
          acceptedTypes?.some(
            (t) => CONTRACT_TYPES.has(t) || EOA_TYPES.has(t),
          ) ?? false;

        if (needsContractCheck) {
          try {
            const code = await client.getCode({
              address: address as `0x${string}`,
            });
            const isContract =
              code !== undefined &&
              code !== "0x" &&
              code !== "0x0" &&
              // EIP-7702 delegation designator prefix
              !code.startsWith("0xef0100");

            const wantsContract = acceptedTypes?.some((t) =>
              CONTRACT_TYPES.has(t),
            );
            const wantsEoa = acceptedTypes?.some((t) => EOA_TYPES.has(t));

            if (wantsContract && !wantsEoa) {
              typeMatch = isContract;
            } else if (wantsEoa && !wantsContract) {
              typeMatch = !isContract;
            }
          } catch {
            typeMatch = true;
          }
        }

        return { name: ensName, typeMatch };
      } catch {
        return null;
      }
    },

    resolveToken: async (_chainId: number, tokenAddress: string) => {
      try {
        const typedAddress = tokenAddress as `0x${string}`;

        const results = await client.multicall({
          contracts: [
            {
              address: typedAddress,
              abi: erc20Abi,
              functionName: "name",
            },
            {
              address: typedAddress,
              abi: erc20Abi,
              functionName: "symbol",
            },
            {
              address: typedAddress,
              abi: erc20Abi,
              functionName: "decimals",
            },
          ],
        });

        const nameResult = results[0];
        const symbolResult = results[1];
        const decimalsResult = results[2];

        if (
          nameResult.status !== "success" ||
          symbolResult.status !== "success" ||
          decimalsResult.status !== "success"
        ) {
          return null;
        }

        return {
          name: nameResult.result,
          symbol: symbolResult.result,
          decimals: decimalsResult.result,
        };
      } catch {
        return null;
      }
    },

    resolveNftCollectionName: async (
      _chainId: number,
      collectionAddress: string,
    ) => {
      try {
        const name = await client.readContract({
          address: collectionAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "name",
        });

        return { name };
      } catch {
        return null;
      }
    },

    resolveBlockTimestamp: async (_chainId: number, blockHeight: bigint) => {
      try {
        const block = await client.getBlock({ blockNumber: blockHeight });
        return { timestamp: Number(block.timestamp) };
      } catch {
        return null;
      }
    },

    resolveChainInfo: (chainId: number) => {
      const entry = chainInfo[String(chainId)];
      if (!entry) {
        return Promise.resolve(null);
      }
      return Promise.resolve(entry);
    },
  };
}
