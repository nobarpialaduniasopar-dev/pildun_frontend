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
        'avg-green': '#3CAC3B',
        'hermes': '#2A398D',
        'torch-red': '#E61D25',
        'light-gray': '#D1D4D1',
        'dark-heather': '#474A4A',
      },
    },
  },
  plugins: [],
};
export default config;