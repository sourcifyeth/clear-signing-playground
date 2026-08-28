import { useState } from "react";
import type { PublicClient } from "viem";
import type { RegistryIndex } from "@ethereum-sourcify/clear-signing";
import type { RawTransaction } from "../services/transactionService";
import { DecodedCalldata } from "./DecodedCalldata";
import { ExternalLink } from "./ExternalLink";

interface RawTransactionViewProps {
  transaction: RawTransaction;
  client: PublicClient | null;
  registryIndex: RegistryIndex | null;
  chainId: number;
  explorerTxUrl?: string | undefined;
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
    <div className="flex flex-col gap-0.5 border-b border-gray-100 py-2.5 last:border-b-0 sm:flex-row sm:items-start sm:gap-2">
      <dt className="w-24 flex-shrink-0 text-sm font-medium text-gray-500">
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

type CalldataMode = "hex" | "decoded";

function CalldataModeToggle({
  mode,
  onChange,
}: {
  mode: CalldataMode;
  onChange: (mode: CalldataMode) => void;
}) {
  const options: { value: CalldataMode; label: string }[] = [
    { value: "hex", label: "Hex" },
    { value: "decoded", label: "ABI decoded" },
  ];
  return (
    <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5 font-sans">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => {
            onChange(opt.value);
          }}
          className={`cursor-pointer rounded px-2 py-0.5 text-xs font-medium transition-colors ${
            mode === opt.value
              ? "bg-cerulean-500 text-white shadow-sm"
              : "text-gray-600 hover:bg-cerulean-50 hover:text-cerulean-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function RawTransactionView({
  transaction,
  client,
  registryIndex,
  chainId,
  explorerTxUrl,
}: RawTransactionViewProps) {
  const [showFullCalldata, setShowFullCalldata] = useState(false);
  const [calldataMode, setCalldataMode] = useState<CalldataMode>("hex");

  const calldataInfo = truncateHex(transaction.input, CALLDATA_PREVIEW_LENGTH);
  const canDecode =
    client !== null &&
    transaction.to !== null &&
    transaction.input.length >= 10;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-800">
          Raw Transaction
        </h3>
        {explorerTxUrl !== undefined && (
          <ExternalLink href={explorerTxUrl}>Block Explorer</ExternalLink>
        )}
      </div>
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
          <div className="space-y-2">
            {canDecode && (
              <CalldataModeToggle
                mode={calldataMode}
                onChange={setCalldataMode}
              />
            )}
            {calldataMode === "decoded" &&
            client !== null &&
            transaction.to !== null ? (
              <DecodedCalldata
                client={client}
                registryIndex={registryIndex}
                chainId={chainId}
                address={transaction.to}
                input={transaction.input}
              />
            ) : (
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
            )}
          </div>
        </FieldRow>

        <FieldRow label="Nonce">{transaction.nonce}</FieldRow>

        <FieldRow label="Gas">{transaction.gas.toString()}</FieldRow>

        {transaction.blockNumber !== null && (
          <FieldRow label="Block">
            {transaction.blockNumber.toString()}
          </FieldRow>
        )}

        <FieldRow label="Type">{transaction.type}</FieldRow>
      </dl>
    </div>
  );
}
