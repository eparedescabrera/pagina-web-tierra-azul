(() => {
  const body = document.body;

  // ======================================================
  // MENU MOVIL (PANEL)
  // ======================================================
  const navToggle = document.getElementById("navToggle");
  const navClose = document.getElementById("navClose");
  const navBackdrop = document.getElementById("navBackdrop");

  const openNav = () => {
    body.classList.add("nav-open");
    navToggle?.setAttribute("aria-expanded", "true");
  };

  const closeNav = () => {
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");

    // Cerrar submenús del panel móvil
    document.querySelectorAll(".nav2__mSub").forEach(sub => (sub.style.display = "none"));
    document.querySelectorAll(".nav2__mDrop").forEach(btn => btn.setAttribute("aria-expanded", "false"));
  };

  navToggle?.addEventListener("click", openNav);
  navClose?.addEventListener("click", closeNav);
  navBackdrop?.addEventListener("click", closeNav);

  // ======================================================
  // SUBMENÚ MÓVIL (ACORDEÓN) - SOLO UNO (Nosotros)
  // ======================================================
  const mobileBtn = document.querySelector(".nav2__mDrop[data-submenu='msubNosotros']");
  const mobileSub = document.getElementById("msubNosotros");

  if (mobileBtn && mobileSub) {
    mobileBtn.addEventListener("click", () => {
      const isOpen = mobileSub.style.display === "block";
      mobileSub.style.display = isOpen ? "none" : "block";
      mobileBtn.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  // ======================================================
  // STICKY HEADER
  // ======================================================
  const header = document.getElementById("siteHeader");

  const setBodyOffset = () => {
    if (!header) return;
    const h = header.offsetHeight; // incluye nav flotante
    document.documentElement.style.setProperty("--header-sticky-h", h + "px");
  };

  const onScroll = () => {
    if (!header) return;
    const isSticky = window.scrollY > 10;
    header.classList.toggle("is-sticky", isSticky);
    document.body.classList.toggle("has-sticky", isSticky);
  };

  // init sticky
  setBodyOffset();
  onScroll();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    setBodyOffset();
    onScroll();
  });

  // ======================================================
  // SUBMENÚ DESKTOP (NOSOTROS) - hover estable + click opcional
  // ======================================================
  const drop = document.getElementById("dropNosotros");
  const btn = drop?.querySelector(".nav2__dropbtn");

  let openTimer = null;
  let closeTimer = null;

  const openDesktopNosotros = () => {
    if (!drop || !btn) return;
    clearTimeout(closeTimer);
    openTimer = setTimeout(() => {
      drop.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }, 80);
  };

  const closeDesktopNosotros = () => {
    if (!drop || !btn) return;
    clearTimeout(openTimer);
    closeTimer = setTimeout(() => {
      drop.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }, 160);
  };

  if (drop) {
    drop.addEventListener("mouseenter", () => {
      if (window.innerWidth <= 900) return;
      openDesktopNosotros();
    });

    drop.addEventListener("mouseleave", () => {
      if (window.innerWidth <= 900) return;
      closeDesktopNosotros();
    });
  }

  if (btn) {
    btn.addEventListener("click", (e) => {
      if (window.innerWidth <= 900) return;
      e.preventDefault();
      const isOpen = drop.classList.contains("is-open");
      if (isOpen) closeDesktopNosotros();
      else openDesktopNosotros();
    });
  }

  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 900) return;
    if (!drop) return;
    if (!e.target.closest("#dropNosotros")) closeDesktopNosotros();
  });

  // ESC cierra todo
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeNav();
      closeDesktopNosotros();
    }
  });

  // Resize: si pasa a desktop, cierra panel; si pasa a móvil, cierra submenu desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeNav();
    else closeDesktopNosotros();
  });

  // ======================================================
  // ✅ ACTIVE LINK AUTOMÁTICO (desktop + mobile)
  // ======================================================
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  // Desktop links
  document.querySelectorAll(".nav2__link").forEach(a => {
    a.classList.remove("active");
    const href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href && href === current) a.classList.add("active");
  });

  // Mobile links
  document.querySelectorAll(".nav2__mLink").forEach(a => {
    a.classList.remove("active");
    const href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href && href === current) a.classList.add("active");
  });

})();
