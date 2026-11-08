/* ==========================================================================
   NITROTOON · secciones.js — MAPA DE LA VITRINA PARA EL EDITOR (F1)
   --------------------------------------------------------------------------
   Este archivo es el CONTRATO entre la portada y el administrador.

   Aquí se declara, sección por sección:
     · dónde vive el dato en data.js  (la ruta exacta)
     · qué etiqueta ve el usuario     (en español llano, sin jerga)
     · cuántos caracteres caben       (MEDIDOS sobre el diseño real)
     · qué tipo de campo es           (texto corto, párrafo, lista, fecha…)

   POR QUÉ EXISTE: el usuario no debe saber qué es `hero__nota` ni
   `eventoVigente.bajada`. Debe leer "Bajada del hero" y "caben 380 letras".
   Si mañana el diseño cambia, se cambia AQUÍ y el editor se entera solo:
   ninguna otra parte del administrador escribe rutas de data.js a mano.

   LOS LÍMITES NO SON INVENTADOS. Se derivan de las medidas reales del CSS:
     · `.hero__titulo`    → max-width: 20ch     (2 líneas a 1,05 de alto)
     · `.hero__nota`      → max-width: 42rem    (7 líneas de lectura cómoda)
     · `.hero__kicker`    → una sola línea, sin salto
     · `.intro h1`        → max-width: 16ch
     · tarjetas y fichas  → anchura fija de columna
   Donde un límite depende de la pantalla (el mismo texto se ve distinto en
   un móvil y en un monitor), se marca `aproximado: true` y el editor lo
   dice con honestidad: «cabrán unos N; en pantalla pequeña, algo menos».
   ========================================================================== */
"use strict";

