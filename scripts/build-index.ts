import { createGitHubRegistryIndex } from "@sourcifyeth/clear-signing";
import fs from "node:fs";
import path from "node:path";

const OUTPUT_PATH = path.resolve("src/generated/registry-index.json");
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

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
          "Registry index is cached (less than 1 week old). Skipping rebuild. Use --force to rebuild.",
        );
        process.exit(0);
      }
    }

    console.log("Building registry index...");
    const index = await createGitHubRegistryIndex();

    const output = { ...index, _cachedAt: Date.now() };

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");

    const calldataCount = Object.keys(index.calldataIndex).length;
    const typedDataCount = Object.keys(index.typedDataIndex).length;
    console.log(
      `Registry index built successfully. Entries: calldata=${String(calldataCount)}, typedData=${String(typedDataCount)}`,
    );
  } catch (error) {
    console.error("Failed to build registry index:", error);
    process.exit(1);
  }
})();
