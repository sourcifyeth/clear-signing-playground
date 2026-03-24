import type { Warning } from "@sourcifyeth/clear-signing";

interface WarningBannerProps {
  warnings: Warning[];
}

export function WarningBanner({ warnings }: WarningBannerProps) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500"
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
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-800">
            {warnings.length === 1 ? "Warning" : "Warnings"}
          </h4>
          <ul className="mt-1 space-y-1">
            {warnings.map((warning, index) => (
              <li key={index} className="text-sm text-amber-700">
                <span className="mr-1.5 inline-block rounded bg-amber-200 px-1 py-0.5 text-xs font-mono font-medium text-amber-800">
                  {warning.code}
                </span>
                {warning.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
