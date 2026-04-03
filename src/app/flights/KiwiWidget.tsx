"use client";

import { useEffect } from "react";

export default function KiwiWidget({ affiliateId }: { affiliateId: string }) {
  useEffect(() => {
    const container = document.getElementById("kiwi-widget-container");
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://widgets.kiwi.com/scripts/widget-search-iframe.js";
    script.async = true;
    script.setAttribute("data-width", "100%");
    script.setAttribute("data-height", "500");
    script.setAttribute("data-currency", "USD");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-affilid", affiliateId);
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [affiliateId]);

  return <div id="kiwi-widget-container" className="w-full min-h-[500px]" />;
}
