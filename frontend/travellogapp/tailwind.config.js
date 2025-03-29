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
      // backgroundImage: {
      //   'login-bg-img': "url('./src/assets/images/bg-image.png')",
      //   'signup-bg-img': "url('./src/assets/images/signup-bg-img.png')"
      // }
    },
  },
  plugins: [],
}

