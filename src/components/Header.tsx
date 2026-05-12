export function Header() {
  return (
    <header className="bg-gray-100 shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center no-underline">
            <img
              src="/sourcify.png"
              alt="Sourcify Logo"
              className="mr-3 h-10 w-auto"
              width={32}
              height={32}
            />
            <span className="font-vt323 text-2xl text-gray-700">
              sourcify.eth
            </span>
          </a>
          <span className="hidden text-gray-300 sm:inline" aria-hidden="true">
            |
          </span>
          <span className="hidden text-base font-medium text-gray-700 sm:inline sm:text-lg">
            Clear Signing Playground
          </span>
          <span className="hidden items-center gap-1.5 rounded-full bg-cerulean-50 px-2.5 py-0.5 text-xs font-medium text-cerulean-700 lg:inline-flex">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
            Ethereum Mainnet
          </span>
        </div>

        <nav className="flex items-center font-vt323 text-2xl text-gray-700">
          {/* Mobile-only network badge */}
          <span className="mr-2 inline-flex items-center gap-1.5 rounded-full bg-cerulean-50 px-2 py-0.5 text-xs font-medium text-cerulean-700 sm:hidden">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
            Mainnet
          </span>

          <a
            href="https://sourcify.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-3 hidden transition-colors hover:text-cerulean-500 sm:inline-flex sm:items-center sm:gap-1"
          >
            sourcify.dev
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>

          <a
            href="https://github.com/sourcifyeth/clear-signing-playground"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            title="GitHub repository"
            className="ml-1 inline-flex items-center justify-center rounded-md p-1.5 text-gray-700 transition-colors hover:text-cerulean-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
              />
            </svg>
          </a>
        </nav>
      </div>
    </header>
  );
}
