/* ==========================================================================
   NITROTOON · vitrina.js — núcleo compartido por todas las páginas
   --------------------------------------------------------------------------
   · Utilidades de construcción DOM y fechas en español (local, sin red).
   · Iconos SVG originales de la marca (trazo fino, sin relleno).
   · Cinta superior (evento vigente + cuenta corta).
   · Menú gigante: Esc cierra, foco atrapado (§7.2.3).
   · Cuenta regresiva del evento vigente.
   · Gancho para la nave insignia: cualquier navegación interna la hace volar.
   ========================================================================== */
"use strict";

const DATOS = window.NITROTOON_DATA || {};

/* ---- FUENTE ÚNICA DEL EVENTO (F0, 05/11/2026) ----------------------------
   Antes el evento vigente se escribía dos veces: una en `eventoVigente`
   (para el hero y la cinta) y otra en `eventos[]` (para el calendario). Dos
   copias del mismo dato se desincronizan en cuanto alguien cambia una: la
   web acaba anunciando un torneo con dos fechas distintas.

   Ahora `eventoVigente` solo guarda lo exclusivo del hero y HEREDA del
   calendario el nombre, las fechas y el lugar, buscando la entrada cuyo
   `id` coincide con `eventoVigente.id`. Cualquier valor heredado que siga
   escrito a mano se respeta como respaldo (por si el id no existe).        */
function eventoDeVerdad(datos) {
  const d = datos || DATOS;
  const ficha = d.eventoVigente || {};
  const id = ficha.id;
  const delCalendario = id && Array.isArray(d.eventos) ? d.eventos.find(e => e.id === id) : null;
  if (!delCalendario) return Object.assign({}, ficha);   /* sin id válido: se usa tal cual */
  const heredado = {};
  /* Qué se hereda del calendario y qué no:
     · nombre, fechas y ciudad → idénticos en ambos sitios: se heredan.
     · lugar → NO se hereda. En el hero es el nombre corto («Valencia») y en
       el calendario la dirección («Sede de la marca aliada del torneo»).
       Heredarlo pintaría la dirección larga en el titular grande del hero. */
  for (const campo of ["nombre", "fechaInicio", "fechaFin", "ciudad"]) {
    const propio = ficha[campo];
    const vale = propio && propio !== "__HEREDADO__" && propio !== "";
    heredado[campo] = vale ? propio : delCalendario[campo];
  }
  return Object.assign({}, delCalendario, ficha, heredado, {
    id: id,                       /* el id del calendario manda */
    estado: delCalendario.estado,
    estadoTexto: delCalendario.estadoTexto,
    entradas: delCalendario.entradas
  });
}
/* Deja el evento resuelto a mano para quien lo pida desde cualquier archivo. */
window.NITROTOON_EVENTO = eventoDeVerdad;

/* ---- Utilidades ----------------------------------------------------------- */
const $  = (sel, base = document) => base.querySelector(sel);
const $$ = (sel, base = document) => Array.from(base.querySelectorAll(sel));

/** h("div", {class:"a", html:"x", dataset:{y:1}}, [nodos]) → Element */
function h(tag, attrs = {}, hijos = []) {
  const nodo = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "html") nodo.innerHTML = v;
    else if (k === "dataset") Object.assign(nodo.dataset, v);
    else if (k.startsWith("on") && typeof v === "function") nodo.addEventListener(k.slice(2), v);
    else nodo.setAttribute(k, v === true ? "" : v);
  }
  for (const hijo of [].concat(hijos)) {
    if (hijo === null || hijo === undefined) continue;
    nodo.append(hijo.nodeType ? hijo : document.createTextNode(hijo));
  }
  return nodo;
}

/* ---- Fechas en español (es-VE) --------------------------------------------- */
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
               "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MESES_CORTOS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
const DIAS_SEMANA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function partes(iso) {
  const [a, m, d] = String(iso).split("-").map(Number);
  return { a, m, d };
}
/** "2027-07-17" → "17 de julio de 2027" */
function fechaLegible(iso) {
  if (!iso) return "";
  const { a, m, d } = partes(iso);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}
