import React from "react";
import { Landmark } from "lucide-react";
import "./Brand.css";

export default function Brand({ size = "default" }) {
  const isLarge = size === "large";

  return (
    <div className="brand-container">
      <span className={`brand-icon ${isLarge ? "large" : "default"}`}>
        <Landmark size={isLarge ? 24 : 20} strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className={`brand-title ${isLarge ? "large" : "default"}`}>
        Northbank
      </span>
    </div>
  );
}
