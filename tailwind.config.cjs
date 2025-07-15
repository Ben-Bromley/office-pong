/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bronze: {
          DEFAULT: '#B89762',
          200: '#F2E0C0',
          300: '#D3B98E',
          400: '#B89762',
          500: '#A67F4C'
        },
        primary: {
          DEFAULT: '#2599FF',
          50: '#FFFFFF',
          100: '#F1F8FF',
          200: '#BEE1FF',
          300: '#8BC9FF',
          400: '#58B1FF',
          500: '#2599FF',
          600: '#0081F1',
          700: '#0065BE',
          800: '#004A8B',
          900: '#002F58'
        }
      },

      backgroundImage: {
        'banner-texture': "url('/images/banner-texture.svg')",
        'banner-polka': "url('/images/banner-polka.svg')"
      },
      animation: {
        gradient: 'gradient 2.4s ease-out infinite;'
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    }
  }
};