(function () {
  /* Niveles del semáforo. Un texto puede pasarse sin romper la web: por eso
     nunca se prohíbe escribir, solo se avisa. */
  const NIVEL = { holgado: "holgado", justo: "justo", largo: "largo" };

  /* Un campo de la sección.
       clave     · nombre interno
       etiqueta  · lo que lee el usuario
       ruta      · dónde vive en el objeto de datos (notación con puntos)
       tipo      · texto | parrafo | lista | fecha | url | numero
       ideal     · hasta aquí el diseño respira (verde)
       max       · hasta aquí aguanta (ámbar). Más allá: rojo
       ayuda     · una frase que explique el campo en lenguaje llano
       ejemplo   · el valor actual, para que se vea qué se espera        */
  const CAMPOS_EVENTO = [
    {
      clave: "nombre", etiqueta: "Nombre del evento", ruta: "eventoVigente.nombre", tipo: "texto",
      ideal: 34, max: 48, aproximado: false,
      ayuda: "Se ve enorme en la portada y en la cinta de arriba. Cambiarlo lo cambia en TODA la web.",
      ejemplo: "Torneo NitroGamers 2026"
    },
    {
      clave: "eslogan", etiqueta: "Frase de arriba", ruta: "eventoVigente.eslogan", tipo: "texto",
      ideal: 45, max: 62, aproximado: true,
      ayuda: "La línea pequeña que va sobre el título. Una sola línea, sin punto final.",
      ejemplo: "Seis disciplinas, tres niveles, una sola jornada épica"
    },
    {
      clave: "bajada", etiqueta: "Bajada (el párrafo)", ruta: "eventoVigente.bajada", tipo: "parrafo",
      ideal: 290, max: 380, aproximado: true,
      ayuda: "El texto que explica el evento bajo el título. Cabe cómodo en unas 6 u 8 líneas.",
      ejemplo: "Torneo de deportes electrónicos en Valencia: Tekken 8…"
    },
    {
      clave: "lugar", etiqueta: "Lugar (corto)", ruta: "eventoVigente.lugar", tipo: "texto",
      ideal: 22, max: 32, aproximado: false,
      ayuda: "El nombre corto que se ve en grande: la ciudad o el recinto. No uses la dirección completa aquí.",
      ejemplo: "Valencia"
    },
    {
      clave: "nivelTexto", etiqueta: "Niveles", ruta: "eventoVigente.nivelTexto", tipo: "texto",
      ideal: 38, max: 52, aproximado: false,
      ayuda: "Los niveles de competencia separados por puntos. Es lo que desfila en la cinta.",
      ejemplo: "Regional · Nacional · Internacional"
    },
    {
      clave: "entradasNota", etiqueta: "Nota de entradas", ruta: "eventoVigente.entradasNota", tipo: "parrafo",
      ideal: 140, max: 200, aproximado: true,
      ayuda: "La letra pequeña sobre el acceso. Si no hay entrada, escribe una frase de aviso.",
      ejemplo: "Aforo limitado a 200 personas con control de acceso QR…"
    }
  ];

  /* Las fechas del evento se editan en el calendario, no aquí: son fuente
     única. El editor muestra su valor pero no deja cambiarlo por separado. */
  const CAMPOS_EVENTO_SOLO_LECTURA = [
    { clave: "fechaInicio", etiqueta: "Fecha de inicio", ruta: "eventoVigente.fechaInicio", tipo: "fecha",
      ideal: 10, max: 10, aproximado: false,
      ayuda: "Se cambia en el calendario del año. Aquí solo se muestra para que no haya dos fechas distintas." },
    { clave: "fechaFin", etiqueta: "Fecha de fin", ruta: "eventoVigente.fechaFin", tipo: "fecha",
      ideal: 10, max: 10, aproximado: false,
      ayuda: "Se cambia en el calendario del año, igual que la de inicio." }
  ];

  /* ---- SECCIONES DE LA PORTADA ------------------------------------------
     El orden de este array ES el orden en que aparecen en la portada.       */
  const SECCIONES = [
    {
      id: "evento",
      piezaId: "hero",
      nombre: "Evento vigente",
      donde: "Cinta de arriba y hero",
      icono: "star",
      intangible: true,          /* no se puede retirar: la web quedaría muda */
      resumen: "El nombre, las fechas, el lugar y la bajada que visten el hero y la cinta superior. Es la sección que manda: sus datos se repiten en el calendario y en las tarjetas.",
      nota: "Esta sección no se puede ocultar: sin ella la portada no tendría nada que contar.",
      campos: CAMPOS_EVENTO,
      camposSoloLectura: CAMPOS_EVENTO_SOLO_LECTURA,
      tipoPieza: "hero",
      /* No hay imagen de fondo del hero en data.js: el hero se viste con
         CSS (degradado + estrellas). Ofrecer un «adjuntar imagen» que no
         lee nadie sería mentirle al usuario, así que no se ofrece. Cuando
         exista la propiedad, basta con añadir aquí la spec. */
      imagenes: []
    },
    {
      id: "cinta",
      nombre: "Cinta de disciplinas",
      donde: "Cierra el hero",
      icono: "reel",
      intangible: false,
      /* La cinta NO es una pieza de la portada: vive dentro del hero, así
         que no tiene interruptor de visibilidad propio. Sin `piezaId` el
         editor no dibuja los dos checkboxes. */
      piezaId: null,
      resumen: "La franja que desfila sin parar con las disciplinas del torneo. Se combina sola con el nombre, la fecha y la ciudad del evento vigente.",
      campos: [
        {
          clave: "cintaDisciplinas", etiqueta: "Disciplinas que desfilan", ruta: "cintaDisciplinas",
          tipo: "lista", ideal: 6, max: 10, aproximado: false,
          ayuda: "Una por línea. Cada una puede tener hasta 28 letras. Con más de 10 la cinta se vuelve interminable.",
          ejemplo: "Tekken 8"
        }
      ],
      tipoPieza: null,
      imagenes: []
    },
    {
      id: "puertas",
      piezaId: "puertas",
      nombre: "Puertas (el hub)",
      donde: "Debajo del hero",
      icono: "puertas",
      intangible: false,
      resumen: "Las tarjetas grandes que llevan a cada comunidad: Otaku, Gamers, KPOP, Cosplay, Artistas y Mercado.",
      campos: [],
      tipoPieza: "puertas",
      imagenes: [],
      nota: "Los textos de cada puerta se editan en su ficha de abajo, no aquí."
    },
    {
      id: "avisos",
      piezaId: "avisos",
      nombre: "Avisos",
      donde: "Franja de anuncios",
      icono: "aviso",
      intangible: false,
      resumen: "Los anuncios cortos: convocatorias, horarios, recordatorios. Aparecen justo debajo de las puertas.",
      campos: [
        {
          clave: "convocatoriaTitulo", etiqueta: "Título del aviso", ruta: "espacios.artistas.destacado.titulo",
          tipo: "texto", ideal: 40, max: 56, aproximado: false,
          ayuda: "Va en negrita mayúscula. Debe entenderse de un vistazo.",
          ejemplo: "Convocatoria de artistas abierta"
        },
        {
          clave: "convocatoriaTexto", etiqueta: "Texto del aviso", ruta: "espacios.artistas.destacado.texto",
          tipo: "parrafo", ideal: 140, max: 190, aproximado: true,
          ayuda: "Una o dos frases. Si necesitas más, es que son dos avisos.",
          ejemplo: "Envía tu portafolio antes del 15 de noviembre."
        }
      ],
      tipoPieza: "avisos",
      imagenes: [],
      nota: "Además de este aviso, la franja muestra sola cualquier evento del calendario que esté «en negociación»: no hay que escribirlo dos veces."
    },
    {
      id: "calendario",
      piezaId: "eventos",
      nombre: "Calendario del año",
      donde: "Sección de eventos",
      icono: "calendario",
      intangible: false,
      resumen: "Los eventos del año con su estado real: entradas a la venta, en preparación, en negociación o realizado. Es también la fuente de las fechas del hero.",
      campos: [],
      tipoPieza: "eventos",
      imagenes: [],
      nota: "Las fichas de cada evento se editan una por una más abajo."
    },
    {
      id: "invitados",
      piezaId: "artistas",
      nombre: "Invitados (artistas)",
      donde: "Artist Alley",
      icono: "artista",
      intangible: false,
      resumen: "Los retratos de los artistas invitados, con su nombre y su especialidad.",
      campos: [],
      tipoPieza: "artistas",
      imagenes: [
        { clave: "retratos", etiqueta: "Retratos de los invitados", ruta: null,
          ancho: 800, alto: 800, pesoMax: 250,
          ayuda: "Una foto por artista, cuadrada. El diseño recorta al centro, así que deja la cara en el medio." }
      ]
    },
    {
      id: "asiSalio",
      piezaId: "galeria",
      nombre: "Así salió (la galería)",
      donde: "Fotos de eventos pasados",
      icono: "galeria",
      intangible: false,
      resumen: "Las fotos de lo que ya ocurrió. Es la sección que más confianza da a quien nunca ha ido.",
      campos: [],
      tipoPieza: "galeria",
      imagenes: [
        { clave: "galeria", etiqueta: "Fotos de la galería", ruta: null,
          ancho: 1200, alto: 800, pesoMax: 300,
          ayuda: "Fotos horizontales del evento anterior. El diseño las muestra en formato 3:2." }
      ]
    },
    {
      id: "aliados",
      piezaId: "aliados",
      nombre: "Aliados y sponsors",
      donde: "Vitrina de marcas",
      icono: "aliado",
      intangible: false,
      resumen: "Los logos de quienes hacen posible el evento.",
      campos: [],
      tipoPieza: "aliados",
      imagenes: [
        { clave: "logos", etiqueta: "Logos de aliados", ruta: null,
          ancho: 400, alto: 400, pesoMax: 150,
          ayuda: "Con el fondo transparente (PNG o SVG) y el logo centrado. Los logos con fondo blanco se ven como recuadros." }
      ]
    }
  ];

  /* ---- ÍNDICE RÁPIDO ----------------------------------------------------- */
  const porId = {};
  for (const s of SECCIONES) porId[s.id] = s;

  /* ---- LECTURA Y ESCRITURA DE DATOS POR RUTA -----------------------------
     Una sola implementación para que nadie más manipule strings de rutas.   */
  function leerRuta(obj, ruta) {
    const partes = ruta.split(".");
    let actual = obj;
    for (const p of partes) {
      if (actual === null || actual === undefined) return undefined;
      actual = actual[p];
    }
    return actual;
  }

  function escribirRuta(obj, ruta, valor) {
    const partes = ruta.split(".");
    const ultima = partes.pop();
    let actual = obj;
    for (const p of partes) {
      if (actual[p] === null || actual[p] === undefined) actual[p] = {};
      actual = actual[p];
    }
    actual[ultima] = valor;
    return obj;
  }

  /* ---- SEMÁFORO ----------------------------------------------------------
     Devuelve el nivel y una frase en español llano. NUNCA impide escribir:
     el diseño aguanta un poco más de lo ideal sin romperse.                 */
  function evaluar(valor, campo) {
    const texto = Array.isArray(valor) ? valor.filter(Boolean) : String(valor === undefined || valor === null ? "" : valor);
    const cuenta = Array.isArray(texto) ? texto.length : texto.trim().length;
    const ideal = campo.ideal;
    const max = campo.max;
    let nivel = NIVEL.holgado;
    if (cuenta > max) nivel = NIVEL.largo;
    else if (cuenta > ideal) nivel = NIVEL.justo;

    let mensaje;
    if (campo.tipo === "fecha") {
      mensaje = cuenta ? "fecha fijada" : "sin fecha";
      if (!cuenta) nivel = NIVEL.largo;
    } else if (Array.isArray(texto)) {
      mensaje = `${cuenta} de ${max}`;
      if (nivel === NIVEL.largo) mensaje += " · se va a hacer muy larga, quita algunas";
      else if (nivel === NIVEL.justo) mensaje += " · va bien, aunque ya es una lista larga";
    } else {
      mensaje = `${cuenta} de ~${ideal}`;
      if (nivel === NIVEL.largo) mensaje += ` · se pasa: el diseño aguanta ~${max}. Puedes seguir, pero se verá apretado`;
      else if (nivel === NIVEL.justo) mensaje += " · al límite, todavía se ve bien";
      else mensaje += " · espacio de sobra";
      if (campo.aproximado) mensaje += " (aproximado: en el móvil cabrá algo menos)";
    }
    return { nivel, cuenta, ideal, max, mensaje };
  }

  /* ---- TEXTO DE AYUDA POR TIPO ------------------------------------------ */
  const PISTAS = {
    texto: "Escribe texto plano, sin negritas ni enlaces. Lo que escribas se publica tal cual.",
    parrafo: "Puedes usar dos o tres frases. Los saltos de línea se respetan.",
    lista: "Una cosa por línea. Para quitar una, borra su línea entera.",
    fecha: "Se cambia en el calendario del año para que no haya dos fechas distintas.",
    url: "Dirección completa, empezando por https://",
    numero: "Solo números."
  };

  /* ---- EXPORTACIÓN ------------------------------------------------------- */
  window.SECCIONES = {
    lista: SECCIONES,
    porId,
    leerRuta,
    escribirRuta,
    evaluar,
    PISTAS,
    NIVEL,
    /* Plantilla de una sección nueva (para el botón «añadir» del futuro) */
    plantilla(id) { return porId[id] ? JSON.parse(JSON.stringify(porId[id])) : null; }
  };
})();


