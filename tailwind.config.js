/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          deep: '#116D6E',
          DEFAULT: '#116D6E',
          hover: '#0e5859',
          light: '#e6f3f3',
          subtle: 'rgba(17, 109, 110, 0.08)',
        },
        espresso: {
          dark: '#321E1E',
          DEFAULT: '#321E1E',
          soft: '#4a2f2f',
        },
        brown: {
          warm: '#4E3636',
          DEFAULT: '#4E3636',
          muted: '#7a5a5a',
          faint: '#c9b8b8',
        },
        crimson: {
          vibrant: '#CD1818',
          DEFAULT: '#CD1818',
          hover: '#b51414',
          subtle: 'rgba(205, 24, 24, 0.08)',
        },
        cream: {
          warm: '#FDFBF7',
          DEFAULT: '#FDFBF7',
          pure: '#FFFFFF',
          card: '#FFFFFF',
          subtle: '#F7F4EC',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
        'xl': '14px',
        '2xl': '16px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(50, 30, 30, 0.05), 0 2px 6px -1px rgba(50, 30, 30, 0.03)',
        'soft-lg': '0 10px 30px -4px rgba(50, 30, 30, 0.08), 0 4px 12px -2px rgba(50, 30, 30, 0.04)',
        'crimson': '0 8px 24px -4px rgba(205, 24, 24, 0.35)',
        'teal': '0 8px 24px -4px rgba(17, 109, 110, 0.3)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
