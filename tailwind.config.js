export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        maroon: "#4a0508",
        wine: "#7a0c12",
        brand: "#c8201f",
        gold: "#f5b82e",
        cream: "#fde7a8",
      },
      fontFamily: {
        display: ["Anton", "Impact", "sans-serif"],
        head: ['"Playfair Display"', "Georgia", "serif"],
        body: ["Poppins", "system-ui", "sans-serif"],
      },
      keyframes: {
        rise: {
          from: { opacity: 0, transform: "translateY(16px) scale(.98)" },
          to: { opacity: 1, transform: "none" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-9px)" },
          "40%": { transform: "translateX(8px)" },
          "60%": { transform: "translateX(-6px)" },
          "80%": { transform: "translateX(4px)" },
        },
        pop: {
          "0%": { transform: "scale(.5)", opacity: 0 },
          "60%": { transform: "scale(1.25)", opacity: 1 },
          "100%": { transform: "scale(1)" },
        },
        floatUp: {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "20%": { opacity: 1 },
          "100%": { opacity: 0, transform: "translateY(-34px)" },
        },
        spark: {
          "0%": { transform: "translate(0,0) scale(1)", opacity: 1 },
          "100%": {
            transform: "translate(var(--dx),var(--dy)) scale(0)",
            opacity: 0,
          },
        },
        bob: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(74,222,128,.55)" },
          "50%": { boxShadow: "0 0 0 10px rgba(74,222,128,0)" },
        },
        tick: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.18)" },
        },
      },
      animation: {
        rise: "rise .5s cubic-bezier(.2,.8,.2,1) both",
        shake: "shake .45s ease-in-out",
        pop: "pop .45s cubic-bezier(.2,.9,.3,1.4) both",
        floatUp: "floatUp 1s ease-out forwards",
        spark: "spark .75s ease-out forwards",
        bob: "bob 3.2s ease-in-out infinite",
        glowPulse: "glowPulse 1s ease-out 2",
        tick: "tick .5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
