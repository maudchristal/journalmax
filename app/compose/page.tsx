import { Suspense } from "react";
import { ComposeForm } from "@/components/compose-form";

function ComposeFallback() {
  return (
    <div className="rounded-xl border border-[#efefef] bg-white px-5 py-12 text-center text-sm text-[#8e8e8e] shadow-sm">
      Loading…
    </div>
  );
}

export default function ComposePage() {
  return (
    <Suspense fallback={<ComposeFallback />}>
      <ComposeForm />
    </Suspense>
  );
}
