// Función para simular la codificación Base64Url
const base64UrlEncode = (obj) => {
  const str = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// Función para decodificar Base64Url
export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Genera un token con estructura Header.Payload.Signature
export const generarSimuladoJWT = (username) => {
  const header = { alg: "HS256", typ: "JWT" };
  
  // El requerimiento pide terminar sesión pasada 1 hora
  const unaHoraEnSegundos = Math.floor(Date.now() / 1000) + 3600; 

  const payload = {
    sub: username,
    role: "ROLE_USER",
    iat: Math.floor(Date.now() / 1000),
    exp: unaHoraEnSegundos // Timestamp de expiración
  };

  const tokenCodificado = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.firma_simulada_totalplay`;
  return tokenCodificado;
};