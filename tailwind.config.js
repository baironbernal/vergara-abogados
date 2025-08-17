/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.jsx",
    "./resources/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
      colors: {
        golden: '#C59B40',
        greyki: '#555555',
        darki:'#161616',
        whiteki: '#FCFBF6',
      }
    },
  },
  plugins: [],
}

