/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FDFBF7',
          100: '#F7F4EC',
          200: '#EFEAE0',
          300: '#E2DBD0',
          400: '#C7BDAD',
          500: '#9E9380',
          600: '#7A6F5C',
          700: '#574D3D',
          800: '#383126',
          900: '#1F1A13',
        },
        forest: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#064E3B',
          900: '#003527',
          950: '#002117'
        },
        terracotta: {
          50: '#FFF7F2',
          100: '#FFEFE5',
          200: '#FEDCCB',
          300: '#FDBFA3',
          400: '#FB8E5F',
          500: '#E2725B',
          600: '#B94723',
          700: '#94381C',
          800: '#732C16',
          900: '#5A2311'
        },
        saffron: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F'
        },
        eco: {
          50: '#F0FDF4',
          100: '#E0F8EC',
          200: '#B6EED2',
          300: '#7CE0B2',
          400: '#3DCA8E',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#064E3B',
          900: '#003527'
        }
      },
      fontFamily: {
        heading: ['"Sora"', '"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sora: ['"Sora"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(6, 78, 59, 0.06), 0 2px 8px 0 rgba(0, 0, 0, 0.03)',
        'glass-hover': '0 16px 40px 0 rgba(6, 78, 59, 0.10), 0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        'glass-glow': '0 0 25px rgba(16, 185, 129, 0.20)',
        'warm': '0 4px 20px -2px rgba(185, 71, 35, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'warm-lg': '0 10px 25px -3px rgba(185, 71, 35, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        'eco': '0 4px 20px -2px rgba(6, 78, 59, 0.12)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)'
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem'
      }
    },
  },
  plugins: [],
}