/** "2027-07-17" → "17 JUL" */
function fechaCorta(iso) {
  if (!iso) return "";
  const { m, d } = partes(iso);
  return `${d} ${MESES_CORTOS[m - 1]}`;
}
/** Rango "17 y 18 de julio de 2027" | "13 de marzo de 2027" */
function fechaRango(ini, fin) {
  if (!ini) return "Fecha por anunciar";
  if (!fin || fin === ini) return fechaLegible(ini);
  const i = partes(ini), f = partes(fin);
  if (i.m === f.m && i.a === f.a) return `${i.d} y ${f.d} de ${MESES[i.m - 1]} de ${i.a}`;
  return `${fechaLegible(ini)} al ${fechaLegible(fin)}`;
}
function diaSemana(iso) {
  const { a, m, d } = partes(iso);
  return DIAS_SEMANA[new Date(a, m - 1, d).getDay()];
}

/* ---- Iconos SVG originales (trazo fino, sin relleno — la geometría de la
   marca). Devuelven HTML string para insertar con html: o innerHTML. ---- */
const ICONOS = {
  nave: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M32 3.5c6.2 7 9.3 14.4 9.3 22.6 0 9.4-3.1 16.9-9.3 22.9-6.2-6-9.3-13.5-9.3-22.9C22.7 17.9 25.8 10.5 32 3.5Z"/>
    <circle cx="32" cy="25.5" r="5"/>
    <path d="M22.8 35.2c-5.6 1.8-9.2 5.8-10.8 12.1 4.3-.7 7.8-2.1 10.6-4.2"/>
    <path d="M41.2 35.2c5.6 1.8 9.2 5.8 10.8 12.1-4.3-.7-7.8-2.1-10.6-4.2"/>
    <path d="M26.5 52.5 32 62l5.5-9.5"/>
    <path d="M29.6 52.5 32 56.8l2.4-4.3"/>
  </svg>`,
  calendario: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 2.8V6M16 2.8V6"/><circle cx="8" cy="13.5" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="13.5" r=".9" fill="currentColor" stroke="none"/><circle cx="16" cy="13.5" r=".9" fill="currentColor" stroke="none"/><circle cx="8" cy="17" r=".9" fill="currentColor" stroke="none"/></svg>`,
  torii: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 6.5c3-1.6 15-1.6 18 0M4.2 10.2h15.6M6.5 6.7 5.8 21M17.5 6.7l.7 14.3M12 6.8V10"/><path d="M8.5 10.5v2.4M15.5 10.5v2.4"/></svg>`,
  control: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 7.5h9c2.8 0 5 2.2 5 5v3a2.6 2.6 0 0 1-4.7 1.5L15.6 15H8.4l-1.2 2A2.6 2.6 0 0 1 2.5 15.5v-3c0-2.8 2.2-5 5-5Z"/><path d="M8 10.2v3.6M6.2 12h3.6"/><circle cx="15.8" cy="11" r=".9" fill="currentColor" stroke="none"/><circle cx="18" cy="13" r=".9" fill="currentColor" stroke="none"/></svg>`,
  nota: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="17.5" r="2.7"/><circle cx="17" cy="15.5" r="2.7"/><path d="M9.7 17.5V6.2L19.7 4v11.5M9.7 9.4 19.7 7.2"/></svg>`,
  mascara: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 4.5h15v7.2c0 5-3.4 8.3-7.5 9.8-4.1-1.5-7.5-4.8-7.5-9.8Z"/><path d="M8.4 9.7h2.2M13.4 9.7h2.2"/><path d="M9 14.2c1.9 1.6 4.1 1.6 6 0"/></svg>`,
  lapiz: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14.5 5.5 4 4L8.7 19.3l-4.9 1 1-4.9Z"/><path d="m13 7 4 4M4.8 15.4l3.8 3.8"/></svg>`,
  tienda: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 8h13l-1 12.5h-11Z"/><path d="M8.8 10.5V6.8a3.2 3.2 0 0 1 6.4 0v3.7"/></svg>`,
  familia: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7.2" cy="7" r="2.4"/><circle cx="16.8" cy="7" r="2.4"/><circle cx="12" cy="13.2" r="1.9"/><path d="M3.5 20.5v-1.6c0-2 1.6-3.7 3.7-3.7 1.2 0 2.3.6 3 1.5M20.5 20.5v-1.6c0-2-1.6-3.7-3.7-3.7-1.2 0-2.3.6-3 1.5M9.6 20.5v-.8c0-1.3 1-2.4 2.4-2.4s2.4 1.1 2.4 2.4v.8"/></svg>`,
  camara: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2.4"/><path d="M8.5 7l1.4-2.5h4.2L15.5 7"/><circle cx="12" cy="13.4" r="3.6"/><circle cx="18" cy="10" r=".9" fill="currentColor" stroke="none"/></svg>`,
  microfono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6"/></svg>`,
  estrella: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7Z"/><path d="M18.8 15.8c.3 1.9 1.2 2.8 3.2 3.2-2 .3-2.9 1.2-3.2 3.2-.3-2-1.2-2.9-3.2-3.2 2-.4 2.9-1.3 3.2-3.2Z" stroke-width="1.4"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.8 8.2h2.4V4.6h-2.4a4 4 0 0 0-4 4v2.2H8.4v3.6h2.4v7h3.6v-7h2.6l.6-3.6h-3.2V8.6c0-.2.2-.4.4-.4Z"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21.5s-6.8-6-6.8-11a6.8 6.8 0 0 1 13.6 0c0 5-6.8 11-6.8 11Z"/><circle cx="12" cy="10.3" r="2.4"/></svg>`,
  ticket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5v-2a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v2a2.5 2.5 0 0 0 0 7v2a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-2a2.5 2.5 0 0 0 0-7Z"/><path d="M14 5.5v2.2M14 10.9v2.2M14 16.3v2.2" stroke-dasharray="2.4 2.6"/></svg>`
};
function icono(nombre, clase = "") {
  const svg = ICONOS[nombre] || ICONOS.estrella;
  return clase ? svg.replace("<svg ", `<svg class="${clase}" `) : svg;
}

