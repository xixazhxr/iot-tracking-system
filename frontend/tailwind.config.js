/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#722F37", // Wine Red
                secondary: "#EFF0BB", // Cream/Light (User requested #EFFBB, assuming #EFF0BB)
                "primary-dark": "#5a232b",
                "primary-light": "#8e3b45",
            }
        },
    },
    plugins: [],
}
