/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      wadik: ['Wadik', "sans-serif"],
      geologica: ['Geologica', "sans-serif"],
    },
    colors: {
      white: "#fff",
      gray: "#c9c9c933",
      black: "#000",
      transparent: "#ffffff00",
      blue: {
        400: "#05e9f0",
        500: "#1a194c",
        600: "#181a40",
        700: "#272661",
        800: "#0c0c2a",
      },
      yellow: {
        5: "#FFF970",
        25: "#FFE83D",
        50: "#ffd900",
        100: "#E7C009",
        200: "#CFAB08",
        300: "#fff04b",
        400: "#9E8006",
        500: "#866A04",
        600: "#6E5503",
        700: "#553F02",
        800: "#3D2A01",
        900: "#251400",
      },
      pink:{
        100:"#3300195c",
        200:"#91064a",
        300:"#e7263e",
        700:"#2d070c",
        900:"#330019",
      }
    },
    extend: {
      maxWidth: {
        maxContent: "1260px",
        maxContentTab: "650px"
      },
    },
  },
  plugins: [],
};