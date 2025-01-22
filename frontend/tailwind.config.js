/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary-bg':'#1A1C24',
        'primary':'#3B1E54',
        'secondary-400':'#9B7EBD',
        'secondary-300':'#D4BEE4',
        'accent':'#EEEEEE'
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
  }
  ],
}

