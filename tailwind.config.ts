/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './pages/**/*.{html,ts}',
    './components/**/*.{html,ts}',
  ],
  theme: {
    theme: {
      colors: {
        blue: '#155E95',
        gray: '#6A80B9',
        orange: '#F6C794',
        yellow: '#FFF6B3',
        tahiti: '#3ab7bf',
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
};
