import { useState } from "react";
import type {
  DisplayModel,
  DisplayField,
  DisplayFieldGroup,
  EmbeddedCalldata,
  Warning,
} from "@ethereum-sourcify/clear-signing";
import { isFieldGroup } from "@ethereum-sourcify/clear-signing";
import { WarningBanner } from "./WarningBanner";
import { MetadataPopover } from "./MetadataPopover";

interface ClearSigningDisplayProps {
  model: DisplayModel;
}

function truncateAddress(address: string): string {
  if (address.length <= 14) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function truncateBytes(hex: string, maxLen = 20): string {
  if (hex.length <= maxLen) {
    return hex;
  }
  return `${hex.slice(0, maxLen)}...`;
}

function FieldWarning({ warning }: { warning: Warning }) {
  if (warning.code === "UNKNOWN_ADDRESS") {
    return (
      <span className="mt-1 text-xs text-gray-400 italic">
        No name for this address found.
      </span>
    );
  }

  return (
    <span className="mt-1 inline-flex items-center gap-1 text-xs text-amber-600">
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      {warning.message}
    </span>
  );
}

function FieldValue({ field }: { field: DisplayField }) {
  switch (field.fieldType) {
    case "address":
      return (
        <div className="flex flex-col">
          <span className="font-mono text-sm" title={field.value}>
            {field.value}
          </span>
          {field.rawAddress !== undefined &&
            field.rawAddress !== field.value && (
              <span className="group/addr relative mt-0.5 inline-block cursor-default">
                <span className="font-mono text-xs text-gray-400">
                  {truncateAddress(field.rawAddress)}
                </span>
                <span className="pointer-events-none absolute bottom-full left-0 z-10 mb-1 hidden whitespace-nowrap rounded bg-gray-800 px-2 py-1 font-mono text-xs text-white shadow-lg group-hover/addr:block">
                  {field.rawAddress}
                </span>
              </span>
            )}
        </div>
      );
    case "bytes":
      return (
        <span className="font-mono text-sm" title={field.value}>
          {truncateBytes(field.value, 60)}
        </span>
      );
    default:
      return <span className="text-sm">{field.value}</span>;
  }
}

function EmbeddedCallChip({
  embedded,
  rawValue,
}: {
  embedded: EmbeddedCalldata;
  rawValue: string;
}) {
  const [open, setOpen] = useState(false);
  const [calldataExpanded, setCalldataExpanded] = useState(false);
  const model: DisplayModel = embedded.display;
  const callee: string | undefined = embedded.callee;
  const chainId: number | undefined = embedded.chainId;

  const contractName = model.metadata?.contractName;
  const intentStr = typeof model.intent === "string" ? model.intent : undefined;

  let summary: string | undefined;
  if (model.interpolatedIntent !== undefined) {
    summary = model.interpolatedIntent;
  } else if (contractName !== undefined || intentStr !== undefined) {
    summary = [contractName, intentStr].filter(Boolean).join(": ");
  }

  const showFallback = summary === undefined;
  const hasRawCalldataFallback = model.rawCalldataFallback !== undefined;
  const calldataPreview = rawValue.slice(0, 40);
  const calldataTruncated = rawValue.length > 40;

  return (
    <>
      <div className="flex flex-col gap-2">
        {summary !== undefined && (
          <span className="text-sm text-gray-700">{summary}</span>
        )}
        {showFallback && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            {callee !== undefined && (
              <>
                <dt className="shrink-0 text-gray-500">Target</dt>
                <dd className="min-w-0 font-mono break-all">{callee}</dd>
              </>
            )}
            {chainId !== undefined && (
              <>
                <dt className="shrink-0 text-gray-500">Chain ID</dt>
                <dd>{chainId}</dd>
              </>
            )}
            {!hasRawCalldataFallback && (
              <>
                <dt className="shrink-0 text-gray-500">Calldata</dt>
                <dd className="min-w-0 font-mono break-all">
                  {calldataExpanded ? rawValue : calldataPreview}
                  {calldataTruncated && !calldataExpanded && "…"}
                  {calldataTruncated && (
                    <button
                      onClick={() => {
                        setCalldataExpanded((v) => !v);
                      }}
                      className="ml-1 text-cerulean-600 hover:underline"
                    >
                      {calldataExpanded ? "show less" : "show more"}
                    </button>
                  )}
                </dd>
              </>
            )}
          </dl>
        )}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-cerulean-50 px-2 py-0.5 text-xs font-medium text-cerulean-700 ring-1 ring-inset ring-cerulean-200">
            Embedded Call
          </span>
          <button
            onClick={() => {
              setOpen(true);
            }}
            className="text-xs font-medium text-cerulean-600 hover:text-cerulean-800 hover:underline"
          >
            Details →
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setOpen(false);
          }}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-gray-50 p-6 shadow-xl"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Embedded Call
              </h3>
              <button
                onClick={() => {
                  setOpen(false);
                }}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            <ClearSigningDisplay model={model} />
          </div>
        </div>
      )}
    </>
  );
}

