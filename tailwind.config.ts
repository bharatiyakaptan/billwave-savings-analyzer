
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          10: "#E6F0FF",  // Blue10
          20: "#D6E4FF",  // Blue20
          30: "#B8CFFF",  // Blue30
          40: "#91B3FF",  // Blue40
          50: "#5A8EFF",  // Blue50
          60: "#2A62FF",  // Blue60
          70: "#1D4DD6",  // Blue70
          80: "#0A369F",  // Blue80
          90: "#091F5F",  // Blue90
          100: "#001359", // Blue100
          DEFAULT: "#2A62FF", // Blue60
          foreground: "#FFFFFF",
          hover: "#1D4DD6", // Blue70
        },
        secondary: {
          10: "#FFF5D6",  // Yellow10
          20: "#FFEB9D",  // Yellow20
          30: "#FFE066",  // Yellow30
          40: "#FFD426",  // Yellow40
          50: "#FFC926",  // Yellow50
          60: "#FFB403",  // Yellow60
          70: "#E29804",  // Yellow70
          80: "#BB7B02",  // Yellow80
          90: "#8D5A03",  // Yellow90
          100: "#633E02",  // Yellow100
          DEFAULT: "#FFC926", // Yellow50
          foreground: "#091F5F", // Blue90 for contrast
        },
        success: {
          10: "#D6FFE3",  // Success10
          20: "#9BFFB5",  // Success20
          30: "#3AD66C",  // Success30
          40: "#007D35",  // Success40
          DEFAULT: "#3AD66C", // Success30
          foreground: "#FFFFFF",
        },
        warning: {
          10: "#FFF5D6",  // Warning10
          20: "#FFD472",  // Warning20
          30: "#F3B915",  // Warning30
          40: "#AA7C04",  // Warning40
          DEFAULT: "#F3B915", // Warning30
          foreground: "#FFFFFF",
        },
        error: {
          10: "#FFD6D6",  // Error10
          20: "#FF8585",  // Error20
          30: "#E72C2C",  // Error30
          40: "#AD1919",  // Error40
          DEFAULT: "#E72C2C", // Error30
          foreground: "#FFFFFF",
        },
        info: {
          10: "#E6D6FF",  // Info10
          20: "#BC94FF",  // Info20
          30: "#6118F5",  // Info30
          40: "#4008AD",  // Info40
          DEFAULT: "#6118F5", // Info30
          foreground: "#FFFFFF",
        },
        neutral: {
          10: "#F5F5F5",  // Neutral10
          20: "#E7E7E7",  // Neutral20
          30: "#D1D1D1",  // Neutral30
          40: "#BDBDBD",  // Neutral40
          50: "#989CA4",  // Neutral50
          60: "#7D7D84",  // Neutral60
          70: "#63636B",  // Neutral70
          80: "#424249",  // Neutral80
          90: "#242437",  // Neutral90
          100: "#13132C",  // Neutral100
          110: "#0A0A29",  // Neutral110
          DEFAULT: "#63636B", // Neutral70
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      fontFamily: {
        sans: ["Figtree", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-down": "fade-down 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
