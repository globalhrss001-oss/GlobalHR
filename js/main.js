(function () {
  const THEME_KEY = "globalhr_theme";
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const themeToggle = document.getElementById("themeToggle");
  const featuredJobsContainer = document.getElementById("featuredJobs");
  const featuredJobsEmpty = document.getElementById("featuredJobsEmpty");

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

  function formatDate(value) {
    try {
      const d = new Date(value);
      return d.toLocaleDateString("en-SG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error(error);
      return value || "";
    }
  }

  function renderJobs(jobs) {
    if (!featuredJobsContainer || !featuredJobsEmpty) return;
    featuredJobsContainer.innerHTML = "";

    if (!Array.isArray(jobs) || jobs.length === 0) {
      featuredJobsEmpty.classList.remove("hidden");
      return;
    }

    featuredJobsEmpty.classList.add("hidden");

    jobs.forEach((job) => {
      const card = document.createElement("article");
      card.className =
        "rounded-xl border border-slate-200 dark:border-slate-700 bg-brandLight dark:bg-slate-800/80 p-5";

      const applyHref = job.apply_email
        ? "mailto:" +
          encodeURIComponent(job.apply_email) +
          "?subject=" +
          encodeURIComponent("Application: " + (job.title || "Job Opening"))
        : "jobs.html";

      card.innerHTML =
        '<h3 class="text-base font-semibold text-brandNavy dark:text-slate-100">' +
        (job.title || "-") +
        '</h3><p class="mt-1 text-sm text-slate-600 dark:text-slate-300">' +
        (job.company || "-") +
        '</p><div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-700 dark:text-slate-200"><span class="rounded-full bg-white px-2 py-1 border border-slate-200 text-slate-800 dark:bg-slate-950 dark:border-slate-500 dark:text-slate-200">' +
        (job.location || "-") +
        '</span><span class="rounded-full bg-white px-2 py-1 border border-slate-200 text-slate-800 dark:bg-slate-950 dark:border-slate-500 dark:text-slate-200">' +
        (job.job_type || "-") +
        '</span><span class="rounded-full bg-white px-2 py-1 border border-slate-200 text-slate-800 dark:bg-slate-950 dark:border-slate-500 dark:text-slate-200">' +
        (job.industry || "-") +
        '</span></div><p class="mt-3 text-xs text-slate-500 dark:text-slate-400">Posted: ' +
        formatDate(job.created_at) +
        '</p><div class="mt-4"><a href="' +
        applyHref +
        '" class="inline-flex items-center rounded-md bg-brandBlue px-3 py-2 text-xs font-semibold text-white hover:bg-brandNavy transition-colors">Apply</a></div>';

      featuredJobsContainer.appendChild(card);
    });
  }

  async function loadFeaturedJobs() {
    if (!featuredJobsContainer || !featuredJobsEmpty) return;
    if (!window.globalHrSheetsJobs) {
      console.error("Jobs API not found. Check js/sheets-jobs.js.");
      featuredJobsEmpty.classList.remove("hidden");
      return;
    }

    try {
      const jobs = await window.globalHrSheetsJobs.fetchActiveJobs();
      renderJobs(jobs.slice(0, 3));
    } catch (error) {
      console.error(error);
      featuredJobsEmpty.classList.remove("hidden");
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
  if (featuredJobsContainer && featuredJobsEmpty) {
    loadFeaturedJobs();
  }

  function warmJobsCache() {
    if (!window.globalHrSheetsJobs || typeof window.globalHrSheetsJobs.prefetch !== "function") {
      return;
    }
    if (currentPublicHtmlFile() === "jobs.html") return;
    window.globalHrSheetsJobs.prefetch();
  }

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(warmJobsCache, { timeout: 2000 });
  } else {
    setTimeout(warmJobsCache, 400);
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
    jobs: "jobs.html",
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
    document.querySelectorAll("header nav a[href], #mobileMenu a[href]").forEach(function (a) {
      var raw = a.getAttribute("href");
      if (!raw || raw.charAt(0) === "#" || /^mailto:/i.test(raw)) return;
      var file = resolvePublicHtmlFile(raw);
      if (file !== here) return;
      a.classList.add("text-brandBlue", "dark:text-sky-400", "font-semibold");
      a.setAttribute("aria-current", "page");
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
})();
