/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0d1b4b',
          800: '#1a237e',
          700: '#283593',
          600: '#3949ab',
        },
      },
      animation: {
        'wiggle': 'wiggle 0.5s ease-in-out',
        'sparkle-in': 'sparkleIn 0.8s ease-out forwards',
        'droop-in': 'droopIn 0.7s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'particle': 'particle 1.2s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.04) rotate(-2deg)' },
          '50%': { transform: 'scale(0.96) rotate(2deg)' },
          '75%': { transform: 'scale(1.02) rotate(-1deg)' },
          '100%': { transform: 'scale(1)' },
        },
        sparkleIn: {
          '0%': { filter: 'brightness(1) saturate(1)', transform: 'scale(1)' },
          '40%': { filter: 'brightness(1.6) saturate(1.8)', transform: 'scale(1.05)' },
          '100%': { filter: 'brightness(1.1) saturate(1.2)', transform: 'scale(1)' },
        },
        droopIn: {
          '0%': { filter: 'brightness(1)', transform: 'translateY(0)' },
          '40%': { filter: 'brightness(0.7) saturate(0.5)', transform: 'translateY(6px)' },
          '100%': { filter: 'brightness(0.9) saturate(0.8)', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        particle: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-80px) scale(0.3)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
