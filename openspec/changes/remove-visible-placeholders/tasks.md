# Tasks — Quitar contenido placeholder visible

## 1. Datos reales (decisión del usuario)
- [x] 1.1 "Eventos en agenda" → **remover** hasta tener dato real
- [x] 1.2 "Colombianos en lista" → **remover** hasta tener dato real
- [x] 1.3 Cita + nombre del fundador → **remover** bloque hasta tener cita real

## 2. Aplicar en index.html
- [x] 2.1 Stats: removidas las 2 `.stat` placeholder; quedan "Ciudades para arrancar" y
      "Hecho en Colombia" sin `data-placeholder` ni pastillas
- [x] 2.2 Cita de fundador: bloque `.founder-quote-section` removido
- [x] 2.3 Comentarios `TODO(placeholder)` eliminados

## 3. Limpieza CSS
- [x] 3.1 Regla `.stat-tag-placeholder` removida de `static/css/style.css`
- [x] 3.2 CSS `.founder-quote*` removido por completo (sección fuera de la página hasta
      tener cita real)

## 4. Verificación
- [x] 4.1 `grep -i "placeholder" index.html` no devuelve ocurrencias
- [ ] 4.2 Revisión visual en navegador en vivo (dark + light) de la banda stats con
      2 métricas y de la sección posterior al value-prop — pendiente (headless no puede
      renderizar secciones reveladas por scroll)
- [x] 4.3 `openspec validate remove-visible-placeholders --strict` pasa
