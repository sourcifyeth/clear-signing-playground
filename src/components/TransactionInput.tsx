interface TransactionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  disabled?: boolean;
}

export function TransactionInput({
  value,
  onChange,
  onSubmit,
  loading,
  disabled,
}: TransactionInputProps) {
  const isSubmitDisabled = loading || value.trim() === "" || disabled === true;

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !isSubmitDisabled) {
      onSubmit();
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Enter transaction hash (0x...)"
        disabled={disabled === true}
        className="flex-1 rounded-md border border-gray-300 px-4 py-2.5 font-mono text-sm transition-colors placeholder:text-gray-400 focus:border-cerulean-500 focus:outline-none focus:ring-2 focus:ring-cerulean-500/30 disabled:bg-gray-50 disabled:text-gray-500"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-cerulean-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cerulean-600 focus:outline-none focus:ring-2 focus:ring-cerulean-500/30 disabled:cursor-not-allowed disabled:bg-cerulean-300"
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading...
          </>
        ) : (
          "Decode"
        )}
      </button>
    </div>
  );
}
