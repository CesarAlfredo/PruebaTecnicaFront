import React, { createContext, useContext, useState, useEffect } from 'react';
import initialAutores from '../data/autores.json';
import initialLibros from '../data/libros.json';
import { fetchBookCover } from '../services/bookApi';
import { normalizeText } from '../utils/textNormalizer';

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  // Cargar de localStorage o usar los archivos JSON de respaldo inicial
  const [autores, setAutores] = useState(() => {
    const saved = localStorage.getItem('biblioteca_autores');
    return saved ? JSON.parse(saved) : initialAutores;
  });

  const [libros, setLibros] = useState(() => {
    const saved = localStorage.getItem('biblioteca_libros');
    return saved ? JSON.parse(saved) : initialLibros;
  });

  // Persistir cambios automáticamente cuando cambie el estado
  useEffect(() => {
    localStorage.setItem('biblioteca_autores', JSON.stringify(autores));
  }, [autores]);

  useEffect(() => {
    localStorage.setItem('biblioteca_libros', JSON.stringify(libros));
  }, [libros]);

  // ==========================================
  // OPERACIONES DE AUTORES (CRUD)
  // ==========================================
  const agregarAutor = (nombre, fechaNacimiento) => {
    const nuevoAutor = {
      id: crypto.randomUUID(), // Autogenerado como UUID
      nombre: normalizeText(nombre), // Normalizado estricto
      fechaNacimiento
    };
    setAutores(prev => [...prev, nuevoAutor]);
    return { success: true };
  };

  const editarAutor = (id, nombre, fechaNacimiento) => {
    setAutores(prev => prev.map(a => a.id === id ? { ...a, nombre: normalizeText(nombre), fechaNacimiento } : a));
  };

  const eliminarAutor = (id) => {
    // 1. Eliminar al autor
    setAutores(prev => prev.filter(a => a.id !== id));
    // 2. REQUERIMIENTO: Borrado en cascada de los libros asociados
    setLibros(prev => prev.filter(l => l.autorId !== id));
  };

  // ==========================================
  // OPERACIONES DE LIBROS (CRUD)
  // ==========================================
  const agregarLibro = async (libroData) => {
    // REQUERIMIENTO: No se pide la URL de portada, se obtiene del API REST de OpenLibrary
    const urlPortada = await fetchBookCover(libroData.isbn);

    const nuevoLibro = {
      id: crypto.randomUUID(), // Autogenerado como UUID
      titulo: normalizeText(libroData.titulo), // Normalizado estricto
      isbn: libroData.isbn.trim(),
      autorId: libroData.autorId,
      paginas: parseInt(libroData.paginas, 10),
      urlPortada
    };

    setLibros(prev => [...prev, nuevoLibro]);
    return { success: true };
  };

  const agregarLibrosMasivo = (nuevosLibros) => {
    // Inserta la lista de libros procesados desde el CSV
    setLibros(prev => [...prev, ...nuevosLibros]);
  };

  const editarLibro = async (id, libroData) => {
    // Si cambia el ISBN, recalculamos la portada por consistencia
    const libroActual = libros.find(l => l.id === id);
    let urlPortada = libroActual.urlPortada;
    if (libroActual.isbn !== libroData.isbn) {
      urlPortada = await fetchBookCover(libroData.isbn);
    }

    setLibros(prev => prev.map(l => l.id === id ? {
      ...l,
      titulo: normalizeText(libroData.titulo),
      isbn: libroData.isbn.trim(),
      autorId: libroData.autorId,
      paginas: parseInt(libroData.paginas, 10),
      urlPortada
    } : l));
  };

  const eliminarLibro = (id) => {
    setLibros(prev => prev.filter(l => l.id !== id));
  };

  return (
    <LibraryContext.Provider value={{
      autores,
      libros,
      agregarAutor,
      editarAutor,
      eliminarAutor,
      agregarLibro,
      editarLibro,
      eliminarLibro,
      agregarLibrosMasivo
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);