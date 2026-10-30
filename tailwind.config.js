/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',    // Tablet breakpoint
      'lg': '1024px',   // Desktop 3-column breakpoint
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        headline: ['var(--font-headline)', '"Newsreader"', '"Playfair Display"', 'Georgia', 'serif'],
        body: ['var(--font-body)', '"Spectral"', '"Merriweather"', '"Lora"', 'Georgia', 'serif'],
        kicker: ['"Cinzel"', '"Inter"', 'system-ui', 'sans-serif'],
        sans: ['var(--font-ui)', '"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        ui: ['var(--font-ui)', '"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        masthead: ['"Cinzel"', '"Newsreader"', '"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        serif: ['var(--font-body)', '"Spectral"', '"Merriweather"', 'Georgia', 'serif'],
      },
      colors: {
        paper: {
          canvas: '#F4F1EA', // Light Theme Canvas ("Aged Broadsheet Edition" warm matte newsprint)
          surface: '#FFFFFF', // Surfaces / Cards
          elevated: '#ECE8DF', // Elevated / Hover surface
          line: '#D5CFBE', // Hairline Card Borders
          border: '#D5CFBE',
          divider: '#1E1E1E', // Hairline Dividers
          hover: '#E5DFD1',
        },
        broadside: {
          canvas: '#0B0C0E', // Dark Theme Canvas ("Midnight Press Edition" ink-well obsidian)
          surface: '#141619', // Elevated Card Surfaces
          elevated: '#1D2025', // Higher Elevation
          line: '#2A2E35', // Defined Borders
          border: '#2A2E35',
          divider: '#363B44',
          hover: '#22262E',
        },
        ink: {
          hard: '#0A0A0A', // Absolute carbon black / 98% density ink; razor-sharp
          primary: '#0A0A0A',
          secondary: '#262626', // Dense graphite for excerpts and subtitles
          tertiary: '#4A4A4A', // Solid charcoal for metadata
          muted: '#4A4A4A',
        },
        cream: {
          hard: '#F5F5F0', // Pure porcelain white; ultra-crisp without eye fatigue
          primary: '#F5F5F0',
          secondary: '#C8CCC5', // Firm silver-paper hue
          tertiary: '#9EA3A0', // Solid light charcoal
          muted: '#9EA3A0',
        },
        accent: {
          brass: '#E6AF2E', // Vintage brass gold accent
          gold: '#E6AF2E',
          linotype: '#38D489', // Linotype green accent
          green: '#38D489',
        },
        gold: {
          DEFAULT: '#E6AF2E',
          light: '#F3C760',
          dark: '#C5911B',
          wash: 'rgba(230, 175, 46, 0.12)',
          glow: 'rgba(230, 175, 46, 0.35)',
        },
        sepia: {
          DEFAULT: '#B45309',
          dark: '#7A3805',
          light: '#D97706',
        },
        linotype: {
          DEFAULT: '#38D489',
          light: '#5FE2A0',
          dark: '#21A364',
          wash: 'rgba(56, 212, 137, 0.12)',
        },
      },
      animation: {
        'slide-up': 'slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.18s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
