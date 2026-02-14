
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1',   // Indigo (Buttons, primary actions)
          success: '#10B981',   // Mint (Income, progress < 80%)
          warning: '#F59E0B',   // Amber (Budget 80-99%)
          danger: '#F43F5E',    // Rose (Over budget > 100%)
          surface: '#1E293B',   // Slate 800 (Cards in dark mode)
          background: '#0F172A',// Deep Slate (App background)
        },
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      borderRadius: {
        'app': '12px',
      }
    },
  },
  plugins: [],
}
