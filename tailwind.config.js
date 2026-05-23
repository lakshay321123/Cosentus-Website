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
      // Tailwind text-* utilities aligned to the CSS-variable type
      // scale defined in app/globals.css :root. Using var(--text-*)
      // here means Tailwind classes like text-base, text-lg, text-xl
      // pick up the mobile @media bump automatically (because the
      // vars themselves change at <=768px in globals.css).
      //
      // Overrides Tailwind's built-in defaults intentionally — we
      // want ONE source of truth, not parallel scales.
      // [size, line-height-css-var] form. Line heights point to
      // the --leading-* vars from globals.css.
      fontSize: {
        xxs:  ['var(--text-xxs)',  { lineHeight: 'var(--leading-snug)'    }],
        xs:   ['var(--text-xs)',   { lineHeight: 'var(--leading-snug)'    }],
        sm:   ['var(--text-sm)',   { lineHeight: 'var(--leading-normal)'  }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-relaxed)' }],
        md:   ['var(--text-md)',   { lineHeight: 'var(--leading-relaxed)' }],
        lg:   ['var(--text-lg)',   { lineHeight: 'var(--leading-snug)'    }],
        xl:   ['var(--text-xl)',   { lineHeight: 'var(--leading-snug)'    }],
        '2xl':['var(--text-2xl)',  { lineHeight: 'var(--leading-tight)'   }],
        '3xl':['var(--text-3xl)',  { lineHeight: 'var(--leading-tight)'   }],
        '4xl':['var(--text-4xl)',  { lineHeight: 'var(--leading-tight)'   }],
        '5xl':['var(--text-5xl)',  { lineHeight: 'var(--leading-tight)'   }],
        '6xl':['var(--text-6xl)',  { lineHeight: 'var(--leading-tight)'   }],
      },
    },
  },
  plugins: [],
}
