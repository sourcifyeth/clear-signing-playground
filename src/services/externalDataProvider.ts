import type { PublicClient } from "viem";
import type { ExternalDataProvider } from "@sourcifyeth/clear-signing";

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

const CONTRACT_TYPES = new Set(["contract", "token", "collection"]);
const EOA_TYPES = new Set(["eoa", "wallet"]);

export function createExternalDataProvider(
  client: PublicClient,
): ExternalDataProvider {
  return {
    resolveEnsName: async (address: string, type: string) => {
      try {
        const ensName = await client.getEnsName({
          address: address as `0x${string}`,
        });

        if (!ensName) {
          return null;
        }

        let typeMatch = true;

        if (CONTRACT_TYPES.has(type) || EOA_TYPES.has(type)) {
          try {
            const code = await client.getCode({
              address: address as `0x${string}`,
            });
            const isContract =
              code !== undefined && code !== "0x" && code !== "0x0";

            if (CONTRACT_TYPES.has(type)) {
              typeMatch = isContract;
            } else if (EOA_TYPES.has(type)) {
              typeMatch = !isContract;
            }
          } catch {
            // If we can't check code, default to true
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
  };
}
