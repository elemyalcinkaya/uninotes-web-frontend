import type { Config } from 'tailwindcss'

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f5effa",
          500: "#6b21a8",
          600: "#581c87",
        }
      },
      borderRadius: {
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
} satisfies Config
