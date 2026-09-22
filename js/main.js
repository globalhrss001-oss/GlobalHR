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
    markets: "markets.html",
    japan: "japan.html",
    titp: "japan-titp.html",
    training: "training.html",
    news: "news.html",
    updates: "news.html",
    contact: "contact.html",
  };

  var NAV_FILE_ALIASES = {
    "markets.html": "services.html",
    "japan.html": "services.html",
    "japan-titp.html": "services.html",
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
    var hereNav = NAV_FILE_ALIASES[here] || here;
    var selectors =
      "header .site-nav__link[href], header .site-mega__link[href], #mobileMenu .site-mobile__link[href], #mobileMenu .site-mobile__sublink[href]";
    document.querySelectorAll(selectors).forEach(function (a) {
      var raw = a.getAttribute("href");
      if (!raw || raw.charAt(0) === "#" || /^mailto:/i.test(raw)) return;
      var file = resolvePublicHtmlFile(raw);
      if (file !== here && file !== hereNav) return;
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
      section.setAttribute("data-reveal", "fade");
    });
  }

  function revealKind(el) {
    var raw = (el.getAttribute("data-reveal") || "fade").trim().toLowerCase();
    if (raw === "left" || raw === "right" || raw === "up") return raw;
    return "fade";
  }

  function finishReveal(el) {
    el.classList.add("is-inview");
    el.addEventListener("transitionend", function onEnd(event) {
      if (event.propertyName !== "opacity") return;
      el.classList.remove("js-reveal", "js-reveal--left", "js-reveal--right", "js-reveal--up");
      el.style.transitionDelay = "";
      el.removeEventListener("transitionend", onEnd);
    });
    if (el.closest(".home-what-we-do")) return;
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
    var kind = revealKind(el);
    if (kind !== "fade") el.classList.add("js-reveal--" + kind);
    var delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
    if (delay > 0) el.style.transitionDelay = delay + "ms";
    return true;
  }

  function isRevealInView(el) {
    if (el.closest(".home-what-we-do")) return false;
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight || 0;
    return rect.top < vh * 0.42 && rect.bottom > 72;
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

  function initBackToTop() {
    if (isAdminPath()) return;
    if (currentPublicHtmlFile() === "contact.html") return;
    if (document.getElementById("backToTop")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "backToTop";
    btn.className = "back-to-top";
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M6 14l6-6 6 6"/></svg>';
    document.body.appendChild(btn);

    function setLabel() {
      var label = "Back to top";
      if (window.GlobalHrI18n && typeof window.GlobalHrI18n.t === "function") {
        label = window.GlobalHrI18n.t("nav.backToTop", label);
      }
      btn.setAttribute("aria-label", label);
    }

    function sync() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      btn.classList.toggle("is-visible", y > 420);
    }

    setLabel();
    if (window.GlobalHrI18n && typeof window.GlobalHrI18n.onChange === "function") {
      window.GlobalHrI18n.onChange(setLabel);
    }

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    });
    window.addEventListener("scroll", sync, { passive: true });
    sync();
  }

  initActivePublicNav();
  document.addEventListener("globalhr:nav-rendered", initActivePublicNav);
  function initHomeCountryMarquee() {
    var root = document.querySelector(".home-marquee");
    if (!root) return;
    var viewport = root.querySelector(".home-marquee__viewport");
    var track = root.querySelector(".home-marquee__track");
    if (!viewport || !track) return;
    var source = track.querySelector(".home-marquee__list");
    if (!source) return;

    function fill() {
      if (prefersReducedMotion()) {
        track.style.removeProperty("--marquee-shift");
        return;
      }
      track.querySelectorAll("[data-marquee-clone]").forEach(function (node) {
        node.parentNode.removeChild(node);
      });
      var guard = 0;
      var viewportWidth = viewport.clientWidth || 0;
      while (viewportWidth > 0 && track.scrollWidth < viewportWidth * 2 && guard < 6) {
        var clone = source.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("data-marquee-clone", "true");
        track.appendChild(clone);
        guard += 1;
      }
      var sourceWidth = source.offsetWidth || 0;
      if (sourceWidth > 0) {
        track.style.setProperty("--marquee-shift", "-" + sourceWidth + "px");
      }
    }

    fill();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fill).catch(function () {});
    }
    window.addEventListener("resize", fill);
    if (window.GlobalHrI18n && typeof window.GlobalHrI18n.onChange === "function") {
      window.GlobalHrI18n.onChange(fill);
    }
  }

  function formatCount(value, suffix) {
    var text = String(Math.round(value));
    text = text.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return suffix ? text + suffix : text;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount(el, to, suffix, duration) {
    var start = null;
    function frame(now) {
      if (start == null) start = now;
      var progress = Math.min(1, (now - start) / duration);
      el.textContent = formatCount(to * easeOutCubic(progress), suffix);
      if (progress < 1) {
        window.requestAnimationFrame(frame);
        return;
      }
      el.textContent = formatCount(to, suffix);
    }
    window.requestAnimationFrame(frame);
  }

  function initStatsCountUp() {
    if (isAdminPath()) return;
    var section = document.querySelector(".home-stats-section");
    if (!section) return;
    var nodes = section.querySelectorAll("[data-count]");
    if (!nodes.length) return;

    function showFinal() {
      nodes.forEach(function (el) {
        var to = parseInt(el.getAttribute("data-count"), 10) || 0;
        var suffix = el.getAttribute("data-count-suffix") || "";
        el.textContent = formatCount(to, suffix);
      });
    }

    if (prefersReducedMotion()) {
      showFinal();
      return;
    }

    nodes.forEach(function (el) {
      el.textContent = formatCount(0, el.getAttribute("data-count-suffix") || "");
    });

    function start() {
      if (section.getAttribute("data-stats-counted") === "1") return;
      section.setAttribute("data-stats-counted", "1");
      nodes.forEach(function (el, index) {
        var to = parseInt(el.getAttribute("data-count"), 10) || 0;
        var suffix = el.getAttribute("data-count-suffix") || "";
        window.setTimeout(function () {
          animateCount(el, to, suffix, 1100);
        }, index * 90);
      });
    }

    if (!("IntersectionObserver" in window)) {
      start();
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          io.disconnect();
          start();
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(section);
  }

  initPageEnterMotion();
  initHeroSlideshow();
  initHomeCountryMarquee();
  initScrollReveal();
  initStatsCountUp();
  initBackToTop();

  if (!/\/admin(\/|$)/i.test(window.location.pathname || "") && !/subscribe\.html/i.test(window.location.pathname || "")) {
    var popupScript = document.createElement("script");
    popupScript.src = "js/job-alert-popup.js?v=20260904a";
    popupScript.defer = true;
    document.body.appendChild(popupScript);
  }
})();
