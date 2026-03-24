import { useState, useEffect } from "react";
import { fetchChainConfigs } from "../config/chains";
import type { ChainConfig } from "../config/chains";

interface UseChainsResult {
  chains: ChainConfig[];
  loading: boolean;
  error: string | null;
}

export function useChains(): UseChainsResult {
  const [chains, setChains] = useState<ChainConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const configs = await fetchChainConfigs();
        if (!cancelled) {
          setChains(configs);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch chain configs",
          );
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { chains, loading, error };
}
