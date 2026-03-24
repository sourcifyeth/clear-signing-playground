interface ViewToggleProps {
  activeView: "raw" | "clear";
  onToggle: (view: "raw" | "clear") => void;
}

export function ViewToggle({ activeView, onToggle }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-0.5">
      <button
        type="button"
        onClick={() => {
          onToggle("raw");
        }}
        className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
          activeView === "raw"
            ? "bg-cerulean-500 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Raw
      </button>
      <button
        type="button"
        onClick={() => {
          onToggle("clear");
        }}
        className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
          activeView === "clear"
            ? "bg-cerulean-500 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Clear Signing
      </button>
    </div>
  );
}
