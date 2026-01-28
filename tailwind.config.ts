import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'media',
    theme: {
        fontFamily: {
            header: ['var(--font-young-serif)', 'serif'],
        },
        extend: {
            animation: {
                'fade-in': 'fade-in 5s 1',
                'fade-in-fast': 'fade-in 0.3s 1',
            },
            fontFamily: {
                serif: ['Georgia', 'serif'],
                sans: ['var(--font-nunito)', 'sans-serif'],
            },
            keyframes: {
                'fade-in': {
                    '0%' : { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
