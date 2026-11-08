/* ==========================================================================
   NITROTOON · vistas.js — renderizadores por página y PIEZAS de la vitrina
   --------------------------------------------------------------------------
   Cada página se declara con <body data-pagina="…">. La portada se compone
   con PIEZAS (data.portada.piezas): el dashboard las reordena, oculta o
   añade — ver §2 y §6 del prompt maestro. Tipos de pieza:
   · Del sistema: hero · puertas · avisos · eventos · artistas · galeria ·
     aliados (usan el contenido de data.js).
   · Libres (dashboard): aviso · tarjeta · enlace · cuenta · reel · carrusel.
   El dashboard reutiliza este archivo para la vista previa en vivo:
   window.VISTAS.pieza(tipo, datos, contenedor).
   ========================================================================== */
"use strict";

const PAGINA = document.body.dataset.pagina || "";
const FECHA_CUENTA = ev => ev && ev.fechaInicio ? `${ev.fechaInicio}T00:00:00-04:00` : null;

/* El dato se lee SIEMPRE en vivo: el dashboard cambia window.NITROTOON_DATA
   con su borrador para que la vista previa refleje lo que se está editando. */
function datosVivos() { return window.NITROTOON_DATA || {}; }

/* ==========================================================================
   PIEZAS COMPARTIDAS
   ========================================================================== */

const ESTADOS_TEXTO = {
  "a-la-venta": "Entradas a la venta",
  "en-preparacion": "En preparación con fecha",
  "en-negociacion": "En negociación",
  "realizado": "Realizado"
};

function estadoBadge(ev) {
  const texto = ev.estadoTexto || ESTADOS_TEXTO[ev.estado] || "";
  return h("p", { class: `estado estado--${ev.estado}`, html: texto });
}

function tarjetaEvento(ev) {
  const inicio = ev.fechaInicio ? partes(ev.fechaInicio) : null;
  const fecha = inicio ? h("p", { class: "tarjeta-evento__fecha", "aria-hidden": "true" }, [
    h("span", { class: "dia", html: inicio.d }),
    h("span", { class: "mes", html: fechaCorta(ev.fechaInicio).split(" ")[1] }),
    h("span", { class: "ano", html: String(inicio.a) })
  ]) : h("p", { class: "tarjeta-evento__fecha", "aria-hidden": "true" }, [
    h("span", { class: "dia", html: "—" }),
    h("span", { class: "mes", html: "por" }),
    h("span", { class: "ano", html: "fechar" })
  ]);

  const acciones = [];
  if (ev.entradas) acciones.push(h("a", { class: "btn btn--contorno btn--pequeno", href: datosVivos().marca.entradasUrl, target: "_blank", rel: "noopener", html: "Conseguir entradas" }));
  if (ev.galeria) acciones.push(h("a", { class: "enlace-flecha", href: ev.galeria, html: "Ver cómo salió" }));

  return h("article", { class: "tarjeta tarjeta-evento" }, [
    fecha,
    h("div", { class: "tarjeta-evento__cuerpo" }, [
      h("p", { class: "texto-micro texto-suave", html: ev.tipo || "" }),
      h("h3", { html: ev.nombre }),
      estadoBadge(ev),
      h("p", { class: "tarjeta-evento__lugar", html: `${ev.lugar || ""}${ev.ciudad ? " · " + ev.ciudad : ""}` }),
      h("p", { class: "tarjeta-evento__descripcion", html: ev.descripcion || "" }),
      h("p", { class: "texto-pequeno cifra", html: fechaRango(ev.fechaInicio, ev.fechaFin) })
    ]),
    acciones.length ? h("div", { class: "tarjeta__pie" }, acciones) : null
  ]);
}

function puertaCard(p) {
  return h("a", {
    class: "puerta",
    href: p.url,
    dataset: { puerta: p.id },
    html: `${icono(p.icono, "puerta__icono")}
           <span class="puerta__nombre">${p.nombre}</span>
           <span class="puerta__resumen">${p.resumen}</span>
           <span class="puerta__abrir">Abrir la puerta →</span>`
  });
}

function fichaArtista(a) {
  const redes = (a.redes || []).map(r =>
    h("a", { href: r.url, "aria-label": `${a.nombre} en ${r.nombre}`, target: "_blank", rel: "noopener", html: icono(r.icono) }));
  return h("article", { class: "ficha", dataset: { letra: a.letra, zona: a.zona, dia: a.dia } }, [
    h("img", { class: "ficha__foto", src: a.foto, alt: `Retrato demo de ${a.nombre}`, width: "800", height: "800", loading: "lazy" }),
    h("div", { class: "ficha__cuerpo" }, [
      h("h3", { class: "ficha__nombre", html: a.nombre }),
      h("p", { class: "ficha__rol", html: a.rol }),
      h("p", { class: "ficha__bio", html: a.bio }),
      h("div", { class: "ficha__chips" }, [
        h("span", { html: a.pais }), h("span", { html: a.zona }), h("span", { html: a.dia })
      ])
    ]),
    h("div", { class: "ficha__pie" }, [
      h("span", { class: "ficha__firma", html: a.nombre }),
      h("div", { class: "ficha__redes" }, redes)
    ])
  ]);
}

