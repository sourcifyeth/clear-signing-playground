import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { PublicClient } from "viem";
import type { DisplayModel } from "@sourcifyeth/clear-signing";
import { format } from "@sourcifyeth/clear-signing";

import { DEFAULT_CHAIN_ID } from "./config/chains";
import { createClient } from "./services/viemClient";
import { createExternalDataProvider } from "./services/externalDataProvider";
import {
  fetchTransaction,
  rawToLibraryTransaction,
} from "./services/transactionService";
import type { RawTransaction } from "./services/transactionService";
import { useChains } from "./hooks/useChains";
import { exampleTransactions } from "./data/exampleTransactions";
import registryIndex from "./generated/registry-index.json";

import { Header } from "./components/Header";
import { TransactionInput } from "./components/TransactionInput";
import { ExampleTransactions } from "./components/ExampleTransactions";
import { RawTransactionView } from "./components/RawTransactionView";
import { ClearSigningDisplay } from "./components/ClearSigningDisplay";
import { ViewToggle } from "./components/ViewToggle";
import { LoadingSpinner } from "./components/LoadingSpinner";

function App() {
  const { chains, loading: chainsLoading, error: chainsError } = useChains();

  const [txHash, setTxHash] = useState("");
  const [rawTransaction, setRawTransaction] = useState<RawTransaction | null>(
    null,
  );
  const [displayModel, setDisplayModel] = useState<DisplayModel | null>(null);
  const [activeView, setActiveView] = useState<"raw" | "clear">("raw");
  const [loadingTx, setLoadingTx] = useState(false);
  const [loadingFormat, setLoadingFormat] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelledRef = useRef(false);

  // Create viem client once chains are loaded
  const client: PublicClient | null = useMemo(() => {
    const chainConfig = chains.find((c) => c.chainId === DEFAULT_CHAIN_ID);
    if (chainConfig === undefined) {
      return null;
    }
    return createClient(chainConfig);
  }, [chains]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  const handleSubmit = useCallback(() => {
    if (client === null) {
      return;
    }

    const trimmedHash = txHash.trim();
    if (trimmedHash === "") {
      return;
    }

    // Cancel any previous in-flight operations
    cancelledRef.current = true;

    // Reset cancellation for this new request
    cancelledRef.current = false;

    // Clear previous results and start loading
    setError(null);
    setRawTransaction(null);
    setDisplayModel(null);
    setLoadingTx(true);
    setLoadingFormat(false);
    setActiveView("raw");

    const currentClient = client;

    void (async () => {
      try {
        const raw = await fetchTransaction(currentClient, trimmedHash);

        if (cancelledRef.current) {
          return;
        }

        setRawTransaction(raw);
        setLoadingTx(false);

        // Start formatting immediately
        setLoadingFormat(true);

        try {
          const libraryTx = rawToLibraryTransaction(raw, DEFAULT_CHAIN_ID);
          const model = await format(libraryTx, {
            externalDataProvider: createExternalDataProvider(currentClient),
            descriptorResolverOptions: {
              type: "github",
              index: registryIndex,
            },
          });

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ref is mutated externally
          if (cancelledRef.current) {
            return;
          }

          setDisplayModel(model);
          setLoadingFormat(false);
        } catch (err) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ref is mutated externally
          if (cancelledRef.current) {
            return;
          }
          setError(
            err instanceof Error ? err.message : "Failed to format transaction",
          );
          setLoadingFormat(false);
        }
      } catch (err) {
        if (cancelledRef.current) {
          return;
        }
        setError(
          err instanceof Error ? err.message : "Failed to fetch transaction",
        );
        setLoadingTx(false);
      }
    })();
  }, [client, txHash]);

  const handleExampleSelect = useCallback(
    (hash: string) => {
      setTxHash(hash);
      // We need to trigger submit with the new hash value.
      // Since setTxHash is async, we'll use a ref-based approach
      // by directly calling the submit logic with the hash.
      if (client === null) {
        return;
      }

      // Cancel any previous in-flight operations
      cancelledRef.current = true;

      cancelledRef.current = false;

      setError(null);
      setRawTransaction(null);
      setDisplayModel(null);
      setLoadingTx(true);
      setLoadingFormat(false);
      setActiveView("raw");

      const currentClient = client;

      void (async () => {
        try {
          const raw = await fetchTransaction(currentClient, hash);

          if (cancelledRef.current) {
            return;
          }

          setRawTransaction(raw);
          setLoadingTx(false);

          // Start formatting immediately
          setLoadingFormat(true);

          try {
            const libraryTx = rawToLibraryTransaction(raw, DEFAULT_CHAIN_ID);
            const model = await format(libraryTx, {
              externalDataProvider: createExternalDataProvider(currentClient),
              descriptorResolverOptions: {
                type: "github",
                index: registryIndex,
              },
            });

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ref is mutated externally
            if (cancelledRef.current) {
              return;
            }

            setDisplayModel(model);
            setLoadingFormat(false);
          } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ref is mutated externally
            if (cancelledRef.current) {
              return;
            }
            setError(
              err instanceof Error
                ? err.message
                : "Failed to format transaction",
            );
            setLoadingFormat(false);
          }
        } catch (err) {
          if (cancelledRef.current) {
            return;
          }
          setError(
            err instanceof Error ? err.message : "Failed to fetch transaction",
          );
          setLoadingTx(false);
        }
      })();
    },
    [client],
  );

  const handleViewToggle = useCallback((view: "raw" | "clear") => {
    setActiveView(view);
  }, []);

  const handleTxHashChange = useCallback((value: string) => {
    setTxHash(value);
  }, []);

  // Loading chains
  if (chainsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <LoadingSpinner message="Loading chain configuration..." />
        </main>
      </div>
    );
  }

  // Chains error
  if (chainsError !== null) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">
              Failed to load chain configuration: {chainsError}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="space-y-6">
          <TransactionInput
            value={txHash}
            onChange={handleTxHashChange}
            onSubmit={handleSubmit}
            loading={loadingTx}
            disabled={client === null}
          />

          <ExampleTransactions
            examples={exampleTransactions}
            onSelect={handleExampleSelect}
            selectedHash={txHash}
          />

          {/* Error display */}
          {error !== null && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Loading transaction */}
          {loadingTx && <LoadingSpinner message="Fetching transaction..." />}

          {/* Results section */}
          {rawTransaction !== null && (
            <div className="space-y-4">
              <ViewToggle activeView={activeView} onToggle={handleViewToggle} />

              {/* Small screens: tabbed view */}
              <div className="lg:hidden">
                {activeView === "raw" ? (
                  <RawTransactionView transaction={rawTransaction} />
                ) : loadingFormat ? (
                  <LoadingSpinner message="Formatting..." />
                ) : displayModel !== null ? (
                  <ClearSigningDisplay model={displayModel} />
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
                    Clear signing data not yet available.
                  </div>
                )}
              </div>

              {/* Large screens: side-by-side */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
                <div>
                  <RawTransactionView transaction={rawTransaction} />
                </div>
                <div>
                  {loadingFormat ? (
                    <LoadingSpinner message="Formatting..." />
                  ) : displayModel !== null ? (
                    <ClearSigningDisplay model={displayModel} />
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
                      Clear signing data not yet available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
