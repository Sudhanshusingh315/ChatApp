/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "primary-bg": "#1A1C24",
                primary: "#3B1E54",
                "secondary-400": "#9B7EBD",
                "secondary-300": "#D4BEE4",
                accent: "#EEEEEE",
                // skeleton
                "primary-bg-skeleton": "#1A1A1D",
                "primary-skeleton": "#3B1C32",
                "secondary-400-skeleton": "#6A1E55",
                "secondary-300-skeleton": "#A64D79",
            },
        },
    },
    plugins: [
        function ({ addVariant }) {
            addVariant("child", "& > *");
        },
    ],
};
