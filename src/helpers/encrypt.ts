function hexToBytes(hex: string): Uint8Array {
  if (!/^[0-9a-fA-F]*$/.test(hex) || hex.length % 2 !== 0)
    throw new Error("Invalid hex");
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++)
    arr[i] = parseInt(hex.substr(i * 2, 2), 16);
  return arr;
}
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
const te = new TextEncoder();
const td = new TextDecoder();

const keyHex = process.env.NEXT_PUBLIC_ENCRYPTION_KEY ?? "";
const ivHex = process.env.NEXT_PUBLIC_IV ?? ""; // must be 16 bytes (32 hex chars)

// Imported on first use, so a missing/invalid key only fails sign-up, not page load
let keyPromise: Promise<CryptoKey> | null = null;
let ivBytes: Uint8Array | null = null;
function getKey(): Promise<CryptoKey> {
  if (!keyPromise) {
    if (keyHex.length !== 64 || ivHex.length !== 32) {
      return Promise.reject(new Error("NEXT_PUBLIC_ENCRYPTION_KEY / NEXT_PUBLIC_IV are not configured"));
    }
    ivBytes = hexToBytes(ivHex); // 16 bytes
    keyPromise = crypto.subtle.importKey(
      "raw",
      hexToBytes(keyHex) as any, // 32 bytes for AES-256
      { name: "AES-CBC", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }
  return keyPromise;
}

// Mirrors your API and returns hex
export async function encrypt(text: string): Promise<string> {
  const key = await getKey();
  const ct = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: ivBytes! as any },
    key,
    te.encode(text)
  );
  return bytesToHex(new Uint8Array(ct));
}

export async function decrypt(textHex: string): Promise<string> {
  const key = await getKey();
  const pt = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: ivBytes! as any },
    key,
    hexToBytes(textHex) as any
  );
  return td.decode(pt);
}
