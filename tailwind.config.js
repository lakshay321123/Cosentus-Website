/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cosentus: {
          primary: '#00B5D6',
          blue1: '#36C2DE',
          blue2: '#68D1E6',
          blue3: '#A1DEED',
          blue4: '#D6EBF2',
        },
        gray: {
          custom1: '#616161',
          custom2: '#CCCCCC',
          custom3: '#E6E6E6',
        },
      },
      fontFamily: {
        reddit: ['"Reddit Sans"', 'sans-serif'],
      },
      animation: {
        spotlight: 'spotlight 2s ease .75s 1 forwards',
      },
      keyframes: {
        spotlight: {
          '0%': {
            opacity: '0',
            transform: 'translate(-72%, -62%) scale(0.5)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%,-40%) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
}
