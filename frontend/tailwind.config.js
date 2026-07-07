/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        slate: {
          950: '#0B1120',
        },
        brand: {
          50: '#EEF4FF',
          100: '#D9E6FF',
          200: '#B3CCFF',
          300: '#82ABFF',
          400: '#5285FF',
          500: '#2E5BFF',
          600: '#1E3FDB',
          700: '#1830A8',
          800: '#142880',
          900: '#101F5F',
        },
        amber: {
          400: '#FFB648',
          500: '#FF9F1C',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
