/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#020202', // Vantablack inspired
        surface: '#0a0a0a',   // Just off-black for cards
        surfaceHover: '#111111', // Lighter hover state for cards
        borderDark: 'rgba(255,255,255,0.08)',
        borderHilight: 'rgba(255,255,255,0.15)',
        primaryText: '#f5f5f7', // Apple inspired typography color
        secondaryText: '#86868b',
        
        // Brand/Glow Accents
        accentBlue: '#2997ff',
        accentPurple: '#bf5af2',
        accentPink: '#ff375f'
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.3s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 15px rgba(191, 90, 242, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(191, 90, 242, 0.6)' },
        },
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(191, 90, 242, 0.5)',
      },
    },
  },
  plugins: [],
};
