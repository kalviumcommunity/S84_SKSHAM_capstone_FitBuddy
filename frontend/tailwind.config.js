/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Power Palette (CSS Vars) ──────────────── */
        bg:      'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          light:   'var(--surface-light)',
          border:  'var(--border)',
          hover:   'var(--surface-hover)',
          rgb:     'var(--surface-rgb)', // Added for opacity support
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover:   'var(--accent-hover)',
          text:    'var(--accent-text)',
        },
        muted:   'var(--text-muted)',
        dim:     'var(--text-dim)',
        inverted: 'var(--text-inverted)',
        /* ── Semantic stat colours ─────────────────── */
        emerald: '#10b981',
        amber:   '#f59e0b',
        sky:     '#0ea5e9',
        violet:  '#8b5cf6',
      },
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'var(--hero-glow)',
      },
      boxShadow: {
        glow:      'var(--shadow-glow)',
        'glow-lg': '0 0 48px rgba(220,38,38,0.35)',
        glass:     'var(--shadow-glass)',
        card:      '0 2px 8px rgba(0,0,0,0.10)',
      },
      animation: {
        float:        'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'slide-up':   'slide-up 0.5s ease-out',
        shimmer:      'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px var(--accent-glow)' },
          '50%':      { boxShadow: '0 0 44px var(--accent-glow)' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to:   { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
