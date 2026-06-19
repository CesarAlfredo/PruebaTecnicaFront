import React, { createContext, useState, useEffect } from 'react';
import { parseJwt, generarSimuladoJWT } from '../utils/jwtSimulator';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Inicializar usuario si ya hay un token guardado
  useEffect(() => {
    if (token) {
      const payload = parseJwt(token);
      if (payload && payload.exp > Date.now() / 1000) {
        setUser(payload.sub);
      } else {
        logout(); // Expiró mientras la app estuvo cerrada
      }
    }
  }, [token]);

  // Hilo guardián: Revisa la expiración del JWT dinámicamente cada 2 segundos
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      const payload = parseJwt(token);
      if (payload) {
        const tiempoRestante = payload.exp - (Date.now() / 1000);
        
        if (tiempoRestante <= 0) {
          logout();
          alert("🚨 Tu sesión ha expirado tras 1 hora de inactividad por seguridad.");
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [token]);

  const login = (username, password) => {
    // Hardcodeamos credenciales simuladas para la BD estática JSON
    if (username === "admin@totalplay.com.mx" && password === "Pass1234") {
      const nuevoToken = generarSimuladoJWT(username);
      localStorage.setItem('token', nuevoToken);
      setToken(nuevoToken);
      setUser(username);
      return { success: true };
    }
    return { success: false, message: "Credenciales incorrectas de Totalplay" };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};