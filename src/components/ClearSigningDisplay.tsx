import type {
  DisplayModel,
  DisplayField,
  Warning,
} from "@sourcifyeth/clear-signing";
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
  // Handle nested DisplayModel
  if (typeof field.value !== "string") {
    return (
      <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3">
        <ClearSigningDisplay model={field.value} />
      </div>
    );
  }

  switch (field.fieldType) {
    case "address":
      return (
        <div className="flex flex-col">
          <span className="font-mono text-sm" title={field.value}>
            {field.value}
          </span>
          {field.rawAddress !== undefined &&
            field.rawAddress !== field.value && (
              <span
                className="mt-0.5 font-mono text-xs text-gray-400"
                title={field.rawAddress}
              >
                {truncateAddress(field.rawAddress)}
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

function FieldRow({ field }: { field: DisplayField }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-gray-100 py-2.5 last:border-b-0 sm:flex-row sm:items-start sm:gap-4">
      <dt className="w-40 flex-shrink-0 text-sm font-medium text-gray-500">
        {field.label}
      </dt>
      <dd className="min-w-0 flex-1 break-all text-gray-900">
        <FieldValue field={field} />
        {field.warning !== undefined && (
          <FieldWarning warning={field.warning} />
        )}
      </dd>
    </div>
  );
}

function IntentDisplay({
  intent,
}: {
  intent: string | Record<string, string>;
}) {
  if (typeof intent === "string") {
    return <h3 className="text-base font-semibold text-gray-800">{intent}</h3>;
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
            Raw calldata fallback — no descriptor matched
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
  return (
    <div className="space-y-4">
      {/* Warnings */}
      {model.warnings !== undefined && model.warnings.length > 0 && (
        <WarningBanner warnings={model.warnings} />
      )}

      {/* Metadata */}
      {model.metadata !== undefined && (
        <MetadataPopover metadata={model.metadata} />
      )}

      {/* Interpolated intent — primary display */}
      {model.interpolatedIntent !== undefined && (
        <div className="rounded-lg border border-cerulean-200 bg-cerulean-50 px-4 py-3">
          <p className="text-sm font-medium text-cerulean-800">
            {model.interpolatedIntent}
          </p>
        </div>
      )}

      {/* Intent */}
      {model.intent !== undefined && (
        <div className="px-1">
          <IntentDisplay intent={model.intent} />
        </div>
      )}

      {/* Fields */}
      {model.fields !== undefined && model.fields.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <dl className="space-y-0">
            {model.fields.map((field, index) => (
              <FieldRow key={index} field={field} />
            ))}
          </dl>
        </div>
      )}

      {/* Raw calldata fallback */}
      {model.rawCalldataFallback !== undefined && (
        <RawCalldataDisplay fallback={model.rawCalldataFallback} />
      )}
    </div>
  );
}
