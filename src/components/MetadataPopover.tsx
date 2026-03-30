import { useState } from "react";
import type { DisplayModel } from "@sourcifyeth/clear-signing";

interface MetadataPopoverProps {
  metadata: DisplayModel["metadata"];
}

function hasContent(metadata: DisplayModel["metadata"]): boolean {
  if (metadata === undefined) {
    return false;
  }
  return metadata.owner !== undefined || metadata.info !== undefined;
}

export function MetadataPopover({ metadata }: MetadataPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!hasContent(metadata)) {
    return null;
  }

  if (metadata === undefined) return null;
  const meta = metadata;

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className="flex w-full items-center justify-between py-1 text-left transition-colors hover:bg-gray-50"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-gray-700">
          Contract Metadata
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="pt-2">
          <dl className="space-y-2 text-sm">
            {meta.owner !== undefined && (
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Owner</dt>
                <dd className="font-mono text-gray-900">{meta.owner}</dd>
              </div>
            )}
            {meta.info?.deploymentDate !== undefined && (
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Deployment Date</dt>
                <dd className="text-gray-900">{meta.info.deploymentDate}</dd>
              </div>
            )}
            {meta.info?.url !== undefined && (
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">URL</dt>
                <dd>
                  <a
                    href={meta.info.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cerulean-500 hover:text-cerulean-600 hover:underline"
                  >
                    {meta.info.url}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
