# NITROTOON — ROADMAP técnico (§11 · Fase 4)

> Documento de ingeniería del plan de crecimiento. La **versión pública**
> vive en [`roadmap.html`](roadmap.html) y se alimenta de
> `data.js → roadmap` (editable; la pestaña Publicar del dashboard lo
> conserva al regenerar `data.js`).
> Regla inviolable del comité: **cero fechas inventadas y cero cifras sin
> fuente y fecha**. Un módulo se anuncia cuando su diseño existe.

## Estados del roadmap

| Estado | Significado |
|---|---|
| `documentado` | Diseñado en el plan maestro (§11); puede arrancar cuando la comunidad lo necesite. |
| `en estudio` | Evaluando opciones técnicas/proveedores antes de diseñar. |
| `en negociacion` | En trámite con terceros; se anuncia con fecha real al firmar. |

Estos estados son de **crecimiento**, distintos de los 4 estados de evento
(K3: `a-la-venta`, `en-preparacion`, `en-negociacion`, `realizado`), que
siguen siendo los únicos permitidos en el calendario.

## Los seis módulos (§11)

### 1 · Contenido en vivo con Supabase — `documentado`
- **Qué:** reemplazar (o complementar) la entrega por `data.js` con una
  base de datos Supabase, para publicación instantánea desde el dashboard.
- **Cómo encaja:** la web ya lee **todo** desde `window.NITROTOON_DATA`
  mediante `datosVivos()` (js/vistas.js). El enchufe es un adaptador que
  alimenta ese mismo objeto desde la API — las 15 páginas no cambian.
- **Requiere:** cuenta Supabase (gratis en su plan base), claves
  `anon`/`service_role` y GitHub Secret para un Action de sincronización.
- **Riesgos:** pérdida de la entrega 100 % estática → mitigable manteniendo
  `data.js` como respaldo generado (export periódico).

### 2 · Gestión de claves de acceso — `documentado`
- **Qué:** crear credenciales por usuario (staff, prensa, jurados) para
  secciones restringidas. Hoy **no existe** ningún acceso por usuario:
  solo el PIN del administrador (hash SHA-256 en `js/admin-acceso.js`).
- **Cómo encaja:** modelo C de referentes — no login de visitantes, solo
  claves de staff. Puede vivir en Supabase (módulo 1) con roles simples.
- **Depende de:** módulo 1 (o de un backend mínimo equivalente).

### 3 · Módulo de entradas propio — `documentado`
- **Qué:** taquilla dentro de la web con órdenes, control de aforo y
  validación de entradas en puerta.
- **Cómo encaja:** la cinta superior ya centraliza el CTA de entradas
  (`marca.entradasUrl`); el módulo reemplaza el enlace externo por el
  flujo propio por evento (estructura `evento.entradas` ya prevista).
- **Depende de:** módulo 1; pasarela de pago local a definir (en su momento,
  en estudio).

### 4 · Intranet por evento — `documentado`
- **Qué:** los enlaces «Tu evento» del pie (presentes en las 15 páginas)
  conectados a una base de datos que cambia con cada convención:
  horarios de staff, mapas operativos, contactos de producción.
- **Cómo encaja:** zona `data-zona="intranet"` ya renderizada por
  `pintarPie()` desde `data.js`; el módulo cambia la fuente a la DB
  por evento (módulo 1).

### 5 · Torneo gamer oficial — `en negociacion`
- **Qué:** competencia oficial de la puerta Gamers con sede, formato y
  premios por confirmar.
- **Estado real:** ficha en `eventos.html` con estado `en negociacion`
  (honestidad K3). Se anuncia con fecha cuando la firma esté lista.
- **Depende de:** sede (en trámite); brackets públicos pueden construirse
  con la arquitectura actual (datos + piezas del dashboard).

### 6 · Índice de audiencia y media kit — `documentado`
- **Qué:** página de cifras para aliados con **fuente y fecha en cada
  número** — la regla del comité. Lo que no exista, no se inventa.
- **Cómo encaja:** el hueco existe: `aliados.mediaKitUrl` (hoy `null`,
  el botón no se muestra) y la pieza del roadmap en `roadmap.html`.
  La página nace cuando existan mediciones reales.

## Orden de implementación sugerido

`1 · Supabase` → `2 · Claves` → `4 · Intranet` → `3 · Entradas` →
`6 · Media kit` (en paralelo, cuando haya cifras) · `5 · Torneo`
(cuando la sede firme).

Cada módulo se documentará aquí con su decisión de arquitectura y su
fecha real de arranque.
