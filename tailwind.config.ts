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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "card-bg": "var(--card-bg)",
        "card-border": "var(--card-border)",
        accent: "var(--accent)",
        "accent-light": "var(--accent-light)",
        "accent-secondary": "var(--accent-secondary)",
        "accent-secondary-light": "var(--accent-secondary-light)",
        "ai-bubble": "var(--ai-bubble)",
        "user-bubble": "var(--user-bubble)",
        "mood-happy": "var(--mood-happy)",
        "mood-tired": "var(--mood-tired)",
        "mood-stressed": "var(--mood-stressed)",
        success: "var(--success)",
        muted: "var(--muted)",
      },
    },
  },
  plugins: [],
};

export default config;
