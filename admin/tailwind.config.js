/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        dashboard: {
          bg: 'var(--dashboard-bg)',
          card: 'var(--dashboard-card)',
          accent: 'var(--dashboard-accent)',
          muted: 'var(--dashboard-muted)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar-bg)',
          accent: 'var(--sidebar-accent)',
          hover: 'var(--sidebar-hover)',
          active: 'var(--sidebar-active)',
        },
      },
      boxShadow: {
        'dashboard-card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'dashboard-card-hover': '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.04)',
        'sidebar-inner': 'inset -1px 0 0 0 rgba(255,255,255,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}