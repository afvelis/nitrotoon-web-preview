/* ==========================================================================
   NITROTOON · editor-secciones.js — EDITOR DE LA VITRINA POR SECCIONES (F1)
   --------------------------------------------------------------------------
   Reemplaza la rejilla de "piezas" por tarjetas con el vocabulario de la
   portada: Evento vigente, Cinta, Puertas, Avisos, Calendario, Invitados,
   Así salió, Aliados.

   IDEAS QUE MANDA ESTE ARCHIVO
   1. LA ESTRUCTURA ESTÁ CONGELADA. Aquí solo se editan DATOS. Ningún botón
      de este archivo crea, borra ni reordena secciones: se cambian textos e
      imágenes y nada más.
   2. NUNCA SE BLOQUEA AL ESCRIBIR. El semáforo avisa cuando un texto se
      pasa de lo que el diseño aguanta, pero no impide seguir: una frase
      larga se ve apretada, no rompe la web.
   3. DOS CONTROLES DISTINTOS, NO UNO. «Ocultar en mi vista» es un borrador
      privado (el público no se entera). «Retirar del sitio» sí despublica y
      por eso pide confirmación y se marca en rojo.
   4. SE PUEDE DESHACER. Cada cambio deja un punto de retorno.
   5. TODO SE GUARDA SOLO y sobrevive a cerrar el navegador (localStorage).

   Depende de: vitrina.js ($ , $$, h, icono) y secciones.js (window.SECCIONES).
   No toca window.NITROTOON_DATA: eso lo gobierna admin.js, que es quien
   guarda el borrador. Este módulo pide los cambios por callback.
   ========================================================================== */
"use strict";

