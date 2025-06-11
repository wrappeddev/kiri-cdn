/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--colour-bg)',
        surface: 'var(--colour-surface)',
        primary: 'var(--colour-primary)',
        secondary: 'var(--colour-secondary)',
        accent: 'var(--colour-accent)',
        'text-primary': 'var(--colour-text-primary)',
        'text-muted': 'var(--colour-text-muted)',
        success: 'var(--colour-success)',
        warning: 'var(--colour-warning)',
        error: 'var(--colour-error)',
      },
    },
  },
  plugins: [],
}
