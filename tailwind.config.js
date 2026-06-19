/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Permite activar el modo oscuro añadiendo la clase "dark" al HTML
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Escanea todos tus componentes de React para aplicar los estilos
  ],
  theme: {
    extend: {
      colors: {
        'totalplay-pink': '#E10098',
        'totalplay-green': '#8BC53F',
      },
    },
  },
  plugins: [],
}