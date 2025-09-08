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
        dmsans: ["DM Sans", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "sans-serif"],
        opensans: ["Arial", "Helvetica", "system-ui", "sans-serif"],
        prata: ["Prata", "Times New Roman", "Georgia", "serif"],
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

