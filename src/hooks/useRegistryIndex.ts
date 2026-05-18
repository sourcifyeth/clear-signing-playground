import { useState, useEffect } from "react";
import { fetchPrebuiltRegistryIndex } from "@ethereum-sourcify/clear-signing";
import type { RegistryIndex } from "@ethereum-sourcify/clear-signing";

interface UseRegistryIndexResult {
  index: RegistryIndex | null;
  loading: boolean;
  error: string | null;
}

export function useRegistryIndex(): UseRegistryIndexResult {
  const [index, setIndex] = useState<RegistryIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const fetched = await fetchPrebuiltRegistryIndex();
        if (!cancelled) {
          setIndex(fetched);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch registry index",
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

  return { index, loading, error };
}
