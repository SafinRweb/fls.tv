"use client";

import { useEffect, useRef, useState } from "react";
import { ADS_CONFIG, type AdPlacement } from "@/lib/ads";

export function AdBanner({ placement }: { placement: AdPlacement }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [nearViewport, setNearViewport] = useState(false);
    const [scale, setScale] = useState(1);
    const snippet = ADS_CONFIG.placements[placement];

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !snippet) return;
        const resizeObserver = new ResizeObserver(entries => {
            const width = entries[0]?.contentRect.width;
            if (width) setScale(Math.min(1, width / 300));
        });
        resizeObserver.observe(container);
        const observer = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                setNearViewport(true);
                observer.disconnect();
            }
        }, { rootMargin: "300px" });
        observer.observe(container);
        return () => {
            observer.disconnect();
            resizeObserver.disconnect();
        };
    }, [snippet]);

    if (!snippet) return null;
    // Isolate each banner's configuration from other placements on the page.
    const srcDoc = `<!doctype html><html><head><meta name="referrer" content="no-referrer-when-downgrade"><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}</style></head><body>${snippet}</body></html>`;
    return (
        <div ref={containerRef} className="my-6 w-full flex flex-col items-center">
            <span className="mb-2 text-[10px] uppercase tracking-widest text-soft/50">Advertisement</span>
            <div style={{ width: 300 * scale, height: 250 * scale }} className="max-w-full">
                {nearViewport && <iframe title="Advertisement" srcDoc={srcDoc} loading="lazy" width={300} height={250} style={{ transform: `scale(${scale})`, transformOrigin: "top left" }} className="border-0 rounded-xl bg-layer/20" />}
            </div>
        </div>
    );
}
