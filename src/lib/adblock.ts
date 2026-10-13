export type AdBlockResult = "blocked" | "clear" | "unknown";

export async function detectAdBlocking(): Promise<AdBlockResult> {
    if (!navigator.onLine) return "unknown";
    const control = document.createElement("div");
    const bait = document.createElement("div");
    for (const node of [control, bait]) {
        node.style.cssText = "position:absolute;left:-10000px;top:-10000px;width:1px;height:1px;pointer-events:none;";
        node.setAttribute("aria-hidden", "true");
        document.body.appendChild(node);
    }
    bait.className = "adsbox ad-banner ad-placement pub_300x250 pub_728x90";

    try {
        await new Promise<void>(resolve => window.setTimeout(resolve, 150));
        const style = window.getComputedStyle(bait);
        const hidden = control.offsetHeight > 0 && (!bait.isConnected || bait.offsetHeight === 0 || style.display === "none" || style.visibility === "hidden");
        if (hidden) return "blocked";

        // Distinguish a blocked probe from a missing file, timeout, or offline site.
        const connectivity = await fetch(`/connection-check.txt?t=${Date.now()}`, {
            cache: "no-store", signal: AbortSignal.timeout(3000),
        });
        if (!connectivity.ok) return "unknown";
        const response = await fetch(`/ads/advertisement.js?t=${Date.now()}`, {
            cache: "no-store", signal: AbortSignal.timeout(3000),
        }).catch(error => {
            if (error instanceof TypeError) return null;
            throw error;
        });
        if (!response) return navigator.onLine ? "blocked" : "unknown";
        return response.ok ? "clear" : "unknown";
    } catch {
        return "unknown";
    } finally {
        control.remove();
        bait.remove();
    }
}