function facadeReel(pieza) {
  /* Facade: nada de terceros carga hasta que el visitante toca (K1, §7.2.7) */
  const btn = h("button", { class: "facade", type: "button", "aria-label": `Reproducir: ${pieza.titulo} (abre en una pestaña nueva)` }, [
    h("img", { src: pieza.poster || "assets/demo/galeria-reel1.svg", alt: "", loading: "lazy" }),
    h("span", { class: "facade__play", html: "Ver reel" })
  ]);
  btn.addEventListener("click", () => {
    if (pieza.videoId) {
      const iframe = h("iframe", {
        src: `https://www.youtube-nocookie.com/embed/${pieza.videoId}?autoplay=1`,
        title: pieza.titulo, allow: "autoplay; encrypted-media; picture-in-picture",
        allowfullscreen: true, style: "position:absolute;inset:0;width:100%;height:100%;border:0"
      });
      btn.replaceWith(iframe);
    } else if (pieza.url) {
      window.open(pieza.url, "_blank", "noopener");
    }
  });
  return btn;
}

/* ==========================================================================
   PORTADA — pipeline de piezas (§2, §6)
   ========================================================================== */

const TITULOS_DEFECTO = {
  puertas:  { kicker: "Hub de puertas", titulo: "Siete puertas, una sola nave", intro: "Cada comunidad tiene su salón: elige tu puerta y entra. Ninguna está vacía — todas abren contenido real." },
  avisos:   { kicker: "Avisos", titulo: "Lo que la nave está hablando", intro: "Estados y convocatorias reales, al día." },
  eventos:  { kicker: "Calendario", titulo: "Lo que viene", intro: "Estados reales, siempre: a la venta, en preparación con fecha, en negociación o realizado. Nada de «próximamente»." },
  artistas: { kicker: "Invitados", titulo: "Artistas que firman la nave", intro: "Ilustración, cómic, doblaje, música y cosplay: la primera tanda del Fest 2027." },
  galeria:  { kicker: "Así salió", titulo: "El Fest 2026, tal como fue", intro: "Fotos de la vitrina y reels para revivir (o enamorarte por primera vez). Los reels se cargan solo cuando los tocas." },
  aliados:  { kicker: "Aliados", titulo: "Marcas que empujan la nave", intro: "" }
};

function seccionPortada(id, pieza, def, cuerpo, { compacta = false, enlace = null, areaLabel = null } = {}) {
  const d = { ...def, ...(pieza || {}) };
  const attrs = { class: `seccion${compacta ? " seccion--compacta" : ""}`, id, "data-insignia-seccion": true };
  if (areaLabel) attrs["aria-label"] = areaLabel; else attrs["aria-labelledby"] = `${id}-titulo`;
  return h("section", attrs, [
    h("div", { class: "contenedor" }, [
      h("div", { class: "cabecera-seccion" }, [
        h("div", {}, [
          h("p", { class: "kicker", html: d.kicker || "" }),
          h("h2", { id: `${id}-titulo`, html: d.titulo || "" }),
          d.intro ? h("p", { html: d.intro }) : null
        ]),
        enlace ? h("a", { class: "enlace-flecha", href: enlace[0], html: enlace[1] }) : null
      ]),
      cuerpo
    ])
  ]);
}

