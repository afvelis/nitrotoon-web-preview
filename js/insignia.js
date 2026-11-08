/* ==========================================================================
   NITROTOON · insignia.js — la nave que vuela entre secciones (§7)
   --------------------------------------------------------------------------
   · SVG original del desarrollador: geometría descrita por el usuario
     (§7) — cohete vertical, contorno fino sin relleno, punta cónica,
     dos propulsores laterales curvos, ventana circular y llama en V
     invertida. Dorado neón sobre negro (§7.1).
   · Vuela en cada navegación interna y en cada cambio de sección de la
     portada, dejando una estela dorada.
   · RESPECTO A prefers-reduced-motion: si el visitante lo pide, la nave
     no se crea ni vuela (además base.css la oculta). K2.
   ========================================================================== */
"use strict";

(function () {
  const QUIETE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (QUIETE) return;

  const DURACION_MIN = 450;   /* ms */
  const DURACION_MAX = 850;
  const MARGEN = 70;          /* no vuela pegado al borde */
  const PARQUEO_MS = 2600;    /* tiempo en destino antes de flotar de nuevo */

  const nave = document.createElement("div");
  nave.className = "insignia";
  nave.setAttribute("aria-hidden", "true");
  /* ICONOS es un binding léxico global definido en vitrina.js (no window.*) */
  nave.innerHTML =
    (typeof ICONOS !== "undefined" && ICONOS.nave) || "";
  document.body.append(nave);

  const estela = document.createElement("div");
  estela.className = "estela";
  estela.setAttribute("aria-hidden", "true");
  document.body.append(estela);

  let posX = 0, posY = 0;      /* esquina superior izquierda actual   */
  let enVuelo = false;
  let temporizadorParqueo = null;
  let ultimoVueloAmbiente = 0;

  function colocar(x, y, rotacion, duracion) {
    nave.style.transition = duracion
      ? `transform ${duracion}ms cubic-bezier(.22,1,.36,1)`
      : "none";
    nave.style.transform = `translate(${x}px, ${y}px) rotate(${rotacion}deg)`;
  }

  function estirarEstela(x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1;
    const distancia = Math.hypot(dx, dy);
    if (distancia < 24) return;
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    estela.style.transition = "none";
    estela.style.width = `${distancia}px`;
    estela.style.left = `${x1}px`;
    estela.style.top = `${y1}px`;
    estela.style.transform = `rotate(${ang}deg)`;
    estela.dataset.activa = "true";
    /* Animación de tinte con doble rAF para garantizar el reinicio */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        estela.style.transition = "opacity .9s ease";
        estela.dataset.activa = "false";
      });
    });
  }

  function volar(xDestino, yDestino, rotacionForzada) {
    const w = nave.offsetWidth || 86;
    const h = nave.offsetHeight || 86;
    const dx = xDestino - (posX + w / 2);
    const dy = yDestino - (posY + h / 2);
    const distancia = Math.hypot(dx, dy);
    if (distancia < 8) return;

    const x2 = Math.min(Math.max(xDestino - w / 2, MARGEN), innerWidth - w - MARGEN);
    const y2 = Math.min(Math.max(yDestino - h / 2, MARGEN), innerHeight - h - MARGEN);
    const rotacion = rotacionForzada !== undefined
      ? rotacionForzada
      : (Math.atan2(dy, dx) * 180) / Math.PI + 90;   /* la nave apunta arriba */

    enVuelo = true;
    nave.dataset.enEspera = "false";
    nave.dataset.vuela = "true";
    estirarEstela(posX + w / 2, posY + h / 2, x2 + w / 2, y2 + h / 2);
    colocar(x2, y2, rotacion, Math.min(DURACION_MAX, Math.max(DURACION_MIN, distancia * .9)));
    posX = x2; posY = y2;

    clearTimeout(temporizadorParqueo);
    temporizadorParqueo = setTimeout(() => {
      enVuelo = false;
      nave.dataset.enEspera = "true";
      /* En el parqueo, la nave mira al cielo (rotación 0) con vuelo corto */
      colocar(posX, posY, 0, DURACION_MIN);
    }, PARQUEO_MS);
  }

  function parquear() {
    const x = innerWidth - 130;
    const y = innerHeight - 170;
    colocar(x, y, 0, DURACION_MAX);
    posX = x; posY = y;
    nave.dataset.vuela = "true";
    nave.dataset.enEspera = "true";
  }

  /* --- Despegue de bienvenida: entra volando desde arriba a su esquina ---- */
  function despegar() {
    posX = -120; posY = -140;
    nave.dataset.vuela = "true";
    nave.dataset.enEspera = "false";
    colocar(posX, posY, 0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => parquear());
    });
  }

  /* --- Vuelo ambiental en la portada: cambia de sección, cambia de asiento --
     Throttle de 1.8 s para que acompañe sin marear.                      */
  function observarSecciones() {
    const secciones = $$("[data-insignia-seccion], main section[id]");
    if (!secciones.length) return;
    const observador = new IntersectionObserver(entradas => {
      const visible = entradas.filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const ahora = Date.now();
      if (enVuelo || ahora - ultimoVueloAmbiente < 1800) return;
      ultimoVueloAmbiente = ahora;
      const caja = visible.target.getBoundingClientRect();
      volar(
        Math.min(caja.right - 40, innerWidth - 150),
        Math.max(caja.top + 60, 110)
      );
    }, { threshold: [0.45] });
    secciones.forEach(s => observador.observe(s));
  }

  /* --- API pública ---------------------------------------------------------- */
  window.NaveInsignia = {
    volarHacia(x, y) { volar(x, y); }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { despegar(); observarSecciones(); });
  } else {
    despegar();
    observarSecciones();
  }

  /* Si la ventana cambia de tamaño, re-parquea sin dramatismo */
  let redimTemp = null;
  addEventListener("resize", () => {
    clearTimeout(redimTemp);
    redimTemp = setTimeout(parquear, 240);
  });
})();
