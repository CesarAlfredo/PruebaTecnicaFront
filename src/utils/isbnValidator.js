// Validación matemática de respaldo por si el servidor SOAP bloquea por CORS
const isValidISBNChecksum = (isbn) => {
  const clean = isbn.replace(/[- ]/g, "");
  if (clean.length === 10) {
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(clean[i]) * (10 - i);
    let last = clean[9].toUpperCase() === "X" ? 10 : parseInt(clean[9]);
    return (sum + last) % 11 === 0;
  } else if (clean.length === 13) {
    let sum = 0;
    for (let i = 0; i < 12; i++) sum += parseInt(clean[i]) * (i % 2 === 0 ? 1 : 3);
    let check = (10 - (sum % 10)) % 10;
    return check === parseInt(clean[12]);
  }
  return false;
};

export const validateISBNSoap = async (isbn) => {
  const cleanIsbn = isbn.replace(/[- ]/g, "");
  
  // Cuerpo del XML estándar para la petición SOAP al WSDL provisto
  const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <IsValidISBN13 xmlns="http://webservices.daehosting.com/ISBN">
          <sISBN>${cleanIsbn}</sISBN>
        </IsValidISBN13>
      </soap:Body>
    </soap:Envelope>`;

  try {
    const response = await fetch('https://webservices.daehosting.com/services/isbnservice.wso', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'http://webservices.daehosting.com/ISBN/IsValidISBN13'
      },
      body: soapEnvelope
    });

    if (!response.ok) throw new Error("SOAP Error");
    
    const text = await response.text();
    // Parsear la respuesta XML simple
    return text.includes("<IsValidISBN13Result>true</IsValidISBN13Result>");
  } catch (error) {
    // Si falla por CORS o red, recurrimos al chequeo matemático local para no romper el flujo
    return isValidISBNChecksum(cleanIsbn);
  }
};