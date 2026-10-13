"use client";

import { useEffect, useRef } from "react";
import { ADS_CONFIG } from "@/lib/ads";
import { appendAdSnippet } from "@/lib/ad-snippet";

export function GlobalAds() {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        appendAdSnippet(container, [ADS_CONFIG.popunder, ADS_CONFIG.inPage, ADS_CONFIG.video].filter(Boolean).join("\n"));
        return () => { container.replaceChildren(); };
    }, []);
    return <div ref={containerRef} />;
}