const PIEZAS_PORTADA = {
  /* ---- Piezas del sistema ---- */
  hero(zona) {
    const ev = eventoDeVerdad(datosVivos());   /* F0: fuente única */
    const seccion = h("section", { class: "hero", id: "hero", "data-insignia-seccion": true, "aria-label": "Evento vigente" }, [
      h("div", { class: "estrellas", "aria-hidden": "true" })
    ]);
    const interior = h("div", { class: "contenedor hero__interior" });
    seccion.append(interior);
    const ciclo = ev.ciclo || "pre";

    if (ciclo === "post") {
      interior.innerHTML = `
        <p class="hero__kicker">Así salió · ${ev.nombre || "el evento"}</p>
        <h1 class="hero__titulo">¡Gracias por<br>volar con<span class="linea-acento">nosotros!</span></h1>
        <p class="hero__meta"><strong>${ev.nombre}</strong> quedó en la historia. Revive la vitrina en fotos y reels.</p>
        <div class="hero__acciones">
          <a class="btn btn--contorno btn--grande" href="galeria.html">Ver la galería «así salió»</a>
          <a class="enlace-flecha" href="eventos.html">Lo que viene del año</a>
        </div>`;
    } else if (ciclo === "carrusel") {
      /* Varios eventos activos: carrusel manual (sin autoplay, K1) */
      const activos = (datosVivos().eventos || []).filter(e => e.estado !== "realizado");
      let idx = 0;
      interior.innerHTML = `
        <p class="hero__kicker">Varios eventos activos</p>
        <h1 class="hero__titulo" data-hero-nombre></h1>
        <p class="hero__meta" data-hero-meta></p>
        <div class="hero__acciones">
          <button class="btn btn--contorno" type="button" data-hero-prev aria-label="Evento anterior">←</button>
          <button class="btn btn--contorno" type="button" data-hero-next aria-label="Evento siguiente">→</button>
          <a class="enlace-flecha" href="eventos.html">Ver todos los eventos</a>
        </div>
        <p class="hero__nota" data-hero-nota aria-live="polite"></p>`;
      const pintar = () => {
        const e = activos[idx];
        interior.querySelector("[data-hero-nombre]").textContent = e.nombre;
        interior.querySelector("[data-hero-meta]").innerHTML =
          `<strong>${e.tipo}</strong><span>${fechaRango(e.fechaInicio, e.fechaFin)}</span><span>${e.lugar}</span>`;
        interior.querySelector("[data-hero-nota]").textContent =
          `Evento ${idx + 1} de ${activos.length} · ${e.estadoTexto}`;
        interior.querySelector("[data-hero-prev]").onclick = () => { idx = (idx - 1 + activos.length) % activos.length; pintar(); };
        interior.querySelector("[data-hero-next]").onclick = () => { idx = (idx + 1) % activos.length; pintar(); };
      };
      pintar();
    } else {
      /* Pre-evento: publicidad del evento vigente (ciclo actual) */
      const cuenta = FECHA_CUENTA(ev) ? `
        <div class="cuenta" data-cuenta data-fecha="${FECHA_CUENTA(ev)}" role="timer" aria-label="Cuenta regresiva para ${ev.nombre}">
          <span class="cuenta__celda"><span class="cuenta__valor" data-celda>--</span><span class="cuenta__etiqueta">días</span></span>
          <span class="cuenta__celda"><span class="cuenta__valor" data-celda>--</span><span class="cuenta__etiqueta">horas</span></span>
          <span class="cuenta__celda"><span class="cuenta__valor" data-celda>--</span><span class="cuenta__etiqueta">min</span></span>
          <span class="cuenta__celda"><span class="cuenta__valor" data-celda>--</span><span class="cuenta__etiqueta">seg</span></span>
        </div>` : "";
      const medio = ev.heroVideo ? `
        <div class="hero__medio">
          <video src="${ev.heroVideo}" ${ev.heroPoster ? `poster="${ev.heroPoster}"` : ""} muted playsinline loop preload="none"></video>
          <button class="btn btn--contorno btn--pequeno btn-reproducir" type="button" data-video-btn>Reproducir</button>
        </div>` : "";
      interior.innerHTML = `
        <p class="hero__kicker">${ev.eslogan || "Evento vigente"}</p>
        <h1 class="hero__titulo">${ev.nombre}<span class="linea-acento">${fechaRango(ev.fechaInicio, ev.fechaFin)}</span></h1>
        <p class="hero__meta">
          <strong>${ev.lugar || ""}</strong>
          <span>${ev.ciudad || ""}</span>
          <span>${ev.fechaInicio ? diaSemana(ev.fechaInicio) + (ev.fechaFin ? " y " + diaSemana(ev.fechaFin) : "") : ""}</span>
        </p>
        <p class="hero__nota">${ev.bajada || ""}</p>
        <div class="hero__acciones">
          <a class="btn btn--contorno btn--grande" href="eventos.html">Conocer el evento</a>
          <a class="enlace-flecha" href="programa.html">Ver el programa completo</a>
        </div>
        ${cuenta}${medio}`;
      const video = interior.querySelector("video");
      const btnVideo = interior.querySelector("[data-video-btn]");
      if (video && btnVideo) {
        btnVideo.addEventListener("click", () => {
          if (video.paused) { video.play(); btnVideo.textContent = "Pausar"; }
          else { video.pause(); btnVideo.textContent = "Reproducir"; }
        });
      }
      if (interior.querySelector("[data-cuenta]")) iniciarCuentas();
      /* Cinta infinita: cierra el hero con los datos del evento en movimiento */
      const cinta = construirCinta(itemsDeCinta());
      if (cinta) seccion.append(cinta);
    }
    zona.append(seccion);
    /* BUG-5b (04/11, reportado por el usuario: «no se actualiza días/horas/
       min/seg»): la cuenta se arrancaba ARRIBA, cuando el hero aún vivía solo
       en memoria — `$$("[data-cuenta]")` busca en document y no lo encontraba,
       así que retornaba sin pintar. Ahora se arranca DESPUÉS de insertar el
       hero en la página: el nodo ya existe y las celdas reciben su número. */
    if (seccion.querySelector("[data-cuenta]")) iniciarCuentas();
  },

  puertas(zona, pieza) {
    const cuerpo = h("div", { class: "puertas" }, (datosVivos().puertas || []).map(puertaCard));
    zona.append(seccionPortada("puertas", pieza, TITULOS_DEFECTO.puertas, cuerpo));
  },

  avisos(zona, pieza) {
    const cuerpo = h("div", { style: "display:grid;gap:1rem" });
    const arena = (datosVivos().eventos || []).find(e => e.estado === "en-negociacion");
    if (arena) cuerpo.append(h("div", { class: "aviso aviso--verde", html: `${icono("control", "aviso__icono")}<div><strong>${arena.nombre} · ${arena.estadoTexto}</strong><p>${arena.descripcion}</p><a class="enlace-flecha" href="gamers.html">Seguir la puerta Gamers</a></div>` }));
    const convocatoria = (datosVivos().espacios && datosVivos().espacios.artistas && datosVivos().espacios.artistas.destacado) || null;
    if (convocatoria) cuerpo.append(h("div", { class: "aviso", html: `${icono("lapiz", "aviso__icono")}<div><strong>${convocatoria.titulo}</strong><p>${convocatoria.texto}</p><a class="enlace-flecha" href="artistas.html">Ver convocatoria</a></div>` }));
    zona.append(seccionPortada("avisos", pieza, TITULOS_DEFECTO.avisos, cuerpo, { compacta: true, areaLabel: "Avisos de la vitrina" }));
  },

  eventos(zona, pieza) {
    const cuerpo = h("div", { class: "grilla-eventos" },
      (datosVivos().eventos || []).filter(e => e.estado !== "realizado").slice(0, 3).map(tarjetaEvento));
    zona.append(seccionPortada("eventos", pieza, TITULOS_DEFECTO.eventos, cuerpo, { enlace: ["eventos.html", "Ver todos los eventos"] }));
  },

  artistas(zona, pieza) {
    const cuerpo = h("div", { class: "fichas" },
      (datosVivos().artistas || []).slice(0, pieza.max || 3).map(fichaArtista));
    zona.append(seccionPortada("artistas", pieza, TITULOS_DEFECTO.artistas, cuerpo, { enlace: ["artistas.html", "Ver todos los invitados"] }));
  },

  galeria(zona, pieza) {
    const cuerpo = h("div", { class: "galeria" });
    const piezas = ((datosVivos().galeria || {}).piezas || []).filter(p => p.tipo === "foto").slice(0, 4);
    for (const p of piezas) {
      cuerpo.append(h("figure", { class: `galeria__pieza ${p.clase ? "galeria__pieza--" + p.clase : ""}` }, [
        h("img", { src: p.src, alt: p.alt, loading: "lazy" })
      ]));
    }
    zona.append(seccionPortada("galeria", pieza, TITULOS_DEFECTO.galeria, cuerpo, { enlace: ["galeria.html", "Ver la galería completa"] }));
  },

  aliados(zona, pieza) {
    const principal = ((datosVivos().aliados || {}).niveles || [])[0];
    const cuerpo = h("div", { class: "nivel__grilla" });
    if (principal) {
      for (const m of principal.marcas) {
        cuerpo.append(h("figure", { class: "aliado aliado--principal" }, [
          h("img", { src: m.logo, alt: `Logo demo de ${m.nombre}`, loading: "lazy" }),
          h("figcaption", { html: m.nombre })
        ]));
      }
    }
    zona.append(seccionPortada("aliados", pieza, TITULOS_DEFECTO.aliados, cuerpo, { compacta: true, enlace: ["aliados.html", "Ver todos los niveles"] }));
  },

  /* ---- Piezas libres (dashboard, §6) ---- */
  aviso(zona, p) {
    const cuerpo = h("div", { class: "aviso" + (p.tono === "verde" ? " aviso--verde" : ""), html: `${icono(p.icono || "estrella", "aviso__icono")}<div><strong>${p.titulo || ""}</strong><p>${p.texto || ""}</p>${p.accionUrl ? `<a class="enlace-flecha" href="${p.accionUrl}">${p.accionTexto || "Ver más"}</a>` : ""}</div>` });
    zona.append(h("section", { class: "seccion seccion--compacta", "data-insignia-seccion": true, "aria-label": p.titulo || "Aviso" }, [
      h("div", { class: "contenedor" }, [cuerpo])
    ]));
  },

  tarjeta(zona, p) {
    const cuerpo = h("article", { class: "tarjeta", style: "max-width:44rem" }, [
      h("h3", { html: p.titulo || "" }),
      h("p", { class: "texto-suave", html: p.texto || "" }),
      p.accionUrl ? h("div", { class: "tarjeta__pie" }, [
        h("a", { class: "enlace-flecha", href: p.accionUrl, html: p.accionTexto || "Ver más" })
      ]) : null
    ]);
    zona.append(h("section", { class: "seccion seccion--compacta", "data-insignia-seccion": true, "aria-label": p.titulo || "Tarjeta" }, [
      h("div", { class: "contenedor" }, [cuerpo])
    ]));
  },

  enlace(zona, p) {
    const cuerpo = h("div", { class: "centrado" }, [
      h("a", { class: `btn btn--contorno${p.grande === false ? "" : " btn--grande"}`, href: p.url || "#", html: p.texto || "Ver más" })
    ]);
    zona.append(h("section", { class: "seccion seccion--compacta", "data-insignia-seccion": true, "aria-label": p.texto || "Enlace" }, [
      h("div", { class: "contenedor" }, [cuerpo])
    ]));
  },

  cuenta(zona, p) {
    const evVivo = eventoDeVerdad(datosVivos());
    const f = p.fecha ? `${p.fecha}T00:00:00-04:00` : (evVivo.fechaInicio ? `${evVivo.fechaInicio}T00:00:00-04:00` : null);
    const celdas = ["días", "horas", "min", "seg"].map(e =>
      h("span", { class: "cuenta__celda" }, [
        h("span", { class: "cuenta__valor", "data-celda": true, html: "--" }),
        h("span", { class: "cuenta__etiqueta", html: e })
      ]));
    const cuerpo = f
      ? h("div", { class: "cuenta", "data-cuenta": true, "data-fecha": f, role: "timer", "aria-label": `Cuenta regresiva: ${p.titulo || "evento"}` }, celdas)
      : h("p", { class: "aviso", html: `${icono("calendario", "aviso__icono")}<div><strong>Cuenta sin fecha</strong><p>Define una fecha para esta pieza desde el dashboard.</p></div>` });
    const sec = seccionPortada("cuenta-" + (p.id || Date.now()), p, { kicker: "Cuenta regresiva", titulo: p.titulo || "Cuenta regresiva", intro: "" }, cuerpo, { compacta: true });
    zona.append(sec);
    if (f) iniciarCuentas();
  },

  reel(zona, p) {
    const marco = h("div", { class: "pieza-reel" }, [facadeReel(p)]);
    zona.append(h("section", { class: "seccion seccion--compacta", "data-insignia-seccion": true, "aria-label": p.titulo || "Reel destacado" }, [
      h("div", { class: "contenedor centrado" }, [
        p.titulo ? h("h2", { html: p.titulo }) : null,
        p.texto ? h("p", { class: "texto-suave", style: "margin-block:.5rem 1rem", html: p.texto }) : null,
        marco
      ])
    ]));
  },

  carrusel(zona, p) {
    const items = Array.isArray(p.items) ? p.items : [];
    if (!items.length) return;
    let idx = 0;
    const ventana = h("div", { class: "carrusel-manual__ventana" });
    const pintar = () => {
      ventana.replaceChildren(
        h("article", { class: "tarjeta" }, [
          h("h3", { html: items[idx].titulo || "" }),
          h("p", { class: "texto-suave", html: items[idx].texto || "" }),
          items[idx].accionUrl ? h("div", { class: "tarjeta__pie" }, [
            h("a", { class: "enlace-flecha", href: items[idx].accionUrl, html: items[idx].accionTexto || "Ver más" })
          ]) : null
        ])
      );
      const vivos = `${idx + 1} de ${items.length}`;
      /* alcance propio: con 2+ carruseles en la portada, cada uno anuncia el suyo */
      cuerpo.querySelectorAll("[data-carrusel-pos]").forEach(n => n.textContent = vivos);
    };
    const cuerpo = h("div", { class: "carrusel-manual" }, [
      ventana,
      h("div", { class: "hero__acciones" }, [
        h("button", { class: "btn btn--contorno btn--pequeno", type: "button", "aria-label": "Anterior", onclick: () => { idx = (idx - 1 + items.length) % items.length; pintar(); }, html: "←" }),
        h("span", { class: "texto-suave cifra", "data-carrusel-pos": true, "aria-live": "polite" }),
        h("button", { class: "btn btn--contorno btn--pequeno", type: "button", "aria-label": "Siguiente", onclick: () => { idx = (idx + 1) % items.length; pintar(); }, html: "→" })
      ])
    ]);
    const sec = seccionPortada("carrusel-" + (p.id || Date.now()), p, { kicker: "Carrusel", titulo: p.titulo || "Carrusel", intro: p.intro || "" }, cuerpo, { compacta: true });
    zona.append(sec);
    pintar();
  }
};

