import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { TotalplayLogo } from '../Shared/TotalplayLogo';
import { BookOpen, Users, LogOut, Sun, Moon, Menu, X } from 'lucide-react';

export const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'libros', label: 'Gestión de Libros', icon: <BookOpen size={20} /> },
    { id: 'autores', label: 'Gestión de Autores', icon: <Users size={20} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-colors duration-1000">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-center">
        <TotalplayLogo className="w-20 h-20" />
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-totalplay-pink to-pink-600 text-white shadow-md shadow-pink-500/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 transition-colors duration-1000">
      {/* Sidebar de Escritorio */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-20">
        <SidebarContent />
      </aside>

      {/* Sidebar Móvil (Drawer) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-64 max-w-xs h-full animate-slide-in">
            <SidebarContent />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-[-45px] p-2 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Contenedor Principal */}
      <div className="flex-1 md:pl-64 flex flex-col">
        {/* Navbar Superior */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 z-10 transition-colors duration-1000">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center space-x-4 ml-auto">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:inline-block">
              {user?.email}
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-totalplay-pink transition-all duration-500 overflow-hidden relative w-10 h-10 flex items-center justify-center shadow-inner"
            >
              <div className={`transform transition-transform duration-700 ${theme === 'dark' ? 'rotate-180' : 'rotate-0'}`}>
                {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
              </div>
            </button>
          </div>
        </header>

        {/* Espacio de Contenido Dinámico */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};