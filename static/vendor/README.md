# static/vendor

Librerías de terceros servidas desde el propio sitio en lugar de un CDN. Así la CSP puede limitarse a
`script-src 'self'`: dar permiso a un CDN completo (unpkg, jsdelivr, cdnjs) deja cargar cualquier
script alojado en él, lo que equivale a saltarse la CSP.

Cada archivo se descargó de la URL indicada y se verificó contra el hash SRI que ya tenía
`index.html`. Ese hash se mantiene en el atributo `integrity` del `<script>` o `<link>`.

Ahora mismo no hay ninguna (Splitting.js se retiró cuando los títulos dejaron de animarse letra a
letra). Al añadir una, anótala aquí con su archivo y la URL de origen.

Los iconos (Remix Icon) no están aquí: se usa un subset propio en
`static/fonts/remixicon-subset.woff2`, declarado en el CSS crítico de `index.html`.

## Actualizar una librería

1. Descarga la nueva versión en este directorio.
2. Calcula el hash: `openssl dgst -sha384 -binary <archivo> | openssl base64 -A`.
3. Actualiza el `src` y el `integrity="sha384-…"` en `index.html`. Si el hash no coincide, el
   navegador no ejecuta el archivo.
4. Sube `CACHE_VERSION` en `sw.js` para que el service worker no siga sirviendo la versión antigua.
