import tags from "./hilltopads-tags.json";

// Exact public tags for verified HilltopAds website 924367 (Non-Mainstream/18+).
// Each page uses each banner zone once. Extra slots await a higher zone limit.
export const ADS_CONFIG = {
    popunder: process.env.NEXT_PUBLIC_HILLTOPADS_POPUNDER || tags.popunder,
    inPage: process.env.NEXT_PUBLIC_HILLTOPADS_INPAGE || tags.inPage,
    video: process.env.NEXT_PUBLIC_HILLTOPADS_VIDEO || tags.video,
    smartlinkUrl: process.env.NEXT_PUBLIC_HILLTOPADS_DIRECTLINK || tags.directLink,
    placements: {
        homeHero: process.env.NEXT_PUBLIC_HILLTOPADS_HOME_HERO || tags.banners.primary,
        homeDivider: process.env.NEXT_PUBLIC_HILLTOPADS_HOME_DIVIDER || tags.banners.secondary,
        homeBottom: process.env.NEXT_PUBLIC_HILLTOPADS_HOME_BOTTOM || tags.banners.tertiary,
        matchesTop: process.env.NEXT_PUBLIC_HILLTOPADS_MATCHES_TOP || tags.banners.primary,
        matchesDivider: process.env.NEXT_PUBLIC_HILLTOPADS_MATCHES_DIVIDER || tags.banners.secondary,
        matchesSidebar: process.env.NEXT_PUBLIC_HILLTOPADS_MATCHES_SIDEBAR || tags.banners.tertiary,
        matchesBottom: process.env.NEXT_PUBLIC_HILLTOPADS_MATCHES_BOTTOM || "",
        streamBelow: process.env.NEXT_PUBLIC_HILLTOPADS_STREAM_BELOW || tags.banners.primary,
        streamSidebar: process.env.NEXT_PUBLIC_HILLTOPADS_STREAM_SIDEBAR || tags.banners.secondary,
        streamBottom: process.env.NEXT_PUBLIC_HILLTOPADS_STREAM_BOTTOM || tags.banners.tertiary,
        footer: process.env.NEXT_PUBLIC_HILLTOPADS_FOOTER || "",
    },
};

export type AdPlacement = keyof typeof ADS_CONFIG.placements;
