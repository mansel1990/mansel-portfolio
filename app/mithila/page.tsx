"use client";

import dynamic from "next/dynamic";

const MithilaApp = dynamic(() => import("@/components/mithila/MithilaApp"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="mithila-loader mx-auto mb-4" />
        <p className="text-sm tracking-[0.3em] uppercase" style={{ color: "#f5f0e8", opacity: 0.5 }}>
          gathering starlight…
        </p>
      </div>
    </div>
  ),
});

export default function MithilaPage() {
  return <MithilaApp />;
}
