(() => {
  const backToTopBtn = document.createElement("button");
  backToTopBtn.type = "button";
  backToTopBtn.className = "ux-backtotop";
  backToTopBtn.setAttribute("aria-label", "Volver arriba");
  backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(backToTopBtn);

  const toggleBackToTop = () => {
    const shouldShow = window.scrollY > 420;
    backToTopBtn.classList.toggle("is-visible", shouldShow);
  };

  backToTopBtn.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  });

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();
})();
