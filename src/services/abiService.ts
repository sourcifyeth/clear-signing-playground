import type { Abi, PublicClient } from "viem";
import type { RegistryIndex } from "@ethereum-sourcify/clear-signing";
import { getDescriptorRawUrl } from "./registryLinks";

const SOURCIFY_SERVER = "https://sourcify.dev/server";

const cache = new Map<string, Promise<Abi | undefined>>();

interface SourcifyContract {
  abi?: unknown;
  proxyResolution?: {
    isProxy?: boolean;
    implementations?: { address: string }[];
  };
}

async function fetchSourcifyContract(
  chainId: number,
  address: string,
  withProxy: boolean,
): Promise<SourcifyContract | undefined> {
  const fields = withProxy ? "abi,proxyResolution" : "abi";
  const url = `${SOURCIFY_SERVER}/v2/contract/${chainId.toString()}/${address}?fields=${fields}`;
  const response = await fetch(url);
  if (!response.ok) {
    return undefined;
  }
  return (await response.json()) as SourcifyContract;
}

function abiOf(contract: SourcifyContract | undefined): Abi | undefined {
  return contract !== undefined && Array.isArray(contract.abi)
    ? (contract.abi as Abi)
    : undefined;
}

function hasImplementationGetter(abi: Abi): boolean {
  return abi.some(
    (item) =>
      item.type === "function" &&
      item.name === "implementation" &&
      item.inputs.length === 0 &&
      (item.stateMutability === "view" || item.stateMutability === "pure"),
  );
}

/**
 * Find implementation addresses behind a proxy:
 * 1. Sourcify's proxy detection (EIP-1967 and similar).
 * 2. An `implementation()` view function on the proxy (e.g. Aragon AppProxy).
 */
async function resolveImplementations(
  client: PublicClient,
  address: string,
  contract: SourcifyContract,
  proxyAbi: Abi,
): Promise<string[]> {
  const detected = contract.proxyResolution?.implementations ?? [];
  if (contract.proxyResolution?.isProxy === true && detected.length > 0) {
    return detected.map((impl) => impl.address);
  }
  if (hasImplementationGetter(proxyAbi)) {
    try {
      const impl = await client.readContract({
        address: address as `0x${string}`,
        abi: proxyAbi,
        functionName: "implementation",
      });
      if (typeof impl === "string" && /^0x[0-9a-fA-F]{40}$/.test(impl)) {
        return [impl];
      }
    } catch {
      // not a proxy after all
    }
  }
  return [];
}

async function fetchFromSourcify(
  client: PublicClient,
  chainId: number,
  address: string,
): Promise<Abi | undefined> {
  const contract = await fetchSourcifyContract(chainId, address, true);
  const proxyAbi = abiOf(contract);
  if (contract === undefined || proxyAbi === undefined) {
    return undefined;
  }
  const implementations = await resolveImplementations(
    client,
    address,
    contract,
    proxyAbi,
  );
  const implAbis = await Promise.all(
    implementations.map(async (impl) =>
      abiOf(await fetchSourcifyContract(chainId, impl, false)),
    ),
  );
  // Implementation functions first so they win over proxy admin functions.
  return [
    ...implAbis.flatMap((abi) => abi ?? []),
    ...proxyAbi,
  ] as unknown as Abi;
}

async function fetchFromDescriptor(
  index: RegistryIndex | null,
  chainId: number,
  address: string,
): Promise<Abi | undefined> {
  const url =
    index === null ? undefined : getDescriptorRawUrl(index, chainId, address);
  if (url === undefined) {
    return undefined;
  }
  const response = await fetch(url);
  if (!response.ok) {
    return undefined;
  }
  const data = (await response.json()) as {
    context?: { contract?: { abi?: unknown } };
  };
  const abi = data.context?.contract?.abi;
  // The descriptor may also carry a URL string instead of an inline ABI.
  return Array.isArray(abi) ? (abi as Abi) : undefined;
}

/**
 * Fetch the ABI of a contract: Sourcify first (following proxies to their
 * implementation), then the inline ABI of the ERC-7730 descriptor.
 * Results are cached per chain + address.
 */
export function fetchAbi(
  client: PublicClient,
  registryIndex: RegistryIndex | null,
  chainId: number,
  address: string,
): Promise<Abi | undefined> {
  const key = `${chainId.toString()}:${address.toLowerCase()}`;
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const promise = (async () => {
    try {
      const fromSourcify = await fetchFromSourcify(client, chainId, address);
      if (fromSourcify !== undefined) {
        return fromSourcify;
      }
    } catch {
      // fall through
    }
    try {
      return await fetchFromDescriptor(registryIndex, chainId, address);
    } catch {
      return undefined;
    }
  })();
  cache.set(key, promise);
  return promise;
}
