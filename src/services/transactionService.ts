import type { PublicClient } from "viem";
import type { Transaction } from "@sourcifyeth/clear-signing";

/**
 * Raw transaction data as returned by viem's `getTransaction`.
 * Only the fields we actually need are included.
 */
export interface RawTransaction {
  hash: string;
  from: string;
  to: string | null;
  value: bigint;
  input: string;
  nonce: number;
  gas: bigint;
  gasPrice: bigint | undefined;
  maxFeePerGas: bigint | undefined;
  maxPriorityFeePerGas: bigint | undefined;
  blockNumber: bigint | null;
  blockHash: string | null;
  transactionIndex: number | null;
  chainId: number | undefined;
  type: string;
}

/**
 * Fetch a transaction from the chain by its hash.
 */
export async function fetchTransaction(
  client: PublicClient,
  hash: string,
): Promise<RawTransaction> {
  const tx = await client.getTransaction({
    hash: hash as `0x${string}`,
  });

  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: tx.value,
    input: tx.input,
    nonce: tx.nonce,
    gas: tx.gas,
    gasPrice: tx.gasPrice,
    maxFeePerGas: tx.maxFeePerGas,
    maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
    blockNumber: tx.blockNumber,
    blockHash: tx.blockHash,
    transactionIndex: tx.transactionIndex,
    chainId: tx.chainId,
    type: tx.type,
  };
}

/**
 * Convert a raw transaction into the library's `Transaction` format.
 */
export function rawToLibraryTransaction(
  raw: RawTransaction,
  chainId: number,
): Transaction {
  const tx: Transaction = {
    chainId,
    to: raw.to ?? "",
    data: raw.input,
    from: raw.from,
  };

  if (raw.value !== 0n) {
    tx.value = raw.value;
  }

  return tx;
}
