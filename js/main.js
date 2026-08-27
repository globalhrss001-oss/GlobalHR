(function () {
  const THEME_KEY = "globalhr_theme";
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const themeToggle = document.getElementById("themeToggle");

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  }

  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    const root = document.documentElement;
    if (next === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      console.error(e);
    }
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = getStoredTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  applyTheme(getStoredTheme());

  function initPageEnterMotion() {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      var mainEl = document.querySelector("main");
      if (!mainEl) return;
      window.requestAnimationFrame(function () {
        mainEl.classList.add("globalhr-page-enter");
      });
    } catch (error) {
      console.error(error);
    }
  }

  var PUBLIC_PAGE_SLUGS = {
    index: "index.html",
    about: "about.html",
    services: "services.html",
    training: "training.html",
    news: "news.html",
    updates: "news.html",
    contact: "contact.html",
  };

  function resolvePublicHtmlFile(hrefOrPath) {
    try {
      var path;
      if (hrefOrPath && (hrefOrPath.indexOf("://") !== -1 || hrefOrPath.charAt(0) === "/")) {
        path = new URL(hrefOrPath, window.location.href).pathname;
      } else if (hrefOrPath) {
        path = "/" + String(hrefOrPath).replace(/^\.\//, "");
      } else {
        path = window.location.pathname || "/";
      }
      var last = path.replace(/\\/g, "/").split("/").filter(Boolean).pop() || "";
      last = last.split("?")[0].toLowerCase();
      if (!last) return "index.html";
      if (/\.html$/i.test(last)) return last;
      if (PUBLIC_PAGE_SLUGS[last]) return PUBLIC_PAGE_SLUGS[last];
      return last + ".html";
    } catch (e) {
      return "index.html";
    }
  }

  function currentPublicHtmlFile() {
    return resolvePublicHtmlFile(window.location.href);
  }

  function initActivePublicNav() {
    var here = currentPublicHtmlFile();
    var selectors =
      "header .site-nav__link[href], header .site-mega__link[href], #mobileMenu .site-mobile__link[href], #mobileMenu .site-mobile__sublink[href]";
    document.querySelectorAll(selectors).forEach(function (a) {
      var raw = a.getAttribute("href");
      if (!raw || raw.charAt(0) === "#" || /^mailto:/i.test(raw)) return;
      var file = resolvePublicHtmlFile(raw);
      if (file !== here) return;
      a.classList.add("text-brandBlue", "dark:text-sky-400", "font-semibold");
      a.setAttribute("aria-current", "page");
      var megaItem = a.closest(".site-nav__item--mega");
      if (megaItem) megaItem.classList.add("is-active");
    });
  }

  function initHeroSlideshow() {
    var root = document.querySelector("[data-hero-slideshow]");
    if (!root) return;

    var slides = root.querySelectorAll("[data-hero-slide]");
    var dots = root.querySelectorAll("[data-hero-dot]");
    if (!slides.length) return;

    var index = 0;
    var timer = null;
    var intervalMs = 5000;
    var reducedMotion = false;

    try {
      reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      reducedMotion = false;
    }

    function goTo(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var active = i === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });
      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", active ? "true" : "false");
      });
    }

    function next() {
      goTo(index + 1);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      if (reducedMotion || slides.length < 2) return;
      stop();
      timer = setInterval(next, intervalMs);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        goTo(i);
        start();
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    goTo(0);
    start();
  }

  initActivePublicNav();
  initPageEnterMotion();
  initHeroSlideshow();
  if (typeof window.initPhotoLightbox === "function") window.initPhotoLightbox();

  if (!/\/admin(\/|$)/i.test(window.location.pathname || "") && !/subscribe\.html/i.test(window.location.pathname || "")) {
    var popupScript = document.createElement("script");
    popupScript.src = "js/job-alert-popup.js?v=20260707b";
    popupScript.defer = true;
    document.body.appendChild(popupScript);
  }
})();
