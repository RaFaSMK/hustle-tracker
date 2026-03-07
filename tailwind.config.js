/** @type {import('tailwindcss').Config} */
module.exports = {
  // Mudamos de "./src/..." para "./app/..."
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
