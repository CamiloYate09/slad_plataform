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
  "script-src 'self' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "font-src 'self' https://cdn.jsdelivr.net",
  "img-src 'self' data:",
  "media-src 'self'",
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

function cspFor(pathname) {
  if (pathname === '/privacidad.html' || pathname === '/terminos.html') return LEGAL_CSP;
  if (pathname === '/offline.html') return OFFLINE_CSP;
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

    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('text/html')) {
      const url = new URL(request.url);
      headers.set('Content-Security-Policy', cspFor(url.pathname));
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
