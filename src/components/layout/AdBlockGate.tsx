"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Heart, RefreshCw } from "lucide-react";
import { detectAdBlocking } from "@/lib/adblock";

export function AdBlockGate() {
    const [blocked, setBlocked] = useState(false);
    const [checking, setChecking] = useState(false);
    const [checkedAgain, setCheckedAgain] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        let cancelled = false;
        void detectAdBlocking().then(result => {
            if (!cancelled) setBlocked(result === "blocked");
        });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (!blocked) return;
        const previousOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;
        const previousFocus = document.activeElement;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        buttonRef.current?.focus();
        const keepFocus = (event: KeyboardEvent) => {
            if (event.key === "Tab") {
                event.preventDefault();
                buttonRef.current?.focus();
            }
        };
        document.addEventListener("keydown", keepFocus);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.removeEventListener("keydown", keepFocus);
            if (previousFocus instanceof HTMLElement) previousFocus.focus();
        };
    }, [blocked]);

    const recheck = useCallback(async () => {
        setChecking(true);
        const result = await detectAdBlocking();
        setChecking(false);
        setCheckedAgain(true);
        if (result === "clear") window.location.reload();
        // Never lock out viewers because connectivity checks failed.
        if (result === "unknown") setBlocked(false);
    }, []);

    if (!blocked) return null;

    return createPortal(
        <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-base/95 backdrop-blur-xl px-5">
            <div role="dialog" aria-modal="true" aria-labelledby="ad-support-title" aria-describedby="ad-support-description" className="w-full max-w-md rounded-3xl border border-accent/30 bg-layer p-8 text-center shadow-neon">
                <Heart className="mx-auto mb-5 h-10 w-10 text-accent" aria-hidden="true" />
                <h2 id="ad-support-title" className="text-2xl font-display font-bold text-white">Help keep fls.tv free</h2>
                <p id="ad-support-description" className="mt-4 text-soft leading-relaxed">Please turn off your ad blocker for this website. Ads help cover our costs and keep the streams available. Your support means a lot to us.</p>
                <p className="mt-4 text-sm text-soft">Allow ads for this site in your blocker, then check again below.</p>
                {checkedAgain && <p role="status" className="mt-4 text-sm text-amber-300">Ads still appear to be blocked. Please allow fls.tv and try again.</p>}
                <button ref={buttonRef} type="button" onClick={() => void recheck()} disabled={checking} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-bold text-[#050510] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                    <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} aria-hidden="true" />
                    {checking ? "Checking…" : "I've turned it off — check again"}
                </button>
            </div>
        </div>, document.body,
    );
}
