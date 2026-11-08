/* ==========================================================================
   NITROTOON · admin-acceso.js — configuración de acceso al dashboard (§6)
   --------------------------------------------------------------------------
   ÚNICO archivo que el administrador toca para cambiar su PIN.
   El PIN NUNCA vive aquí: solo su hash SHA-256 (con salto), calculado así:
     sha256Hex(SALTO + ":" + PIN)
   Para cambiar el PIN: abre el dashboard → Publicar → «Cambiar PIN» →
   reemplaza la línea «hash: …» de AQUÍ ABAJO y sube ESTE archivo a
   GitHub. (data.js no cambia al cambiar el PIN.)

   ┌──────────────────────────────────────────────────────────────────────┐
   │  PIN del preview (hash abajo). Cambiar antes de promocionar a prod.   │
   └──────────────────────────────────────────────────────────────────────┘
   ========================================================================== */
"use strict";

window.ADMIN_ACCESO = {
  /* sha256Hex("nitrotoon:" + PIN real) — el PIN solo existe en la cabeza
     del administrador: nunca en archivos, chats ni capturas. */
  hash: "a3950a7a88e460e20c54da778812428d9761eaf7d2a4fbab63d38a3112d18a63",

  /* Salto que se antepone al PIN antes de hashear */
  salto: "nitrotoon",

  /* Bloqueo tras intentos fallidos (§6: mismo patrón que NitroSystem) */
  maxIntentos: 5,
  bloqueoMinutos: 15,

  /* La sesión vive en este navegador (localStorage) y expira sola */
  sesionHoras: 8
};
