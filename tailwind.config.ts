import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './views/**/*.{js,ts,jsx,tsx,mdx}', // Just in case
    './figma/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255, 255, 255, 0.25)',
        glassBorder: 'rgba(255, 255, 255, 0.5)',
        textMain: '#2D2A4A', // Dark purple-grey
        textLight: '#6E6A8F', // Soft purple-grey
        pastelPink: '#FFC8DD',
        pastelPurple: '#E0C3FC',
        pastelBlue: '#A0C4FF',
        pastelYellow: '#FDFFB6',
        pastelGreen: '#CBF0F8', // Minty
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'var(--font-noto)', 'sans-serif'],
        heading: ['var(--font-heading)', 'var(--font-noto)', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow': '0 0 40px rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'blob': 'blob 10s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    }
  },
  plugins: [],
};
export default config;