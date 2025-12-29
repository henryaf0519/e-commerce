/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
     colors: {
        
        brand: 'rgb(var(--color-brand) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        
       
        page: 'rgb(var(--bg-page) / <alpha-value>)',      
        surface: 'rgb(var(--bg-surface) / <alpha-value>)', 
        
        main: 'rgb(var(--text-main) / <alpha-value>)',     
        muted: 'rgb(var(--text-muted) / <alpha-value>)',  
        inverted: 'rgb(var(--text-inverted) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}

