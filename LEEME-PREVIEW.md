# LEEME-PREVIEW.md — Carpeta de pruebas de Nitrotoon

## Qué es esta carpeta

Esta carpeta es una **COPIA EXPERIMENTAL** del sitio de Nitrotoon.
**NO es la web de producción.** La web real sigue viviendo en su propio
repositorio y sigue publicándose en su dirección de siempre, intacta.

Aquí dentro se está probando una versión mejorada del panel de
administración: el **editor por secciones (F0–F5)**. Todo lo que se pruebe,
rompa o arregle en esta carpeta **no afecta para nada** a la web pública.

Trata esta carpeta como un taller: puedes ensuciarte las manos sin miedo.

## AVISO IMPORTANTE: esta carpeta no debe aparecer en Google

Para que los buscadores (Google, Bing, etc.) ignoren esta copia se han
tomado dos medidas:

1. **robots.txt**: un archivo que le dice a todos los buscadores
   ("User-agent: *") que **no recorran nada** de esta carpeta ("Disallow: /").
2. **Etiqueta noindex**: los **16 archivos HTML** de esta carpeta llevan
   dentro la línea `<meta name="robots" content="noindex, nofollow">`,
   que le ordena a cualquier buscador que llegue: "no guardes esta página
   en tus resultados y no sigas sus enlaces".

Por favor, **no compartas públicamente los enlaces de esta carpeta como si
fueran la web real**. Son enlaces de prueba internos.

## Qué trae de nuevo: el editor por secciones (F0–F5)

El panel de administración de esta copia incorpora un editor nuevo que
organiza la página principal en **8 tarjetas**, una por bloque del sitio:

1. **Evento** — el titular y la información general del evento.
2. **Cinta** — la cinta de textos que se desliza por la web.
3. **Puertas** — los accesos y horarios de apertura.
4. **Avisos** — los avisos destacados para el público.
5. **Calendario** — los días y horarios del evento.
6. **Invitados** — los invitados anunciados.
7. **Así Salio** — la crónica y fotos de la edición anterior.
8. **Aliados** — los colaboradores y patrocinadores.

Cada tarjeta trae mejoras pensadas para que editar sea seguro y claro:

- **Contadores de estado** en verde, ámbar y rojo: de un vistazo sabes
  qué bloques están completos, cuáles tienen avisos y cuáles tienen
  problemas que conviene revisar.
- **Dos interruptores distintos** por bloque, que antes se confundían:
  - **"Ocultar en mi vista"**: esconde el bloque solo en TU pantalla,
    mientras estás editando. El público sigue viéndolo.
  - **"Retirar del sitio"**: quita el bloque de la web pública de verdad.
- **Deshacer con Ctrl+Z**: si te equivocas, pulsa Ctrl+Z y recuperas lo
  último que cambiaste.
- **Vista previa con ?borrador=1**: puedes ver cómo quedaría la página
  principal con tus cambios aún sin publicarlos.
- **Barra de estado**: una franja inferior te dice en todo momento qué
  se está haciendo y si hay cambios sin guardar.
- **Checklist de 3 casillas**: una lista breve de comprobaciones antes de
  dar por bueno un bloque.
- **manual.html**: una página de ayuda nueva, escrita en lenguaje claro,
  que explica cómo usar todo el panel paso a paso.

## Cómo probarlo

1. **Panel de administración**: abre esta carpeta y haz **doble clic en
   `admin.html`** (o ábrelo con tu navegador). Te pedirá el **PIN de
   preview**, el mismo PIN de siempre.
2. **Página principal en modo borrador**: abre en el navegador
   `index.html?borrador=1`. Con ese parámetro verás la portada tal y como
   quedaría con tus cambios sin publicar, incluyendo los bloques que hayas
   decidido retirar u ocultar.

Consejo: prueba primero a editar un bloque, pulsa Ctrl+Z para deshacer, y
comprueba la diferencia entre "Ocultar en mi vista" y "Retirar del sitio".

## Archivos nuevos y archivos modificados

Los **4 archivos NUEVOS** que trae esta copia son:

- `js/secciones.js` — el contrato interno del editor: define las 8
  secciones y sus reglas.
- `js/editor-secciones.js` — la interfaz del editor: dibuja las 8 tarjetas,
  los interruptores y los contadores.
- `css/editor-secciones.css` — el estilo visual del editor por secciones.
- `manual.html` — el manual de uso para no programadores.

Los **5 archivos MODIFICADOS** respecto a la web real son:

- `admin.html` — ahora carga el editor por secciones (sus scripts y su CSS).
- `data.js` — guarda también los datos que necesita el nuevo editor.
- `js/admin.js` — ampliado con la lógica de las fases F3, F4 y F5.
- `js/vistas.js` — adaptado para que las vistas respeten el modo borrador.
- `js/vitrina.js` — adaptado para que la portada respete lo decidido en el
  editor (incluye el evento `eventoDeVerdad()`, fase F0).

El resto de archivos son una copia idéntica de la web real.

## Qué se perdió y se recreó aquí

Como esta carpeta es una copia aparte, algunas cosas que estaban en la web
real **no venían incluidas** y se han recreado aquí mismo:

- **robots.txt** — recreado con "Disallow: /" para bloquear buscadores.
- **Este LEEME-PREVIEW.md** — escrito de nuevo para esta carpeta.
- **Las etiquetas noindex** — añadidas a los 16 archivos HTML.

## Cómo se promociona a producción (y qué hay que revertir)

Cuando todo esté probado y funcione bien, los cambios se llevan a la web
real copiando los archivos modificados y nuevos. **Pero antes de promocionar
hay que deshacer tres cosas** que aquí solo existen para aislamiento:

1. **Borrar `robots.txt`** de lo que se copie a producción (en producción
   los buscadores SÍ deben entrar).
2. **Quitar las etiquetas `noindex, nofollow`** de todos los HTML.
3. **Volver las URLs** de `nitrotoon-web-preview` a `nitrotoon-web`
   en cualquier meta o enlace absoluto que las lleve, si llegara a quedar
   alguna.

Con esas tres reversiones hechas, el resto del contenido puede promocionarse
tal cual.
