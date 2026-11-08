# NITROTOON — la vitrina viva (Fases 1 y 2)

Web pública de la comunidad geek venezolana **Nitrotoon**: una vitrina de
piezas (hero, avisos, cronogramas, galerías, tarjetas) que el administrador
cambia desde un dashboard — sin tocar código en el día a día.

> **Estado:** FASE 1 (vitrina) ✅ · FASE 2 (dashboard) ✅ · FASE 3 (skins) ✅
> · FASE 4 (roadmap documentado §11) ✅ — plan de fases completo · contenido demo aprobado (§8).

---

## 1 · Cómo abrir la web (sin instalar nada)

Abre **`index.html`** con doble clic — funciona directamente en cualquier
navegador moderno (Chrome, Edge, Firefox, Safari), incluso sin internet.
Ningún CDN, ninguna instalación, ningún servidor.

Para probar como si fuera publicada (recomendado antes de subir):

```
python -m http.server 8000        # desde esta carpeta
# → http://localhost:8000
```

## 2 · Cómo publicarla en GitHub Pages (flujo del administrador)

1. Entra al repositorio de la web en GitHub.
2. **Add file → Upload files**.
3. Arrastra **solo los archivos que cambiaron** (normalmente `data.js` y los
   medios nuevos; el dashboard de Fase 2 te dará la checklist exacta).
4. **Commit changes** sobre la rama `main`.
5. Espera el ✅ verde de **Actions** (1–2 min) y refresca la web con `Ctrl+F5`.

Si el sitio aún no existe: GitHub → New repository → sube ESTA carpeta
completa → Settings → Pages → Branch: `main` / carpeta `/ (root)` → Save.
La web quedará en `https://TUUSUARIO.github.io/NOMBRE-DEL-REPO/`.

> **og:image:** al conocer tu URL final, actualiza la línea
> `<meta property="og:image" …>` de cada página (13 en total) con la ruta
> absoluta, por ejemplo `https://TUUSUARIO.github.io/NOMBRE-DEL-REPO/assets/logo.png`.
> Los rastreadores sociales no resuelven rutas relativas.

## 3 · Cómo actualizar el contenido — dashboard `admin.html` (Fase 2)

Abre **`admin.html`** e introduce tu **PIN**. El dashboard tiene 3 pestañas:

### Vitrina (componer la portada)
- La portada se arma con **piezas** (`data.portada.piezas`): arrastra ☰ para
  ordenar (o usa ↑ ↓), desmarca **Visible** para ocultar sin borrar, y
  **Editar** cambia título/bajada de las piezas del sistema.
- **Añadir pieza** crea piezas libres: *Aviso/noticia · Tarjeta · Botón/enlace
  · Cuenta regresiva · Reel destacado · Carrusel (manual)*.
- **Escribe texto plano** en los campos: se publican tal cual (sin HTML).
- La **vista previa en vivo** (derecha) usa los mismos renderizadores de la
  web real. El borrador se guarda solo en tu navegador (`localStorage`).

### Medios (biblioteca con validación)
- Arrastra archivos: se validan contra la tabla de especificaciones (§6).
- La biblioteca **solo bloquea** lo que rompería la web (formato no servible
  o más de 50 MB); el peso alto o la medida baja pasan **con aviso y consejo
  de compresión**.
- Cada archivo muestra su **ruta exacta de GitHub** (botón «Copiar ruta»).
- La biblioteca vive en tu navegador (IndexedDB): los archivos NO se suben
  solos — el checklist de «Publicar» te dice dónde guardar cada uno.

### Publicar
- **Generar data.js** descarga el archivo listo con tu borrador.
- El **checklist** enumera la subida exacta: data.js + cada medio con su
  ruta + los pasos de GitHub + verificar con `Ctrl+F5`.
- **Cambiar PIN** calcula el hash nuevo para pegar en `js/admin-acceso.js`.

### Seguridad del acceso
- El **PIN nunca vive en el código**: solo su hash SHA-256 con salto
  (`js/admin-acceso.js`). 5 intentos fallidos bloquean 15 minutos; la
  sesión caduca sola (8 h) y vive solo en tu navegador.
- **PIN de demostración: `NITRO27`** — cámbialo antes de publicar el sitio
  real (pestaña Publicar → Cambiar PIN, y sube el `admin-acceso.js` nuevo).

Actualización manual (sin dashboard): todo lo visible vive en **`data.js`**.

- **Estados de evento (K3):** solo estos cuatro — `a-la-venta`,
  `en-preparacion`, `en-negociacion`, `realizado`. Nunca escribas
  "próximamente" como estado.
- **Ciclo de la vitrina (§2):** `eventoVigente.ciclo` admite `pre`
  (publicidad del evento vigente), `post` (la portada muestra «así salió»)
  y `carrusel` (varios eventos activos, sin autoplay).
- **Medios:** especificaciones exactas y huecos con nombre en
  [`assets/LEEME-ASSETS.md`](assets/LEEME-ASSETS.md).

## 4 · Estructura del proyecto

