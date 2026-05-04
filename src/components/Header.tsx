export function Header() {
  return (
    <header className="bg-cerulean-500 text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-lg font-semibold tracking-tight text-white no-underline sm:text-xl"
          >
            Clear Signing Playground
          </a>
          <span className="hidden items-center gap-1.5 rounded-full bg-cerulean-600 px-2.5 py-0.5 text-xs font-medium sm:inline-flex">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
            Ethereum Mainnet
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile-only network badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cerulean-600 px-2 py-0.5 text-xs font-medium sm:hidden">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
            Mainnet
          </span>

          <a
            href="https://sourcify.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-2 py-1 text-sm font-medium text-cerulean-100 transition-colors hover:bg-cerulean-600 hover:text-white"
          >
            sourcify.dev
          </a>
        </div>
      </div>
    </header>
  );
}
