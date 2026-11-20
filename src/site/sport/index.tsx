"use client";

import Script from "next/script";
import Sportsbook from "@/components/Sportsbook";

// The sportsbook SDK is only needed here, so other pages don't pay for it
const SDK_URL = "https://ta-betinovio-wr5yui56.btgpub.online/assets/sdk/shadow/init.js";

export default function Sport() {
  return (
    <>
      <Script src={SDK_URL} strategy="afterInteractive" />
      <Sportsbook />
    </>
  );
}
