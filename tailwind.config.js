/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      minWidth: {
        '4' : '4rem' 
      },
      fontSize: {
        'ssm': '0.7rem'
      },
      minWidth: {
        '250': '250px',
        '2': '2rem',
        '3': '3rem',
        '4': '4rem',
        '5': '5rem'
      },
      maxHeight: {
        
      },
      keyframes: {
        drop: {
          '0%': { height: '0px' },
          '100%': { height: 'auto' }
        }
      },
      animation: {
        'drop': 'drop .2s ease-in-out'
      },
      height: {
        '6': '1.5rem'
      },
      width: {
        '6': '1.5rem'
      },
      backgroundImage: {
        'image-placeholder': "url(./src/public/images/OIP.jpg)"
      }
    },
  },
  plugins: [],
}