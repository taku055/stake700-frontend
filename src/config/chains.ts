import { ASSET_BASE_URL, BITCOIN_CHAIN_ID, SOLANA_CHAIN_ID, TRON_CHAIN_ID } from "./constants";
import { tChain } from "@/types/tChain";

export const chainIds: { [network: string]: number } = {
  ethereum: 1,
  bsc: 56,
  polygon: 137,
  avalanche: 43114,
  fantom: 250,
  optimism: 10,
  arbitrum: 42161,
  gnosis: 100,
  base: 8453,
  solana: SOLANA_CHAIN_ID,
  bitcoin: BITCOIN_CHAIN_ID,
  tron: TRON_CHAIN_ID,
};

export const chainNames: {[id: number] : string } = {
  1: "Ethereum",
  56: "BSC",
  137: "Polygon",
  43114: "Avalanche",
  250: "Fantom",
  10: "Optimism",
  42161: "Arbitrum",
  100: "Gnosis",
  8453: "Base",
  [SOLANA_CHAIN_ID]: "Solana",
  [BITCOIN_CHAIN_ID]: "Bitcoin",
  [TRON_CHAIN_ID]: "Tron",
}

export const ZERO_ADDRESS = "0x";

export const allChains: tChain[] = [
  {
    icon: `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/bitcoin-btc-logo.png`,
    name: "BTC",
    symbol: "BTC",
    chainId: 8086,
  },
  {
    icon: `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/solana-sol-logo.png`,
    name: "Solana",
    symbol: "SOL",
    chainId: 900,
  },
  {
    icon: `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/ethereum-eth-logo.png`,
    name: "Ethereum",
    symbol: "ETH",
    chainId: 1,
  },
  {
    icon: `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/polygon-matic-logo.png`,
    name: "Polygon",
    symbol: "POL",
    chainId: 137,
  },
  {
    icon: `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/bnb-bnb-logo.png`,
    name: "BSC",
    symbol: "BNB",
    chainId: 56,
  },
  {
    icon: `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/base-logo.svg`,
    name: "Base",
    symbol: "BASE",
    chainId: 8453,
  },
  {
    icon: `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/avalanche-avax-logo.png`,
    name: "Avalanche",
    symbol: "AVAX",
    chainId: 43114,
  },
  {
    icon: `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/fantom-ftm-logo.png`,
    name: "Fantom",
    chainId: 250,
    symbol: "FTM",
  },
];

export const allChainsMap: tChain[] = [
  {
    icon: `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/usd.png`,
    name: "USD",
    chainId: 0,
    symbol: "USD",
  },
];
allChains.forEach((c) => (allChainsMap[c.chainId] = c));

const chainIconFallbacks: Record<number, string> = {
  10: `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/optimism-ethereum-op-logo.svg`,
  42161: `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/arbitrum-arb-logo.svg`,
  100: `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/gnosis-gno-gno-logo.svg`,
  [TRON_CHAIN_ID]: `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/tron-trx-logo.svg`,
};

/** Icon URL for a network `chainId`; extends `allChainsMap` with known fallbacks. */
export function getChainIconUrl(chainId: number): string {
  const mapped = (allChainsMap as unknown as Record<number, tChain | undefined>)[
    chainId
  ];
  if (mapped?.icon) return mapped.icon;
  return (
    chainIconFallbacks[chainId] ??
    `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/ethereum-eth-logo.png`
  );
}

export const ethSignatureTypes = {
  Person: [
    { name: "name", type: "string" },
    { name: "wallet", type: "address" },
  ],
  Transaction: [
    { name: "from", type: "Person" },
    { name: "to", type: "Person" },
    { name: "transaction", type: "string" },
    { name: "tokenAmount", type: "string" },
    { name: "tokenAddress", type: "string" },
    { name: "chainId", type: "string" },
  ],
};
