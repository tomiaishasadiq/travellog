/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Poppins", "sans-serif"]
    },
    extend: {
      //Colors used in the project
      colors: {
        primary: "#386FA4",
        secondary: "",
      },
      backgroundImage: {
        'login-bg-img': "url('./assets/images/bg-image.jpeg')",
        'signup-bg-img': "url('./assets/images/signup-bg-img.jpeg')"
      }
    },
  },
  plugins: [],
}


