# Cómo editar la web de Nitrotoon (sin romper nada)

> ## 🔑 LA REGLA DE ORO
>
> **Solo editas `data.js`. Nunca `js/*.js`, `css/*` ni las etiquetas `data-zona`.**
>
> Todo lo que se ve en la web (textos, fechas, fotos, precios de stand…) vive en `data.js`.
> El diseño y la maquinaria ya están hechos y probados: si tocas el resto, la web se puede
> quedar en blanco. Si dudas, esta guía o `ayuda/validador.html` te sacan del paso.

Bienvenido. Esta guía está escrita para quien **nunca ha programado**. Necesitas solo dos cosas:

1. Un editor de texto sencillo (el Bloc de notas sirve; mejor uno como VS Code o Notepad++,
   que colorean el código y marcan la línea de los errores).
2. Calma: cambia **una cosa a la vez**, guarda, y mira la web antes de seguir.

---

## Mapa mental: ¿dónde está cada cosa?

Todas las rutas son dentro de `data.js`.

| Quiero cambiar… | Está en data.js en… |
| --- | --- |
| El nombre, el lema o las redes de la marca | `marca` |
| El evento que sale grande en la portada | `eventoVigente` (casi siempre solo su `id`) |
| El calendario de eventos (añadir, fechas, estados) | `eventos[]` |
| Los textos que desfilan en la cinta del hero | `cintaDisciplinas[]` |
| Los artistas invitados y sus fotos | `artistas[]` |
| La agenda por día y escenario | `programa` → `dias[]` → `bloques[]` |
| Las fotos y reels «así salió» | `galeria` → `piezas[]` |
| Los aliados y sus logos | `aliados` → `niveles[]` → `marcas[]` |
| Las normas de la comunidad | `normas` → `secciones[]` |
| Las vías de contacto y las preguntas frecuentes | `contacto` → `vias[]` y `faq[]` |
| El orden (o qué se ve) en la portada | `portada` → `piezas[]` |
| Los avisos sueltos de la portada | `portada` → `piezas[]` (las de tipo `"aviso"`) |
| Los textos de cada puerta (Otaku, Gamers, KPOP…) | `espacios` (otaku, gamers, kpop, cosplay, artistas, mercado) |
| Los enlaces «Tu evento» del pie | `intranet` → `enlaces[]` |
| La versión que se ve en el pie | `version` |

---

## Las 10 recetas

> Antes de cada receta: abre `data.js`, busca la clave indicada (con Ctrl+F en tu editor),
> cambia **solo** lo dicho, guarda y abre `ayuda/validador.html` para comprobar.

### Receta 1 · Añadir un evento nuevo

**Qué hace:** crea una entrada nueva en el calendario (`eventos.html` y la portada).

**Dónde ir:** `data.js` → `eventos: [ … ]`. Cada evento es un bloque entre llaves `{ … }`
separado del siguiente por una coma.

**El bloque exacto a copiar** (pegalo dentro de los corchetes de `eventos`, después del último
evento, con una coma entre medias):

```js
{
  id: "mi-evento-2027",
  nombre: "Mi evento 2027",
  tipo: "Convención comunitaria",
  estado: "en-preparacion",
  estadoTexto: "En preparación con fecha",
  fechaInicio: "2027-09-11",
  fechaFin: "2027-09-12",
  lugar: "Centro de convenciones de tu ciudad",
  ciudad: "Tu ciudad, Venezuela",
  descripcion: "Escribe aquí, en dos o tres frases, de qué trata el evento. Este texto se ve en la tarjeta del calendario.",
  puertas: ["otaku", "kpop"],
  entradas: false,
  demo: false
},
```

**⚠️ Advertencias:**
- El `id` debe ser **único** y sin espacios ni tildes (usa guiones: `k-fest-2028`).
- `estado` solo acepta los 4 valores oficiales (ver abajo «Los 4 estados de un evento»).
- Las fechas van **AAAA-MM-DD** (año-mes-día): `2027-09-11`, nunca `11/09/2027`.
- Si el evento dura un solo día, puedes dejar `fechaFin: null` (sin fecha de fin).
- Copia la plantilla comentada completa de `ayuda/PLANTILLA-EVENTO.txt`.

### Receta 2 · Cambiar la fecha de un evento

**Qué hace:** actualiza cuándo es el evento.

**Dónde ir:** `data.js` → `eventos[]` → el evento de tu `id` → las líneas `fechaInicio:` y `fechaFin:`.

**El bloque exacto a modificar:**

