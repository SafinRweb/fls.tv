"use client";

import { useEffect, useRef, useState } from "react";
import { ADS_CONFIG, type AdPlacement } from "@/lib/ads";

export function AdBanner({ placement }: { placement: AdPlacement }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [nearViewport, setNearViewport] = useState(false);
    const snippet = ADS_CONFIG.placements[placement];

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !snippet) return;
        const observer = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                setNearViewport(true);
                observer.disconnect();
            }
        }, { rootMargin: "300px" });
        observer.observe(container);
        return () => observer.disconnect();
    }, [snippet]);

    if (!snippet) return null;
    // Isolate each banner's configuration from other placements on the page.
    const srcDoc = `<!doctype html><html><head><meta name="referrer" content="strict-origin-when-cross-origin"><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}</style></head><body>${snippet}</body></html>`;
    return (
        <div ref={containerRef} className="my-6 w-full flex flex-col items-center">
            <span className="mb-2 text-[10px] uppercase tracking-widest text-soft/50">Advertisement</span>
            {nearViewport && <iframe title="Advertisement" srcDoc={srcDoc} loading="lazy" className="w-full max-w-[728px] h-[250px] border-0 rounded-xl bg-layer/20" />}
        </div>
    );
}
