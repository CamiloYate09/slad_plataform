# Change: Separar el contenido de la tarjeta CTA en su propio requisito

## Por qué

Tras `retire-removed-features-specs`, el requisito "CTA Section — Tarjeta Oscura Pre-Footer"
pasaba de 500 caracteres y `openspec validate --strict` lo marcaba: mezclaba la forma de la
tarjeta con su contenido.

## Qué cambia

- MODIFIED `cta-dark-card` → "CTA Section — Tarjeta Oscura Pre-Footer": solo posición, medidas y colores.
- ADDED `cta-dark-card` → "Contenido de la Tarjeta CTA": label, heading, subtexto y captura de correo.

## Impacto

- Specs: `cta-dark-card`. Sin cambios de código ni de comportamiento especificado.
