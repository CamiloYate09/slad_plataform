/**
 * CityStream — Security headers at the edge.
 *
 * GitHub Pages (the actual origin behind the citystream.tech custom domain)
 * cannot send custom HTTP response headers — it ignores `_headers` files,
 * unlike Netlify/Cloudflare Pages. The CSP declared via <meta http-equiv> in
 * index.html/privacidad.html/terminos.html works for script-src/style-src,
 * but browsers ignore `frame-ancestors` (and `sandbox`) when a CSP is
 * delivered via <meta> — that directive only takes effect as a real HTTP
 * header. There is currently NO X-Frame-Options, Strict-Transport-Security,
 * or X-Content-Type-Options header at all on the live site.
 *
 * This Worker sits in front of the GitHub Pages origin (bind it to a Route
 * on the citystream.tech zone) and adds those headers to every response.
 * The CSP string per path mirrors what's already declared in each page's
 * <meta> tag — this Worker does not change *what* is allowed, only *where*
 * frame-ancestors, X-Frame-Options, HSTS, etc. actually take effect.
 *
 * Deploy: see cloudflare/README-deploy.md in this folder, or the chat
 * message that shipped alongside this file.
 */

const APP_CSP = [
  "default-src 'none'",
  // Las librerias viven en static/vendor: ningun CDN completo en la lista, porque
  // cualquier script alojado en el se podria cargar y saltarse la CSP.
  "script-src 'self' https://static.cloudflareinsights.com",
  // 'unsafe-inline' en estilos: index.html lleva el CSS critico en un <style>
  // generado por scripts/critical-css.sh. Un hash se romperia en cada
  // regeneracion; inyectar estilos es mucho menos grave que inyectar scripts.
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
  "media-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

const LEGAL_CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "font-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

// Login, registro, cuenta, olvide y reset: hablan con el API y con Google
// Sign-In. Header y <meta> se aplican A LA VEZ (gana la interseccion), asi que
// si estas paginas recibieran APP_CSP el navegador bloquearia sus fetch al API.
// Espejo del <meta> de login.html sin http://localhost:8080 (esto es produccion).
const AUTH_CSP = [
  "default-src 'none'",
  "script-src 'self' https://accounts.google.com",
  "style-src 'self' 'unsafe-inline' https://accounts.google.com",
  "font-src 'self'",
  "img-src 'self' data: https://lh3.googleusercontent.com",
  "connect-src 'self' https://api.citystream.tech https://accounts.google.com",
  "frame-src https://accounts.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

const AUTH_PAGES = ['/login', '/registro', '/cuenta', '/olvide-password', '/reset-password'];

const OFFLINE_CSP = [
  "default-src 'none'",
  "style-src 'unsafe-inline'",
  "img-src 'self' data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

const PERMISSIONS_POLICY =
  'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()';

/** '/login.html', '/login' y '/reset-password/index.html' -> '/login', '/reset-password'. */
function pagePath(pathname) {
  return pathname.replace(/(\/index)?\.html$/, '').replace(/\/$/, '');
}

function isAuthPage(pathname) {
  return AUTH_PAGES.includes(pagePath(pathname));
}

function cspFor(pathname) {
  const page = pagePath(pathname);
  if (page === '/privacidad' || page === '/terminos') return LEGAL_CSP;
  if (page === '/offline') return OFFLINE_CSP;
  if (isAuthPage(pathname)) return AUTH_CSP;
  return APP_CSP; // '/', '/index.html', y cualquier ruta no reconocida (incluida la 404 de GitHub Pages)
}

export default {
  async fetch(request, env, ctx) {
    const response = await fetch(request);
    const headers = new Headers(response.headers);

    // Headers base — aplican a toda respuesta (HTML, CSS, JS, imágenes, sw.js, manifest).
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', PERMISSIONS_POLICY);

    // HSTS: 180 días + includeSubDomains. NO se activa `preload` aquí a propósito —
    // enviar el dominio a la lista de precarga de los navegadores es una decisión
    // casi irreversible (tarda meses en revertirse una vez propagada). Añádelo
    // manualmente en https://hstspreload.org solo cuando estés seguro de que TODO
    // subdominio de citystream.tech servirá siempre HTTPS.
    headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');

    // Ningun otro sitio necesita leer nuestros recursos desde el navegador.
    headers.set('Cross-Origin-Resource-Policy', 'same-origin');

    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('text/html')) {
      const url = new URL(request.url);
      headers.set('Content-Security-Policy', cspFor(url.pathname));
      // Aisla la ventana de quien la abrio. En las paginas de sesion se permiten
      // los popups porque Google Sign-In abre uno y necesita comunicarse de vuelta.
      headers.set(
        'Cross-Origin-Opener-Policy',
        isAuthPage(url.pathname) ? 'same-origin-allow-popups' : 'same-origin'
      );
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
