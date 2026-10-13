# fls.tv | Live Football In Home.

fls.tv is a football schedule and streaming interface built with Next.js. It fetches events and iframe sources from SportSRC and adds local competition labels, match filters, and a responsive viewing page.

## ✨ Features

- **Immersive Stream Player**: A dedicated, full-viewport cinema mode for watching matches with ambient background blurring to match the broadcast.
- **Chronological Sorting**: Smart scheduling automatically bubbles the soonest upcoming matches to the top of your feed.
- **Match Filters**: Browse live and upcoming events by competition, including events classified as Other.
- **Stable Player Connection**: API refreshes preserve the playing iframe. Viewers can reload it or select a different source explicitly.
- **Adblock Support Message**: A recheckable support dialog appears when local probes detect ad blocking; connectivity failures do not lock out viewers.
- **Premium Dark UI**: A meticulously crafted interface heavily inspired by modern sports broadcasting UI standards, featuring neon glows, glassmorphism, and strict grid structures.
- **Responsive Design**: Flawless layout scaling from ultra-wide desktop monitors down to mobile devices.

## 🛠️ Tech Stack

This project was built with a cutting-edge front-end stack to ensure maximum performance and developer experience:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

Use Node.js 20.9 or later, as required by the installed Next.js version.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SafinRweb/fls.tv.git
   cd fls.tv
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Architecture Notes

- **Data Layer**: The application features a robust internal data-fetching layer (`src/lib/api.ts`) that standardizes raw match data into clean TypeScript interfaces (`Match`, `Team`, `League`). It utilizes Next.js App Router's built-in fetch cache mechanisms for optimal performance and rate-limit protection.
- **Navigation**: The logo returns home; a football icon opens `/matches`. Stream pages use a separate viewing layout. The former leagues and standings pages have been removed.
- **League Detection**: `src/lib/leagues.ts` uses handwritten club aliases and UEFA rosters. These guesses are not official competition metadata. The hardcoded World Cup category has been removed.

## Checks and advertising configuration

Run `npm test`, `npm run lint`, and `npm run build` before deployment. The regression tests cover player connection preservation, empty sources, match sorting/status, and adblock detection.

HilltopAds tags are stored exactly as issued in `src/lib/hilltopads-tags.json` and mapped to placements in `src/lib/ads.ts`. All former Adsterra scripts and links have been removed. The verified website has six approved zones: Popunder, In-Page Push, Video Slider, and three 300×250 banners. Home, Matches, and stream pages each use the three banner zones once. Banners load near the viewport and fit narrow screens. The stream support button uses the issued sponsored DirectLink.

Website 924367 (`flstv.vercel.app`) is verified with Non-Mainstream/18+ ads enabled. Its ownership and recommended referrer meta tags are in `src/app/layout.tsx`. The dashboard currently rejects additional zones; a limit-increase request has been sent to support for routing to the publisher manager. Additional Matches Bottom and Footer placements remain empty until more zones are approved.

Copy `.env.example` to `.env.local`, or set its variables in Vercel, to override the installed tags with other approved HilltopAds tags. Rebuild/redeploy after changing `NEXT_PUBLIC_*` values. Unconfigured extra placements render nothing. These are public embed codes, not account credentials.

See [UPDATES.md](UPDATES.md) for the 14 October 2026 changes and ad configuration.
