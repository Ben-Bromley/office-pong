/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'white-texture': "url('/images/bg-texture.jpg')",
        'banner-texture': "url('/images/banner-texture.svg')",
        'banner-polka': "url('/images/banner-polka.svg')"
      }
    }
  },
  plugins: []
};
