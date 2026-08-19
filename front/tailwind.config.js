/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ─── Nature Travel Palette (ref: Dribbble@Anastasia Golovko) ───
        // Backgrounds — light mint
        bg: "#F5F7F2",
        card: "#FFFFFF",
        cardSecondary: "#F5F7F2",
        navy: "#0F2B24",
        border: "#E5E5E7",

        // Brand accent — warm amber (sunsets, stars, CTAs)
        accent: "#D4AF37",
        accentHover: "#C9A227",
        accentMuted: "#F8E7B2",

        // Text — forest tones
        textPrimary: "#2A2A2A",
        textSecondary: "#8B8B8B",
        textMuted: "#8B8B8B",

        // Nature green (forest dark, tags, icons)
        forest: "#355E4B",
        forestDark: "#0F2B24",
        forestLight: "#F5F7F2",

        // Semantic
        danger: "#EF4444",
        success: "#355E4B",
      },
      borderRadius: {
        card: "20px",
        btn: "14px",
        input: "14px",
        img: "16px",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 4px 20px rgba(245, 200, 59, 0.3)',
        glowStrong: '0 8px 30px rgba(245, 200, 59, 0.45)',
        card: '0 4px 24px rgba(15, 23, 42, 0.06)',
        glass: '0 8px 32px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1)',
        forest: '0 4px 14px rgba(74, 99, 84, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(245, 200, 59, 0.5))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 4px rgba(245, 200, 59, 0.2))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      }
    },
  },
  plugins: [],
}
