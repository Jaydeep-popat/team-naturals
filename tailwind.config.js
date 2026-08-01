/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1F3D2B',
          deep: '#16301F',
          soft: '#2F5A40',
          mist: '#E7EDE7',
        },
        cream: {
          DEFAULT: '#F8F3E9',
          soft: '#FCFAF5',
        },
        gold: '#C9A268',
        terracotta: '#C77B4A',
        ink: '#22261F',
        muted: '#6B7268',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        soft: '0 4px 20px -8px rgba(31, 61, 43, 0.12)',
        lift: '0 18px 40px -18px rgba(31, 61, 43, 0.28)',
        header: '0 6px 24px -16px rgba(31, 61, 43, 0.4)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(6deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        float: 'float 7s ease-in-out infinite',
      },
      scale: {
        '108': '1.08',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
};
