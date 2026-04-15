declare const chainInfo: Record<
  string,
  | {
      name: string;
      nativeCurrency: { name: string; symbol: string; decimals: number };
    }
  | undefined
> & { _cachedAt: number };
export default chainInfo;
