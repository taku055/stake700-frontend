import { BITCOIN_CHAIN_ID, SOLANA_CHAIN_ID, TRON_CHAIN_ID } from "./constants";
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
    icon: "/images/tokens/bitcoin-btc-logo.png",
    name: "BTC",
    symbol: "BTC",
    chainId: 8086,
  },
  {
    icon: "/images/tokens/solana-sol-logo.png",
    name: "Solana",
    symbol: "SOL",
    chainId: 900,
  },
  {
    icon: "/images/tokens/ethereum-eth-logo.png",
    name: "Ethereum",
    symbol: "ETH",
    chainId: 1,
  },
  {
    icon: "/images/tokens/polygon-matic-logo.png",
    name: "Polygon",
    symbol: "POL",
    chainId: 137,
  },
  {
    icon: "/images/tokens/bnb-bnb-logo.png",
    name: "BSC",
    symbol: "BNB",
    chainId: 56,
  },
  {
    icon: "/images/tokens/base-logo.svg",
    name: "Base",
    symbol: "BASE",
    chainId: 8453,
  },
  {
    icon: "/images/tokens/avalanche-avax-logo.png",
    name: "Avalanche",
    symbol: "AVAX",
    chainId: 43114,
  },
  {
    icon: "/images/tokens/fantom-ftm-logo.png",
    name: "Fantom",
    chainId: 250,
    symbol: "FTM",
  },
];

export const allChainsMap: tChain[] = [
  {
    icon: "/images/tokens/usd.png",
    name: "USD",
    chainId: 0,
    symbol: "USD",
  },
];
allChains.forEach((c) => (allChainsMap[c.chainId] = c));

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
