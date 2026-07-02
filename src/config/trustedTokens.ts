import type { TrustedTokens } from "@ethereum-sourcify/clear-signing";

import { DEFAULT_CHAIN_ID } from "./chains";

/**
 * Static wallet-provided "trusted token" list passed to the library's
 * `descriptorResolverOptions.trustedTokens`. Standard ERC-20 tokens usually
 * don't have a descriptor in the ERC-7730 registry, so without this list the
 * library can't format transfers/approvals to them. The library generates
 * descriptors on the fly for any token found here.
 *
 * This is a snapshot of the top 100 ERC-20 tokens by market cap on Ethereum
 * mainnet, sourced from https://etherscan.io/tokens?ps=100. Addresses are
 * lowercased; the library accepts both lowercase and checksummed forms.
 */
const MAINNET_ERC20_TOKENS: Record<string, "erc20"> = {
  "0xdac17f958d2ee523a2206206994597c13d831ec7": "erc20", // USDT — Tether USD
  "0xb8c77482e45f1f44de1745f52c74426c631bdd52": "erc20", // BNB
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "erc20", // USDC
  "0xae7ab96520de3a18e5e111b5eaab095312d7fe84": "erc20", // stETH
  "0xdc035d45d973e3ec169d2276ddab16f1e407384f": "erc20", // USDS — USDS Stablecoin
  "0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3": "erc20", // LEO — Bitfinex LEO Token
  "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0": "erc20", // wstETH
  "0x4a64515e5e1d1073e83f30cb97bed20400b66e10": "erc20", // WZEC — Wrapped ZEC
  "0x66eff5221ca926636224650fd3b9c497ff828f7d": "erc20", // multiBTC — Multichain BTC
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": "erc20", // WBTC — Wrapped BTC
  "0xa2e3356610840701bdf5611a53974510ae27e2e1": "erc20", // wBETH — Wrapped Binance Beacon ETH
  "0x514910771af9ca656af840dff83e8264ecf986ca": "erc20", // LINK — ChainLink Token
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "erc20", // WETH — Wrapped Ether
  "0xa3931d71877c0e7a3148cb7eb4463524fec27fbd": "erc20", // sUSDS — Savings USDS
  "0xbc65ad17c5c0a2a4d159fa5a503f4992c7b545fe": "erc20", // sUSDC — Spark USDC Vault
  "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf": "erc20", // cbBTC — Coinbase Wrapped BTC
  "0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d": "erc20", // USD1 — World Liberty Financial USD
  "0x6b175474e89094c44da98b954eedeac495271d0f": "erc20", // DAI — Dai Stablecoin
  "0x582d872a1b094fc48f5de31d3b73f2d9be47def1": "erc20", // TONCOIN — Wrapped TON Coin
  "0x4c9edd5852cd905f086c759e8383e09bff1e68b3": "erc20", // USDe
  "0x4d5f47fa6a74757f35c14fd3a6ef8e3c9bc514e8": "erc20", // aEthWETH — Aave Ethereum WETH
  "0x136471a34f6ef19fe571effc1ca711fdb8e49f2b": "erc20", // USYC — US Yield Coin
  "0xe343167631d89b6ffc58b88d6b7fb0228795491d": "erc20", // USDG — Global Dollar
  "0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee": "erc20", // weETH — Wrapped eETH
  "0x6c3ea9036406852006290770bedfcaba0e23a0e8": "erc20", // PYUSD — PayPal USD
  "0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b": "erc20", // CRO — Cronos Coin
  "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce": "erc20", // SHIB — SHIBA INU
  "0x85f17cf997934a597031b2e18a9ab6ebd4b9f6a4": "erc20", // NEAR
  "0x68749665ff8d2d112fa859aa293f07a622782f38": "erc20", // XAUt — Tether Gold
  "0x7712c34205737192402172409a8f7ccef8aa2aec": "erc20", // BUIDL — BlackRock USD Institutional Digital Liquidity Fund
  "0x6a9da2d710bb9b700acde7cb81f10f1ff8c89041": "erc20", // BUIDL-I — BlackRock BUIDL - I Class
  "0x96f6ef951840721adbf46ac996b59e0235cb985c": "erc20", // USDY — Ondo U.S. Dollar Yield
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": "erc20", // UNI — Uniswap
  "0xde4ee8057785a7e8e800db58f9784845a5c2cbd6": "erc20", // DEXE — Dexe
  "0xda5e1988097297dcdc1f90d4dfe7909e847cbef6": "erc20", // WLFI — World Liberty Financial
  "0x45804880de22913dafe09f4980848ece6ecbaf78": "erc20", // PAXG — Paxos Gold
  "0xd1d82d3ab815e0b47e38ec2d666c5b8aa05ae501": "erc20", // SOL — Wrapped Solana (IBC)
  "0x75231f58b43240c9718dd58b4967c5114342a86c": "erc20", // OKB
  "0x9d39a5de30e57443bff2a8307a4256c8797a3497": "erc20", // sUSDe — Staked USDe
  "0xfaba6f8e4a5e8ab82f62fe7c39859fa577269be3": "erc20", // ONDO — Ondo
  "0x80ac24aa929eaf5013f6436cda2a7ba190f5cc0b": "erc20", // syrupUSDC — Syrup USDC
  "0x8292bb45bf1ee4d140127049757c2e0ff06317ed": "erc20", // RLUSD
  "0x61ec85ab89377db65762e234c946b5c25a56e99e": "erc20", // HTX
  "0x3c3a81e81dc49a522a592e7622a7e711c06bf354": "erc20", // MNT — Mantle
  "0x196c20da81fbc324ecdf55501e95ce9f0bd84d14": "erc20", // DOT — Polkadot
  "0x21c2c96dbfa137e23946143c71ac8330f9b44001": "erc20", // DOT — Polkadot (IBC)
  "0x58d97b57bb95320f9a05dc918aef65434969c2b2": "erc20", // MORPHO — Morpho Token
  "0x4f8e5de400de08b164e7421b3ee387f461becd1a": "erc20", // USDD — Usdd Stablecoin
  "0x50327c6c5a14dcade707abad2e27eb517df87ab5": "erc20", // TRX — TRON
  "0x163f8c2467924be0ae7b5347228cabf260318753": "erc20", // WLD — Worldcoin
  "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9": "erc20", // AAVE — Aave Token
  "0x4da27a545c0c5b758a6ba100e3a049001de870f5": "erc20", // stkAAVE — Staked Aave
  "0x56072c95faa701256059aa122697b133aded9279": "erc20", // SKY — SKY Governance Token
  "0xfa2b947eec368f42195f24f36d2af29f7c24cec2": "erc20", // USDf — Falcon USD
  "0x54d2252757e1672eead234d27b1270728ff90581": "erc20", // BGB — BitgetToken
  "0x6982508145454ce325ddbe47a25d4ec3d2311933": "erc20", // PEPE — Pepe
  "0xce24439f2d9c6a2289f741120fe202248b666666": "erc20", // U — United Stables
  "0x4a220e6096b25eadb88358cb44068a3248254675": "erc20", // QNT — Quant
  "0xa0769f7a8fc65e47de93797b4e21c073c117fc80": "erc20", // EUTBL — Spiko EU T-Bills Money Market Fund
  "0xf34960d9d60be18cc1d5afc1a6f012a723a28811": "erc20", // KCS — KuCoin Token
  "0xa1290d69c65a6fe4df752f95823fae25cb99e5a7": "erc20", // rsETH
  "0x8c213ee79581ff4984583c6a801e5263418c4b86": "erc20", // JTRSY — Janus Henderson Anemoy Treasury Fund
  "0x43415eb6ff9db7e26a15b704e7a3edce97d31c4e": "erc20", // USTB — Superstate Short Duration US Government Securities Fund
  "0xe7ae30c03395d66f30a26c49c91edae151747911": "erc20", // clBTC
  "0xbe90556468e5ee2a15da99a5c0e045ed0b142143": "erc20", // jitoSOL — Jito Staked SOL (IBC)
  "0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24": "erc20", // RNDR — Render Token
  "0x8d983cb9388eac77af0474fa441c4815500cb7bb": "erc20", // ATOM — Cosmos
  "0x519ddeff5d142fc177d95f24952ef3d2ede530bc": "erc20", // ATOM — Cosmos Hub (IBC)
  "0xc8fb80fcc03f699c70ff0cc08c09106288888888": "erc20", // CTM — c8ntinuum
  "0x455e53cbb86018ac2b8092fdcd39d8444affc3f6": "erc20", // POL — Polygon Ecosystem Token
  "0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206": "erc20", // NEXO — Nexo
  "0xc139190f447e929f090edeb554d95abb8b18ac1c": "erc20", // USDtb
  "0x8236a87084f8b84306f72007f36f2618a5634494": "erc20", // LBTC — Lombard Staked BTC
  "0x57e114b691db790c35207b2e685d4a43181e6061": "erc20", // ENA — Ethena
  "0x8b1484d57abbe239bb280661377363b03c89caea": "erc20", // ADI
  "0xe66747a101bff2dba3697199dcce5b743b454759": "erc20", // GT — GateChainToken
  "0x6ad12e761b438bea3ea09f6c6266556bb24c2181": "erc20", // BDX — BELDEX
  "0x5a0f93d040de44e78f251b03c43be9cf317dcf64": "erc20", // JAAA — Janus Henderson Anemoy AAA CLO Fund Token
  "0xc96de26018a54d51c097160568752c4e3bd6c364": "erc20", // FBTC — FunctionBTC
  "0xae78736cd615f374d3085123a210448e74fc6393": "erc20", // rETH — Rocket Pool ETH
  "0x6e1a19f235be7ed8e3369ef73b196c07257494de": "erc20", // WFIL — Wrapped Filecoin
  "0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f": "erc20", // GHO — GHO Token
  "0x1a88df1cfe15af22b3c4c783d4e6f7f9e0c1885d": "erc20", // stkGHO — stk GHO
  "0x356b8d89c1e1239cbbb9de4815c39a1474d5ba7d": "erc20", // syrupUSDT — Syrup USDT
  "0x73a15fed60bf67631dc6cd7bc5b6e8da8190acf5": "erc20", // USD0 — Usual USD
  "0x232ce3bd40fcd6f80f3d55a522d03f25df784ee2": "erc20", // LIT — Lighter
  "0xb50721bcf8d664c30412cfbc6cf7a15145234ad1": "erc20", // ARB — Arbitrum
  "0x0000000000085d4780b73119b644ae5ecd22b376": "erc20", // TUSD — TrueUSD
  "0x6fa0be17e4bea2fcfa22ef89bf8ac9aab0ab0fc9": "erc20", // A7A5
  "0xe28b3b32b6c345a34ff64674606124dd5aceca30": "erc20", // INJ — Injective Token
  "0x152649ea73beab28c5b49b26eb48f7ead6d4c898": "erc20", // Cake — PancakeSwap Token
  "0x5cd8cd3c5e8780ccbc74277f22b099fefd04f5ef": "erc20", // jupSOL — Jupiter Staked SOL (IBC)
  "0x1abaea1f7c830bd89acc67ec4af516284b1bc33c": "erc20", // EURC
  "0xd5f7838f5c461feff7fe49ea5ebaf7728bb0adfa": "erc20", // mETH
  "0x1b19c19393e2d034d8ff31ff34c81252fcbbee92": "erc20", // OUSG — Ondo Short-Term U.S. Government Bond Fund
  "0xaea46a60368a7bd060eec7df8cba43b7ef41ad85": "erc20", // FET — Fetch
  "0x418708dd507a2f0cac24d31c60b350315f4c8009": "erc20", // WTRUMP — Wrapped TRUMP
  "0xd850942ef8811f2a866692a623011bde52a462c1": "erc20", // VEN — VeChain
  "0x4aef9bd3fbb09d8f374436d9ec25711a1be9bacb": "erc20", // BONK — Bonk (IBC)
  "0x44ff8620b8ca30902395a7bd3f2407e1a091bf73": "erc20", // VIRTUAL — Virtual Protocol
};

/**
 * Trusted token list keyed by chain ID, ready to pass to
 * `descriptorResolverOptions.trustedTokens`.
 */
export const TRUSTED_TOKENS: TrustedTokens = {
  [DEFAULT_CHAIN_ID]: MAINNET_ERC20_TOKENS,
};
