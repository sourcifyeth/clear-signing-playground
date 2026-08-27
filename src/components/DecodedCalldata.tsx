import { useEffect, useState } from "react";
import {
  decodeFunctionData,
  type Abi,
  type AbiFunction,
  type Hex,
  type PublicClient,
} from "viem";
import type { RegistryIndex } from "@ethereum-sourcify/clear-signing";
import { fetchAbi } from "../services/abiService";

interface DecodedCalldataProps {
  client: PublicClient;
  registryIndex: RegistryIndex | null;
  chainId: number;
  address: string;
  input: string;
}

type Status =
  | { kind: "loading" }
  | { kind: "no-abi" }
  | { kind: "no-match"; selector: string }
  | { kind: "decoded"; fn: AbiFunction; args: readonly unknown[] };

function findFunction(
  abi: Abi,
  name: string,
  argCount: number,
): AbiFunction | undefined {
  const candidates = abi.filter(
    (item): item is AbiFunction =>
      item.type === "function" && item.name === name,
  );
  return (
    candidates.find((fn) => fn.inputs.length === argCount) ?? candidates[0]
  );
}

function decode(abi: Abi, input: string): Status {
  try {
    const { functionName, args } = decodeFunctionData({
      abi,
      data: input as Hex,
    });
    const argList: readonly unknown[] = args ?? [];
    const fn = findFunction(abi, functionName, argList.length);
    if (fn === undefined) {
      return { kind: "no-match", selector: input.slice(0, 10) };
    }
    return { kind: "decoded", fn, args: argList };
  } catch {
    return { kind: "no-match", selector: input.slice(0, 10) };
  }
}

function signatureOf(fn: AbiFunction): string {
  const params = fn.inputs
    .map((p) => `${p.type} ${p.name ?? ""}`.trim())
    .join(", ");
  return `${fn.name}(${params})`;
}

interface ParamLike {
  name?: string | undefined;
  type: string;
  components?: readonly ParamLike[] | undefined;
}

function baseType(type: string): string {
  return type.replace(/\[\d*\]$/, "");
}

function isArrayType(type: string): boolean {
  return /\[\d*\]$/.test(type);
}

function scalarToString(value: unknown): string {
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "string" || typeof value === "number") {
    return value.toString();
  }
  if (value === null || value === undefined) {
    return "";
  }
  return typeof value === "symbol" ? value.toString() : "[unsupported value]";
}

/**
 * Turn a decoded value into a list of labeled members.
 * viem returns arrays for `T[]` and for unnamed tuples, and plain objects
 * for tuples whose components have names.
 */
function membersOf(
  value: unknown,
  param: ParamLike,
): { label: string; param: ParamLike; value: unknown }[] | undefined {
  if (isArrayType(param.type)) {
    if (!Array.isArray(value)) {
      return undefined;
    }
    const itemParam: ParamLike = {
      type: baseType(param.type),
      components: param.components,
    };
    return value.map((item: unknown, i) => ({
      label: i.toString(),
      param: itemParam,
      value: item,
    }));
  }
  if (param.type === "tuple" && param.components !== undefined) {
    const components = param.components;
    if (Array.isArray(value)) {
      return components.map((c, i) => ({
        label: c.name !== undefined && c.name !== "" ? c.name : i.toString(),
        param: c,
        value: value[i] as unknown,
      }));
    }
    if (typeof value === "object" && value !== null) {
      const record = value as Record<string, unknown>;
      return components.map((c, i) => ({
        label: c.name !== undefined && c.name !== "" ? c.name : i.toString(),
        param: c,
        value: record[c.name ?? ""] ?? record[i.toString()],
      }));
    }
  }
  return undefined;
}

function Value({ value, param }: { value: unknown; param: ParamLike }) {
  const members = membersOf(value, param);
  if (members !== undefined) {
    if (members.length === 0) {
      return <span className="text-gray-400">[]</span>;
    }
    return (
      <div className="mt-1 space-y-1.5 border-l border-gray-200 pl-2">
        {members.map((m, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <span className="flex-shrink-0 text-gray-500">
              {m.label}
              <span className="ml-1 text-gray-400">{m.param.type}</span>
            </span>
            <span className="min-w-0 break-all">
              <Value value={m.value} param={m.param} />
            </span>
          </div>
        ))}
      </div>
    );
  }
  return <span>{scalarToString(value)}</span>;
}

export function DecodedCalldata({
  client,
  registryIndex,
  chainId,
  address,
  input,
}: DecodedCalldataProps) {
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    setStatus({ kind: "loading" });
    void fetchAbi(client, registryIndex, chainId, address).then((abi) => {
      if (cancelled) {
        return;
      }
      setStatus(abi === undefined ? { kind: "no-abi" } : decode(abi, input));
    });
    return () => {
      cancelled = true;
    };
  }, [client, registryIndex, chainId, address, input]);

  if (status.kind === "loading") {
    return <div className="text-gray-400">Fetching ABI…</div>;
  }
  if (status.kind === "no-abi") {
    return (
      <div className="italic text-gray-400">
        No ABI found for this contract on Sourcify or in the descriptor.
      </div>
    );
  }
  if (status.kind === "no-match") {
    return (
      <div className="italic text-gray-400">
        No function in the ABI matches selector {status.selector}.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="break-all py-1.5 font-bold text-cerulean-700">
        {signatureOf(status.fn)}
      </div>
      {status.fn.inputs.length > 0 && (
        <div className="space-y-1.5">
          {status.fn.inputs.map((param, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span className="flex-shrink-0 text-gray-500">
                {param.name !== undefined && param.name !== ""
                  ? param.name
                  : i.toString()}
                <span className="ml-1 text-gray-400">{param.type}</span>
              </span>
              <span className="min-w-0 break-all">
                <Value value={status.args[i]} param={param} />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
