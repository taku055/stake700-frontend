import { Suspense } from "react";
import ClientRoot from "@/client-root";

export default function CatchAllPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a2c38]" />}>
      <ClientRoot />
    </Suspense>
  );
}