/* Puente para el dashboard: vista previa en vivo de una pieza (§6) */
window.VISTAS = {
  pieza(tipo, datos, contenedor) {
    const fn = PIEZAS_PORTADA[tipo];
    if (!fn || !contenedor) return null;
    const zona = h("div", {});
    try { fn(zona, datos || {}); } catch (e) {
      zona.append(h("p", { class: "aviso", html: `<div><strong>Esta pieza no se pudo previsualizar</strong><p>${String(e && e.message || e)}</p></div>` }));
    }
    contenedor.replaceChildren(...zona.childNodes);
    return true;
  }
};

function renderPortada() {
  const zona = $('[data-zona="portada"]');
  if (!zona) return;
  const piezas = (datosVivos().portada && Array.isArray(datosVivos().portada.piezas) && datosVivos().portada.piezas.length)
    ? datosVivos().portada.piezas
    : Object.keys(PIEZAS_PORTADA).slice(0, 7).map(t => ({ id: t, tipo: t, visible: true }));
  let i = 0;
  for (const p of piezas) {
    if (p.visible === false) continue;
    const fn = PIEZAS_PORTADA[p.tipo];
    if (!fn) continue;
    fn(zona, p);
    i++;
  }
  if (!i) {
    zona.append(h("p", { class: "aviso aviso-sin-js", html: "<div><strong>La vitrina está sin piezas</strong><p>Actívalas desde el dashboard de mantenimiento.</p></div>" }));
  }
}

