/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor:'#fff4ea',
        secondaryColor:'#F1CAFFFF',
        tertiaryColor:'#414141',
        fourthColor: '#FF7B00FF',
        fifthColor: '#B613F1FF',
        sixthColor: '#DF90FCFF',
      },
      fontFamily: {
        lora: ['"Lora"', 'serif']
      }
    },
  },
  plugins: [],
}