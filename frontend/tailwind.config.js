/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F3F4F6",
        },
      },
      fontFamily: {
        heading: ["PlusJakartaSans_700Bold"],
        "heading-medium": ["PlusJakartaSans_600SemiBold"],
        body: ["PlusJakartaSans_400Regular"],
        "body-medium": ["PlusJakartaSans_500Medium"],
      },
    },
  },
  plugins: [],
};