/* ==========================================================================
   EVENTOS — calendario con estado real (K3)
   ========================================================================== */
function renderEventos() {
  const zona = $('[data-zona="eventos-listado"]');
  if (!zona) return;
  const grupos = [
    { id: "a-la-venta",     titulo: "Entradas a la venta", nota: "Lo que ya puedes vivir este año" },
    { id: "en-preparacion", titulo: "En preparación con fecha", nota: "En la mesa de trabajo, con día marcado" },
    { id: "en-negociacion", titulo: "En negociación", nota: "Se anuncia cuando la firma esté lista" },
    { id: "realizado",      titulo: "Realizado", nota: "Quedó en la galería «así salió»" }
  ];
  for (const g of grupos) {
    const lista = (datosVivos().eventos || []).filter(e => e.estado === g.id);
    if (!lista.length) continue;
    zona.append(h("section", { class: "nivel", "aria-labelledby": `grupo-${g.id}` }, [
      h("h2", { class: "nivel__titulo", id: `grupo-${g.id}`, html: `${g.titulo} <small>${g.nota}</small>` }),
      h("div", { class: "grilla-eventos" }, lista.map(tarjetaEvento))
    ]));
  }
}

/* ==========================================================================
   ARTISTAS — filtros letra/zona/día con conteo anunciado (§7.2.4)
   ========================================================================== */
