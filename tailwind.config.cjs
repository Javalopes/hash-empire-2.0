module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores personalizadas para o contraste máximo
        cyan: {
          400: '#22d3ee', // Cyan vibrante
          500: '#06b6d4', // Cyan base
          900: '#164e63', // Cyan escuro para profundidade
          950: '#083344',
        },
        slate: {
          950: '#020617', // O fundo "vazio" do espaço/cidade
        }
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'neon': '0 0 15px rgba(34, 211, 238, 0.4)',
        'neon-strong': '0 0 30px rgba(6, 182, 212, 0.6)',
      }
    },
  },
  plugins: [],
}
