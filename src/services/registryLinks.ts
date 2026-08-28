import type { RegistryIndex } from "@ethereum-sourcify/clear-signing";

const REGISTRY_REPO = "ethereum/clear-signing-erc7730-registry";
const REGISTRY_REF = "master";

/** Repo-relative path of the calldata descriptor for a contract, if indexed. */
export function getDescriptorPath(
  index: RegistryIndex,
  chainId: number,
  address: string,
): string | undefined {
  return index.calldataIndex[
    `eip155:${chainId.toString()}:${address.toLowerCase()}`
  ];
}

/** GitHub web URL of the descriptor JSON file for a contract, if indexed. */
export function getDescriptorUrl(
  index: RegistryIndex,
  chainId: number,
  address: string,
): string | undefined {
  const path = getDescriptorPath(index, chainId, address);
  if (path === undefined) {
    return undefined;
  }
  return `https://github.com/${REGISTRY_REPO}/blob/${REGISTRY_REF}/${path}`;
}

/** Raw-content URL of the descriptor JSON file, if indexed. */
export function getDescriptorRawUrl(
  index: RegistryIndex,
  chainId: number,
  address: string,
): string | undefined {
  const path = getDescriptorPath(index, chainId, address);
  if (path === undefined) {
    return undefined;
  }
  return `https://raw.githubusercontent.com/${REGISTRY_REPO}/${REGISTRY_REF}/${path}`;
}

export function getExplorerTxUrl(
  explorerUrl: string | undefined,
  txHash: string,
): string | undefined {
  if (explorerUrl === undefined) {
    return undefined;
  }
  return `${explorerUrl}/tx/${txHash}`;
}
