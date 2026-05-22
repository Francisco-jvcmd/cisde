/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#B8935A',    // Refined Antiqued Gold
          'primary-light': '#D4B87A',
          dark: '#0A0F1C',      // Abyss Navy
          'dark-mid': '#111827', // Elevated Dark
          accent: '#1A2332',    // Charcoal Blue
          light: '#FAFAF8',     // Warm Ivory
          'light-mid': '#F0EDE8', // Parchment
          muted: '#6B7280',     // Slate muted
        }
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fluid-display': 'clamp(3.5rem, 8vw + 1rem, 9rem)',
        'fluid-h1': 'clamp(2.75rem, 6vw + 1rem, 6.5rem)',
        'fluid-h2': 'clamp(2.25rem, 4vw + 1rem, 4.5rem)',
        'fluid-h3': 'clamp(1.5rem, 2.5vw + 0.5rem, 2.75rem)',
        'fluid-p': 'clamp(1.05rem, 0.8vw + 0.6rem, 1.25rem)',
        'fluid-sm': 'clamp(0.85rem, 0.5vw + 0.5rem, 1rem)',
      },
      transitionTimingFunction: {
        'corporate': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'line-grow': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'ticker': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.15)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 1.5s ease forwards',
        'line-grow': 'line-grow 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'ticker': 'ticker 30s linear infinite',
        'pulse-slow': 'pulse-slow 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
