import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Plus, Trash2, Edit2, Calendar, User } from 'lucide-react';

export const Autores = () => {
  const { autores, agregarAutor, eliminarAutor } = useLibrary();
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Estados del Formulario Alternativo Simplificado (Próximamente modal o inline)
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState('');

  // Lógica de Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAutores = autores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(autores.length / itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !fecha) {
      setError('Todos los campos son requeridos.');
      return;
    }

    agregarAutor(nombre, fecha);
    setNombre('');
    setFecha('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Autores</h1>
          <p className="text-sm text-gray-500">Registra y administra los autores del sistema bibliotecario.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Alta */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-totalplay-pink" /> Nuevo Autor
          </h2>
          {error && <p className="text-xs text-red-500 mb-3 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Nombre Completo</label>
              <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Juan Rulfo" 
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-totalplay-pink"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Fecha de Nacimiento</label>
              <input 
                type="date" 
                value={fecha} 
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-totalplay-pink"
              />
            </div>
            <button type="submit" className="w-full py-2.5 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-totalplay-pink to-pink-600 shadow-md shadow-pink-500/10 hover:opacity-90 transition-all">
              Guardar Autor
            </button>
          </form>
        </div>

        {/* Tabla / Lista de Registros */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs font-bold uppercase text-gray-400 tracking-wider">
                  <th className="p-4">Autor</th>
                  <th className="p-4">Nacimiento</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
                {currentAutores.map((autor) => (
                  <tr key={autor.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/30 text-totalplay-pink">
                        <User size={18} />
                      </div>
                      <span className="font-semibold">{autor.nombre}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Calendar size={14} />
                        <span>{autor.fechaNacimiento}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => eliminarAutor(autor.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Eliminar autor y sus libros asociados"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer con Paginación */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 dark:text-white"
              >
                Anterior
              </button>
              <span className="text-xs text-gray-500">Página {currentPage} de {totalPages}</span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 dark:text-white"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};