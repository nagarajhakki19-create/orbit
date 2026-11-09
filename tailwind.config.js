/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#080D19',      // Deep Space Navy
          surface: '#101A2B',   // Midnight Blue
          card: '#142036',      // Card surface
          border: '#1E3250',    // Elevated border
          cyan: '#42D9FF',      // Electric Cyan
          teal: '#36E0C0',      // Aurora Teal
          amber: '#FFB547',     // Solar Amber
          coral: '#FF6B70',     // Warning Coral
          light: '#F4F6FA',     // Warm White
          muted: '#8E9EB5'      // Subdued text
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Space Mono"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Orbitron"', '"Rajdhani"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(66, 217, 255, 0.35)',
        'glow-teal': '0 0 25px -5px rgba(54, 224, 192, 0.35)',
        'glow-coral': '0 0 25px -5px rgba(255, 107, 112, 0.45)',
        'glow-amber': '0 0 25px -5px rgba(255, 181, 71, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 40s linear infinite',
      }
    },
  },
  plugins: [],
}
