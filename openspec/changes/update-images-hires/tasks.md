## 1. Preparación de assets

- [x] 1.1 Convertir IMG_1086.JPG → `static/img/img-01.jpg` (copia) + `img-01.webp` (Python Pillow WebP q85)
- [x] 1.2 Convertir IMG_1089.JPG → `static/img/img-02.jpg` + `img-02.webp`
- [x] 1.3 Convertir IMG_1091.JPG → `static/img/img-03.jpg` + `img-03.webp`
- [x] 1.4 Convertir IMG_1092.JPG → `static/img/img-04.jpg` + `img-04.webp`
- [x] 1.5 Convertir IMG_1093.JPG → `static/img/img-05.jpg` + `img-05.webp`
- [x] 1.6 Convertir IMG_1094.JPG → `static/img/img-06.jpg` + `img-06.webp`
- [x] 1.7 Convertir IMG_1095.JPG → `static/img/img-07.jpg` + `img-07.webp`
- [x] 1.8 Convertir IMG_1096.JPG → `static/img/img-08.jpg` + `img-08.webp`
- [x] 1.9 Convertir IMG_1084.JPG → `static/img/img-09.jpg` + `img-09.webp`
- [x] 1.10 Convertir IMG_1085.JPG → `static/img/img-10.jpg` + `img-10.webp`
- [x] 1.11 Convertir IMG_1087.JPG → `static/img/img-11.jpg` + `img-11.webp`
- [x] 1.12 Convertir IMG_1088.JPG → `static/img/img-12.jpg` + `img-12.webp`
- [x] 1.13 Convertir IMG_1090.JPG → `static/img/img-13.jpg` + `img-13.webp`
- [x] 1.14 Convertir IMG_1097.JPG → `static/img/img-14.jpg` + `img-14.webp`
- [x] 1.15 Convertir IMG_1098.JPG → `static/img/img-15.jpg` + `img-15.webp`
- [x] 1.16 Verificar que los 30 archivos (15 JPG + 15 WebP) existen en `static/img/` ✓

## 2. CSS — Ajuste de object-position

- [x] 2.1 Añadir `object-position: center top` a `.tab-image img` en `style.css`
- [x] 2.2 Añadir `object-position: center top` a `.value-prop-image img` en `style.css`
- [x] 2.3 Añadir `object-position: center top` a `.exp-image img` en `style.css`

## 3. index.html — Carousel (trusted-by)

- [x] 3.1 Reemplazar los 5 carousel-items del set primario con img-09 a img-13
- [x] 3.2 Actualizar los 3 sets aria-hidden="true" con las mismas nuevas imágenes
- [x] 3.3 Atributos `width="48" height="48"` sin cambios — dimensiones de render correctas

## 4. index.html — Feature tabs

- [x] 4.1 Reemplazar imagen del tab Ciudades: `img-03.webp` / `img-03.jpg`
- [x] 4.2 Reemplazar imagen del tab Eventos: `img-04.webp` / `img-04.jpg`
- [x] 4.3 Reemplazar imagen del tab Personas: `img-05.webp` / `img-05.jpg`
- [x] 4.4 Reemplazar imagen del tab Conciertos: `img-06.webp` / `img-06.jpg`
- [x] 4.5 Actualizar atributos a `width="1280" height="720"` en imágenes de tabs

## 5. index.html — Value-prop section

- [x] 5.1 Reemplazar imagen de value-prop: `img-07.webp` / `img-07.jpg`
- [x] 5.2 Actualizar atributos a `width="1280" height="720"`

## 6. index.html — Experience cards

- [x] 6.1 Reemplazar imagen de exp. Bogotá: `img-01.webp` / `img-01.jpg`
- [x] 6.2 Reemplazar imagen de exp. Medellín: `img-02.webp` / `img-02.jpg`
- [x] 6.3 Reemplazar imagen de exp. Cartagena: `img-08.webp` / `img-08.jpg`
- [x] 6.4 Actualizar atributos: `width="1280" height="960"` (img-01, img-02) y `width="1280" height="720"` (img-08)

## 7. Revisión visual y ajuste fino

- [x] 7.1 Abrir la página en el browser y revisar visualmente cada sección con las nuevas imágenes ✓
- [x] 7.2 Asignaciones correctas — ningún intercambio necesario (todas las imágenes corresponden a su sección) ✓
- [x] 7.3 object-position: center top funciona correctamente — encuadres sin corte de sujeto en todas las secciones ✓

## 8. Limpieza

- [x] 8.1 Eliminar imágenes de ciudad antiguas: `1.jpg`, `1.webp`, `5.jpg`, `5.webp`, `7.jpg`, `7.webp`, `8.jpg`, `8.webp`, `background.png`, `background.webp`
- [x] 8.2 Cero referencias a imágenes eliminadas en `index.html` y `style.css` ✓
- [x] 8.3 Carpeta `static/img/new/` eliminada ✓

## 9. Spec alignment

- [x] 9.1 Carousel usa img-09 a img-13 (WebP + JPG) — cumple page-structure spec ✓
- [x] 9.2 style.css tiene `object-fit: cover` + `object-position: center top` en `.tab-image img`, `.value-prop-image img`, `.exp-image img` ✓
