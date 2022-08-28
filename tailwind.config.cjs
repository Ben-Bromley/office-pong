/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'white-texture': "url('/images/bg-texture.jpg')"
      }
    },
  },
  plugins: [],
};
