module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1550px',
      // => @media (min-width: 1536px) { ... }
    },

  },
  darkMode: 'selector',
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.shadow-white': {
          filter: 'drop-shadow(0 0 0.2rem rgba(255, 255, 255, 1))',
        },
      }
      addUtilities(newUtilities)
    },
    require('flowbite/plugin')
  ],
}
