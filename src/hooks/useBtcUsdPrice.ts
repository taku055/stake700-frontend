import { useEffect, useState } from "preact/hooks";

export function useBtcUsdPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
          { headers: { accept: "application/json" } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const p = data?.bitcoin?.usd;

        if (!cancelled) setPrice(typeof p === "number" ? p : null);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to fetch BTC price");
      }
    }

    run();
    const id = setInterval(run, 300_000); // refresh every 5 minutes
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { price, error };
}
