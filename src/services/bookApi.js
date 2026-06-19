export const fetchBookCover = async (isbn) => {
  const cleanIsbn = isbn.replace(/[- ]/g, "");
  try {
    const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json`);
    const data = await response.json();
    
    const key = `ISBN:${cleanIsbn}`;
    if (data[key] && data[key].thumbnail_url) {
      // Modificamos el sufijo para obtener la imagen en alta calidad (-L.jpg)
      return data[key].thumbnail_url.replace('-S.jpg', '-L.jpg').replace('-M.jpg', '-L.jpg');
    }
    
    // Portada genérica si OpenLibrary no tiene el libro registrado
    return `https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400`;
  } catch (error) {
    return `https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400`;
  }
};