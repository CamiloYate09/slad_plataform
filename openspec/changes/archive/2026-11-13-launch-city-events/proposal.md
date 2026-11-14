# Change: Próximos eventos solo de las ciudades de lanzamiento

## Por qué

Dos de las cuatro tarjetas de "Lo que viene" eran de ciudades que no están en el lanzamiento
(Valledupar y Barranquilla), y el enlace de la Feria de las Flores (`ferialasflores.com.co`)
devolvía 404.

## Qué cambia

- Fuera el Festival de la Leyenda Vallenata (Valledupar) y el Carnaval de Barranquilla.
- Nuevos, de Cartagena y con fechas comprobadas en noviembre de 2026:
  - Festival de Música de Cartagena: del 9 al 17 de enero de 2027 (`cartagenamusicfestival.com`).
  - Hay Festival Cartagena: del 28 al 31 de enero de 2027 (`hayfestival.com/cartagena`).
- Feria de las Flores: "Ago 2027, por confirmar" (la Alcaldía aún no ha publicado fechas), con
  enlace a `medellin.gov.co/es/feria-de-flores/`. El plan del selector dice lo mismo.
- Rock al Parque se mantiene ("2027, por anunciar"): la edición 2026 fue del 10 al 12 de octubre
  (rockalparque.gov.co) y la de 2027 aún no tiene fecha.
- Orden por fecha y cabecera "Lo que *viene*" con un subtítulo sobre las tres ciudades.

## Impacto

- Specs: `page-structure` (nuevo requisito "Próximos Eventos"). Código: `index.html`, `sw.js`
  (`CACHE_VERSION` v25).

## Fuentes (consultadas el 13-11-2026)

- Fechas del Festival de Música de Cartagena 2027 y su orquesta residente (English Chamber
  Orchestra): `<title>` de cartagenamusicfestival.com; Rio Times
  (riotimesonline.com/cartagena-music-festival-2027-tickets-2026/) y Blu Radio.
- Fechas del Hay Festival Cartagena 2027 y cifras de 2026 (más de 180 participantes de 25 países):
  hayfestival.com/cartagena y Rio Times (riotimesonline.com/hay-festival-cartagena-2027-dates-tickets-2026/).
- Feria de las Flores 2027 sin fechas oficiales: Rio Times (riotimesonline.com/medellin-flower-fair-2027-guide).
