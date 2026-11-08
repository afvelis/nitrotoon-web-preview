# LEEME — ASSETS de la web de Nitrotoon

> Carpeta `assets/` de la vitrina. **La web funciona hoy con el arte demo que
> el desarrollador creó en SVG** (`assets/demo/`). Cada hueco real queda
> documentado aquí con **nombre, formato y tamaño exactos**: genera tu archivo
> con la herramienta que prefieras, suéltalo con el nombre exacto y ajusta
> `data.js` (o el dashboard, Fase 2) para que la web lo use automáticamente.

## 1 · Especificaciones técnicas (§6 del prompt maestro)

| Tipo | Formato | Medida | Peso máx. | Nota |
| --- | --- | --- | --- | --- |
| Video HERO en loop | MP4 (H.264, **sin audio**) | 1920×1080 | 40 MB | 6–15 s · arranca solo con botón (§7.2.7) |
| Póster del HERO | JPG | 1920×1080 | 600 KB | Se muestra mientras carga el video |
| Reel vertical | MP4 (H.264) | 1080×1920 | 40 MB | ≤ 60 s |
| Foto de galería | JPG/PNG | 1600×900 | 500 KB | paisaje · también se usa 4:5 en fichas |
| Tarjeta de contenido | JPG/PNG | 1200×800 | 400 KB | |
| Foto de perfil (artista) | JPG/PNG | 800×800 | 300 KB | cuadrada, encare de rostro centrado |
| Logo de aliado | PNG transparencia | 600×400 | 200 KB | la web le da `aspect-ratio` uniforme |
| Logo de Nitrotoon | PNG transparencia | — | — | ya entregado (ver §2) |

**Regla del comité:** prohibido el texto dentro de imágenes de marketing —
el texto va en HTML. Si tu imagen lleva texto, la web no la publica.

## 2 · Logos oficiales (ya instalados)

| Archivo | Qué es | Uso |
| --- | --- | --- |
| `assets/logo-original-4500.png` | Copia intacta del logo anterior (nave monocroma con lockup) | Resguardo / print |
| `assets/logo.png` | **Logo oficial (29/10):** "Logo Yellow" — letras amarillas de la marca sobre negro, 1280×1280 | Identificación del proyecto |
| `assets/logo-nave-1280.png` | Copia archivada del logo anterior (nave monocroma, 1280×779) | Resguardo / usos futuros |
| `assets/og.jpg` | **Tarjeta de compartición (29/10):** Donut 3D sobre negro de marca, 1200×630 exactos, ≤0,5 MB | og:image de las 14 páginas |
| `assets/logo-blanco.png` | Variante blanca de la nave | Fondos oscuros (usos futuros) |
| `assets/favicon.svg` | Nave en dorado sobre negro (SVG propio) | Pestaña del navegador |

## 3 · Huecos por activar (nombre exacto del archivo → campo de `data.js`)

| Hueco | Archivo esperado | Se activa con |
| --- | --- | --- |
| Video del HERO | `assets/hero-loop.mp4` | `eventoVigente.heroVideo: "assets/hero-loop.mp4"` |
| Póster del HERO | `assets/hero-poster.jpg` | `eventoVigente.heroPoster: "assets/hero-poster.jpg"` |
| Media kit de aliados | `assets/kit-media-nitrotoon.pdf` | `aliados.mediaKitUrl: "assets/kit-media-nitrotoon.pdf"` |
| Reels de galería | sube el video y usa el **ID de YouTube** o la URL de Instagram en `galeria.piezas[].videoId / .url` | el facade carga el embed solo al tocar |

Sin esos campos, la web muestra su versión CSS/SVG propia y **ningún enlace
roto aparece** — los slots son opcionales por diseño (§9).

## 4 · Arte demo actual (`assets/demo/`) — qué reemplaza cada cosa

**Retratos de artistas** (800×800 SVG) → reemplazables por JPG 800×800:

| Slot demo | Artista demo |
| --- | --- |
| `retrato-kana.svg` | Kana Mori · ilustración |
| `retrato-dako.svg` | Andrés «Dako» Villalba · cómic nacional |
| `retrato-valeria.svg` | Valeria Ríos · doblaje |
| `retrato-pixel8.svg` | DJ Pixel8 · chiptune |
| `retrato-makicake.svg` | María «Makicake» González · cosplay |
| `retrato-mangosta.svg` | Estudio Mangosta · editorial |
| `retrato-ivan.svg` | Iván Torres · coleccionismo |
| `retrato-sorakuma.svg` | Sora & Kuma · dance KPOP |

**Galería «así salió»** (1600×900 SVG de escenas abstractas):

`galeria-hero.svg` · `galeria-cosplay.svg` · `galeria-mercado.svg` ·
`galeria-reel1.svg` · `galeria-reel2.svg` · `galeria-artistas.svg` ·
`galeria-gamers.svg` · `galeria-kpop.svg` · `galeria-familias.svg`

→ Cada foto real reemplaza a un SVG en `galeria.piezas[].src`
   (recomendado: mover las fotos reales a `assets/galeria/`).

**Logos de aliados** (400×400 SVG abstractos) → reemplazables por PNG 600×400:

`aliado-dulce.svg` · `aliado-radio.svg` · `aliado-pixelcafe.svg` ·
`aliado-mangapolis.svg` · `aliado-kpop.svg` · `aliado-3d.svg` ·
`aliado-retro.svg` · `aliado-domingueada.svg`

## 5 · Carpetas sugeridas para los medios reales

```
assets/
  galeria/    fotos del evento (1600×900)
  artistas/   retratos 800×800
  aliados/    logos 600×400
  reels/      videos verticales 1080×1920
  fuentes/    (Fase 3) fuente display propia por espacio — WOFF2 local
  demo/       arte demo del desarrollador (puede eliminarse al reemplazar)
```

> **Nota de capacidad (29/10/2026):** el agente de esta sesión no ve imágenes;
> el arte demo se creó como SVG original por código y con la paleta oficial
> (§7.1). Sin azules.
