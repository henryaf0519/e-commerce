/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blueMain: '#005fbe',
        grayDark: '#1f2937',
        accent: '#e5e7eb',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

