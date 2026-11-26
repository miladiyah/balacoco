import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { sage: { 50: "#F5F8F3", 100: "#E6EFE5", 200: "#C5D8C3", 500: "#78977C", 700: "#4F6B55" } } } },
  plugins: []
};
export default config;