/* ---- Cinta superior: evento vigente + cuenta corta -------------------------- */
function pintarCinta() {
  const ev = eventoDeVerdad(DATOS);   /* F0: datos heredados del calendario */
  $$('[data-cinta="nombre"]').forEach(n => n.textContent = ev.nombre || "Nitrotoon");
  $$('[data-cinta="fecha"]').forEach(n => n.textContent = fechaRango(ev.fechaInicio, ev.fechaFin));
  $$('[data-cinta-cta]').forEach(a => a.href = (DATOS.marca && DATOS.marca.entradasUrl) || "#");
  /* Cuenta corta en días para la cinta */
  if (ev.fechaInicio) {
    const objetivo = new Date(`${ev.fechaInicio}T00:00:00-04:00`).getTime();
    const dias = Math.ceil((objetivo - Date.now()) / 86400000);
    const texto = dias > 1 ? `Faltan ${dias} días`
      : dias === 1 ? "¡Es mañana!"
      : dias === 0 ? "¡Es hoy!"
      : "Evento en curso o cerrado";
    $$('[data-cinta="cuenta"]').forEach(n => n.textContent = texto);
  }
}

/* ---- Cuenta regresiva (cinta y hero) ----------------------------------------
     [data-cuenta][data-fecha="2026-12-05T00:00:00-04:00"]
     BUG-5 (04/11, reportado por el usuario: «las celdas quedan en --»):
     la versión anterior congelaba `$$("[data-cuenta]")` en la PRIMERA
     llamada. vitrina.js arranca antes de que vistas.js dibuje el hero, así
     que la lista quedaba vacía y el guardia `_activa` impedía la segunda
     pasada: las celdas nunca se pintaban. Ahora los nodos se recogen en
     cada tick, de modo que sirve para cualquier cuenta que aparezca después
     (hero, piezas del dashboard, eventos futuros).
     BUG-5b: además, el hero se dibuja DESPUÉS del primer arranque; si al
     llamar todavía no hay cuentas en el documento, se reintenta solo. */
function enIniciarCuentasReintento() { iniciarCuentas(); }

function iniciarCuentas() {
  if (iniciarCuentas._activa) return;
  if (!$$("[data-cuenta]").length) {
    /* BUG-5b: el hero puede dibujarse después de este arranque. En vez de
       rendirse para siempre, se reintenta en el próximo ciclo (máx. ~5 s). */
    if (!iniciarCuentas._reintentos) iniciarCuentas._reintentos = 0;
    if (iniciarCuentas._reintentos++ < 20) {
      setTimeout(enIniciarCuentasReintento, 250);
    }
    return;
  }
  iniciarCuentas._activa = true;
  const pintar = () => {
    const ahora = Date.now();
    for (const n of $$("[data-cuenta]")) {    /* fresco en cada tick */
      const objetivo = new Date(n.dataset.fecha).getTime();
      if (!objetivo) continue;
      let s = Math.max(0, Math.floor((objetivo - ahora) / 1000));
      const dias = Math.floor(s / 86400); s -= dias * 86400;
      const horas = Math.floor(s / 3600); s -= horas * 3600;
      const min = Math.floor(s / 60);
      const seg = s - min * 60;
      const cero = v => String(v).padStart(2, "0");
      const celdas = n.querySelectorAll("[data-celda]");
      const valores = [String(dias), cero(horas), cero(min), cero(seg)];
      celdas.forEach((c, i) => {
        const v = valores[i] ?? "";
        if (c.textContent !== v) c.textContent = v;
      });
    }
  };
  pintar();
  setInterval(pintar, 1000);
}