function renderArtistas() {
  const zonaFiltros = $('[data-zona="filtros-artistas"]');
  const zonaGrid = $('[data-zona="fichas"]');
  if (!zonaFiltros || !zonaGrid) return;
  const artistas = datosVivos().artistas || [];

  const estado = { letra: "*", zona: "*", dia: "*" };
  const letras = [...new Set(artistas.map(a => a.letra))].sort();
  const zonas = [...new Set(artistas.map(a => a.zona))];
  const dias = [...new Set(artistas.map(a => a.dia))];

  const vivo = h("p", { class: "filtros__resultado", "aria-live": "polite" });
  const grupo = (etiqueta, clave, valores) => {
    const cont = h("div", { class: "filtro-grupo", role: "group", "aria-label": etiqueta }, [
      h("span", { class: "filtro-grupo__etiqueta", html: etiqueta })
    ]);
    const chip = (valor, texto) => {
      const b = h("button", {
        class: "chip chip--espacio", type: "button",
        "aria-pressed": String(estado[clave] === valor),
        html: texto
      });
      b.addEventListener("click", () => {
        estado[clave] = valor;
        $$(`.filtro-grupo[data-clave="${clave}"] .chip`, zonaFiltros).forEach(c => c.setAttribute("aria-pressed", String(c === b)));
        pintar();
      });
      return b;
    };
    cont.dataset.clave = clave;
    cont.append(chip("*", "Todas"));
    for (const v of valores) cont.append(chip(v, v));
    return cont;
  };

  zonaFiltros.append(
    grupo("Filtrar por letra", "letra", letras),
    grupo("Filtrar por zona", "zona", zonas),
    grupo("Filtrar por día", "dia", dias),
    vivo
  );

  function pintar() {
    const sel = artistas.filter(a =>
      (estado.letra === "*" || a.letra === estado.letra) &&
      (estado.zona === "*" || a.zona === estado.zona) &&
      (estado.dia === "*" || a.dia === estado.dia));
    zonaGrid.replaceChildren(...sel.map(fichaArtista));
    vivo.textContent = sel.length === artistas.length
      ? `${artistas.length} artistas invitados`
      : sel.length === 1
        ? "1 artista encontrado"
        : `${sel.length} artistas encontrados`;
    if (!sel.length) {
      zonaGrid.append(h("p", { class: "aviso", html: `${icono("estrella", "aviso__icono")}<div><strong>Sin resultados con ese filtro</strong><p>Prueba otra letra, zona o día: la lista completa siempre vuelve con «Todas».</p></div>` }));
    }
  }
  pintar();
}

/* ==========================================================================
   PROGRAMA — pestañas por día + tabla ordenable (§7.2.6)
   ========================================================================== */
function renderPrograma() {
  const zona = $('[data-zona="programa"]');
  if (!zona || !datosVivos().programa) return;
  const dias = datosVivos().programa.dias;
  let colOrden = { campo: "hora", asc: true };

  const tablist = h("div", { class: "pestanas", role: "tablist", "aria-label": "Elegir día" });
  const panel = h("div", { class: "panel-programa", role: "tabpanel" });

  const horas = b => Number(b.hora.replace(":", ""));
  const bloquesOrdenados = bloques => {
    const copia = [...bloques];
    const { campo, asc } = colOrden;
    copia.sort((x, y) => {
      if (campo === "hora") {
        const vx = horas(x), vy = horas(y);
        return asc ? vx - vy : vy - vx;
      }
      const cmp = String(x[campo]).localeCompare(String(y[campo]));
      return asc ? cmp : -cmp;
    });
    return copia;
  };

  function tablaPara(dia) {
    const th = (campo, texto) => {
      const dir = colOrden.campo === campo ? (colOrden.asc ? "ascending" : "descending") : "none";
      return h("th", { "aria-sort": dir, scope: "col" }, [
        h("button", {
          class: "orden", type: "button",
          html: `${texto} ${dir === "ascending" ? "▲" : dir === "descending" ? "▼" : "↕"}`,
          onclick: () => {
            colOrden = { campo, asc: colOrden.campo === campo ? !colOrden.asc : true };
            pintarPanel(dia);
          }
        })
      ]);
    };
    const tbody = h("tbody", {}, bloquesOrdenados(dia.bloques).map(b =>
      h("tr", {}, [
        h("td", { class: "col-hora", html: `${b.hora}–${b.fin}` }),
        h("td", {}, [h("strong", { html: b.titulo })]),
        h("td", { class: "col-escenario", html: b.escenario }),
        h("td", { class: "col-tipo", html: b.tipo })
      ])));
    return h("div", { class: "tabla-envoltura" }, [
      h("table", { class: "tabla" }, [
        h("caption", { html: `${dia.etiqueta} · ${dia.bloques.length} actividades` }),
        h("thead", {}, [h("tr", {}, [th("hora", "Hora"), th("titulo", "Actividad"), th("escenario", "Escenario"), th("tipo", "Tipo")])]),
        tbody
      ])
    ]);
  }

  function pintarPanel(diaActivo) {
    panel.setAttribute("aria-labelledby", `tab-${diaActivo.id}`);
    panel.replaceChildren(tablaPara(diaActivo));
  }

  dias.forEach((dia, i) => {
    const btn = h("button", {
      class: "pestana", type: "button", role: "tab",
      id: `tab-${dia.id}`, "aria-selected": String(i === 0),
      "aria-controls": "panel-programa",
      html: dia.etiqueta,
      onclick: () => {
        $$(".pestana", tablist).forEach(b => b.setAttribute("aria-selected", String(b === btn)));
        pintarPanel(dia);
      }
    });
    tablist.append(btn);
  });

  panel.id = "panel-programa";
  zona.append(tablist, panel);
  pintarPanel(dias[0]);

  /* Navegación por flechas entre pestañas */
  tablist.addEventListener("keydown", e => {
    const tabs = $$(".pestana", tablist);
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
    if (j !== null) { tabs[j].focus(); tabs[j].click(); }
  });
}

