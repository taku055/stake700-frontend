export const addressLink = (address: string, chainId: number) => {
  if (chainId === 900) {
    return `https://solscan.io/account/${address}`;
  }

  if (chainId === 8086) {
    return `https://btcscan.org/address/${address}`;
  }

  if (chainId === 1) {
    return `https://etherscan.io/address/${address}`;
  }

  if (chainId === 137) {
    return `https://polygonscan.com/address/${address}`;
  }

  if (chainId === 56) {
    return `https://bscscan.com/address/${address}`;
  }

  if (chainId === 43114) {
    return `https://snowtrace.io/address/${address}`;
  }

  if (chainId === 250) {
    return `https://ftmscan.com/address/${address}`;
  }

  if (chainId === 10) {
    return `https://optimistic.etherscan.io/address/${address}`;
  }

  if (chainId === 42161) {
    return `https://arbiscan.io/address/${address}`;
  }

  if (chainId === 100) {
    return `https://gnosisscan.io/address/${address}`;
  }

  if (chainId === 8453) {
    return `https://basescan.org/address/${address}`;
  }

  return "#";
};