function FieldRow({ field }: { field: DisplayField }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-gray-100 py-2.5 last:border-b-0 sm:flex-row sm:items-start sm:gap-4">
      <dt className="w-40 flex-shrink-0 text-sm font-medium text-gray-500">
        {field.label}
      </dt>
      <dd className="min-w-0 flex-1 break-all text-gray-900">
        {field.embeddedCalldata !== undefined ? (
          <EmbeddedCallChip
            embedded={field.embeddedCalldata}
            rawValue={field.value}
          />
        ) : (
          <FieldValue field={field} />
        )}
        {field.warning !== undefined && (
          <div>
            <FieldWarning warning={field.warning} />
          </div>
        )}
      </dd>
    </div>
  );
}

function FieldGroupDisplay({ group }: { group: DisplayFieldGroup }) {
  return (
    <div className="border-b border-gray-100 py-2.5 last:border-b-0">
      {group.label !== undefined && (
        <div className="mb-2 flex items-center gap-2">
          <h4 className="text-sm font-semibold text-gray-700">{group.label}</h4>
          {group.warning !== undefined && (
            <FieldWarning warning={group.warning} />
          )}
        </div>
      )}
      {group.warning !== undefined && group.label === undefined && (
        <div className="mb-2">
          <FieldWarning warning={group.warning} />
        </div>
      )}
      {group.fields.length > 0 ? (
        <div className="rounded-md border border-gray-100 bg-gray-50/50 pl-3 sm:pl-4">
          <dl className="space-y-0">
            {group.fields.map((field, index) => (
              <FieldRow key={index} field={field} />
            ))}
          </dl>
        </div>
      ) : (
        group.warning === undefined && (
          <p className="text-xs italic text-gray-400">Empty</p>
        )
      )}
    </div>
  );
}

function IntentDisplay({
  intent,
}: {
  intent: string | Record<string, string>;
}) {
  if (typeof intent === "string") {
    return <span>{intent}</span>;
  }

  const entries = Object.entries(intent);
  return (
    <dl className="space-y-1">
      {entries.map(([key, value]) => (
        <div key={key} className="flex gap-2 text-sm">
          <dt className="font-medium text-gray-500">{key}:</dt>
          <dd className="text-gray-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function RawCalldataDisplay({
  fallback,
}: {
  fallback: { selector: string; args: string[] };
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-amber-500"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-amber-800">
            Raw calldata fallback
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="mb-2 text-sm">
          <span className="font-medium text-gray-500">Selector: </span>
          <code className="font-mono text-gray-900">{fallback.selector}</code>
        </div>
        {fallback.args.length > 0 && (
          <div className="text-sm">
            <span className="font-medium text-gray-500">Arguments:</span>
            <ol className="mt-1 list-inside list-decimal space-y-1">
              {fallback.args.map((arg, i) => (
                <li
                  key={i}
                  className="font-mono text-xs text-gray-700 break-all"
                >
                  {arg}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export function ClearSigningDisplay({ model }: ClearSigningDisplayProps) {
  const hasCardContent =
    model.metadata?.contractName !== undefined ||
    model.interpolatedIntent !== undefined ||
    model.intent !== undefined ||
    (model.fields !== undefined && model.fields.length > 0) ||
    model.metadata !== undefined;

  return (
    <div className="space-y-4">
      {/* Warnings */}
      {model.warnings !== undefined && model.warnings.length > 0 && (
        <WarningBanner warnings={model.warnings} />
      )}

      {/* Clear Transaction card */}
      {hasCardContent && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-800">
            Clear Transaction
          </h3>

          {/* Interacting with + Intent */}
          <div className="mb-5 space-y-2">
            {model.metadata?.contractName !== undefined && (
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:gap-4">
                <span className="w-40 flex-shrink-0 text-base font-medium text-gray-500">
                  Interacting with
                </span>
                <span className="min-w-0 flex-1 text-base text-cerulean-700">
                  {model.metadata.contractName}
                </span>
              </div>
            )}

            {model.interpolatedIntent !== undefined && (
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:gap-4">
                <span className="w-40 flex-shrink-0 text-base font-medium text-gray-500">
                  Intent
                </span>
                <span className="min-w-0 flex-1 text-base text-cerulean-700">
                  {model.interpolatedIntent}
                </span>
              </div>
            )}

            {model.intent !== undefined &&
              model.interpolatedIntent === undefined && (
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:gap-4">
                  <span className="w-40 flex-shrink-0 text-base font-medium text-gray-500">
                    Intent
                  </span>
                  <span className="min-w-0 flex-1 text-base text-cerulean-700">
                    <IntentDisplay intent={model.intent} />
                  </span>
                </div>
              )}
          </div>

          {/* Fields */}
          {model.fields !== undefined && model.fields.length > 0 && (
            <dl className="space-y-0">
              {model.fields.map((field, index) =>
                isFieldGroup(field) ? (
                  <FieldGroupDisplay key={index} group={field} />
                ) : (
                  <FieldRow key={index} field={field} />
                ),
              )}
            </dl>
          )}

          {/* Metadata — inside the card, collapsed by default */}
          {model.metadata !== undefined && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <MetadataPopover metadata={model.metadata} />
            </div>
          )}
        </div>
      )}

      {/* Raw calldata fallback */}
      {model.rawCalldataFallback !== undefined && (
        <RawCalldataDisplay fallback={model.rawCalldataFallback} />
      )}
    </div>
  );
}
