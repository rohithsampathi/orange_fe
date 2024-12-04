// tailwind.config.js

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        teal: {
          200: '#81E6D9',
          400: '#38B2AC',
          500: '#319795',
        },
        blue: {
          500: '#4299E1',
        },
        gray: {
          900: '#0d1117',
          800: '#161b22',
          700: '#1f2937',
        },
      },
      fontFamily: {
        mono: ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
