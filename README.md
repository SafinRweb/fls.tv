# fls.tv | Live Football In Home.

fls.tv is a premium, modern web application designed to deliver an immersive and cinematic football tracking and streaming experience. Built with performance and aesthetics in mind, it provides real-time match data, chronological upcoming schedules, and a dedicated distraction-free viewing environment.

## ✨ Features

- **Immersive Stream Player**: A dedicated, full-viewport cinema mode for watching matches with ambient background blurring to match the broadcast.
- **Chronological Sorting**: Smart scheduling automatically bubbles the soonest upcoming matches to the top of your feed.
- **Global Leagues Hub**: Browse through a curated gallery of the world's top football leagues with high-quality crests.
- **Premium Dark UI**: A meticulously crafted interface heavily inspired by modern sports broadcasting UI standards, featuring neon glows, glassmorphism, and strict grid structures.
- **Responsive Design**: Flawless layout scaling from ultra-wide desktop monitors down to mobile devices.

## 🛠️ Tech Stack

This project was built with a cutting-edge front-end stack to ensure maximum performance and developer experience:

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js 18+ installed.

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
- **Component Design System**: Reusable UI primitives (like `MatchCard`, navigation pills, and glowing buttons) enforce strict design system rules across all pages.
- **Dynamic League Detection**: The frontend intelligently maps match titles and team names to their parent league competitions to display the correct global crests dynamically.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
