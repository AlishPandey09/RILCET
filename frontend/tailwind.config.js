/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#fff4ea",
        secondaryColor: "#F1CAFFFF",
        tertiaryColor: "#414141",
        fourthColor: "#FF7B00FF",
        fifthColor: "#B613F1FF",
        sixthColor: "#DF90FCFF",
        seventhColor: "#F04E44",
        eighthColor: "#F68A60",
        ninthColor: "#B0499B",
        tenthColor: "#6CCAD3",
      },
      fontFamily: {
        lora: ['"Lora"', "serif"],
        inter: ['"Inter"', "sans-serif"],
      },
      backgroundImage: {
        "resin-gradient": "linear-gradient(135deg, #6CCAD3, #B0499B, #F04E44)",
      },
    },
  },
  plugins: [],
};
