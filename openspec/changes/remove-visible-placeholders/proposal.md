# Change: Quitar contenido placeholder visible en la página publicada

## Por qué

Una revisión visual de `index.html` confirmó que la estructura y el orden de
secciones están bien. Sin embargo, la página renderiza a los visitantes 3
marcadores de desarrollo con datos fabricados:

- `index.html:274-275` — stat "Eventos en agenda 1200+" con pastilla `placeholder`
- `index.html:278-279` — stat "Colombianos en lista 5000+" con pastilla `placeholder`
- `index.html:447` — cita atribuida a "Nombre del Fundador" con pastilla `placeholder`

Los comentarios `TODO(placeholder)` en `index.html:266` y `:440` confirman que son
datos de relleno a reemplazar antes de publicar. Hoy se muestran en producción
(`citystream.co`), lo que contradice el escenario "Métricas con datos reales" ya
existente en la spec `page-structure` y expone marcadores internos al usuario final.

## Qué cambia

- La página publicada NO debe mostrar marcadores `data-placeholder` ni la pastilla
  `.stat-tag-placeholder`, ni cifras/citas fabricadas.
- Para cada instancia: usar el dato real (lo aporta el equipo CityStream) o, mientras
  no exista, **remover** esa métrica/cita para que la página sea publicable hoy sin
  contenido falso.
- Limpiar los TODO y los estilos `.stat-tag-placeholder` que queden sin uso.

Fuera de alcance: rediseño de secciones, animaciones, nuevas métricas. Solo se
corrige la veracidad del contenido ya presente.

## Impacto

- Specs afectadas: `page-structure` (ADDED: "Página publicada sin contenido placeholder")
- Código afectado: `index.html` (banda stats, cita fundador), `static/css/style.css`
  (regla `.stat-tag-placeholder` si queda huérfana)
- Sin cambios de dependencias, JS ni estructura de página.
