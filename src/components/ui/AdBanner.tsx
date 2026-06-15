"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
    type: "horizontal" | "sidebar" | "160x300" | "468x60" | "native";
}

export function AdBanner({ type }: AdBannerProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear container first to avoid multiple script insertions in dev hot-reload
        containerRef.current.innerHTML = "";

        if (type === "native") {
            const targetDiv = document.createElement("div");
            targetDiv.id = "container-2c5786c8f5e34051222d22259fb2952a";
            containerRef.current.appendChild(targetDiv);

            const script = document.createElement("script");
            script.async = true;
            script.setAttribute("data-cfasync", "false");
            script.src = "https://pl29757569.effectivecpmnetwork.com/2c5786c8f5e34051222d22259fb2952a/invoke.js";
            containerRef.current.appendChild(script);
            return;
        }

        // Detect screen width for responsive banner sizes
        const isMobile = window.innerWidth < 1024;
        let config;

        if (type === "horizontal") {
            if (isMobile) {
                config = {
                    key: "fe546cbf4f235550e85e3dea1e450d86", // Banner 300x250 for mobile friendly layout
                    format: "iframe",
                    height: 250,
                    width: 300,
                };
            } else {
                config = {
                    key: "72b95d611a1039e7540aa78429f1e49e", // Banner 728x90 for desktop
                    format: "iframe",
                    height: 90,
                    width: 728,
                };
            }
        } else if (type === "sidebar") {
            config = {
                key: "bccebcdc2193a5ead486c298c93bebc5", // Banner 160x600 for sidebar
                format: "iframe",
                height: 600,
                width: 160,
            };
        } else if (type === "160x300") {
            config = {
                key: "8826a9eb4714ae99e8b938f0e00b836c", // Banner 160x300
                format: "iframe",
                height: 300,
                width: 160,
            };
        } else {
            // 468x60
            config = {
                key: "e0cda5dd695ca94306a483a4618fec6a", // Banner 468x60
                format: "iframe",
                height: 60,
                width: 468,
            };
        }

        // Create options script tag
        const optScript = document.createElement("script");
        optScript.type = "text/javascript";
        optScript.innerHTML = `
            atOptions = {
                'key' : '${config.key}',
                'format' : 'iframe',
                'height' : ${config.height},
                'width' : ${config.width},
                'params' : {}
            };
        `;

        // Create script tag to invoke the ad
        const invokeScript = document.createElement("script");
        invokeScript.type = "text/javascript";
        invokeScript.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`;

        // Append to local container
        containerRef.current.appendChild(optScript);
        containerRef.current.appendChild(invokeScript);
    }, [type]);

    // Enforce min-height to prevent layout shifts (CLS)
    let containerClass = "mx-auto flex items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-layer/20";
    if (type === "horizontal") {
        containerClass += " w-full max-w-[728px] min-h-[250px] lg:min-h-[90px]";
    } else if (type === "sidebar") {
        containerClass += " w-[160px] min-h-[600px]";
    } else if (type === "160x300") {
        containerClass += " w-[160px] min-h-[300px]";
    } else if (type === "468x60") {
        containerClass += " w-[468px] max-w-full min-h-[60px]";
    } else {
        // native
        containerClass += " w-full min-h-[150px]";
    }

    return (
        <div className="w-full flex justify-center items-center my-6">
            <div ref={containerRef} className={containerClass}>
                <span className="text-[10px] uppercase tracking-widest text-soft/20 font-bold">
                    Advertisement
                </span>
            </div>
        </div>
    );
}
