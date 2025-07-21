import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
      screens: {
        xs: "360px",
        xsm: "420px",
        smxs:'500px',
        smx:'550px',
        sm: "640px",
        sml: "680px",
        md: "768px",
        mdl: "890px",
        lg: "1024px",
        lgl: "1100px",
        lgll:'1190px',
        xl: "1250px",
        "2xl": "1536px",
      },
  },

  plugins: [],
};
export default config;
