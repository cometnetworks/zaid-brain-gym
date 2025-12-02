/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'bounce-slight': 'bounce-slight 2s infinite',
                'confetti': 'confetti 3s ease-in-out forwards',
                'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'fade-in': 'fadeIn 0.5s ease-out',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                'bounce-slight': {
                    '0%, 100%': { transform: 'translateY(-5%)' },
                    '50%': { transform: 'translateY(0)' },
                },
                'pop': {
                    '0%': { transform: 'scale(0.5)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'fadeIn': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
