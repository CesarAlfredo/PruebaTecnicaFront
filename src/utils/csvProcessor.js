import { normalizeText } from './textNormalizer';

export const parseBooksCSV = (csvText) => {
  // Separar por saltos de línea
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length <= 1) return []; // Archivo vacío o sólo con encabezado

  const books = [];
  
  // Procesar línea por línea (omitimos la cabecera i=0)
  for (let i = 1; i < lines.length; i++) {
    // Manejo básico de separación por comas
    const columns = lines[i].split(',');
    
    if (columns.length >= 4) {
      const titulo = normalizeText(columns[0]);
      const isbn = columns[1]?.trim() || '';
      const autorId = columns[2]?.trim() || '';
      const paginas = parseInt(columns[3]) || 0;

      if (titulo && isbn && autorId && paginas > 0) {
        books.push({
          id: crypto.randomUUID(), // Generación automática de UUID en el navegador
          titulo,
          isbn,
          autorId,
          paginas,
          urlPortada: "" // Se resolverá dinámicamente mediante el API REST posteriormente
        });
      }
    }
  }
  return books;
};