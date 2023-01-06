module.exports = {
  mode: 'jit',
  darkMode: 'class', // or 'media' or 'class'
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './App.{js,ts,vue}',
    './app.{js,ts,vue}',
    './Error.{js,ts,vue}',
    './error.{js,ts,vue}',
    // './node_modules/flowbite/**/*.js',
  ],
  theme: {
    darkSelector: '.dark-mode',
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': {
            transform: 'rotate(-1deg)'
          },
          '50%': {
            transform: 'rotate(1deg)'
          }
        }
      },
      animation: {
        wigglefast: 'wiggle 0.5s ease-in-out infinite',
        wigglemedium: 'wiggle 0.8s ease-in-out infinite',
        wiggleslow: 'wiggle 1s ease-in-out infinite'
      }
    },
    fontSize: {
      xxs: '.65rem',
      xs: '.75rem',
      sm: '.875rem',
      tiny: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem'
    }
  },
  variants: {
    extend: {
      backgroundColor: ['dark', 'dark-hover', 'dark-focus', 'dark-group-hover', 'dark-even', 'dark-odd'],
      borderColor: ['dark', 'dark-hover', 'dark-disabled', 'dark-focus', 'dark-focus-within'],
      textColor: ['dark', 'dark-hover', 'dark-active', 'dark-placeholder'],
      fontWeight: ['hover']
    }
  },
  plugins: [
    require('tailwindcss-dark-mode')(),
    // require('flowbite/plugin')
  ]
}
