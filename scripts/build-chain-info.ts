import fs from "node:fs";
import path from "node:path";

const OUTPUT_PATH = path.resolve("src/generated/chain-info.json");
const SOURCE_URL = "https://chainid.network/chains_mini.json";
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

interface ChainMiniEntry {
  name: string;
  chainId: number;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

/**
 * Bundled format: Record<chainId, { name, nativeCurrency }>.
 * Keyed by chainId string for fast lookup at runtime.
 */
type ChainInfoMap = Record<
  string,
  {
    name: string;
    nativeCurrency: { name: string; symbol: string; decimals: number };
  }
>;

void (async () => {
  try {
    const force = process.argv.includes("--force");

    if (!force && fs.existsSync(OUTPUT_PATH)) {
      const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8")) as {
        _cachedAt?: number;
      };
      const cachedAt = existing._cachedAt;
      if (cachedAt && Date.now() - cachedAt < CACHE_MAX_AGE_MS) {
        console.log(
          "Chain info is cached (less than 1 week old). Skipping rebuild. Use --force to rebuild.",
        );
        process.exit(0);
      }
    }

    console.log("Fetching chain info from chainid.network...");
    const response = await fetch(SOURCE_URL);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch chains_mini.json: ${String(response.status)} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as ChainMiniEntry[];

    const chainInfoMap: ChainInfoMap = {};
    for (const entry of data) {
      chainInfoMap[String(entry.chainId)] = {
        name: entry.name,
        nativeCurrency: entry.nativeCurrency,
      };
    }

    const output = { ...chainInfoMap, _cachedAt: Date.now() };

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output) + "\n");

    console.log(
      `Chain info built successfully. ${String(data.length)} chains indexed.`,
    );
  } catch (error) {
    console.error("Failed to build chain info:", error);
    process.exit(1);
  }
})();
