/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Nunito: ["Nunito", "sans-serif"],
        OpenSans: ["Open Sans", "sans-serif"],
        pop: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#5F35F5",
        secondary: "#11175D",
        smallText: "#888BAE",
        inputText: "#585D8E",
      },
    },
  },
};