```
nitrotoon-web/
  index.html          portada componible por piezas (§2, §6)
  eventos.html        calendario del año (estados reales, K3)
  artistas.html       puerta Artistas: Artist Alley + invitados con filtros
  programa.html       agenda por día y escenario (tabla ordenable)
  galeria.html        «así salió»: fotos + reels con embeds diferidos
  normas.html         normas de la comunidad (qué sí y qué no)
  aliados.html        sponsors por niveles con aspect-ratio uniforme
  contacto.html       vías oficiales + preguntas frecuentes
  roadmap.html        plan de crecimiento con estados honestos (Fase 4)
  otaku / gamers / kpop / cosplay / mercado .html   puertas de comunidad
  admin.html          dashboard de mantenimiento (Fase 2, con PIN)
  data.js             ← LA VITRINA: todo el contenido en un solo archivo
  css/                tokens.css · base.css · componentes.css · paginas.css · admin.css · skins.css
  js/                 vitrina.js · vistas.js · insignia.js · sha256.js · admin-acceso.js · admin.js
  assets/             logo, favicon, arte demo + LEEME-ASSETS.md
  LEEME.md            este archivo
```

## 5 · Reglas del sistema que no se rompen

- **Paleta oficial (§7.1):** negro `#0A0A0A` · carbón `#161616` · blanco ·
  dorado `#F2B705` · verde ácido `#A2AE15` · perla `#B3B3B3`.
  **El azul y toda su familia están vetados** (color de la competencia).
- **Una sola acción dominante por pantalla:** el CTA dorado de la cinta de
  entradas; todo lo demás son botones de contorno.
- **Accesibilidad (K2):** `:focus-visible` siempre visible, `lang="es"`,
  contraste AA, navegación por teclado completa (menú con `Esc` y foco
  atrapado) y respeto total a `prefers-reduced-motion` (la nave insignia y
  las estrellas se apagan si el visitante lo pide).
- **Sin autoplay ni "datos en vivo"** (K1): el video del HERO arranca con
  botón y tiene pausa siempre visible; los reels se cargan solo al tocar.
- **Sin "Coming Soon"** (K3): todo evento publicado tiene estado real.
- **Ninguna cifra de audiencia sin fuente y fecha** (regla del comité).

## 6 · La nave insignia (§7)

El SVG de la nave es original del desarrollador, fiel a la descripción
oficial del usuario (cohete vertical, contorno fino sin relleno, punta
cónica, dos propulsores curvos, ventana circular, llama en V invertida).
Vuela por la pantalla en cada navegación interna y en los cambios de
sección de la portada, con estela dorada. Vive en `js/insignia.js`.

## 6-bis · Las skins de las puertas (Fase 3, §5.2)

Las tres puertas insignia visten su propia identidad — **solo CSS** en
[`css/skins.css`](css/skins.css), sobre el mismo DOM y solo con la paleta
oficial (cero azules):

| Puerta | Identidad | Detalles |
|---|---|---|
| **Otaku** | Manga | Speedlines diagonales, kanji 夢 de agua contorneado, torii en trazo fino, kickers encorchetados 「…」, destacado como globo de diálogo con cola, subrayado de marcador |
| **Gamers** | Arcade | Scanlines CRT, grid de piso, esquinas HUD en la cabecera, kicker insert-coin ▶, panel destacado con esquina recortada y barra de HP segmentada, lista numerada como misiones |
| **KPOP** | Light ocean | Mar de luces dorado (dos capas de puntos), kicker-pill de lightstick, doble subrayado dorado, destacado como photocard con marco blanco y brillo al enfocar, lista como tracklist numerada, meta como ticket stubs |

Reglas que las skins respetan: paleta cerrada §7.1 (decoración con las
variantes rgba declaradas), nada de autoplay (K1), `prefers-reduced-motion`
apaga el brillo deslizante y las rotaciones (K2), y la textura por puerta
del hub (Fase 1) sigue funcionando en la portada.

Cosplay, Artistas y Mercado conservan el tema compartido con acento propio
(tokens.css): el plan las viste a fondo solo si el administrador lo pide.

## 6-ter · El roadmap (Fase 4, §11)

[`roadmap.html`](roadmap.html) muestra el plan de crecimiento de Nitrotoon
con **estados honestos** (`documentado` · `en estudio` · `en negociación`),
cero fechas inventadas y cero cifras sin fuente — la regla del comité.
Los seis módulos: Supabase, claves de acceso, entradas propio, intranet por
evento, torneo gamer (en negociación de verdad, con ficha en el calendario)
y media kit con audiencia verificable.

- **Pública:** `roadmap.html` ← `data.js → roadmap` (píldoras, descripción
  y «qué resuelve» por módulo).
- **Técnica:** [`ROADMAP.md`](ROADMAP.md) — cómo encaja cada módulo con la
  arquitectura actual, dependencias y orden sugerido.
- El dashboard conserva el roadmap al regenerar `data.js` (Publicar).

## 7 · Publicación y pendientes (§13)

- [x] Logo oficial instalado (`assets/logo.png` + blanca + original).
- [ ] Imágenes reales ("ya tenemos muchas") → suéltalas en `materiales/` del
      proyecto y las integraremos con sus nombres exactos.
- [ ] Confirmar **nombre y datos del macro evento** para reemplazar el demo
      "Nitrotoon Fest 2027".
- [ ] (Opcional) dominio propio · hex exacto del azul vetado.

---
Hecho con orgullo geek en Venezuela. 🚀 Nitrotoon — una comunidad de comunidades.
