# Website updates — 14 October 2026

## Implemented

- Simplified navbar to the logo and a football icon linking to `/matches`. Removed the old Matches/Leagues/Standings text buttons, search placeholder, and mobile dropdown.
- Removed `/leagues` and `/standings` pages; these paths now return 404.
- Removed the requested hero sentence and the hardcoded World Cup category, country roster, and title override. Remaining competition inference is still based on club aliases.
- Removed the forced two-second homepage delay. Home and match listings refresh every minute while visible and online.
- Added Other to the match filters so unmatched events can be browsed.
- Corrected sorting of equal-time upcoming matches and same-league live fixtures.
- Preserved the playing iframe when provider URLs rotate, sources disappear temporarily, or polling fails. The old automatic URL-based switching and misleading offline toast were removed.
- Added an explicit Reload player button and retained manual server selection. Polling keeps the source list current without changing a playing connection. Reload uses the latest URL for that source when available.
- Fixed rendering with an empty source list. New sources can populate an initially empty player. Upcoming pages now refresh status and sources and can transition to live at kickoff.
- Removed unmeasured latency labels, improved selected-server text contrast, added an iframe title, and kept the player/reload controls scrollable on smaller screens.
- Added a global adblock support dialog with a recheck button. It checks cosmetic hiding and a harmless local ad probe, and fails open for offline, timeout, missing-file, and server-error conditions. Detection is best-effort; it cannot identify every blocking extension.
- Removed every former Adsterra script, banner key, and Smartlink from application code. Exact public HilltopAds tags are stored in `src/lib/hilltopads-tags.json` and mapped in `src/lib/ads.ts`, with overrides in `.env.example`. Banner placements load near the viewport and isolate provider configuration. Empty, unconfigured placements render nothing.
- Kept all three stream-page banners available even before kickoff, and made the desktop stream sidebar scroll with the main content so its ads cannot squeeze the server list out of view.

## Ad network replacement

Adsterra rejected registration because the domain belongs to another publisher account. The authorized transfer/support request was sent, but you subsequently chose to replace Adsterra with HilltopAds.

`flstv.vercel.app` was added and verified in HilltopAds as website 924367 with the Non-Mainstream (18+) category, honoring your request to keep adult ads enabled. Its exact ownership meta tag is published in `src/app/layout.tsx`, alongside the referrer meta tag recommended in the publisher dashboard. No payout settings or account credentials were changed.

Six approved zones are installed using their exact provider-issued tags in `src/lib/hilltopads-tags.json`: Popunder (7516329), In-Page Push (7516365), Video Slider (7516381), and three 300×250 banners (7516405, 7516421, 7516437). Global ads run across the site; home, Matches, and stream pages each use all three banner zones once. The stream support button uses the issued sponsored DirectLink. Banner frames reserve space and scale to fit narrow containers.

The dashboard rejected a seventh zone with “Too many zones created. Please contact your personal manager.” The authorized limit-increase request was sent through support and escalated to a human agent for the publisher manager. Additional banner positions and a mobile 300×100 zone are pending that review. Matches Bottom and the shared Footer slot remain unconfigured; no duplicate or invented tags are inserted there.

## Revenue suggestions

Measure revenue per 1,000 visits and per placement across similar match days, devices, and countries. Try one layout/frequency change at a time; avoid layering several popunder networks together. Keeping the player reliable and the site quick helps retain viewers. Review whether below-the-player and mobile placements are actually visible before adding more units. These are experiments to measure, not guaranteed revenue increases.

[HilltopAds](https://hilltopads.com/publishers/platform) explicitly lists sports streaming. Its [streaming monetization guide](https://hilltopads.com/blog/streaming-website-monetization-a-practical-guide-for-publishers/) recommends comparing placement performance and managing frequency. More slots alone do not establish higher earnings; compare actual revenue and returning viewers before expanding further.

## Verification

The regression suite covers unique banner-zone use per page, URL rotation, disappearing/empty source lists, empty-source rendering, source identity and URL validation, kickoff status, sorting, removed World Cup classification, and adblock clear/blocked/offline/network-error cases. Run it with `npm test` (or `node --test tests/regressions.test.mjs`). Lint, TypeScript, production build, and browser checks are completed as part of this update. Source preservation is verified against controlled iframe fixtures; this does not measure upstream video playback quality.