/* ==========================================================================
   GALERÍA — embeds diferidos al tocar (§7.2.7, K1)
   ========================================================================== */
function renderGaleria() {
  const zona = $('[data-zona="galeria-listado"]');
  if (!zona || !datosVivos().galeria) return;
  for (const p of datosVivos().galeria.piezas) {
    const clase = `galeria__pieza ${p.clase ? "galeria__pieza--" + p.clase : ""}`;
    if (p.tipo === "foto") {
      zona.append(h("figure", { class: clase }, [
        h("img", { src: p.src, alt: p.alt, loading: "lazy" }),
        h("figcaption", { class: "galeria__pie", html: p.alt })
      ]));
    } else {
      const fig = h("figure", { class: clase }, [
        facadeReel({ ...p, titulo: p.titulo }),
        h("figcaption", { class: "galeria__pie", html: p.titulo })
      ]);
      zona.append(fig);
    }
  }
}

/* ==========================================================================
   ALIADOS — vitrina por niveles (§7.2.5)
   ========================================================================== */
function renderAliados() {
  const zona = $('[data-zona="niveles"]');
  if (!zona || !datosVivos().aliados) return;
  for (const nivel of datosVivos().aliados.niveles) {
    zona.append(h("section", { class: `nivel nivel--${nivel.id}`, "aria-labelledby": `nivel-${nivel.id}` }, [
      h("h2", { class: "nivel__titulo", id: `nivel-${nivel.id}`, html: `${nivel.nombre} <small>${nivel.nota}</small>` }),
      h("div", { class: "nivel__grilla" }, nivel.marcas.map(m => {
        const fig = h("figure", { class: `aliado aliado--${nivel.id}` }, [
          h("img", { src: m.logo, alt: `Logo demo de ${m.nombre}`, loading: "lazy" }),
          h("figcaption", { html: m.nombre })
        ]);
        if (m.url) fig.append(h("a", { href: m.url, target: "_blank", rel: "noopener", html: "Visitar" }));
        return fig;
      }))
    ]));
  }
  const kit = $('[data-zona="mediakit"]');
  if (kit && datosVivos().aliados.mediaKitUrl) {
    kit.append(h("a", { class: "btn btn--contorno", href: datosVivos().aliados.mediaKitUrl, html: "Descargar media kit" }));
  }
}

/* ==========================================================================
   NORMAS — secciones sí/no (§7.2.9)
   ========================================================================== */
function renderNormas() {
  const zona = $('[data-zona="normas"]');
  if (!zona || !datosVivos().normas) return;
  for (const s of datosVivos().normas.secciones) {
    const cuerpo = s.pares
      ? h("div", { class: "norma__pares" }, [
          h("div", { class: "si-no si-no--si" }, [h("h4", { html: "Sí se puede" }), h("ul", {}, s.pares.si.map(x => h("li", { html: x })))]),
          h("div", { class: "si-no si-no--no" }, [h("h4", { html: "No se permite" }), h("ul", {}, s.pares.no.map(x => h("li", { html: x })))])
        ])
      : h("ul", { class: "lista-simple" }, s.lista.map(x => h("li", { html: x })));
    zona.append(h("article", { class: "norma", id: s.id }, [
      h("h3", { html: `${icono(s.icono, "icono")} ${s.titulo}` }),
      h("p", { class: "texto-suave", html: s.intro }),
      cuerpo
    ]));
  }
}

/* ==========================================================================
   CONTACTO — vías + preguntas frecuentes
   ========================================================================== */
function renderContacto() {
  const vias = $('[data-zona="vias"]');
  if (vias && datosVivos().contacto) {
    for (const v of datosVivos().contacto.vias) {
      vias.append(h("div", { class: "via" }, [
        h("span", { html: icono(v.icono) }),
        h("div", {}, [
          h("h3", { html: v.titulo }),
          h("p", { html: v.texto }),
          h("a", { href: v.accion.url, target: v.accion.url.startsWith("http") ? "_blank" : null, rel: "noopener", html: v.accion.texto })
        ])
      ]));
    }
  }
  const faq = $('[data-zona="faq"]');
  if (faq && datosVivos().contacto) {
    for (const q of datosVivos().contacto.faq) {
      faq.append(h("details", {}, [
        h("summary", { html: q.p }),
        h("p", { html: q.r })
      ]));
    }
  }
}

/* ==========================================================================
   ESPACIOS — la misma librería, acento propio (§7.2.13)
   ========================================================================== */
/* ==========================================================================
   CINTA INFINITA · marquesina de datos del evento vigente (MEJORA 04/11)
   CSS puro (la animación vive en componentes.css). Decorativa: repite datos
   que ya están en la página, por eso va aria-hidden y el texto real se lee
   en el hero. Las dos pistas son idénticas: el bucle cierra sin costura.
   ========================================================================== */
