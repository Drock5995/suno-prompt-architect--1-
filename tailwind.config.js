/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'spotify-gray': {
          '100': '#B3B3B3',
          '200': '#535353',
          '300': '#282828',
          '400': '#181818',
          '500': '#121212'
        },
        'spotify-green': '#1DB954',
      }
    }
  },
  plugins: [],
}
