import React from 'react';

export const TotalplayLogo = ({ className = "w-16 h-16" }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Icono animado corregido con transition y transform nativo */}
      <svg 
        className="animate-pulse transition-transform duration-300 ease-out hover:rotate-12 transform cursor-pointer inline-block"
        viewBox="0 0 100 100" 
        width="100%" 
        height="100%"
      >
        {/* Esfera central */}
        <circle cx="50" cy="50" r="14" fill="#E10098" />
        {/* Nodos de red satelitales */}
        <circle cx="50" cy="20" r="8" fill="#8BC53F" className="animate-bounce" style={{ animationDelay: '0.1s' }} />
        <circle cx="78" cy="35" r="7" fill="#00A1E4" />
        <circle cx="70" cy="68" r="8" fill="#F9A01B" />
        <circle cx="30" cy="68" r="7" fill="#8BC53F" />
        <circle cx="22" cy="35" r="8" fill="#E10098" />
        {/* Líneas de interconexión sutiles */}
        <path d="M50 20 L50 36 M78 35 L62 44 M70 68 L58 58 M30 68 L42 58 M22 35 L38 44" 
              stroke="currentColor" strokeWidth="1.5" strokeDasharray="3" className="opacity-40 text-gray-400 dark:text-gray-500" />
      </svg>
      {/* Texto Tipográfico */}
      <h1 className="mt-2 text-2xl font-black tracking-tighter text-gray-800 dark:text-white">
        total<span className="text-totalplay-pink font-light">play</span>
      </h1>
      <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500 uppercase font-semibold">
        Biblioteca Interna
      </p>
    </div>
  );
};