function construirCinta(items) {
  if (!items || !items.length) return null;
  /* El track necesita DOS grupos idénticos para que translateX(-50%) cierre
     el bucle sin hueco. El segundo se oculta a lectores de pantalla. */
  const grupo = (oculto) => {
    const g = h("div", { class: "franja__grupo" });
    if (oculto) g.setAttribute("aria-hidden", "true");
    items.forEach((it) => {
      const clase = "franja__item" + (it.tono ? " franja__item--" + it.tono : "");
      g.append(h("span", { class: clase, html: it.texto }));
    });
    return g;
  };
  return h("div", { class: "franja", "data-cinta-infinito": true }, [
    h("div", { class: "franja__pista" }, [grupo(false), grupo(true)])
  ]);
}

function itemsDeCinta() {
  const ev = eventoDeVerdad(datosVivos());   /* F0: fuente única */
  const disciplinas = (datosVivos().cintaDisciplinas || []);
  const items = [];
  if (ev.nombre) items.push({ texto: ev.nombre, tono: "acento" });
  if (ev.fechaInicio) items.push({ texto: fechaRango(ev.fechaInicio, ev.fechaFin), tono: "verde" });
  if (ev.ciudad) items.push({ texto: ev.ciudad, tono: "perla" });
  disciplinas.forEach((d) => items.push({ texto: d }));
  if (ev.nivelTexto) items.push({ texto: ev.nivelTexto, tono: "perla" });
  return items;
}

function renderEspacio() {
  const espacio = datosVivos().espacios && datosVivos().espacios[PAGINA];
  if (!espacio) return;
  const zona = $('[data-zona="espacio"]');
  if (zona) {
    const destacado = espacio.destacado;
    zona.append(
      /* Cinta infinita de disciplinas: da movimiento a la puerta sin tapar
         el texto de lectura (CSS puro, decorativa). */
      construirCinta(itemsDeCinta()) || "",
      h("div", { class: "destacado-espacio" }, [
        h("h2", { html: destacado.titulo }),
        destacado.estado ? estadoBadge({ estado: destacado.estado }) : null,
        h("p", { class: "texto-suave", html: destacado.texto }),
        destacado.accion ? h("a", { class: "btn btn--espacio", href: destacado.accion.url, html: destacado.accion.texto }) : null
      ]),
      h("ul", { class: "lista-simple" }, espacio.lista.map(x => h("li", {}, [h("strong", { html: `${x.titulo}: ` }), x.texto])))
    );
  }
  const cabecera = $('[data-zona="espacio-cabecera"]');
  if (cabecera) {
    cabecera.querySelector(".kicker").textContent = espacio.kicker;
    cabecera.querySelector("h1").textContent = espacio.titulo;
    cabecera.querySelector(".entradilla").textContent = espacio.entradilla;
  }
  /* Puertas hermanas para seguir navegando la vitrina */
  const hermanas = $('[data-zona="hermanas"]');
  if (hermanas && datosVivos().puertas) {
    const otras = datosVivos().puertas.filter(p => p.id !== PAGINA).slice(0, 3);
    hermanas.append(...otras.map(puertaCard));
  }
}

/* ==========================================================================
   ROADMAP — el plan de crecimiento, documentado (§11, Fase 4)
   Estados honestos del crecimiento (no son estados de evento, K3):
   documentado · en estudio · en negociacion. Sin fechas inventadas.
   ========================================================================== */
const ESTADOS_ROADMAP = {
  "documentado": "Documentado · listo para arrancar",
  "en estudio": "En estudio",
  "en negociacion": "En negociación"
};

function renderRoadmap() {
  const zona = $('[data-zona="camino"]');
  if (!zona || !datosVivos().roadmap) return;
  const roadmap = datosVivos().roadmap;
  if (roadmap.nota) {
    zona.append(h("p", { class: "camino__nota texto-suave", html: roadmap.nota }));
  }
  const ol = h("ol", { class: "camino" });
  (roadmap.items || []).forEach((item, i) => {
    const claseEstado = String(item.estado || "").replace(" ", "-");
    ol.append(h("li", { class: "camino__paso", id: `paso-${item.id}` }, [
      h("p", { class: "camino__num", "aria-hidden": "true", html: String(i + 1).padStart(2, "0") }),
      h("div", { class: "camino__cuerpo" }, [
        h("h3", { html: item.titulo }),
        h("p", { class: `estado estado--${claseEstado}`, html: ESTADOS_ROADMAP[item.estado] || item.estado }),
        h("p", { class: "texto-suave", html: item.descripcion || "" }),
        item.resuelve ? h("p", { class: "camino__resuelve", html: `<strong>Qué resuelve:</strong> ${item.resuelve}` }) : null,
        item.enlace ? h("a", { class: "enlace-flecha", href: item.enlace.url, html: item.enlace.texto }) : null
      ])
    ]));
  });
  zona.append(ol);
}

/* ==========================================================================
   DESPACHO
   ========================================================================== */
const RENDERIZADORES = {
  inicio:    renderPortada,
  eventos:   renderEventos,
  /* La puerta «Artistas» vive en la página núcleo artistas.html: espacio
     Artist Alley + invitados con filtros (§5.3 y §5 hub) */
  artistas:  () => { renderEspacio(); renderArtistas(); },
  programa:  renderPrograma,
  galeria:   renderGaleria,
  normas:    renderNormas,
  aliados:   renderAliados,
  contacto:  renderContacto,
  roadmap:   renderRoadmap,
  otaku:     renderEspacio,
  gamers:    renderEspacio,
  kpop:      renderEspacio,
  cosplay:   renderEspacio,
  mercado:   renderEspacio
};

document.addEventListener("DOMContentLoaded", () => {
  const fn = RENDERIZADORES[PAGINA];
  if (fn) fn();
});