/* ---- Menú gigante: abrir/cerrar, Esc, foco atrapado (§7.2.3) ---------------- */
function iniciarMenu() {
  const btn = $("#btn-menu");
  const mega = $("#mega");
  if (!btn || !mega) return;

  let focoPrevio = null;

  const enfocables = () => $$('a[href], button, [tabindex]:not([tabindex="-1"])', mega)
    .filter(n => n.offsetParent !== null || n === document.activeElement);

  function abrir() {
    focoPrevio = document.activeElement;
    mega.dataset.abierto = "true";
    btn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    const primero = enfocables()[0];
    if (primero) primero.focus();
  }
  function cerrar(devolverFoco = true) {
    mega.dataset.abierto = "false";
    btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (devolverFoco && focoPrevio) focoPrevio.focus();
  }

  btn.addEventListener("click", () =>
    mega.dataset.abierto === "true" ? cerrar() : abrir());
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "mega");

  /* Botón de cierre dentro del menú (lo escribe el HTML estático) */
  const btnCerrar = $("#mega-cerrar");
  if (btnCerrar) btnCerrar.addEventListener("click", () => cerrar());

  /* Esc cierra; Tab queda atrapado dentro */
  mega.addEventListener("keydown", e => {
    if (e.key === "Escape") { cerrar(); return; }
    if (e.key !== "Tab") return;
    const lista = enfocables();
    if (!lista.length) return;
    const primero = lista[0], ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });

  /* Cerrar al elegir un destino */
  mega.addEventListener("click", e => {
    if (e.target.closest("a")) cerrar(false);
  });
}

/* ---- Marca de página activa en menús (aria-current) -------------------------- */
function marcarPaginaActual() {
  const aqui = location.pathname.split("/").pop() || "index.html";
  $$('a[href], nav a[href]').forEach(a => {
    if (a.getAttribute("href") === aqui) a.setAttribute("aria-current", "page");
  });
}

/* ---- Pie: intranet por evento + año + admin discreto (§5.9) ------------------ */
function pintarPie() {
  const anio = $("#anio");
  if (anio) anio.textContent = String(new Date().getFullYear());
  const adminOn = DATOS.admin && DATOS.admin.activo === true && DATOS.admin.url;
  $$("[data-acceso-admin]").forEach(n => {
    if (adminOn) {
      n.hidden = false;
      n.setAttribute("href", DATOS.admin.url);
    } else {
      n.hidden = true;
    }
  });
  /* Sello de versión del contenido (lo actualiza el dashboard al publicar) */
  const version = DATOS.version;
  if (version) {
    $$("[data-version]").forEach(n => n.textContent = `${version.etiqueta} · actualizado ${version.fecha}`);
  }
  /* Intranet por evento: enlaces a sistemas externos (§11) */
  const zona = $('[data-zona="intranet"]');
  if (zona && DATOS.intranet) {
    zona.replaceChildren(...(DATOS.intranet.enlaces || []).map(e =>
      h("li", {}, [h("a", { href: e.url, target: String(e.url).startsWith("http") ? "_blank" : null, rel: "noopener", html: e.nombre })])));
  }
}

/* ---- La nave reacciona a toda navegación interna ------------------------------ */
function iniciarVuelos() {
  document.addEventListener("click", e => {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    const interno = href.startsWith("#") || href.endsWith(".html");
    if (!interno) return;
    if (window.NaveInsignia) window.NaveInsignia.volarHacia(e.clientX, e.clientY);
  }, { capture: true });
}

/* ---- Iconos [data-icono]: inyección del arte SVG original --------------------- */
function pintarIconos() {
  $$("[data-icono]").forEach(n => {
    n.innerHTML = icono(n.dataset.icono);
    if (!n.getAttribute("aria-hidden")) n.setAttribute("aria-hidden", "true");
  });
}

