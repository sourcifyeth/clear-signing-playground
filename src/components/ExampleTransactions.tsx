import type { ExampleTransaction } from "../data/exampleTransactions";

interface ExampleTransactionsProps {
  examples: ExampleTransaction[];
  onSelect: (txHash: string) => void;
  selectedHash?: string;
}

export function ExampleTransactions({
  examples,
  onSelect,
  selectedHash,
}: ExampleTransactionsProps) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">
        Example Transactions
      </h2>
      <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-x-visible sm:pb-0">
        {examples.map((example) => {
          const isSelected = selectedHash === example.txHash;
          return (
            <button
              key={example.txHash}
              type="button"
              onClick={() => {
                onSelect(example.txHash);
              }}
              className={`flex-shrink-0 cursor-pointer rounded-lg border px-3 py-2 text-left transition-all ${
                isSelected
                  ? "border-cerulean-500 bg-cerulean-50 text-cerulean-700 ring-1 ring-cerulean-500"
                  : "border-gray-200 bg-white text-gray-700 hover:border-cerulean-300 hover:bg-cerulean-50/50"
              }`}
            >
              <span className="block text-sm font-medium">{example.name}</span>
              <span className="mt-0.5 block text-xs text-gray-500">
                {example.description}
              </span>
              <span className="mt-1 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-500">
                {example.contractName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