```js
fechaInicio: "2027-07-17",   /* ← día que empieza (AAAA-MM-DD) */
fechaFin: "2027-07-18",      /* ← día que termina */
```

Cambia solo lo que va entre comillas. **⚠️ Advertencias:**
- Respeta el formato AAAA-MM-DD y las comillas dobles `" "`.
- La fecha de fin **no puede ser anterior** a la de inicio (el validador lo caza).
- Si la fecha también se usa en la **cuenta regresiva** de la portada (una pieza de tipo
  `"cuenta"` con su propio campo `fecha`), cámbiala allí también.

### Receta 3 · Cambiar el evento que sale en la portada (eventoVigente)

**Qué hace:** hace que el hero de la portada y la cinta muestren OTRO evento.

**Dónde ir:** `data.js` → `eventoVigente` → la línea `id:`.

**El bloque exacto a modificar:**

```js
eventoVigente: {
  id: "nitrogamers-2026",   /* ← pon aquí el id del evento del calendario que manda */
  ciclo: "pre",             /* pre (antes) · post (así salió) · carrusel (varios) */
  eslogan: "…",
  bajada: "…",
  nivelTexto: "…",
  entradasNota: "…",
  nombre: "__HEREDADO__",       /* ⚠️ dejar así: se hereda del calendario */
  fechaInicio: "__HEREDADO__",  /* ⚠️ dejar así */
  fechaFin: "__HEREDADO__",     /* ⚠️ dejar así */
  ciudad: "__HEREDADO__",       /* ⚠️ dejar así */
  lugar: "Valencia"             /* texto corto que se ve en grande en el hero */
},
```

**⚠️ Advertencias:**
- El `id` debe existir **exactamente igual** en `eventos[]` (el validador lo comprueba).
- **No rellenes** `nombre`, `fechaInicio`, `fechaFin` ni `ciudad` a mano: déjalos en
  `"__HEREDADO__"` y se copiarán solos del calendario. Si los escribes, acabas con dos
  versiones distintas de la verdad en la misma web.
- `ciclo: "post"` sirve para mostrar «así salió» después del evento.

### Receta 4 · Pasar un evento a realizado

**Qué hace:** marca el evento como terminado; deja de vender entradas y sale como histórico.

**Dónde ir:** `data.js` → `eventos[]` → el evento → sus líneas de estado.

**El bloque exacto a modificar:**

```js
estado: "realizado",
estadoTexto: "Realizado",
entradas: false,
```

**⚠️ Advertencias:**
- `estado` y `estadoTexto` son cosas distintas: `estado` es el código interno (solo los 4
  valores oficiales) y `estadoTexto` es lo que lee la gente (puedes escribirlo a tu gusto,
  siempre entre comillas).
- Si el evento tiene fotos, enlaza la galería añadiendo `galeria: "galeria.html",`.
- Si además quieres que la portada pase a modo «así salió», cambia también
  `eventoVigente.ciclo` a `"post"` (receta 3).

### Receta 5 · Añadir un artista

**Qué hace:** publica la ficha de un invitado (retrato, rol, bio y firmas) en `artistas.html` y la portada.

**Dónde ir:** `data.js` → `artistas: [ … ]`. Copia este bloque dentro de los corchetes:

```js
{
  id: "nombre-apellido",
  nombre: "Nombre Apellido",
  rol: "Ilustración y character design",
  pais: "Venezuela",
  bio: "Dos o tres frases sobre su trabajo y qué hará en el evento.",
  letra: "N", zona: "Salón de firmas", dia: "Sábado",
  redes: [{ nombre: "Instagram", url: "https://www.instagram.com/…", icono: "instagram" }],
  foto: "assets/retrato-nombre.jpg",
  demo: false
},
```

**⚠️ Advertencias:**
- `foto` apunta a una imagen real de 800×800 dentro de `assets/` (JPG o PNG; menos de 0,5 MB).
  Si el archivo no existe, el validador lo avisará y la ficha saldrá con el retrato roto.
- La `letra` es la inicial que agrupa el filtro de artistas; `zona` y `dia` deben coincidir
  con los escenarios y días del `programa` para que los filtros sean coherentes.
- Los invitados demo llevan `demo: true`; los reales, `demo: false`.

### Receta 6 · Añadir una foto a la galería

**Qué hace:** suma una foto a la sección «así salió» (`galeria.html`).

**Dónde ir:** `data.js` → `galeria` → `piezas: [ … ]`.

**El bloque exacto a copiar:**

