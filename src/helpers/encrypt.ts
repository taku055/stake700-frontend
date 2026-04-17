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

const keyHex = import.meta.env.VITE_ENCRYPTION_KEY ?? "";
const ivHex = import.meta.env.VITE_IV ?? ""; // must be 16 bytes (32 hex chars)

const keyBytes = hexToBytes(keyHex); // 32 bytes for AES-256
const ivBytes = hexToBytes(ivHex); // 16 bytes

const keyPromise = crypto.subtle.importKey(
  "raw",
  keyBytes as any,
  { name: "AES-CBC", length: 256 },
  false,
  ["encrypt", "decrypt"]
);

// Mirrors your API and returns hex
export async function encrypt(text: string): Promise<string> {
  const key = await keyPromise;
  const ct = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: ivBytes as any },
    key,
    te.encode(text)
  );
  console.log(ct);
  return bytesToHex(new Uint8Array(ct));
}

export async function decrypt(textHex: string): Promise<string> {
  const key = await keyPromise;
  const pt = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: ivBytes as any },
    key,
    hexToBytes(textHex) as any
  );
  return td.decode(pt);
}
