// =========================================================
// CONTACTO - VALIDACIÓN + FORMSUBMIT + SWEETALERT + HORARIO
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nombreInput  = document.getElementById("nombre");
  const correoInput  = document.getElementById("correo");
  const asuntoInput  = document.getElementById("asunto");
  const mensajeInput = document.getElementById("mensaje");
  const archivoInput = document.getElementById("archivo");
  const MAX_FILE_SIZE_MB = 5;

  // -------------------------------
  // 1) IDIOMA (ES / EN)
  // -------------------------------
  const getLang = () => (document.documentElement.lang === "en" ? "en" : "es");

  function updateValidationMessages() {
    const lang = getLang();
    document.querySelectorAll(".invalid-feedback").forEach((el) => {
      const msg = el.getAttribute(`data-${lang}`);
      if (msg) el.textContent = msg;
    });
  }

  updateValidationMessages();
  document.addEventListener("idioma-cambiado", updateValidationMessages);

  // -------------------------------
  // 2) VALIDACIÓN EN TIEMPO REAL
  // -------------------------------

  // NOMBRE: solo letras, espacios, ', . y -
  if (nombreInput) {
    nombreInput.addEventListener("input", () => {
      const limpio = nombreInput.value.replace(
        /[^A-Za-zÁÉÍÓÚáéíóúÑñ\s'.-]/g,
        ""
      );
      if (limpio !== nombreInput.value) {
        nombreInput.value = limpio;
      }
    });

    nombreInput.addEventListener("blur", () => {
      nombreInput.value = nombreInput.value.trim();
      nombreInput.setCustomValidity("");

      if (!nombreInput.value) {
        // requerido: el required ya marca error, no ponemos mensaje extra
        return;
      }

      // Por seguridad extra revisamos que cumpla el patrón
      const patron = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'.-]+$/;
      if (!patron.test(nombreInput.value)) {
        nombreInput.setCustomValidity("invalid");
      }
    });
  }

  // CORREO: limpieza de espacios + validación regex sencilla
  if (correoInput) {
    correoInput.addEventListener("input", () => {
      // Quitamos espacios a los lados y dentro
      correoInput.value = correoInput.value.replace(/\s+/g, "").toLowerCase();
      correoInput.setCustomValidity("");
    });

    correoInput.addEventListener("blur", () => {
      correoInput.value = correoInput.value.trim().toLowerCase();
      correoInput.setCustomValidity("");

      if (!correoInput.value) return; // required se encarga

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correoInput.value)) {
        correoInput.setCustomValidity("invalid");
      }
    });
  }

  // --- Bloqueo en tiempo real para ASUNTO (solo letras) ---
if (asuntoInput) {
  asuntoInput.addEventListener("input", () => {
    // Elimina cualquier caracter que NO sea permitido
    const limpio = asuntoInput.value.replace(
      /[^A-Za-zÁÉÍÓÚáéíóúÑñ\s'.-]/g,
      ""
    );

    if (limpio !== asuntoInput.value) {
      asuntoInput.value = limpio;
    }

    asuntoInput.setCustomValidity("");
  });

  asuntoInput.addEventListener("blur", () => {
    asuntoInput.value = asuntoInput.value.trim();
    asuntoInput.setCustomValidity("");

    if (!asuntoInput.value) return; // required se encarga
    if (asuntoInput.value.length < 3) {
      asuntoInput.setCustomValidity("invalid");
      return;
    }

    const patron = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'.-]+$/;
    if (!patron.test(asuntoInput.value)) {
      asuntoInput.setCustomValidity("invalid");
    }
  });
}

  // MENSAJE: opcional, pero recortamos y respetamos máximo 2000
  if (mensajeInput) {
    mensajeInput.addEventListener("input", () => {
      if (mensajeInput.value.length > 2000) {
        mensajeInput.value = mensajeInput.value.slice(0, 2000);
      }
      mensajeInput.setCustomValidity("");
    });

    mensajeInput.addEventListener("blur", () => {
      mensajeInput.value = mensajeInput.value.trim();
      mensajeInput.setCustomValidity("");
      // No hacemos obligatorio; solo controles de longitud
    });
  }

  // ARCHIVO: solo PDF hasta 5MB
  if (archivoInput) {
    archivoInput.addEventListener("change", () => {
      archivoInput.setCustomValidity("");

      const file = archivoInput.files[0];
      if (!file) return;

      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      const isTooBig = file.size > MAX_FILE_SIZE_MB * 1024 * 1024;

      if (!isPdf || isTooBig) {
        archivoInput.setCustomValidity("invalid");
      } else {
        archivoInput.setCustomValidity("");
      }
    });
  }

  // -------------------------------
  // 3) SUBMIT: VALIDAR + FORMSUBMIT
  // -------------------------------
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Limpieza rápida antes de validar
    if (nombreInput)  nombreInput.value  = nombreInput.value.trim();
    if (correoInput)  correoInput.value  = correoInput.value.trim();
    if (asuntoInput)  asuntoInput.value  = asuntoInput.value.trim();
    if (mensajeInput) mensajeInput.value = mensajeInput.value.trim();

    // Si no hay archivo, que no arrastre error anterior
    if (archivoInput && archivoInput.files.length === 0) {
      archivoInput.setCustomValidity("");
    }

    updateValidationMessages();

    // HTML5 + customValidity
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return; // NO enviamos si hay algo mal
    }

    form.classList.add("was-validated");

    const formData = new FormData(form);

    try {
      await fetch("https://formsubmit.co/josegamaparedes.93@gmail.com", {
        method: "POST",
        body: formData,
      });

      await Swal.fire({
        title: "¡Gracias por contactarnos!",
        text: "Hemos recibido su mensaje. Le responderemos pronto.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#f5c400",
      });

      form.reset();
      form.classList.remove("was-validated");
      window.location.href = "contacto.html";
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al enviar el formulario.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  });
});

// =========================================================
// 4) HORARIO DINÁMICO (TEXTO DE ABAJO DEL HORARIO)
// =========================================================
// Lunes–Viernes: 8:00–16:00
// Sábado: 8:00–12:00
// Domingo: Cerrado
(function () {
  const el = document.getElementById("horarioDinamico");
  if (!el) return;

  const ahora = new Date();
  const dia = ahora.getDay(); // 0 dom, 1 lun, ..., 6 sab
  const hora = ahora.getHours() + ahora.getMinutes() / 60;

  let mensaje = "";

  const abreSemana = 8;
  const cierraSemana = 16; // 4:00 p.m.
  const abreSabado = 8;
  const cierraSabado = 12; // 12:00 m.d.

  if (dia === 0) {
    mensaje = "Hoy: Cerrado (domingo)";
  } else if (dia >= 1 && dia <= 5) {
    if (hora < abreSemana) {
      mensaje = "Hoy: Cerrado (abrimos a las 8:00 a.m.)";
    } else if (hora >= cierraSemana) {
      mensaje = "Hoy: Cerrado (cerramos a las 4:00 p.m.)";
    } else {
      mensaje = "Hoy: Abierto ahora (8:00 a.m. – 4:00 p.m.)";
    }
  } else if (dia === 6) {
    if (hora < abreSabado) {
      mensaje = "Hoy: Cerrado (abrimos a las 8:00 a.m.)";
    } else if (hora >= cierraSabado) {
      mensaje = "Hoy: Cerrado (cerramos a las 12:00 m.d.)";
    } else {
      mensaje = "Hoy: Abierto ahora (8:00 a.m. – 12:00 m.d.)";
    }
  }

  el.textContent = mensaje;
})();