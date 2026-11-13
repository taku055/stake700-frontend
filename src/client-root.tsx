"use client";

import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("@/client-app"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#1a2c38]" />,
});

export default function ClientRoot() {
  return <ClientApp />;
}
