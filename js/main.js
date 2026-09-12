(function () {
  const THEME_KEY = "globalhr_theme";

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

  function toggleTheme() {
    applyTheme(getStoredTheme() === "dark" ? "light" : "dark");
  }

  window.globalHrTheme = {
    get: getStoredTheme,
    apply: applyTheme,
    toggle: toggleTheme,
  };

  applyTheme(getStoredTheme());

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle && !document.getElementById("siteHeader")) {
    themeToggle.addEventListener("click", toggleTheme);
  }

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

  var revealObserver = null;

  function prefersReducedMotion() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }

  function isAdminPath() {
    return /\/admin(\/|$)/i.test(window.location.pathname || "");
  }

  function markSectionReveals() {
    document.querySelectorAll("main > section").forEach(function (section) {
      if (section.classList.contains("home-hero") || section.classList.contains("page-hero")) return;
      if (section.hasAttribute("data-reveal-skip")) return;
      if (section.hasAttribute("data-reveal")) return;
      if (section.querySelector("[data-reveal]")) return;
      section.setAttribute("data-reveal", "");
    });
  }

  function finishReveal(el) {
    el.classList.add("is-inview");
    el.addEventListener("transitionend", function onEnd(event) {
      if (event.propertyName !== "opacity") return;
      el.classList.remove("js-reveal");
      el.style.transitionDelay = "";
      el.removeEventListener("transitionend", onEnd);
    });
    var prev = el.previousElementSibling;
    while (prev) {
      if (prev.hasAttribute("data-reveal") && prev.classList.contains("js-reveal") && !prev.classList.contains("is-inview")) {
        if (revealObserver) revealObserver.unobserve(prev);
        prev.classList.add("is-inview");
      }
      prev = prev.previousElementSibling;
    }
  }

  function prepareRevealEl(el) {
    if (!el || el.classList.contains("js-reveal") || el.classList.contains("is-inview")) return false;
    el.classList.add("js-reveal");
    var delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
    if (delay > 0) el.style.transitionDelay = delay + "ms";
    return true;
  }

  function isRevealInView(el) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight || 0;
    return rect.top < vh * 0.85 && rect.bottom > 72;
  }

  function initScrollReveal() {
    if (isAdminPath() || prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    markSectionReveals();
    var nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            revealObserver.unobserve(entry.target);
            finishReveal(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
      );
    }

    nodes.forEach(function (el) {
      if (el.classList.contains("js-reveal") || el.classList.contains("is-inview")) return;
      if (isRevealInView(el)) {
        el.classList.add("is-inview");
        return;
      }
      if (!prepareRevealEl(el)) return;
      revealObserver.observe(el);
    });
  }

  window.globalHrReveal = {
    refresh: initScrollReveal,
  };

  initActivePublicNav();
  document.addEventListener("globalhr:nav-rendered", initActivePublicNav);
  initPageEnterMotion();
  initHeroSlideshow();
  initScrollReveal();
  if (typeof window.initPhotoLightbox === "function") window.initPhotoLightbox();

  if (!/\/admin(\/|$)/i.test(window.location.pathname || "") && !/subscribe\.html/i.test(window.location.pathname || "")) {
    var popupScript = document.createElement("script");
    popupScript.src = "js/job-alert-popup.js?v=20260904a";
    popupScript.defer = true;
    document.body.appendChild(popupScript);
  }
})();
