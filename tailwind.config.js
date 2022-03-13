module.exports = {
  content: [
    './pages/**/*.{js,jsx,md,mdx,tsx}',
    './components/**/*.{js,jsx,md,mdx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Rubik', 'sans-serif'],
        body: ['Karla', 'sans-serif'],
      },
      colors: {
        theme: {
          'body': '#18194A',
          'subtitle': '#BABBC3',
          'primary': '#DCB8A9',
        }
      },
      animation: {
        'tap': 'tap 0.2s ease-in forwards',
        'fade-suspsene': 'fade-suspense 0.3s ease-in forwards' 
      },
      keyframes: {
        'tap': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' }
        },
        'fade-suspense': {
          '10%': { opacity: 0},
          '100%': { opacity: 1}
        }
      }
    },
  },
  plugins: [],
}
