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
        dmsans: ["DM Sans", "sans-serif"],
        opensans: ['"Arial, Helvetica"', 'sans-serif'],
        prata: ['Prata', 'sans-serif'],
      },
      colors: {
        golden: '#C59B40',
        greyki: '#555555',
        darki:'#242323',
        softGrey:'#e1e1e1',
        whiteki: '#FCFBF6',
        graykiSecondary:'#CBCFD5',
        blueki: '#24354F'
      },
    },
  },
  plugins: [],
}

