const links = [
  {
    label: "Clear Signing Registry",
    href: "https://github.com/ethereum/clear-signing-erc7730-registry",
  },
  {
    label: "Clear Signing Standard ERC-7730",
    href: "https://eips.ethereum.org/EIPS/eip-7730",
  },
  {
    label: "TS SDK @sourcifyeth/clear-signing",
    href: "https://github.com/sourcifyeth/clear-signing",
  },
  {
    label: "Built by sourcify.dev",
    href: "https://sourcify.dev/",
  },
];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2 sm:px-6">
        {links.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-cerulean-600"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