```js
{ tipo: "foto", src: "assets/galeria-mi-foto.jpg", alt: "Descripción de la foto para lectores de pantalla", clase: "", demo: false },
```

**⚠️ Advertencias:**
- `alt` es obligatorio: es lo que leen las personas ciegas. Describe la foto, no digas «foto».
- `clase` acepta `""` (normal), `"ancha"` (ocupa doble) o `"alta"`. Déjala vacía si dudas.
- La foto: JPG o WebP, proporción 3:2, mínimo 1600 px de ancho, menos de 0,8 MB.

### Receta 7 · Añadir un reel de YouTube

**Qué hace:** añade un video (reel) a la galería. **No se carga nada de YouTube hasta que el
visitante toca el botón** — así la web sigue siendo rápida.

**Dónde ir:** `data.js` → `galeria` → `piezas: [ … ]`.

**El bloque exacto a copiar:**

```js
{ tipo: "reel", poster: "assets/galeria-mi-reel.jpg", titulo: "Reel · gran final de cosplay", videoId: "dQw4w9WgXcQ", clase: "", demo: false },
```

**⚠️ Advertencias:**
- `videoId` es **el código del video de YouTube**: lo que va después de `watch?v=` en el
  enlace (`youtube.com/watch?v=dQw4w9WgXcQ` → `dQw4w9WgXcQ`). No pegues la URL completa.
- `poster` es la imagen vertical 9:16 que se ve antes de reproducir; debe existir en `assets/`.
- Si en vez de YouTube es un enlace de Instagram, usa `url: "https://www.instagram.com/…"`
  en lugar de `videoId`.

### Receta 8 · Añadir un aliado/patrocinador

**Qué hace:** publica una marca en la página de aliados, dentro de un nivel.

**Dónde ir:** `data.js` → `aliados` → `niveles[]` → el nivel que corresponda
(`principal`, `aliado` o `colaborador`) → su lista `marcas: [ … ]`.

**El bloque exacto a copiar:**

```js
{ nombre: "Nombre de la marca", logo: "assets/aliado-marca.png", url: null, demo: false },
```

**⚠️ Advertencias:**
- El logo: PNG o SVG, mínimo 600×400, menos de 0,3 MB, y **debe existir** en `assets/`.
- Si la marca tiene web, cambia `url: null` por `url: "https://…"`.
- Nivel `principal` = presencia máxima; pon ahí solo a quien pague ese nivel.

### Receta 9 · Reordenar u ocultar una sección de la portada

**Qué hace:** cambia el orden de los bloques de la portada o esconde uno.

**Dónde ir:** `data.js` → `portada` → `piezas: [ … ]`.

**El bloque actual (ejemplo):**

```js
piezas: [
  { id: "hero",     tipo: "hero",     visible: true },
  { id: "puertas",  tipo: "puertas",  visible: true },
  { id: "avisos",   tipo: "avisos",   visible: true },
  { id: "eventos",  tipo: "eventos",  visible: true },
  { id: "artistas", tipo: "artistas", visible: true },
  { id: "galeria",  tipo: "galeria",  visible: true },
  { id: "aliados",  tipo: "aliados",  visible: true }
],
```

- **Reordenar:** mueve la línea entera `{ … },` arriba o abajo en la lista. Nada más.
- **Ocultar:** cambia `visible: true` por `visible: false` en esa línea (no la borres:
  así la puedes volver a mostrar después).
- **⚠️ Advertencias:** los `tipo` válidos son solo: hero, puertas, avisos, eventos, artistas,
  galeria, aliados, aviso, tarjeta, enlace, cuenta, reel, carrusel. No inventes tipos nuevos,
  y deja el `hero` primero (la portada sin su hero se ve vacía).

### Receta 10 · Cambiar un aviso de la portada

**Qué hace:** edita un aviso/noticia suelto que flota en la portada (una pieza de tipo `"aviso"`).

**Dónde ir:** `data.js` → `portada` → `piezas[]` → la pieza con `tipo: "aviso"`.

**El bloque exacto a modificar:**

```js
{ id: "mi-aviso", tipo: "aviso", visible: true,
  titulo: "Título corto del aviso",
  texto: "El texto que se lee debajo del título.",
  icono: "estrella",           /* estrella · calendario · ticket · tienda · lapiz … */
  tono: "verde",               /* quita esta línea si lo quieres dorado */
  accionTexto: "Ver más",      /* opcional: el texto del botón */
  accionUrl: "eventos.html"    /* opcional: a dónde lleva el botón */
},
```

