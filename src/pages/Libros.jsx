import React, { useState, useRef } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { validateISBNSoap } from '../utils/isbnValidator';
import { parseBooksCSV } from '../utils/csvProcessor';
import { fetchBookCover } from '../services/bookApi';
import { Search, Plus, FileText, Trash2, BookOpen, AlertCircle, Loader2 } from 'lucide-react';

export const Libros = () => {
  const { libros, autores, agregarLibro, eliminarLibro, agregarLibrosMasivo } = useLibrary();
  const fileInputRef = useRef(null);

  // Estados de búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Estados del Formulario / Modal básico
  const [isOpen, setIsOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [isbn, setIsbn] = useState('');
  const [autorId, setAutorId] = useState('');
  const [paginas, setPaginas] = useState('');
  
  // Validaciones y loaders
  const [errors, setErrors] = useState({});
  const [isValidatingSoap, setIsValidatingSoap] = useState(false);

  // ==========================================
  // FILTRADO Y BUSQUEDA AVANZADA (Requerimiento)
  // ==========================================
  const filteredLibros = libros.filter(libro => {
    const minSearch = searchTerm.toLowerCase();
    const tituloMatch = libro.titulo.toLowerCase().includes(minSearch);
    
    // Buscar el nombre del autor correspondiente para cruzar el filtro
    const autor = autores.find(a => a.id === libro.autorId);
    const autorMatch = autor ? autor.nombre.toLowerCase().includes(minSearch) : false;

    return tituloMatch || autorMatch;
  });

  // Cálculo de Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLibros = filteredLibros.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLibros.length / itemsPerPage);

  // ==========================================
  // MANEJO DE CARGA MASIVA CSV (Requerimiento)
  // ==========================================
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target.result;
      const librosParseados = parseBooksCSV(text);
      
      if (librosParseados.length === 0) {
        alert("No se encontraron registros válidos en el CSV. Estructura esperada: Titulo,ISBN,AutorID,Paginas");
        return;
      }

      // Resolver las portadas mediante la API REST para cada libro del CSV de forma asíncrona
      const librosConPortada = await Promise.all(
        librosParseados.map(async (libro) => {
          const urlPortada = await fetchBookCover(libro.isbn);
          return { ...libro, urlPortada };
        })
      );

      agregarLibrosMasivo(librosConPortada);
      alert(`¡Carga masiva exitosa! Se añadieron ${librosConPortada.length} libros.`);
    };
    reader.readAsText(file);
    e.target.value = null; // Limpiar input
  };

  // ==========================================
  // VALIDACIÓN DE FORMULARIO Y SOAP
  // ==========================================
  const handleGuardarLibro = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!titulo.trim() || titulo.length < 3) nuevosErrores.titulo = "Título requerido (mínimo 3 caracteres).";
    if (!isbn.trim()) nuevosErrores.isbn = "El ISBN es obligatorio.";
    if (!autorId) nuevosErrores.autorId = "Debes seleccionar un autor.";
    if (!paginas || parseInt(paginas, 10) <= 0) nuevosErrores.paginas = "Páginas deben ser mayor a 0.";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    setErrors({});
    setIsValidatingSoap(true);

    // REQUERIMIENTO CRÍTICO: Validar mediante la API SOAP de DaeHosting
    const isIsbnValido = await validateISBNSoap(isbn);

    if (!isIsbnValido) {
      setIsValidatingSoap(false);
      setErrors({ isbn: "El servidor SOAP determinó que este ISBN no es válido estructuralmente." });
      return;
    }

    // Si pasa la validación SOAP, se agrega (el contexto jalará el API REST de portadas por detrás)
    await agregarLibro({ titulo, isbn, autorId, paginas });
    
    setIsValidatingSoap(false);
    setIsOpen(false);
    // Limpiar campos
    setTitulo('');
    setIsbn('');
    setAutorId('');
    setPaginas('');
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Catálogo de Libros</h1>
          <p className="text-sm text-gray-500">Gestiona las obras literarias, valida códigos ISBN vía SOAP y automatiza portadas REST.</p>
        </div>
        
        {/* Acciones de Control */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleCSVUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold text-sm cursor-pointer"
          >
            <FileText size={18} className="text-totalplay-green" />
            <span>Carga Masiva (CSV)</span>
          </button>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-white font-bold bg-gradient-to-r from-totalplay-pink to-pink-600 shadow-md shadow-pink-500/10 hover:opacity-90 transition-all text-sm cursor-pointer"
          >
            <Plus size={18} />
            <span>{isOpen ? 'Cerrar Formulario' : 'Nuevo Libro'}</span>
          </button>
        </div>
      </div>

      {/* Formulario Desplegable de Alta */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl max-w-2xl animate-fade-in">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-totalplay-pink" /> Registrar Nueva Obra
          </h2>
          <form onSubmit={handleGuardarLibro} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Título del Libro</label>
              <input 
                type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border outline-none text-gray-900 dark:text-white ${errors.titulo ? 'border-red-500 ring-2 ring-red-100 dark:ring-red-950/30' : 'border-gray-200 dark:border-gray-700'}`}
                placeholder="Ej. Pedro Páramo"
              />
              {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Código ISBN (Validación SOAP)</label>
              <input 
                type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border outline-none text-gray-900 dark:text-white ${errors.isbn ? 'border-red-500 ring-2 ring-red-100 dark:ring-red-950/30' : 'border-gray-200 dark:border-gray-700'}`}
                placeholder="Ej. 9780307474728"
              />
              {errors.isbn && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.isbn}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Autor de la Obra</label>
              <select 
                value={autorId} onChange={(e) => setAutorId(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border outline-none text-gray-900 dark:text-white ${errors.autorId ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200 dark:border-gray-700'}`}
              >
                <option value="">-- Selecciona un autor --</option>
                {autores.map(aut => (
                  <option key={aut.id} value={aut.id}>{aut.nombre}</option>
                ))}
              </select>
              {errors.autorId && <p className="text-red-500 text-xs mt-1">{errors.autorId}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Número de Páginas</label>
              <input 
                type="number" value={paginas} onChange={(e) => setPaginas(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border outline-none text-gray-900 dark:text-white ${errors.paginas ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200 dark:border-gray-700'}`}
                placeholder="Ej. 350"
              />
              {errors.paginas && <p className="text-red-500 text-xs mt-1">{errors.paginas}</p>}
            </div>

            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={isValidatingSoap}
                className="w-full py-2.5 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-totalplay-pink to-pink-600 shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75"
              >
                {isValidatingSoap ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Validando WSDL SOAP...</span>
                  </>
                ) : (
                  <span>Guardar Obra</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Barra de Búsqueda y Filtro Cruzado */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search size={18} />
        </span>
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          placeholder="Buscar por título o nombre del autor..." 
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none focus:border-totalplay-pink transition-colors"
        />
      </div>

      {/* Vista Responsiva de Datos (Tabla / Grid) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse hidden sm:table">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs font-bold uppercase text-gray-400 tracking-wider">
                <th className="p-4">Portada</th>
                <th className="p-4">Título</th>
                <th className="p-4">ISBN</th>
                <th className="p-4">Autor</th>
                <th className="p-4">Páginas</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
              {currentLibros.map((libro) => {
                const autorAsociado = autores.find(a => a.id === libro.autorId);
                return (
                  <tr key={libro.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <img 
                        src={libro.urlPortada} 
                        alt={libro.titulo} 
                        className="w-10 h-14 object-cover rounded-md shadow-sm border border-gray-100 dark:border-gray-800"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100'; }}
                      />
                    </td>
                    <td className="p-4 font-bold tracking-tight text-gray-900 dark:text-white">{libro.titulo}</td>
                    <td className="p-4 font-mono text-xs">{libro.isbn}</td>
                    <td className="p-4 font-medium text-gray-600 dark:text-gray-400">{autorAsociado ? autorAsociado.nombre : 'Desconocido'}</td>
                    <td className="p-4 text-gray-500">{libro.paginas} pgs</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => eliminarLibro(libro.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Tarjetas móviles para versión responsive estricta */}
          <div className="grid grid-cols-1 gap-4 p-4 sm:hidden">
            {currentLibros.map((libro) => {
              const autorAsociado = autores.find(a => a.id === libro.autorId);
              return (
                <div key={libro.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/40 flex space-x-4">
                  <img src={libro.urlPortada} alt={libro.titulo} className="w-16 h-24 object-cover rounded-lg shadow-sm" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{libro.titulo}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{autorAsociado ? autorAsociado.nombre : 'Desconocido'}</p>
                      <p className="text-[10px] font-mono text-gray-400 mt-1">ISBN: {libro.isbn}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{libro.paginas} pgs</span>
                      <button onClick={() => eliminarLibro(libro.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer de Paginación */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 dark:text-white cursor-pointer"
            >
              Anterior
            </button>
            <span className="text-xs text-gray-500">Página {currentPage} de {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 dark:text-white cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};