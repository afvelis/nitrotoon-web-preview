/* ==========================================================================
   NITROTOON · data.js — la vitrina entera vive aquí (§4 del prompt maestro)
   --------------------------------------------------------------------------
   · Un solo data.js alimenta TODAS las páginas (portada, núcleo y espacios).
   · En Fase 1 lo escribe el desarrollador con contenido de DEMOSTRACIÓN
     bien hecho (§8): todo lo marcado  demo: true  es plausible pero ficticio.
   · En Fase 2, el dashboard (admin.html) genera este archivo al pulsar
     «Publicar»; el administrador nunca toca código.
   · Formato: script clásico (sin módulos) para funcionar abriendo el HTML
     directamente con file:// (§3.6).
   ========================================================================== */

window.NITROTOON_DATA = {

  /* ---- Marca ----------------------------------------------------------- */
  marca: {
    nombre: "Nitrotoon",
    lema: "Una comunidad de comunidades",
    descripcion: "Nitrotoon es la comunidad geek venezolana que reúne a artistas internacionales, gamers, fandoms de KPOP, dibujantes, cosplayers, coleccionistas y familias en convenciones hechas con cariño y a pura energía.",
    redes: [
      { nombre: "Instagram", url: "https://www.instagram.com/nitrotoon/", icono: "instagram" },
      { nombre: "Facebook",  url: "https://www.facebook.com/nitrotoon/",   icono: "facebook" }
    ],
    /* El CTA de entradas apunta a un sistema externo (§11, roadmap de
       entradas propio). Demo: red de la comunidad. El administrador lo
       reemplaza desde el dashboard por la URL real de taquilla. */
    entradasUrl: "https://www.instagram.com/nitrotoon/",
    demo: true
  },

  /* ---- Evento vigente: viste el HERO y la cinta (§2) --------------------
     Ciclo actual: PRE-EVENTO (publicidad del evento vigente).
     Para post-evento: eventoVigente.ciclo = "post" y la portada muestra
     «así salió». Para varios eventos activos: ciclo = "carrusel".

     FUENTE ÚNICA (F0, 05/11/2026): el evento YA NO se escribe dos veces.
     Antes sus datos vivían aquí Y en `eventos[]`; si se cambiaba uno, el
     otro quedaba mintiendo (un torneo con dos fechas distintas en la misma
     web). Ahora esta ficha solo aporta lo que es EXCLUSIVO del hero y todo
     lo demás se hereda de la entrada del calendario apuntada por `id`.
     Para cambiar el evento vigente: se cambia `id` aquí y se edita UNA vez
     la entrada correspondiente en `eventos[]`.                             */
  eventoVigente: {
    id: "nitrogamers-2026",   /* ← la entrada de `eventos[]` que manda */
    ciclo: "pre",             /* pre · post · carrusel */
    eslogan: "Seis disciplinas, tres niveles, una sola jornada épica",
    bajada: "Torneo de deportes electrónicos en Valencia: Tekken 8, Street Fighter 6, EA Sports FC 26, Just Dance, Smash Bros. Ultimate y Call of Duty Mobile. Competencia regional, nacional e internacional con transmisión en vivo y narradores, el sábado 5 y domingo 6 de diciembre.",
    nivelTexto: "Regional · Nacional · Internacional",
    entradasNota: "Aforo limitado a 200 personas con control de acceso QR. Menores de edad participan solo con autorización escrita de su representante.",
    /* Estos tres se HEREDAN del calendario (fuente única). Si algún día hace
       falta que el hero diga algo distinto, se escribe aquí y manda esto. */
    nombre: "__HEREDADO__",
    fechaInicio: "__HEREDADO__",
    fechaFin: "__HEREDADO__",
    ciudad: "__HEREDADO__",
    /* `lugar` NO se hereda a propósito: en el hero es el nombre corto que se
       ve en grande («Valencia») y en el calendario es la dirección real
       («Sede de la marca aliada del torneo»). Son dos textos distintos. */
    lugar: "Valencia"
  },

  /* ---- Cinta infinita (MEJORA 04/11) --------------------------------------
     Ítems que desfilan en el hero y en la puerta Gamers. Se combinan con el
     nombre, la fecha y la ciudad del evento vigente. Decorativo: el texto
     real siempre está legible en el hero. Editable sin tocar código. */
  cintaDisciplinas: [
    "Tekken 8",
    "Street Fighter 6",
    "EA Sports FC 26",
    "Just Dance",
    "Super Smash Bros. Ultimate",
    "Call of Duty Mobile"
  ],

  /* ---- Calendario del año — SOLO estados reales (K3, §7.2.11) -----------
     Estados posibles: a-la-venta · en-preparacion · en-negociacion ·
     realizado. Nunca «próximamente».                                   */
  eventos: [
    {
      id: "nitrogamers-2026",
      nombre: "Torneo NitroGamers 2026",
      tipo: "Torneo de deportes electrónicos",
      estado: "en-preparacion",
      estadoTexto: "En preparación con fecha",
      fechaInicio: "2026-12-05",
      fechaFin: "2026-12-06",
      lugar: "Sede de la marca aliada del torneo",
      ciudad: "Valencia, Venezuela",
      descripcion: "El torneo gamer del año: seis disciplinas de consola, PC y móvil, competencia en tres niveles (regional, nacional e internacional) en la misma jornada, transmisión en vivo con narradores en pantalla dividida y aforo controlado para 200 personas con acceso QR. Organizado con respaldo técnico y arbitral especializado en esports. Sin brackets de humo: cuando la convocatoria abra, las bases estarán aquí.",
      puertas: ["gamers"],
      entradas: false,
      demo: false
    },
    {
      id: "nitrotoon-fest-2027",
      nombre: "Nitrotoon Fest 2027",
      tipo: "Macro evento anual",
      estado: "a-la-venta",
      estadoTexto: "Entradas a la venta",
      fechaInicio: "2027-07-17",
      fechaFin: "2027-07-18",
      lugar: "Poliedro de Caracas",
      ciudad: "Caracas, Venezuela",
      descripcion: "Nuestra convención estrella regresa con más suelo, más sombra y más puertas: artistas internacionales, torneos, concursos de cosplay, dance covers y el mercado geek más grande del país.",
      puertas: ["otaku", "gamers", "kpop", "cosplay", "artistas", "mercado"],
      entradas: true,
      demo: true
    },
    {
      id: "k-fest-2027",
      nombre: "Nitrotoon K-Fest",
      tipo: "Convención KPOP y dance covers",
      estado: "en-preparacion",
      estadoTexto: "En preparación con fecha",
      fechaInicio: "2027-03-13",
      fechaFin: null,
      lugar: "Caracas",
      ciudad: "Sede por anunciar en las redes de la comunidad",
      descripcion: "Un día entero de crews de dance covers, random play dance, talleres de fan projects y concursos de banners. El line-up de crews se publica en enero.",
      puertas: ["kpop", "mercado"],
      entradas: false,
      demo: true
    },
    {
      id: "nitrotoon-fest-2026",
      nombre: "Nitrotoon Fest 2026",
      tipo: "Macro evento anual",
      estado: "realizado",
      estadoTexto: "Realizado",
      fechaInicio: "2026-07-18",
      fechaFin: "2026-07-19",
      lugar: "Poliedro de Caracas",
      ciudad: "Caracas, Venezuela",
      descripcion: "La primera gran edición del Fest: Artist Alley a tope, la primera final de dance covers y una zona de mercado que no dejó de sonreír. Revive cómo salió en la galería.",
      puertas: [],
      entradas: false,
      galeria: "galeria.html",
      demo: true
    }
  ],

  /* ---- Artistas invitados — fichas demo (§5.3, §7.2.10) -----------------
     foto: los retratos demo son piezas SVG propias del desarrollador
     (assets/demo/). El administrador los reemplaza por JPG 800×800.     */
  artistas: [
    {
      id: "kana-mori",
      nombre: "Kana Mori",
      rol: "Ilustración y character design",
      pais: "Japón",
      bio: "Su línea limpia y sus paletas de pastel le han dado portadas a series de novelas ligeras y mazmorras virtuales que la comunidad conoce de memoria. Primera visita a Venezuela: trae prints exclusivos y un panel de proceso creativo.",
      letra: "K", zona: "Salón de firmas", dia: "Ambos días",
      redes: [{ nombre: "Instagram", url: "https://www.instagram.com/", icono: "instagram" }],
      foto: "assets/demo/retrato-kana.svg",
      demo: true
    },
    {
      id: "dako-villalba",
      nombre: "Andrés «Dako» Villalba",
      rol: "Cómic nacional",
      pais: "Venezuela",
      bio: "Autor de «Guachimanes», la serie de cómic que convirtió las esquinas de Caracas en superhéroes. Presenta el capítulo 12 en el Fest y dicta una masterclass de guion para dibujantes emergentes.",
      letra: "D", zona: "Artist Alley", dia: "Sábado",
      redes: [{ nombre: "Instagram", url: "https://www.instagram.com/", icono: "instagram" }],
      foto: "assets/demo/retrato-dako.svg",
      demo: true
    },
    {
      id: "valeria-rios",
      nombre: "Valeria Ríos",
      rol: "Actriz de doblaje",
      pais: "México",
      bio: "La voz hispana de protagonistas de anime que crecieron con toda una generación. Firmas, un panel de preguntas abiertas y una lectura dramatizada con el público como elenco sorpresa.",
      letra: "V", zona: "Salón de firmas", dia: "Ambos días",
      redes: [{ nombre: "Instagram", url: "https://www.instagram.com/", icono: "instagram" }],
      foto: "assets/demo/retrato-valeria.svg",
      demo: true
    },
    {
      id: "pixel8",
      nombre: "DJ Pixel8",
      rol: "Música chiptune",
      pais: "Chile",
      bio: "Conciertos con consolas de los 80 recicladas como instrumentos. Su set de cierre del Fest 2026 es aún el video más compartido de la comunidad. Vuelve con show nuevo y taller de sonidos 8 bits.",
      letra: "P", zona: "Escenario Nebula", dia: "Domingo",
      redes: [{ nombre: "Instagram", url: "https://www.instagram.com/", icono: "instagram" }],
      foto: "assets/demo/retrato-pixel8.svg",
      demo: true
    },
    {
      id: "makicake",
      nombre: "María «Makicake» González",
      rol: "Cosplay · jurado internacional",
      pais: "Colombia",
      bio: "Dueña de una vitrina de premios con armaduras de espuma que parecen forja real. Preside el jurado del concurso de cosplay y evalúa en vivo el desfile de la categoría familiar.",
      letra: "M", zona: "Escenario Nebula", dia: "Ambos días",
      redes: [{ nombre: "Instagram", url: "https://www.instagram.com/", icono: "instagram" }],
      foto: "assets/demo/retrato-makicake.svg",
      demo: true
    },
    {
      id: "estudio-mangosta",
      nombre: "Estudio Mangosta",
      rol: "Editorial independiente",
      pais: "Venezuela",
      bio: "Colectivo que edita y traduce cómic independiente venezolano. Lanza en el Fest la antología «Criaturas del Trópico Ninja» con firmas de sus ocho autores.",
      letra: "E", zona: "Artist Alley", dia: "Ambos días",
      redes: [{ nombre: "Instagram", url: "https://www.instagram.com/", icono: "instagram" }],
      foto: "assets/demo/retrato-mangosta.svg",
      demo: true
    },
    {
      id: "ivan-torres",
      nombre: "Iván Torres",
      rol: "Coleccionismo y juguetes de autor",
      pais: "Argentina",
      bio: "Escultor de figuras de resina edición limitada. Da la charla «Cómo empezar tu colección sin arruinarte» y estrena su línea inspirada en la fauna venezolana friki.",
      letra: "I", zona: "Puerta Mercado", dia: "Domingo",
      redes: [{ nombre: "Instagram", url: "https://www.instagram.com/", icono: "instagram" }],
      foto: "assets/demo/retrato-ivan.svg",
      demo: true
    },
    {
      id: "sora-kuma",
      nombre: "Sora & Kuma",
      rol: "Colectivo dance KPOP",
      pais: "Venezuela",
      bio: "Crew caraqueña campeona del cover battle del Fest 2026. Regresa como anfitriona del showcase de dance covers y del taller de formación de nuevas crews.",
      letra: "S", zona: "Escenario Arcade", dia: "Sábado",
      redes: [{ nombre: "Instagram", url: "https://www.instagram.com/", icono: "instagram" }],
      foto: "assets/demo/retrato-sorakuma.svg",
      demo: true
    }
  ],

  /* ---- Programa: agenda por día y escenario (§5.4, §7.2.6) -------------- */
  programa: {
    escenarios: ["Escenario Nebula", "Escenario Arcade", "Artist Alley", "Salón de firmas", "Puerta Mercado"],
    dias: [
      {
        id: "sabado",
        etiqueta: "Sábado 17 de julio",
        fecha: "2027-07-17",
        bloques: [
          { hora: "10:00", fin: "10:40", titulo: "Apertura oficial de la vitrina", escenario: "Escenario Nebula", tipo: "Ceremonia" },
          { hora: "11:00", fin: "12:00", titulo: "Panel: proceso creativo de Kana Mori", escenario: "Escenario Nebula", tipo: "Panel" },
          { hora: "11:00", fin: "13:00", titulo: "Zona de juego libre: retro y simuladores", escenario: "Escenario Arcade", tipo: "Juego libre" },
          { hora: "12:00", fin: "13:30", titulo: "Firmas: Valeria Ríos · ronda 1", escenario: "Salón de firmas", tipo: "Firma" },
          { hora: "13:00", fin: "14:00", titulo: "Taller familiar: tu primer personaje de manga", escenario: "Artist Alley", tipo: "Taller" },
          { hora: "14:30", fin: "16:00", titulo: "Concurso de cosplay — clasificatorio", escenario: "Escenario Nebula", tipo: "Concurso" },
          { hora: "16:30", fin: "18:00", titulo: "Showcase de dance covers — jornada 1", escenario: "Escenario Arcade", tipo: "Showcase" },
          { hora: "18:30", fin: "19:30", titulo: "Presentación: «Criaturas del Trópico Ninja»", escenario: "Artist Alley", tipo: "Lanzamiento" }
        ]
      },
      {
        id: "domingo",
        etiqueta: "Domingo 18 de julio",
        fecha: "2027-07-18",
        bloques: [
          { hora: "10:30", fin: "11:30", titulo: "Charla: coleccionismo sin arruinarte", escenario: "Puerta Mercado", tipo: "Charla" },
          { hora: "11:30", fin: "12:30", titulo: "Firmas: Kana Mori · ronda única", escenario: "Salón de firmas", tipo: "Firma" },
          { hora: "12:00", fin: "14:00", titulo: "Torneo exhibición: final de la comunidad", escenario: "Escenario Arcade", tipo: "Torneo" },
          { hora: "13:00", fin: "14:00", titulo: "Masterclass de guion con «Dako» Villalba", escenario: "Artist Alley", tipo: "Taller" },
          { hora: "14:30", fin: "15:30", titulo: "Panel de doblaje con Valeria Ríos", escenario: "Escenario Nebula", tipo: "Panel" },
          { hora: "16:00", fin: "17:30", titulo: "Gran final del concurso de cosplay", escenario: "Escenario Nebula", tipo: "Concurso" },
          { hora: "18:00", fin: "19:00", titulo: "Concierto de cierre: DJ Pixel8", escenario: "Escenario Nebula", tipo: "Concierto" }
        ]
      }
    ],
    demo: true
  },

  /* ---- Galería «así salió» (§5.5, §7.2.7) --------------------------------
     Reels: los embeds se cargan solo al tocar (K1). Demo: el facade abre la
     publicación en la red de la comunidad; el dashboard cambia esto por
     IDs reales de YouTube/Instagram.                                     */
  galeria: {
    evento: "Nitrotoon Fest 2026",
    introduccion: "Dos días de nave despegada: el Fest 2026 tal como lo vivió la comunidad. Fotos de la vitrina y reels para revivir (o enamorarte por primera vez).",
    piezas: [
      { tipo: "foto", src: "assets/demo/galeria-hero.svg",   alt: "El escenario principal del Fest 2026 iluminado en dorado", clase: "ancha", demo: true },
      { tipo: "foto", src: "assets/demo/galeria-cosplay.svg", alt: "Final del concurso de cosplay en el Escenario Nebula", clase: "", demo: true },
      { tipo: "reel", poster: "assets/demo/galeria-reel1.svg", titulo: "Reel · gran final de cosplay", url: "https://www.instagram.com/nitrotoon/", clase: "alta", demo: true },
      { tipo: "foto", src: "assets/demo/galeria-mercado.svg", alt: "Pasillos de la zona de mercado geek", clase: "", demo: true },
      { tipo: "reel", poster: "assets/demo/galeria-reel2.svg", titulo: "Reel · concierto de DJ Pixel8", url: "https://www.instagram.com/nitrotoon/", clase: "", demo: true },
      { tipo: "foto", src: "assets/demo/galeria-artistas.svg", alt: "Mesas del Artist Alley con ilustradores al público", clase: "", demo: true },
      { tipo: "foto", src: "assets/demo/galeria-gamers.svg",  alt: "Final del torneo gamer en el Escenario Arcade", clase: "ancha", demo: true },
      { tipo: "foto", src: "assets/demo/galeria-kpop.svg",    alt: "Crews en el showcase de dance covers", clase: "", demo: true },
      { tipo: "foto", src: "assets/demo/galeria-familias.svg", alt: "Familias en el taller de dibujo para niños", clase: "", demo: true }
    ],
    demo: true
  },

  /* ---- Aliados y sponsors por niveles (§5.7, §7.2.5) --------------------- */
  aliados: {
    introduccion: "Marcas que empujan la nave. Si tu negocio quiere volar con la comunidad geek, escríbenos por el media kit.",
    mediaKitUrl: null, /* Slot: PDF del media kit — se activa desde el dashboard */
    niveles: [
      {
        id: "principal",
        nombre: "Aliado principal",
        nota: "Presencia en escenario, cinta y todas las puertas",
        marcas: [
          { nombre: "Dulce Otaku",    logo: "assets/demo/aliado-dulce.svg",    url: null, demo: true },
          { nombre: "Radio Geek 89.7", logo: "assets/demo/aliado-radio.svg",   url: null, demo: true }
        ]
      },
      {
        id: "aliado",
        nombre: "Aliado",
        nota: "Zona activa dentro del evento",
        marcas: [
          { nombre: "PixelCafé",              logo: "assets/demo/aliado-pixelcafe.svg", url: null, demo: true },
          { nombre: "Librería Mangápolis",    logo: "assets/demo/aliado-mangapolis.svg", url: null, demo: true },
          { nombre: "Academia K-Pop Venezuela", logo: "assets/demo/aliado-kpop.svg",   url: null, demo: true }
        ]
      },
      {
        id: "colaborador",
        nombre: "Colaborador",
        nota: "Apoyo en convocatorias y sorteos",
        marcas: [
          { nombre: "Impresiones 3D Caracas", logo: "assets/demo/aliado-3d.svg",       url: null, demo: true },
          { nombre: "Zona Retro Venezuela",    logo: "assets/demo/aliado-retro.svg",    url: null, demo: true },
          { nombre: "Domingueada Friki",       logo: "assets/demo/aliado-domingueada.svg", url: null, demo: true }
        ]
      }
    ],
    demo: true
  },

  /* ---- Normas de la comunidad (§5.6, §7.2.9) — exigencia del comité ------ */
  normas: {
    actualizado: "2026-10-29",
    introduccion: "Las reglas de la casa, a la vista de todos. Existen para que familias, artistas, cosplayers y gamers compartan la misma vitrina con respeto. La entrada implica aceptarlas.",
    secciones: [
      {
        id: "cosplay-props",
        titulo: "Cosplay y props",
        icono: "mascara",
        intro: "Tu disfraz, tus reglas: la creatividad manda, la seguridad no se negocia. Todo prop pasa por revisión en la entrada y recibe el sello de la nave.",
        pares: {
          si: [
            "Props de foam, madera liviana o plástico, sin bordes cortantes",
            "Armas de prop con punta redondeada y hasta 1,5 metros de largo",
            "Disfraces que cubren la zona íntima y permiten sentarte cómodo",
            "Cadenas y arneses fijados para que nadie se tropiece contigo"
          ],
          no: [
            "Armas reales, de fuego, de airsoft o réplicas realistas de metal",
            "Proyectiles, explosivos, humo o cualquier efecto pirotécnico",
            "Patines, patinetas ni zancos dentro de los pasillos",
            "Props que suelten líquidos o manchen el suelo del recinto"
          ]
        }
      },
      {
        id: "menores",
        titulo: "Menores de edad",
        icono: "familia",
        intro: "La comunidad geek es transversal: aquí hay bebés fans de mechas y abuelas fans de idols. Para que todo el mundo respire tranquilo:",
        lista: [
          "Menores de 12 años entran acompañados de un adulto responsable todo el tiempo",
          "De 12 a 17 años: autorización escrita del representante en la entrada",
          "Punto de encuentro «Estación Familia» junto al Escenario Nebula, con personal identificado",
          "Brazalete de contacto: escribe ahí el teléfono del adulto responsable",
          "Los talleres infantiles tienen cupo y horario propio: llega 15 minutos antes"
        ]
      },
      {
        id: "fanart-marca",
        titulo: "Fan-art y uso de la marca",
        icono: "lapiz",
        intro: "En Artist Alley se vende amor por los fandoms, con líneas claras para que nadie se meta en problemas legales:",
        lista: [
          "Fan-art original y parodias: sí, siempre que sean tu trabajo propio",
          "Reproducciones de merch oficial (prints de arte oficial, bootlegs): no",
          "Usar el nombre o el logo de Nitrotoon para vender nada: requiere autorización escrita",
          "IA generativa entrenada con obra ajena: debe declararse en tu mesa y no participa en convocatorias",
          "Dudas sobre tu stand: escríbenos antes de imprimir nada"
        ]
      },
      {
        id: "grabacion",
        titulo: "Grabación en el evento",
        icono: "camara",
        intro: "Registremos recuerdos, no invasiones. La regla de oro: ante la duda, pregunta.",
        pares: {
          si: [
            "Fotos y videos personales con el celular",
            "Grabar a cosplayers pidiendo permiso primero",
            "Compartir con el hashtag de la comunidad: lo mejor sale en las redes oficiales"
          ],
          no: [
            "Cámaras profesionales con fines comerciales sin acreditación de prensa",
            "Drones sobre el recinto",
            "Flash durante concursos, conciertos y paneles",
            "Grabar a alguien sin su consentimiento para burlarse o acosar: expulsión inmediata"
          ]
        }
      },
      {
        id: "imagen-artistas",
        titulo: "Derecho de imagen de artistas y doblaje",
        icono: "microfono",
        intro: "Los invitados prestan su voz y su obra; el registro de eso les pertenece a ellos:",
        lista: [
          "Las sesiones de firma se registran para tu recuerdo personal, no para publicar sin permiso",
          "El audio y video de los paneles de doblaje es propiedad del artista y del evento",
          "No grabes más de 30 segundos continuos de panel sin autorización del moderador",
          "Los meet & greet tienen su propia política de fotos, anunciada en la puerta del salón"
        ]
      },
      {
        id: "convivencia",
        titulo: "Convivencia y accesibilidad",
        icono: "estrella",
        intro: "Una comunidad de comunidades se reconoce por cómo trata a la gente:",
        lista: [
          "Cero discriminación por fandom, género, origen, condición o edad",
          "El personal de la nave (camisetas doradas) es autoridad dentro del evento",
          "Puntos de descanso y lactancia en cada pasillo principal",
          "Recinto con acceso para sillas de ruedas; los talleres tienen fila preferente",
          "Buzón de reporte anónimo en la app de la comunidad y en punto de información"
        ]
      }
    ],
    demo: true
  },

  /* ---- Contacto (§5.8) ---------------------------------------------------- */
  contacto: {
    introduccion: "Dudas, alianzas, stands o un simple saludo: la torre de control está atenta.",
    vias: [
      {
        icono: "instagram",
        titulo: "Redes de la comunidad",
        texto: "La vía más rápida: respondemos los mensajes en horario de oficina venezolano.",
        accion: { texto: "@nitrotoon en Instagram", url: "https://www.instagram.com/nitrotoon/" }
      },
      {
        icono: "facebook",
        titulo: "Facebook",
        texto: "Eventos, avisos largos y comunidad de discusión diaria.",
        accion: { texto: "Ir a la página", url: "https://www.facebook.com/nitrotoon/" }
      },
      {
        icono: "estrella",
        titulo: "Aliados y prensa",
        texto: "Media kit, precios de stands y acreditaciones de prensa para el Fest 2027.",
        accion: { texto: "Pedir el media kit", url: "https://www.instagram.com/nitrotoon/" }
      },
      {
        icono: "tienda",
        titulo: "Stands y Artist Alley",
        texto: "Convocatorias abiertas con fechas y bases claras. Sin letra pequeña.",
        accion: { texto: "Ver convocatorias", url: "artistas.html" }
      }
    ],
    faq: [
      {
        p: "¿Dónde compro las entradas del Nitrotoon Fest 2027?",
        r: "Por la cinta de entradas de esta web (te lleva a la taquilla oficial de la comunidad) o en los puntos de venta que anunciamos en redes. Evita revendedores: solo taquilla oficial."
      },
      {
        p: "¿Cómo participo en el Torneo NitroGamers del 5 y 6 de diciembre?",
        r: "La convocatoria y las bases del torneo se publican aquí y en nuestras redes: disciplinas, brackets, requisitos por nivel y cómo registrarte. El aforo de público está limitado a 200 personas con acceso QR, y los menores de edad compiten solo con autorización escrita de su representante."
      },
      {
        p: "¿Los niños pagan entrada?",
        r: "Menores de 8 años no pagan, acompañados de un adulto con boleto. Los talleres infantiles tienen cupo limitado: revisa el programa del fin de semana."
      },
      {
        p: "¿Puedo entrar con mi prop de cosplay?",
        r: "Sí, si cumple las normas de materiales y medidas. Pasa por el punto de revisión al entrar y recibe el sello de la nave; sin sello, el prop no entra a escenarios."
      },
      {
        p: "¿Qué formas de pago aceptan dentro del evento?",
        r: "Efectivo en divisas y bolívares, pago móvil, Zelle y biopago en la mayoría de los stands. Cada vendedor anuncia sus métodos; la taquilla acepta todos."
      },
      {
        p: "¿Cómo llego y hay estacionamiento?",
        r: "El recinto cuenta con estacionamiento propio y zonas de desembarque para transporte. Recomendamos ir en convoy de carros: la comunidad suele organizarlo en los grupos de cada puerta."
      },
      {
        p: "¿Cómo puedo ser voluntario?",
        r: "Abriremos convocatoria de personal de la nave (camisetas doradas) dos meses antes de cada evento, con beneficios reales y certificado. Sigue las redes para no perderla."
      },
      {
        p: "Soy artista: ¿cómo consigo mesa en el Artist Alley?",
        r: "La convocatoria se abre en esta web (puerta Artistas) con fecha de cierre y bases completas. La selección prioriza obra original y diversidad de estilos."
      }
    ],
    demo: true
  },

  /* ---- PORTADA COMPOISIBLE (§2, §6) --------------------------------------
     La vitrina se viste con PIEZAS en orden: el dashboard las arrastra,
     las oculta o añade piezas nuevas. Tipos de pieza:
     hero · puertas · avisos · eventos · artistas · galeria · aliados
     (zonas vivas del sistema) + aviso · tarjeta · enlace · cuenta · reel ·
     carrusel (piezas libres creadas desde el dashboard).
     Sin esta sección, la portada usa el orden por defecto.             */
  portada: {
    piezas: [
      { id: "hero",     tipo: "hero",     visible: true },
      { id: "puertas",  tipo: "puertas",  visible: true },
      { id: "avisos",   tipo: "avisos",   visible: true },
      { id: "eventos",  tipo: "eventos",  visible: true },
      { id: "artistas", tipo: "artistas", visible: true },
      { id: "galeria",  tipo: "galeria",  visible: true },
      { id: "aliados",  tipo: "aliados",  visible: true }
    ],
    demo: true
  },

  /* ---- HUB DE PUERTAS (§5) — cada una con su color y su URL -------------- */
  puertas: [
    { id: "eventos",  nombre: "Eventos",  resumen: "El calendario del año y el evento vigente", url: "eventos.html",  icono: "calendario", demo: false },
    { id: "otaku",    nombre: "Otaku",    resumen: "Anime, manga, cómic y cultura japonesa",     url: "otaku.html",    icono: "torii",      demo: false },
    { id: "gamers",   nombre: "Gamers",   resumen: "Torneos, esports y zonas de juego",          url: "gamers.html",   icono: "control",    demo: false },
    { id: "kpop",     nombre: "KPOP",     resumen: "Dance covers, stans y fandoms",              url: "kpop.html",     icono: "nota",       demo: false },
    { id: "cosplay",  nombre: "Cosplay",  resumen: "Concursos, normas sí/no y zona de fotos",    url: "cosplay.html",  icono: "mascara",    demo: false },
    { id: "artistas", nombre: "Artistas", resumen: "Artist Alley, doblaje, firmas y convocatorias", url: "artistas.html", icono: "lapiz",   demo: false },
    { id: "mercado",  nombre: "Mercado",  resumen: "Merch, stans, coleccionistas y stands",      url: "mercado.html",  icono: "tienda",     demo: false }
  ],

  /* ---- ESPACIOS por comunidad (Fase 1: tema compartido; Fase 3: skins) --- */
  espacios: {
    otaku: {
      kicker: "Puerta Otaku",
      titulo: "Anime, manga y cómic sin filtro",
      entradilla: "La puerta para quien habla en capítulos: proyecciones, editoriales, invitados que firman y una comunidad que recomienda series mejor que cualquier algoritmo.",
      destacado: {
        titulo: "Invitada estrella: Kana Mori",
        texto: "Portadista de novelas ligeras, por primera vez en Venezuela. Panel de proceso creativo, firmas los dos días y prints exclusivos del Fest 2027.",
        accion: { texto: "Ver su ficha", url: "artistas.html" }
      },
      lista: [
        { titulo: "Proyecciones alineadas", texto: "Maratones elegidas por votación de la comunidad, con subtítulos y reserva de asientos para familias." },
        { titulo: "Editoriales invitadas", texto: "Estudio Mangosta y sellos independientes presentan lanzamientos del año." },
        { titulo: "Karaoke otaku", texto: "Los openings y endings que todos gritamos, con letra a pantalla y cero vergüenza." }
      ],
      demo: true
    },
    gamers: {
      kicker: "Puerta Gamers",
      titulo: "Zona de juego y torneos",
      entradilla: "Consolas, PCs, arcade y mesa: la puerta donde la competencia es seria y el juego, más. Brackets públicos, reglas claras y torneos con estado real.",
      destacado: {
        titulo: "Torneo NitroGamers 2026 · 5 y 6 de diciembre",
        texto: "Seis disciplinas oficiales: Tekken 8, Street Fighter 6, EA Sports FC 26, Just Dance, Super Smash Bros. Ultimate y Call of Duty Mobile. Competencia en tres niveles —regional, nacional e internacional— en la misma jornada, con transmisión en vivo y narradores en pantalla dividida. Valencia, Venezuela.",
        accion: { texto: "Ver el calendario", url: "eventos.html" },
        estado: "en-preparacion"
      },
      lista: [
        { titulo: "Seis disciplinas, tres niveles", texto: "Consola, PC y móvil en un mismo torneo: del cuadro regional a la final internacional, servidores cercanos y lejanos. La manera honesta de ver dónde rinde cada jugador." },
        { titulo: "Transmisión profesional", texto: "Narradores en vivo y pantalla dividida con varias disciplinas a la vez, como una transmisión deportiva. Quien no está en la sala, lo ve igual." },
        { titulo: "Aforo controlado, control real", texto: "200 personas dentro con sistema formal de acceso QR y estadísticas auditables de cada entrada. Nadie entra sin registro; los menores, solo con autorización escrita." }
      ],
      demo: false
    },
    kpop: {
      kicker: "Puerta KPOP",
      titulo: "Dance covers, stans y fandoms",
      entradilla: "La puerta donde los fandoms se encuentran: showcases de dance covers, random play dance, talleres de fan projects y una pista que nunca se enfría.",
      destacado: {
        titulo: "Nitrotoon K-Fest · 13 de marzo de 2027",
        texto: "La convención KPOP del año en preparación: crews, concursos de banners y una jornada completa de fandoms. El line-up se publica en enero.",
        accion: { texto: "Ver el calendario", url: "eventos.html" },
        estado: "en-preparacion"
      },
      lista: [
        { titulo: "Showcase de crews", texto: "Las crews invitadas abren y cierran cada jornada; el resto del line-up sale de convocatoria abierta." },
        { titulo: "Random play dance", texto: "La pista donde la suerte y el mérito se abrazan: premios para las crews sorpresa." },
        { titulo: "Fan projects con reglas", texto: "Proyectos de fandom bienvenidos, siempre con las normas de la comunidad por delante." }
      ],
      demo: true
    },
    cosplay: {
      kicker: "Puerta Cosplay",
      titulo: "Concursos, normas y zona de fotos",
      entradilla: "Del primer prop de foam a las armaduras de concurso: la puerta del cosplay venezolano, con bases claras, jurado internacional y una zona de fotos a la altura de tu trabajo.",
      destacado: {
        titulo: "Concurso de cosplay · Nitrotoon Fest 2027",
        texto: "Clasificatorio el sábado, gran final el domingo. El premio mayor: la Nave de Oro y cupo directo al panel del jurado del próximo año.",
        accion: { texto: "Leer las bases completas", url: "normas.html" }
      },
      lista: [
        { titulo: "Revisión de props", texto: "Punto de revisión en la entrada con sellos de la nave: entra tranquilo, tu prop está avalado." },
        { titulo: "Zona de fotos", texto: "Sets temáticos con luz pensada para cámara de celular: tu cosplay merece buena luz, no excusas." },
        { titulo: "Categoría familiar", texto: "Desfile para crews y familias en nivel inicio: el jurado premia actitud, no presupuesto." }
      ],
      demo: true
    },
    artistas: {
      kicker: "Puerta Artistas",
      titulo: "Artist Alley, doblaje y firmas",
      entradilla: "La puerta de quienes crean: ilustradores y dibujantes del Artist Alley, actores de doblaje en el salón de firmas y convocatorias abiertas con bases claras.",
      destacado: {
        titulo: "Convocatoria Artist Alley 2027 · abierta",
        texto: "Mesa para ilustradores, dibujantes y creadores de objetos geek originales. Cierra el 28 de febrero de 2027. Selección prioriza obra propia y diversidad de estilos.",
        accion: { texto: "Conocer los requisitos", url: "normas.html" },
        estado: "en-preparacion"
      },
      lista: [
        { titulo: "Invitados que firman", texto: "Horarios de firma publicados en el programa: una firma por invitado y tiempo de sobra para la foto." },
        { titulo: "Panel de doblaje", texto: "La voz detrás de tus personajes favoritos, en vivo y con lectura dramatizada." },
        { titulo: "Masterclass de guion", texto: "«Dako» Villalba enseña cómo se escribe un cómic que la gente termina." }
      ],
      demo: true
    },
    mercado: {
      kicker: "Puerta Mercado",
      titulo: "Merch, stans y coleccionistas",
      entradilla: "La puerta del tesoro: merch de fandoms, figuras, cartas, retro y todo lo que tu estantería pide a gritos. Con normas de venta claras para que comprar sea tan divertido como coleccionar.",
      destacado: {
        titulo: "Zona Retro · nueva en 2027",
        texto: "Consolas de colección encendidas, catálogo de cartas para intercambio y la charla de Iván Torres sobre coleccionar sin arruinarse.",
        accion: { texto: "Ver el programa", url: "programa.html" }
      },
      lista: [
        { titulo: "Stands verificados", texto: "Todo vendedor pasa por convocatoria: merch legítimo, precios a la vista y devolución amable." },
        { titulo: "Stans y photocard trading", texto: "Mesas de intercambio por fandom con horario propio, para que nadie pierda su photocard favorito." },
        { titulo: "Coleccionismo en grande", texto: "Exhibición de colecciones privadas de la comunidad: figuras, manga editorial y consolas con historia viva." }
      ],
      demo: true
    }
  },

  /* ---- Intranet por evento + acceso (§5.9, §11) ---------------------------
     Enlaces a sistemas externos; el administrador los actualiza por evento. */
  intranet: {
    titulo: "Tu evento",
    enlaces: [
      { nombre: "Acceso del personal (NitroSystem)", url: "https://www.instagram.com/nitrotoon/", demo: true },
      { nombre: "Convocatoria de voluntarios", url: "contacto.html", demo: true },
      { nombre: "Bases de concursos y torneos", url: "normas.html", demo: true }
    ]
  },

  /* ---- ROADMAP (§11, Fase 4) — el plan de crecimiento, a la vista --------
     Estados honestos del crecimiento (no son estados de evento; la regla
     K3 de los 4 estados aplica al calendario, no aquí):
     · "documentado"    — diseñado en este prompt, listo para arrancar.
     · "en estudio"     — evaluando opciones antes de diseñar.
     · "en negociacion" — se anuncia con fecha cuando la firma esté lista.
     Cero fechas inventadas y cero cifras sin fuente (regla del comité). */
  roadmap: {
    nota: "El plan de crecimiento de la nave, a la vista de todos. Aquí no hay humo: cada módulo está documentado o en trámite real, y se lanza cuando la comunidad lo pide.",
    items: [
      {
        id: "supabase", estado: "documentado",
        titulo: "Contenido en vivo con Supabase",
        descripcion: "Conectar la vitrina a una base de datos para que los cambios del dashboard se publiquen al instante, sin esperar la subida a GitHub.",
        resuelve: "Publicación instantánea y edición en equipo sin tocar archivos."
      },
      {
        id: "claves", estado: "documentado",
        titulo: "Gestión de claves de acceso",
        descripcion: "Módulo para crear claves a personas que necesiten entrar a secciones restringidas (staff, prensa, jurados). Hoy no existe acceso por usuario: el dashboard es solo del administrador con su PIN.",
        resuelve: "Accesos por rol sin compartir el PIN del administrador."
      },
      {
        id: "entradas", estado: "documentado",
        titulo: "Módulo de entradas propio",
        descripcion: "Taquilla dentro de la web, con órdenes y control de aforo por evento. Mientras llega, la cinta de entradas enlaza al sistema externo que ya usamos.",
        resuelve: "Venta directa y control total del aforo, sin comisiones de terceros.",
        enlace: { texto: "Ver la cinta de entradas actual", url: "index.html" }
      },
      {
        id: "intranet", estado: "documentado",
        titulo: "Intranet por evento",
        descripcion: "Los enlaces «Tu evento» del pie ya existen en todas las páginas; este módulo los conecta a una base de datos que cambia con cada convención.",
        resuelve: "Información operativa por evento sin duplicar la web.",
        enlace: { texto: "Ver la intranet del evento vigente", url: "index.html#pie-evento" }
      },
      {
        id: "torneo", estado: "hecho",
        titulo: "Torneo gamer oficial",
        descripcion: "Cumplido: el Torneo NitroGamers 2026 se celebra el 5 y 6 de diciembre en Valencia, con seis disciplinas, tres niveles de competencia, transmisión con narradores y aforo controlado de 200 personas por acceso QR.",
        resuelve: "Competencia con premios reales y brackets públicos.",
        enlace: { texto: "Ver el torneo en el calendario", url: "eventos.html" }
      },
      {
        id: "audiencia", estado: "documentado",
        titulo: "Índice de audiencia y media kit",
        descripcion: "Página de cifras para aliados con fuente y fecha en cada número — la regla del comité. Lo que no exista, no se inventa: esta página nace cuando haya mediciones reales.",
        resuelve: "Media kit creíble para sponsors, con datos verificables.",
        enlace: { texto: "Ver el nivel actual de aliados", url: "aliados.html" }
      }
    ]
  },

  /* ---- Administración (Fase 2) --------------------------------------------
     El enlace discreto al dashboard aparece en el pie cuando activo sea
     true. admin.html existe desde la Fase 2: el administrador entra con
     su PIN (el PIN nunca vive en el código fuente, solo su hash SHA-256). */
  admin: { activo: true, url: "admin.html" },

  /* ---- Versionado de contenido (lo actualiza el dashboard al publicar) --- */
  version: { etiqueta: "Fase 2 · demo", fecha: "2026-10-29" }
};
