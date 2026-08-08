/* Configuración de OAuth para las páginas de autenticación.
 *
 * Los botones de proveedor solo se renderizan si aquí hay un client ID,
 * el mismo criterio que usa el backend: si el proveedor no está
 * configurado, la ruta /auth/oauth/... ni siquiera existe.
 *
 * Google: el client ID de un "Web application" en Google Cloud Console,
 * con el origen del sitio (https://citystream.tech) en "Authorized
 * JavaScript origins".
 */
window.CS_OAUTH = {
  googleClientId: '',
};
