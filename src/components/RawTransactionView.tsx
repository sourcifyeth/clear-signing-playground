import { useState } from "react";
import type { RawTransaction } from "../services/transactionService";

interface RawTransactionViewProps {
  transaction: RawTransaction;
}

function formatEthValue(wei: bigint): string {
  const ETH_DECIMALS = 18n;
  const divisor = 10n ** ETH_DECIMALS;
  const whole = wei / divisor;
  const remainder = wei % divisor;
  if (remainder === 0n) {
    return `${whole.toString()} ETH`;
  }
  const remainderStr = remainder
    .toString()
    .padStart(18, "0")
    .replace(/0+$/, "");
  return `${whole.toString()}.${remainderStr} ETH`;
}

function truncateHex(
  hex: string,
  maxLen: number,
): { truncated: string; isTruncated: boolean } {
  if (hex.length <= maxLen) {
    return { truncated: hex, isTruncated: false };
  }
  return { truncated: hex.slice(0, maxLen) + "...", isTruncated: true };
}

interface FieldRowProps {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}

function FieldRow({ label, children, mono }: FieldRowProps) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-gray-100 py-2.5 last:border-b-0 sm:flex-row sm:items-start sm:gap-4">
      <dt className="w-32 flex-shrink-0 text-sm font-medium text-gray-500">
        {label}
      </dt>
      <dd
        className={`min-w-0 break-all text-sm text-gray-900 ${mono === true ? "font-mono" : ""}`}
      >
        {children}
      </dd>
    </div>
  );
}

const CALLDATA_PREVIEW_LENGTH = 130;

export function RawTransactionView({ transaction }: RawTransactionViewProps) {
  const [showFullCalldata, setShowFullCalldata] = useState(false);

  const calldataInfo = truncateHex(transaction.input, CALLDATA_PREVIEW_LENGTH);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="mb-4 text-base font-semibold text-gray-800">
        Raw Transaction
      </h3>
      <dl className="space-y-0">
        <FieldRow label="From" mono>
          {transaction.from}
        </FieldRow>

        <FieldRow label="To" mono>
          {transaction.to ?? (
            <span className="italic text-gray-400">Contract creation</span>
          )}
        </FieldRow>

        <FieldRow label="Value">{formatEthValue(transaction.value)}</FieldRow>

        <FieldRow label="Calldata" mono>
          <div>
            <span>
              {showFullCalldata || !calldataInfo.isTruncated
                ? transaction.input
                : calldataInfo.truncated}
            </span>
            {calldataInfo.isTruncated && (
              <button
                type="button"
                onClick={() => {
                  setShowFullCalldata((prev) => !prev);
                }}
                className="ml-2 inline text-xs font-medium text-cerulean-500 hover:text-cerulean-600"
              >
                {showFullCalldata ? "Show less" : "Show full"}
              </button>
            )}
          </div>
        </FieldRow>

        <FieldRow label="Nonce">{transaction.nonce}</FieldRow>

        <FieldRow label="Gas">{transaction.gas.toString()}</FieldRow>

        {transaction.blockNumber !== null && (
          <FieldRow label="Block Number">
            {transaction.blockNumber.toString()}
          </FieldRow>
        )}

        <FieldRow label="Type">{transaction.type}</FieldRow>
      </dl>
    </div>
  );
}
