## ADDED Requirements

### Requirement: llms.txt Index File
El sitio SHALL exponer `https://citystream.co/llms.txt` con un indice estructurado en Markdown que permite a crawlers de LLMs (GPT, Claude, Perplexity, Gemini) descubrir el contenido principal y URLs canonicas del sitio sin tener que parsear HTML.

#### Scenario: LLM crawler solicita llms.txt
- **WHEN** un crawler hace `GET /llms.txt`
- **THEN** recibe HTTP 200 con content-type `text/plain` o `text/markdown`
- **AND** el archivo contiene una seccion `# CityStream` con descripcion en 1 parrafo
- **AND** contiene secciones `## Funcionalidades`, `## Ciudades`, `## Preguntas Frecuentes`, `## Recursos` con links absolutos a las anclas del landing

#### Scenario: Citacion en respuesta de LLM
- **WHEN** un usuario consulta a Perplexity o ChatGPT por "que es CityStream"
- **THEN** la respuesta cita https://citystream.co como fuente y resume correctamente la propuesta de valor

### Requirement: llms-full.txt Content Dump
El sitio SHALL exponer `https://citystream.co/llms-full.txt` con el contenido completo del landing (texto sin markup) optimizado para ingesta por LLMs en una sola request, evitando que tengan que renderizar JavaScript.

#### Scenario: LLM solicita el contenido completo
- **WHEN** un crawler hace `GET /llms-full.txt`
- **THEN** recibe HTTP 200 con todas las descripciones de features, FAQ, ciudades, y propuesta de valor en texto plano
- **AND** el archivo NO contiene tags HTML, CSS ni JS

### Requirement: Robots Rules para Bots de IA
El `robots.txt` SHALL declarar politicas explicitas (Allow/Disallow) para los principales user-agents de crawlers de IA, distinguiendo entre bots de busqueda (allow indexing) y bots de training (politica por bot segun preferencia del proyecto).

#### Scenario: GPTBot solicita /
- **WHEN** un crawler con `User-Agent: GPTBot` solicita la raiz
- **THEN** `robots.txt` permite el crawl de la pagina principal
- **AND** disallow para `/waitlist/`, `/privacidad/`, `/terminos/` (paginas que contienen o procesan datos personales)

#### Scenario: ClaudeBot solicita /
- **WHEN** un crawler con `User-Agent: ClaudeBot` solicita la raiz
- **THEN** `robots.txt` permite el crawl completo del contenido publico
- **AND** disallow para rutas con datos personales

#### Scenario: PerplexityBot, OAI-SearchBot, Applebot-Extended
- **WHEN** cualquiera de estos user-agents solicita /
- **THEN** `robots.txt` permite el crawl de contenido publico, manteniendo el mismo set de exclusiones de paths con datos personales

#### Scenario: Google-Extended (opt-out de training Gemini)
- **WHEN** Google-Extended solicita la raiz
- **THEN** la politica define explicitamente Allow o Disallow segun la decision del proyecto (capturada en design.md)

### Requirement: FAQPage Structured Data
La pagina principal SHALL incluir un `<script type="application/ld+json">` con esquema `FAQPage` que contiene al menos 4 preguntas frecuentes con respuesta, para mejorar elegibilidad de Rich Results en Google y servir como contexto adicional para LLMs.

#### Scenario: Google Rich Results Test valida FAQPage
- **WHEN** se ejecuta Google Rich Results Test sobre la URL
- **THEN** reporta `FAQPage` como valido con 0 errores
- **AND** detecta al menos 4 `Question` con `acceptedAnswer`

### Requirement: Place Schema para Ciudades
La pagina SHALL incluir un `<script type="application/ld+json">` con esquema `ItemList` de `Place` para cada ciudad del carousel (Bogota, Medellin, Cartagena, Cali, Barranquilla), con `name`, `addressCountry: CO`, y `geo` (latitud/longitud).

#### Scenario: Validacion del Place schema
- **WHEN** un parser de schema.org procesa el JSON-LD
- **THEN** identifica 5 lugares con `@type: Place` dentro de un `ItemList`
- **AND** cada Place tiene `addressCountry: CO` y coordenadas validas

### Requirement: Organization Schema Enriquecido
El esquema `Organization` actual SHALL ampliarse con `legalName`, `areaServed: { @type: Country, name: Colombia }`, `foundingLocation: Colombia`, `email` de contacto general y `email` separado para canal de habeas data.

#### Scenario: Inspeccion del JSON-LD
- **WHEN** se inspecciona el script `Organization` del head
- **THEN** contiene los campos `legalName`, `areaServed`, `foundingLocation`, `email`, y un `contactPoint` adicional para `customer service - habeas data`
