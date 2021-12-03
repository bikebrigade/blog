module.exports = {
  purge: ['_site/**/*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        move: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(100%)' }
        },
        roll: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(180deg)' }
        }
      },
      animation: {
        'move': 'move 3.5s ease-in-out 1',
        'roll': 'roll 3.5s ease-in-out 1',
       }
    },
    fontFamily: {
      sans: ["HK Grotesk", "sans-serif"]
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}