(function () {

  const SEC = window.SECCIONES;
  if (!SEC) return;

  /* ---- Estado local del editor ------------------------------------------ */
  let contexto = {
    datos: () => ({}),      /* devuelve el borrador vivo */
    alCambiar: () => {},    /* avisa a admin.js para que guarde y repinte */
    alEnfocar: () => {},    /* avisa qué sección se está editando */
    previewDe: () => {}     /* pinta la vista previa de una sección */
  };

  let deshacer = [];          /* puntos de retorno, máximo 50 */
  const MAX_DESHACER = 50;
  let tarjetas = {};          /* id de sección → nodo, para no repintar todo */

  /* ==========================================================================
     1 · UTILIDADES
     ========================================================================== */
  const clonar = x => JSON.parse(JSON.stringify(x));

  function anotarParaDeshacer() {
    const estado = clonar(contexto.datos());
    const ultimo = deshacer[deshacer.length - 1];
    /* no apilar estados idénticos */
    if (ultimo && JSON.stringify(ultimo) === JSON.stringify(estado)) return;
    deshacer.push(estado);
    if (deshacer.length > MAX_DESHACER) deshacer.shift();
    actualizarBotonDeshacer();
  }

  function actualizarBotonDeshacer() {
    const btn = document.getElementById("btn-deshacer");
    if (btn) {
      btn.disabled = deshacer.length === 0;
      btn.textContent = deshacer.length ? `↶ Deshacer (${deshacer.length})` : "↶ Deshacer";
    }
  }

  function puedeDeshacer() { return deshacer.length > 0; }

  function deshacerCambio() {
    if (!deshacer.length) return false;
    const estado = deshacer.pop();
    contexto.reemplazar(estado);
    actualizarBotonDeshacer();
    return true;
  }

  /* ==========================================================================
     2 · SEMÁFORO
     ========================================================================== */
  const CLASE_NIVEL = { holgado: "semaforo--verde", justo: "semaforo--ambar", largo: "semaforo--rojo" };

  function pintarSemaforo(nodo, campo, valor) {
    const r = SEC.evaluar(valor, campo);
    nodo.className = "semaforo " + (CLASE_NIVEL[r.nivel] || "");
    nodo.textContent = r.mensaje;
    nodo.setAttribute("data-nivel", r.nivel);
    return r;
  }

  /* ==========================================================================
     3 · UN CAMPO DE TEXTO
     ========================================================================== */
  function campoTexto(seccion, campo, datos) {
    /* LECTURA: en la sección del evento, el nombre, las fechas y la ciudad
       pueden ser «__HEREDADO__» en `eventoVigente`. Para que el campo muestre
       el valor REAL (no un marcador ni un hueco), se lee del evento resuelto
       por la fuente única cuando hace falta.
       ESCRITURA: siempre sobre el borrador crudo, que es lo que se publica. */
    const bruto = SEC.leerRuta(datos, campo.ruta);
    const leerDe = (bruto === "__HEREDADO__" && typeof window.NITROTOON_EVENTO === "function")
      ? ambienteEvento(datos)
      : datos;
    const actual = SEC.leerRuta(leerDe, campo.ruta);
    const idCampo = `campo-${seccion.id}-${campo.clave}`;
    const esLista = campo.tipo === "lista";
    const esLargo = campo.tipo === "parrafo" || esLista;
    const soloLectura = (seccion.camposSoloLectura || []).some(c => c.clave === campo.clave);

    const entrada = esLargo
      ? h("textarea", { id: idCampo, rows: esLista ? Math.max(4, (actual || []).length + 1) : 4 })
      : h("input", { id: idCampo, type: "text" });
    entrada.value = esLista ? (actual || []).join("\n") : (actual === undefined || actual === null ? "" : String(actual));
    if (soloLectura) {
      entrada.readOnly = true;
      entrada.setAttribute("aria-readonly", "true");
    }

    const semaforo = h("p", { class: "semaforo", "aria-live": "polite" });
    pintarSemaforo(semaforo, campo, esLista ? (actual || []) : entrada.value);

    const ayuda = h("p", { class: "campo__ayuda", html: campo.ayuda || SEC.PISTAS[campo.tipo] || "" });

    if (!soloLectura) {
      /* Un mismo cambio del usuario dispara «input» y «change». Si cada uno
         apilara un punto de retorno, harían falta DOS pulsaciones de
         deshacer para deshacer UNA edición. La marca de tiempo agrupa los
         eventos del mismo gesto en un solo paso. */
      let ultimoGesto = 0;
      const aplicar = () => {
        const bruto = entrada.value;
        const valor = esLista
          ? bruto.split("\n").map(t => t.trim()).filter(Boolean)
          : bruto;
        const ahora = Date.now();
        if (ahora - ultimoGesto > 400) {
          anotarParaDeshacer();
          ultimoGesto = ahora;
        }
        SEC.escribirRuta(datos, campo.ruta, valor);
        pintarSemaforo(semaforo, campo, esLista ? valor : bruto);
        contexto.alCambiar();
      };
      entrada.addEventListener("input", aplicar);
      entrada.addEventListener("change", aplicar);
      /* Al salir del campo, el siguiente cambio empieza un gesto nuevo. */
      entrada.addEventListener("blur", () => { ultimoGesto = 0; });
    }

    return h("div", { class: "campo" }, [
      h("div", { class: "campo__cabecera" }, [
        h("label", { for: idCampo, class: "campo__etiqueta", html: campo.etiqueta }),
        soloLectura ? h("span", { class: "campo__candado", html: "solo lectura", title: campo.ayuda || "" }) : null
      ]),
      entrada,
      semaforo,
      ayuda
    ]);
  }

  /* ==========================================================================
     4 · UN CAMPO DE IMAGEN
     --------------------------------------------------------------------------
     El archivo elegido NO se sube a ningún servidor (esta web no tiene
     backend, y así debe seguir). Se guarda en la biblioteca local del
     navegador (IndexedDB) y su ruta se anota en data.js. Al publicar, el
     usuario sube el archivo a GitHub junto al data.js, igual que hoy.
     El campo guarda DOS cosas: la ruta para data.js y el blob para poder
     generar la vista previa sin esperar a subir nada.
     ========================================================================== */
  function campoImagen(seccion, spec) {
    const medidas = `${spec.ancho}×${spec.alto} px · hasta ${spec.pesoMax} KB`;
    const datos = contexto.datos();
    const contenedor = h("div", { class: "imagen-campo" });

    /* Ruta ya publicada para este slot (si existe). */
    const rutaActual = spec.ruta || null;
    const valorActual = rutaActual ? SEC.leerRuta(datos, rutaActual) : null;

    const miniatura = h("div", { class: "imagen-campo__vista" });
    if (valorActual && typeof valorActual === "string" && /\.(jpe?g|png|webp|svg)$/i.test(valorActual)) {
      miniatura.append(h("img", { src: valorActual, alt: `Imagen actual de ${seccion.nombre}` }));
    } else {
      miniatura.append(h("p", { class: "texto-micro texto-suave", html: "Sin imagen propia: se usa la de demostración" }));
    }

    const inputArchivo = h("input", {
      type: "file", accept: "image/jpeg,image/png,image/webp,image/svg+xml",
      class: "imagen-campo__archivo", id: `img-${seccion.id}-${spec.clave}`
    });

    const estado = h("p", { class: "semaforo", "aria-live": "polite" });
    estado.textContent = "Adjunta una imagen y aquí se te dirá si sirve o no";

    const nombreArchivo = h("p", { class: "texto-micro texto-suave" });

    inputArchivo.addEventListener("change", () => {
      const archivo = inputArchivo.files && inputArchivo.files[0];
      if (!archivo) return;
      validarImagen(archivo, spec, miniatura, estado, (url, datosMedida) => {
        anotarParaDeshacer();
        /* La ruta que se escribirá en data.js: misma convención que la
           biblioteca de medios (assets/demo/…), para que al publicar el
           usuario sepa exactamente qué archivo subir y dónde. */
        const destino = `assets/demo/${slug(seccion.id)}-${slug(spec.clave)}-${Date.now().toString(36)}.${extensionDe(archivo.type)}`;
        if (rutaActual) SEC.escribirRuta(datos, rutaActual, destino);
        /* Se pide a admin.js que guarde el archivo en la biblioteca local. */
        contexto.guardarMedio({
          nombre: archivo.name,
          tipoSpec: spec.clave,
          rutaDestino: destino,
          seccion: seccion.id,
          mime: archivo.type,
          peso: archivo.size,
          ancho: datosMedida.ancho,
          alto: datosMedida.alto,
          blob: archivo
        });
        nombreArchivo.textContent = `Se publicará como: ${destino}`;
        contexto.alCambiar();
      });
    });

    contenedor.append(
      h("div", { class: "imagen-campo__cabecera" }, [
        h("strong", { html: spec.etiqueta }),
        h("span", { class: "texto-micro texto-suave", html: medidas })
      ]),
      h("p", { class: "campo__ayuda", html: spec.ayuda }),
      miniatura,
      h("label", { class: "btn btn--contorno btn--pequeno imagen-campo__boton", for: inputArchivo.id, html: "📎 Adjuntar imagen" }),
      inputArchivo,
      estado,
      nombreArchivo
    );
    return contenedor;
  }

  function slug(texto) {
    return String(texto || "").toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "imagen";
  }

  function extensionDe(mime) {
    return { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/svg+xml": "svg" }[mime] || "jpg";
  }

  /* Validación honesta: se avisa de todo, se bloquea solo lo que rompería.
     Regla del proyecto: el formato equivocado o un peso extremo sí se
     bloquean; una medida algo corta se acepta con consejo.                  */
  function validarImagen(archivo, spec, miniatura, estado, alAceptar) {
    const mimesOk = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    const pesoKB = Math.round(archivo.size / 1024);

    const marcar = (nivel, texto) => {
      estado.className = "semaforo " + (CLASE_NIVEL[nivel] || "");
      estado.textContent = texto;
      estado.setAttribute("data-nivel", nivel);
    };

    if (!mimesOk.includes(archivo.type)) {
      marcar("largo", `«${archivo.name}» no es una imagen que la web pueda usar. Usa JPG, PNG, WebP o SVG.`);
      return;
    }

    const esSvg = archivo.type === "image/svg+xml";
    const url = URL.createObjectURL(archivo);

    const mostrar = () => {
      miniatura.replaceChildren(h("img", { src: url, alt: `Vista previa de ${archivo.name}` }));
    };

    if (esSvg) {
      mostrar();
      if (pesoKB > spec.pesoMax) marcar("justo", `${pesoKB} KB · algo pesado para el diseño (ideal ≤ ${spec.pesoMax} KB), pero un SVG no pierde calidad.`);
      else marcar("holgado", `${pesoKB} KB · SVG aceptado. Al publicar subirás este archivo a la carpeta assets/ de GitHub.`);
      alAceptar(url, { ancho: spec.ancho, alto: spec.alto });
      return;
    }

    const img = new Image();
    img.onload = () => {
      mostrar();
      const w = img.naturalWidth, h_ = img.naturalHeight;
      const proporcion = w / h_;
      const esperada = spec.ancho / spec.alto;
      const desvio = Math.abs(proporcion - esperada) / esperada;

      if (pesoKB > spec.pesoMax * 2) {
        marcar("largo", `${pesoKB} KB es demasiado peso (máximo ${spec.pesoMax} KB). Comprímela antes de subirla.`);
        return;
      }
      let nivel = "holgado";
      let texto = `${w}×${h_} px · ${pesoKB} KB · encaja bien.`;

      /* El diagnóstico más IMPORTANTE va primero: una foto con la proporción
         equivocada se recorta aunque tenga resolución de sobra (1920×400 no
         es pequeña, está mal de forma). Antes se comprobaba la medida primero
         y el mensaje salía confuso. */
      const cortaAncho = w < spec.ancho;
      const cortaAlto = h_ < spec.alto;
      if (desvio > 0.15) {
        nivel = "justo";
        texto = `${w}×${h_} px · la proporción no es la esperada (${spec.ancho}×${spec.alto} ≈ ${(spec.ancho / spec.alto).toFixed(2)}:1, esta es ${proporcion.toFixed(2)}:1). El diseño recortará los bordes.`;
        if (cortaAncho || cortaAlto) texto += ` Además es pequeña: tendría que medir al menos ${spec.ancho}×${spec.alto}.`;
      } else if (cortaAncho || cortaAlto) {
        nivel = "justo";
        texto = `${w}×${h_} px · algo pequeña para ${spec.ancho}×${spec.alto}. Se verá algo borrosa en pantallas grandes.`;
      }
      if (pesoKB > spec.pesoMax) {
        nivel = "justo";
        texto += ` Además pesa ${pesoKB} KB (ideal ≤ ${spec.pesoMax} KB): tardará en cargar en el móvil.`;
      }
      marcar(nivel, texto);
      alAceptar(url, { ancho: w, alto: h_ });
    };
    img.onerror = () => {
      marcar("largo", `No se pudo leer «${archivo.name}». Puede estar dañado.`);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  /* ==========================================================================
     5 · LOS DOS CONTROLES DE VISIBILIDAD
     ========================================================================== */
  function controlesVisibilidad(seccion, datos) {
    const pieza = piezaDeSeccion(seccion, datos);

    /* Si la sección no es una pieza de la portada (la cinta vive dentro del
       hero), no hay nada que ocultar ni retirar: se dice y no se dibujan
       casillas que no harían nada. Un checkbox inerte es peor que ninguno. */
    if (!pieza) {
      return h("p", {
        class: "texto-micro texto-suave seccion__nota-sin-controles",
        html: seccion.piezaId === null
          ? "Va dentro de otra sección, así que se muestra u oculta con ella."
          : "No se encontró su pieza en la portada."
      });
    }

    const fila = h("div", { class: "seccion__controles" });   /* se declara ANTES de los listeners */

    /* 1 · Borrador privado: no afecta al público */
    const idOculto = `oculto-${seccion.id}`;
    const chkOculto = h("input", { type: "checkbox", id: idOculto });
    chkOculto.checked = !!(pieza && pieza.ocultaEnEditor);
    chkOculto.addEventListener("change", () => {
      if (pieza) pieza.ocultaEnEditor = chkOculto.checked;
      fila.classList.toggle("seccion--oculta", chkOculto.checked);
      contexto.alCambiar();
    });
    const etiquetaOculto = h("label", { class: "control-suave", for: idOculto, title: "Solo afecta a tu vista mientras trabajas. El público sigue viendo la sección." }, [
      chkOculto, h("span", { html: "Ocultar en mi vista" })
    ]);

    /* 2 · Despublicar: sí afecta al público */
    const idPublico = `retirar-${seccion.id}`;
    const chkPublico = h("input", { type: "checkbox", id: idPublico });
    chkPublico.checked = !!(pieza && pieza.visible === false);
    const etiquetaPublico = h("label", { class: "control-peligro", for: idPublico }, [
      chkPublico, h("span", { html: "Retirar del sitio" })
    ]);
    if (seccion.intangible) {
      chkPublico.disabled = true;
      etiquetaPublico.title = seccion.nota || "Esta sección no se puede retirar.";
    } else {
      chkPublico.addEventListener("change", () => {
        if (!pieza) return;
        if (chkPublico.checked) {
          const ok = window.confirm(
            `¿Retirar «${seccion.nombre}» del sitio público?\n\n` +
            "Dejará de verse para todo el mundo en cuanto subas los cambios a GitHub. " +
            "No se borra nada: puedes volver a activarla cuando quieras."
          );
          if (!ok) { chkPublico.checked = false; return; }
        }
        anotarParaDeshacer();
        pieza.visible = !chkPublico.checked;
        fila.classList.toggle("seccion--retirada", chkPublico.checked);
        contexto.alCambiar();
      });
    }

    fila.append(etiquetaOculto, etiquetaPublico);
    if (pieza && pieza.visible === false) fila.classList.add("seccion--retirada");
    return fila;
  }

  /* La pieza de portada que corresponde a una sección. Se usa `piezaId`
     DECLARADO en el mapa, no el id de la sección: los nombres del editor
     («calendario») no tienen por qué coincidir con los de la portada
     («eventos»), y adivinarlo por el tipo daba choques (evento y cinta
     comparten la pieza «hero»). */
  function piezaDeSeccion(seccion, datos) {
    const piezas = (datos.portada && datos.portada.piezas) || [];
    if (seccion.piezaId === null) return null;      /* no es una pieza */
    const id = seccion.piezaId || seccion.id;
    return piezas.find(p => p.id === id) || null;
  }

  /* ==========================================================================
     6 · UNA TARJETA DE SECCIÓN
     ========================================================================== */
  function tarjetaSeccion(seccion) {
    const datos = contexto.datos();
    const cuerpo = h("div", { class: "seccion__cuerpo", id: `cuerpo-${seccion.id}` });

    /* Campos de texto editables */
    for (const campo of seccion.campos) {
      cuerpo.append(campoTexto(seccion, campo, datos));
    }
    /* Campos de solo lectura (las fechas del evento): siempre desde la fuente única */
    for (const campo of (seccion.camposSoloLectura || [])) {
      cuerpo.append(campoTexto(seccion, campo, ambienteEvento(datos)));
    }
    /* Imágenes */
    for (const spec of (seccion.imagenes || [])) {
      cuerpo.append(campoImagen(seccion, spec));
    }
    if (!seccion.campos.length && !(seccion.imagenes || []).length && !(seccion.camposSoloLectura || []).length) {
      cuerpo.append(h("p", { class: "texto-suave", html: seccion.nota || "Esta sección se compone sola con los datos de las demás." }));
    }
    if (seccion.nota && (seccion.campos.length || (seccion.imagenes || []).length)) {
      cuerpo.append(h("p", { class: "campo__nota", html: seccion.nota }));
    }

    /* Botón «ver en la portada» */
    const btnVer = h("button", { class: "btn btn--contorno btn--pequeno", type: "button", html: "Ver en la portada" });
    btnVer.addEventListener("click", () => {
      activa(seccion.id);
      contexto.previewDe(seccion);
    });

    const tituloH3 = h("h3", { id: `titulo-${seccion.id}`, html: seccion.nombre });
    const cabecera = h("div", { class: "seccion__cabecera" }, [
      h("div", { class: "seccion__titulo" }, [
        tituloH3,
        h("span", { class: "texto-micro texto-suave", html: seccion.donde })
      ]),
      h("div", { class: "seccion__acciones" }, [btnVer])
    ]);

    const resumen = h("p", { class: "seccion__resumen", html: seccion.resumen });
    const controles = controlesVisibilidad(seccion, datos);

    const nodo = h("section", {
      class: "seccion-editor" + (seccion.intangible ? " seccion-editor--fija" : ""),
      "data-seccion": seccion.id,
      "aria-labelledby": `titulo-${seccion.id}`
    }, [cabecera, resumen, controles, cuerpo]);

    if (seccion.intangible) {
      nodo.append(h("p", { class: "campo__nota campo__nota--fija", html: seccion.nota || "" }));
    }
    return nodo;
  }

  /* Los campos de solo lectura y los heredados del evento viven resueltos:
     se leen del resolvedor de la fuente única para mostrar el valor real. */
  function datosFuente(seccion, datos) {
    if (seccion.id === "evento" && typeof window.NITROTOON_EVENTO === "function") {
      return window.NITROTOON_EVENTO(datos);
    }
    return datos;
  }

  /* El evento resuelto conserva las MISMAS rutas (`eventoVigente.nombre`),
     así que se envuelve el resultado en la misma forma para poder leerlo
     con las rutas del mapa sin ramificar el código. */
  function ambienteEvento(datos) {
    const resuelto = window.NITROTOON_EVENTO(datos);
    return Object.assign({}, datos, { eventoVigente: resuelto });
  }

  /* ==========================================================================
     7 · PINTAR EL EDITOR COMPLETO
     ========================================================================== */
  let activaId = null;

  function activa(id) {
    activaId = id;
    for (const [clave, nodo] of Object.entries(tarjetas)) {
      nodo.classList.toggle("seccion-editor--activa", clave === id);
    }
  }

  function pintar(raiz) {
    const contenedor = raiz || document.getElementById("editor-secciones");
    if (!contenedor) return;
    contenedor.replaceChildren();
    tarjetas = {};
    const datos = contexto.datos();
    const lista = SEC.lista;

    for (const seccion of lista) {
      const nodo = tarjetaSeccion(seccion);
      tarjetas[seccion.id] = nodo;
      const pieza = piezaDeSeccion(seccion, datos);
      if (pieza && pieza.visible === false) nodo.classList.add("seccion--retirada");
      contenedor.append(nodo);
    }

    /* Tarjeta informativa al final: qué no se puede tocar y por qué */
    contenedor.append(h("section", { class: "seccion-editor seccion-editor--info" }, [
      h("h3", { html: "Lo que este editor no toca (a propósito)" }),
      h("ul", { class: "lista-puntos" }, [
        h("li", { html: "<strong>El diseño:</strong> colores, tipografías, tamaños y animaciones. Cambiarlos requiere al taller." }),
        h("li", { html: "<strong>El orden de las secciones:</strong> siempre es el mismo. Así la web no se desarma por accidente." }),
        h("li", { html: "<strong>Las páginas interiores:</strong> Eventos, Artistas, Programa… tienen su propio contenido, que se edita en sus fichas." })
      ])
    ]));

    actualizarBotonDeshacer();
  }

  /* ==========================================================================
     8 · API PÚBLICA
     ========================================================================== */
  window.EDITOR_SECCIONES = {
    /** Conecta el editor con el borrador de admin.js. */
    configurar(opciones) {
      Object.assign(contexto, opciones || {});
    },
    /** Dibuja (o redibuja) todas las tarjetas dentro de `raiz`. */
    pintar,
    /** Vuelve al estado anterior. Devuelve true si deshizo algo. */
    deshacer: deshacerCambio,
    puedeDeshacer,
    /** Vacía la pila al descartar un borrador. */
    reiniciarHistorial() {
      deshacer = [];
      actualizarBotonDeshacer();
    },
    /** Sección activa en este momento. */
    seccionActiva: () => activaId,
    activa
  };
})();
