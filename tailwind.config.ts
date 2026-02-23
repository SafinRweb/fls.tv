import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#050510",
        layer: "#0A0F1F",
        accent: "#00D4FF",
        live: "#FF2B2B",
        soft: "#8A9BB8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
        score: ["var(--font-oswald)", "sans-serif"],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)",
        'radial-glow': "radial-gradient(circle at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        'neon': '0 0 15px rgba(0, 212, 255, 0.5)',
        'neon-strong': '0 0 25px rgba(0, 212, 255, 0.8)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-scroll': 'grid-scroll 20s linear infinite',
      },
      keyframes: {
        'grid-scroll': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(50px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
