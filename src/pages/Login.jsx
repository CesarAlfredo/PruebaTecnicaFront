import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; 
import { useTheme } from '../context/ThemeContext'; 
import { TotalplayLogo } from '../components/Shared/TotalplayLogo';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados de errores
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validarFormulario = () => {
    const nuevosErrores = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      nuevosErrores.email = "El correo electrónico es requerido.";
    } else if (!emailRegex.test(email)) {
      nuevosErrores.email = "Formato de correo inválido.";
    }

    if (!password) {
      nuevosErrores.password = "La contraseña no puede estar vacía.";
    } else if (password.length < 6) {
      nuevosErrores.password = "Debe contener al menos 6 caracteres.";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError('');

    if (validarFormulario()) {
      const res = login(email, password);
      if (!res.success) {
        setApiError(res.message);
      }
    }
  };

  return (
    // Duración extendida a 1000ms para simular el anochecer/amanecer progresivo
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-1000 ease-in-out px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-1000 ease-in-out relative">
        
        {/* Nueva sección superior: Botón animado de Sol/Luna sobre el recuadro */}
        <div className="flex justify-end mb-2">
          <button 
            type="button"
            onClick={toggleTheme} 
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-totalplay-pink dark:hover:text-totalplay-pink transition-all duration-500 overflow-hidden relative w-10 h-10 flex items-center justify-center shadow-inner"
            title={theme === 'dark' ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {/* Contenedor con rotación y transición de salida/entrada */}
            <div className={`transform transition-transform duration-700 flex items-center justify-center ${theme === 'dark' ? 'rotate-180' : 'rotate-0'}`}>
              {theme === 'dark' ? (
                <Sun size={20} className="text-yellow-400 animate-spin-slow transition-opacity duration-500" />
              ) : (
                <Moon size={20} className="text-indigo-600 transition-opacity duration-500" />
              )}
            </div>
          </button>
        </div>

        {/* Header con el Logo Animado */}
        <div className="text-center">
          <TotalplayLogo className="w-24 h-24 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300 transition-colors duration-1000">
            Ingresa a tu cuenta
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Prueba técnica Cesar Olvera
          </p>
        </div>

        {/* Error general de la API */}
        {apiError && (
          <div className="mt-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-200 dark:border-red-900 text-center font-medium">
            {apiError}
          </div>
        )}

        {/* Formulario */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            
            {/* Input Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-1000">
                Correo Institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-white outline-none focus:ring-2 transition-all duration-1000 ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50' 
                    : 'border-gray-200 dark:border-gray-700 focus:border-totalplay-pink focus:ring-pink-100 dark:focus:ring-pink-950/30'
                }`}
                placeholder="ejemplo@totalplay.com.mx"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Input Contraseña */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-1000">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-white outline-none focus:ring-2 transition-all duration-1000 ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50' 
                      : 'border-gray-200 dark:border-gray-700 focus:border-totalplay-pink focus:ring-pink-100 dark:focus:ring-pink-950/30'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
            </div>
          </div>

          {/* Botón Enviar */}
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-totalplay-pink to-pink-600 hover:from-pink-600 hover:to-totalplay-pink shadow-lg shadow-pink-500/20 transition-all transform hover:-translate-y-0.5 focus:outline-none"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6 transition-colors duration-1000">
          Tip: <span className="font-mono text-gray-600 dark:text-gray-300">admin@totalplay.com.mx</span> / <span className="font-mono text-gray-600 dark:text-gray-300">Pass1234</span>
        </div>
      </div>
    </div>
  );
};