/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#182333',
        paper: '#F5F6F8',
        line: '#E2E4EA',
        teal: {
          50: '#EAF6F4',
          600: '#147D6F',
          700: '#0F6459'
        },
        amber: {
          50: '#FBF2E3',
          600: '#C9862B'
        },
        danger: '#C0392B'
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      borderRadius: {
        xl: '0.75rem'
      }
    }
  },
  plugins: []
}