**⚠️ Advertencia:** además de tus avisos, la portada arma dos avisos automáticos a partir de
`eventos[]` (los de estado `en-negociacion`) y de `espacios.artistas.destacado`. Si ves un
aviso que no está en `portada.piezas`, viene de allí: se edita en su origen, no en la portada.

---

## El dashboard vs editar a mano

Tienes dos caminos para mantener la web, y conviene **no mezclarlos** en la misma sesión:

- **Dashboard (`admin.html`):** formas con campos y botones, sin tocar código. Ideal para el día a día.
- **Editar `data.js` a mano:** control total, ideal con la ayuda de una IA pública (pégale esta
  guía y la plantilla y pídele el bloque ya armado).

**El riesgo del borrador:** el dashboard guarda todo lo que haces en un **borrador dentro de tu
navegador** (localStorage), no en el archivo. Dos consecuencias importantes:

1. Si editas `data.js` a mano y luego abres el dashboard, el dashboard puede seguir creyendo que
   manda **su versión vieja**: al publicar, machacaría tus cambios. **Antes de abrir el dashboard
   después de editar a mano: entra en `admin.html` → «Publicar» → «Descartar borrador».**
2. Cuando el dashboard publica, **regenera `data.js` completo** con `JSON.stringify`, y ese formato
   **no admite comentarios**: todos los comentarios `/* … */` que había en el archivo **se borran**.
   Tu data.js publicado por el dashboard será más «pelado» que el original. No es un error, pero
   si apreciabas los comentarios, guárdalos (o mantén la edición a mano).

---

## Antes de publicar: 3 comprobaciones

1. **Abre `ayuda/validador.html`.** Debe decir «TODO BIEN». Si marca errores, arregla y vuelve a abrir.
2. **Recarga la web con Ctrl+F5** (o Cmd+Shift+R en Mac). El refresco forzado evita ver una versión
   vieja guardada por el navegador. Mira la portada y la página que cambiaste.
3. **Revisa que no falte ninguna imagen.** Cualquier foto o logo nuevo debe verse bien; el validador
   también avisa, pero ojo de al menos pasar por la galería, los artistas y los aliados.

---

## Si la web se queda en blanco

Tranquilidad: casi siempre es **una coma o una comilla** y se arregla en dos minutos.

1. **Abre la consola del navegador:** pulsa `F12` y ve a la pestaña «Console» (o clic derecho →
   «Inspeccionar» → «Console»).
2. **Busca la línea del error:** verás algo en rojo tipo `Uncaught SyntaxError: … data.js:123`.
   Lo importante es el número al final: la **línea 123 de data.js**.
3. **Abre `data.js` en tu editor y ve a esa línea:** el error casi siempre está ahí o en la línea
   de arriba. Los sospechosos habituales:
   - falta una **coma** entre dos bloques (`},` al cerrar un evento o un artista),
   - sobra una coma al final de la última línea de una lista,
   - una **comilla doble** sin cerrar, o un texto que contiene `"` dentro,
   - una llave `{` o corchete `[` que no se cerró.
4. **Compara con la plantilla:** abre `ayuda/PLANTILLA-EVENTO.txt` y mira cómo debe verse un bloque
   sano. También puedes pedirle a tu IA pública: *«este es mi data.js y este el error, ¿qué coma falta?»*.
5. **Corrige, guarda, y abre `ayuda/validador.html`** antes de volver a mirar la web.

---

## Los 4 estados de un evento (regla K3)

El calendario solo admite **estos 4 valores** exactos en `estado` (con guiones, sin tildes,
entre comillas):

| Estado | Significa | Se ve como |
| --- | --- | --- |
| `a-la-venta` | Las entradas están a la venta AHORA | El evento más destacado, con botón de entradas |
| `en-preparacion` | Hay fecha confirmada, pero aún no se vende | «En preparación con fecha» |
| `en-negociacion` | Se está cerrando; aún SIN fecha | «En negociación» — el aviso verde de la portada |
| `realizado` | Ya pasó | Sale como histórico; puede enlazar a la galería |

**La regla K3 prohibe «proximamente»** (y cualquier otro estado inventado: `pronto`, `breve`,
`confirmado`…). ¿Por qué? Porque el estado controla la maquinaria: qué tarjeta se pinta, si se
muestra el botón de entradas, si el evento sale en la portada. Un estado que el sistema no
conoce **rompe en silencio** esas decisiones. Lo que tú quieras decirle a la gente, se dice en
`estadoTexto` (ese es libre), no en `estado`.
