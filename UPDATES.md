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
- Removed every former Adsterra script, banner key, and Smartlink from application code. Public HilltopAds tags are centralized in `src/lib/ads.ts`, with overrides in `.env.example`. Banner placements load near the viewport and isolate provider configuration. Empty, unconfigured placements render nothing.

## Ad network replacement

Adsterra rejected registration because the domain belongs to another publisher account. The authorized transfer/support request was sent, but you subsequently chose to replace Adsterra with HilltopAds.

`flstv.vercel.app` was added to HilltopAds as website 924367 with the Non-Mainstream (18+) category, honoring your request to keep adult ads enabled. HilltopAds requires proof of ownership before it exposes website ad zones. Its exact verification meta tag is prepared in `src/app/layout.tsx` for publication to the live domain. No payout settings or account credentials were changed.

The expanded layout is prepared for 11 banner placements: three on home, four on Matches, three on stream pages, and one shared footer placement. Global slots support Popunder, In-Page, and video tags if approved/available, plus a sponsored DirectLink. Each placement must receive a provider-issued zone tag; no tags or zone IDs are invented. New ad delivery remains pending ownership verification and actual zone creation.

## Revenue suggestions

Measure revenue per 1,000 visits and per placement across similar match days, devices, and countries. Try one layout/frequency change at a time; avoid layering several popunder networks together. Keeping the player reliable and the site quick helps retain viewers. Review whether below-the-player and mobile placements are actually visible before adding more units. These are experiments to measure, not guaranteed revenue increases.

Adsterra exposes placement impressions, clicks, CPM, and revenue in its [publisher statistics](https://adsterra.com/blog/adsterra-statistics-for-publishers-and-webmasters/). [HilltopAds](https://hilltopads.com/publishers/platform) explicitly lists sports streaming; [Monetag](https://help.monetag.com/en/articles/6726292-website-content-main-rules-for-publishers) accepts streaming sites subject to its content rules. Approval of this domain/stream content should be confirmed by the chosen network before integration.

## Verification

The regression suite covers URL rotation, disappearing/empty source lists, empty-source rendering, source identity and URL validation, kickoff status, sorting, removed World Cup classification, and adblock clear/blocked/offline/network-error cases. Run it with `npm test` (or `node --test tests/regressions.test.mjs`). Lint, TypeScript, production build, and browser checks are completed as part of this update. Source preservation is verified against controlled iframe fixtures; this does not measure upstream video playback quality.
