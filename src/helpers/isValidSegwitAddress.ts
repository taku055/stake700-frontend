import * as bitcoin from "bitcoinjs-lib";

export function isValidSegwitAddress(address: string) {
  try {
    const decoded = bitcoin.address.fromBech32(address);
    return decoded.version === 0; // Check for SegWit version 0
  } catch (e) {
    // If fromBech32 throws an error, the address is not valid
    return false;
  }
}
