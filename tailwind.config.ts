import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'alterview': {
          blue: '#4169E1',
          lightblue: '#4F86F7',
          skyblue: '#4682B4',
          indigo: '#5D3FD3',
          violet: '#8A2BE2',
          lavender: '#9370DB',
          purple: '#800080',
          darkblue: '#483D8B',
          periwinkle: '#6A5ACD',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'alterview-gradient': 'linear-gradient(to right, #4169E1, #5D3FD3, #800080)',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
export default config;
