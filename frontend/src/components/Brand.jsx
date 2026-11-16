import React from "react";
import { Landmark } from "lucide-react";

export default function Brand({ size = "default" }) {
  const isLarge = size === "large";

  return (
    <div className="flex items-center gap-3 select-none">
      <span
        className={`grid place-items-center rounded-xl bg-sky-600 text-white shadow-[0_8px_22px_rgba(2,132,199,0.24)] ${
          isLarge ? "size-12" : "size-10"
        }`}
      >
        <Landmark size={isLarge ? 24 : 20} strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span
        className={`font-bold tracking-[-0.03em] text-slate-950 ${
          isLarge ? "text-xl sm:text-2xl" : "text-lg"
        }`}
      >
        North<span className="text-sky-600">bank</span>
      </span>
    </div>
  );
}