/* ---- Menú gigante: contenido por público (§7.2.3) ---------------------------- */
function pintarMenu() {
  const vitrina = $('[data-zona="mega-vitrina"]');
  const publico = $('[data-zona="mega-publico"]');
  const puertas = $('[data-zona="mega-puertas"]');
  if (!vitrina || !publico || !puertas) return;

  vitrina.append(
    h("h2", { html: "La vitrina" }),
    h("ul", { class: "mega__lista" }, [
      h("li", {}, [h("a", { href: "eventos.html", html: "Eventos <span class=\"nota\">calendario del año</span>" })]),
      h("li", {}, [h("a", { href: "programa.html", html: "Programa <span class=\"nota\">agenda por día y escenario</span>" })]),
      h("li", {}, [h("a", { href: "galeria.html", html: "Galería «así salió» <span class=\"nota\">fotos y reels</span>" })]),
      h("li", {}, [h("a", { href: "aliados.html", html: "Aliados y sponsors" })]),
      h("li", {}, [h("a", { href: "contacto.html", html: "Contacto" })]),
      h("li", {}, [h("a", { href: "roadmap.html", html: "Roadmap <span class=\"nota\">hacia dónde crece la nave</span>" })])
    ])
  );

  publico.append(
    h("h2", { html: "Por público" }),
    h("ul", { class: "mega__lista" }, [
      h("li", {}, [h("a", { href: "galeria.html", html: "Familias <span class=\"nota\">galería y normas para toda la casa</span>" })]),
      h("li", {}, [h("a", { href: "normas.html", html: "Normas de la comunidad <span class=\"nota\">qué sí y qué no</span>" })]),
      h("li", {}, [h("a", { href: "gamers.html", html: "Gamers <span class=\"nota\">torneos y zonas de juego</span>" })]),
      h("li", {}, [h("a", { href: "kpop.html", html: "KPOP <span class=\"nota\">dance covers y fandoms</span>" })]),
      h("li", {}, [h("a", { href: "cosplay.html", html: "Cosplay <span class=\"nota\">concursos y zona de fotos</span>" })]),
      h("li", {}, [h("a", { href: "artistas.html", html: "Artistas <span class=\"nota\">artist alley y firmas</span>" })])
    ])
  );

  puertas.append(
    h("h2", { html: "Las 7 puertas" }),
    h("div", { class: "mega__puertas" }, (DATOS.puertas || []).map(p =>
      h("a", { class: "mega__puerta", href: p.url, dataset: { puerta: p.id } }, [
        h("span", { class: "icono-puerta", html: icono(p.icono) }),
        h("strong", { html: p.nombre }),
        h("small", { html: p.resumen })
      ])))
  );
}

/* ---- Vista previa del borrador (F3) ------------------------------------------
   `index.html?borrador=1` muestra la portada con lo que hay en el borrador del
   dashboard, SIN haber publicado nada. Solo funciona en la misma máquina y
   en el mismo navegador (lee localStorage), así que jamás puede filtrar
   contenido a un visitante: para él la URL no muestra nada distinto.

   Reglas:
   · Si la URL no pide el borrador, esto no hace absolutamente nada.
   · Si el borrador está vacío o roto, se usa lo publicado: nunca una
     pantalla en blanco.
   · Se avisa en pantalla con una franja fija, para que nadie confunda la
     vista previa con el sitio real. */
function aplicarBorradorSiSePide() {
  let pedido = false;
  try {
    pedido = new URLSearchParams(location.search).get("borrador") === "1";
  } catch (e) { return false; }
  if (!pedido) return false;

  let borrador = null;
  try { borrador = JSON.parse(localStorage.getItem("nitrotoon-borrador") || "null"); } catch (e) { borrador = null; }
  if (!borrador || !borrador.portada) {
    console.warn("[Nitrotoon] Pediste la vista previa del borrador, pero no hay ninguno guardado. Se muestra lo publicado.");
    return false;
  }

  window.NITROTOON_DATA = borrador;

  /* Franja de advertencia: imposible confundirse. */
  const franja = document.createElement("div");
  franja.className = "franja-borrador";
  franja.setAttribute("role", "status");
  franja.innerHTML = "<strong>Vista previa del borrador</strong> · esto NO es lo que ve el público todavía."
    + ' <a href="admin.html">Volver al dashboard</a>';
  document.body.prepend(franja);
  document.body.classList.add("con-franja-borrador");
  return true;
}

/* Se ejecuta ANTES de que las vistas lean los datos. */
aplicarBorradorSiSePide();

/* ---- Arranque común ----------------------------------------------------------- */
function arranqueVitrina() {
  pintarIconos();
  pintarCinta();
  pintarPie();
  pintarMenu();
  marcarPaginaActual();
  iniciarMenu();
  iniciarCuentas();
  iniciarVuelos();
}
document.addEventListener("DOMContentLoaded", arranqueVitrina);
