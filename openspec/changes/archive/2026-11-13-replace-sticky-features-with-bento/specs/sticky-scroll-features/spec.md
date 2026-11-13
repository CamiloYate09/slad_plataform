## REMOVED Requirements

### Requirement: Sticky Scroll Narrative — Features Section

**Reason**: La sección Funcionalidades pasa a un bento de tarjetas con mini-interfaces de la app (ver `features-bento`). El scroll narrativo exigía un recorrido largo y escenas en React que el bento ya no necesita.

**Migration**: `#features` conserva su id y su enlace en la barra. Los selectores `.features-sticky-wrap`, `.features-nav`, `.fnav-item` y `.features-item` dejan de existir; el tour apunta a `#features .section-header`.
