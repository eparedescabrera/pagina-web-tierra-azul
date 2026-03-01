// js/idioma.js
document.addEventListener("DOMContentLoaded", () => {
  // 1. Crear el widget flotante de idioma
  const langWrapper = document.createElement("div");
  langWrapper.className = "lang-floating";
  langWrapper.innerHTML = `
    <span class="lang-floating-label" data-es="Idioma" data-en="Language">
      Idioma
    </span>
    <button
      id="btnEs"
      type="button"
      class="lang-btn"
      data-es="ES"
      data-en="ES"
    >
      ES
    </button>
    <button
      id="btnEn"
      type="button"
      class="lang-btn"
      data-es="EN"
      data-en="EN"
    >
      EN
    </button>
  `;
  document.body.appendChild(langWrapper);

  const btnEs = document.getElementById("btnEs");
  const btnEn = document.getElementById("btnEn");

  function marcarActivo(lang) {
    if (!btnEs || !btnEn) return;
    if (lang === "es") {
      btnEs.classList.add("lang-btn--active");
      btnEn.classList.remove("lang-btn--active");
    } else {
      btnEn.classList.add("lang-btn--active");
      btnEs.classList.remove("lang-btn--active");
    }
  }

  function aplicarIdioma(lang) {
    // Cambiar textos
    document.querySelectorAll("[data-es], [data-en]").forEach((el) => {
      const texto = el.getAttribute(`data-${lang}`);

      if (texto !== null) {
        // Texto principal (evitamos inputs)
        if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") {
          el.textContent = texto;
        }

        // Placeholders
        if (el.hasAttribute(`data-${lang}-ph`)) {
          el.placeholder = el.getAttribute(`data-${lang}-ph`);
        }

        // Title
        if (el.hasAttribute(`data-${lang}-title`)) {
          el.title = el.getAttribute(`data-${lang}-title`);
        }

        // ALT imágenes
        if (el.hasAttribute(`data-${lang}-alt`)) {
          el.alt = el.getAttribute(`data-${lang}-alt`);
        }

        // value de inputs/botones
        if (el.hasAttribute(`data-${lang}-value`)) {
          el.value = el.getAttribute(`data-${lang}-value`);
        }
      }
    });

    // Guardar idioma
    localStorage.setItem("idioma_tierraazul", lang);
    document.documentElement.lang = lang === "es" ? "es" : "en";

    // Actualizar estado visual de los botones
    marcarActivo(lang);
  }

  // Eventos de click en botones
  if (btnEs) {
    btnEs.addEventListener("click", () => aplicarIdioma("es"));
  }
  if (btnEn) {
    btnEn.addEventListener("click", () => aplicarIdioma("en"));
  }

  // Idioma inicial (desde localStorage o español)
  const idiomaGuardado = localStorage.getItem("idioma_tierraazul") || "es";
  aplicarIdioma(idiomaGuardado);
});