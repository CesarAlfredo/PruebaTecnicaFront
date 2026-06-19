export const normalizeText = (text) => {
  if (!text) return '';
  
  return text
    .toUpperCase()
    // Convertir caracteres especiales y acentos de forma explícita
    .replace(/[ÁÀÄÂ]/g, 'A')
    .replace(/[ÉÈËÊ]/g, 'E')
    .replace(/[ÍÌÏÎ]/g, 'I')
    .replace(/[ÓÒÖÔ]/g, 'O')
    .replace(/[ÚÙÜÛ]/g, 'U')
    .replace(/Ñ/g, 'N')
    // Eliminar números
    .replace(/[0-9]/g, '')
    // Reemplazar múltiples espacios en blanco seguidos por un solo espacio
    .replace(/\s+/g, ' ')
    .trim();
};