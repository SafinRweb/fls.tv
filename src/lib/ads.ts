// HilltopAds tags only. Website 924367 is pending ownership verification.
// Paste the exact issued tags below or override them with the public Vercel variables.
export const ADS_CONFIG = {
    popunder: process.env.NEXT_PUBLIC_HILLTOPADS_POPUNDER || "",
    inPage: process.env.NEXT_PUBLIC_HILLTOPADS_INPAGE || "",
    video: process.env.NEXT_PUBLIC_HILLTOPADS_VIDEO || "",
    smartlinkUrl: process.env.NEXT_PUBLIC_HILLTOPADS_DIRECTLINK || "",
    placements: {
        homeHero: process.env.NEXT_PUBLIC_HILLTOPADS_HOME_HERO || "",
        homeDivider: process.env.NEXT_PUBLIC_HILLTOPADS_HOME_DIVIDER || "",
        homeBottom: process.env.NEXT_PUBLIC_HILLTOPADS_HOME_BOTTOM || "",
        matchesTop: process.env.NEXT_PUBLIC_HILLTOPADS_MATCHES_TOP || "",
        matchesDivider: process.env.NEXT_PUBLIC_HILLTOPADS_MATCHES_DIVIDER || "",
        matchesSidebar: process.env.NEXT_PUBLIC_HILLTOPADS_MATCHES_SIDEBAR || "",
        matchesBottom: process.env.NEXT_PUBLIC_HILLTOPADS_MATCHES_BOTTOM || "",
        streamBelow: process.env.NEXT_PUBLIC_HILLTOPADS_STREAM_BELOW || "",
        streamSidebar: process.env.NEXT_PUBLIC_HILLTOPADS_STREAM_SIDEBAR || "",
        streamBottom: process.env.NEXT_PUBLIC_HILLTOPADS_STREAM_BOTTOM || "",
        footer: process.env.NEXT_PUBLIC_HILLTOPADS_FOOTER || "",
    },
};

export type AdPlacement = keyof typeof ADS_CONFIG.placements;
