(function () {
  const THEME_KEY = "globalhr_theme";
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const langToggle = document.getElementById("langToggle");
  const themeToggle = document.getElementById("themeToggle");
  const translatableNodes = document.querySelectorAll("[data-en][data-my]");
  const featuredJobsContainer = document.getElementById("featuredJobs");
  const featuredJobsEmpty = document.getElementById("featuredJobsEmpty");

  function applyLanguage(lang) {
    translatableNodes.forEach((node) => {
      const nextText = node.getAttribute(lang === "my" ? "data-my" : "data-en");
      if (nextText) node.textContent = nextText;
      node.classList.toggle("lang-my", lang === "my");
    });
    document.documentElement.lang = lang === "my" ? "my" : "en";
    localStorage.setItem("globalhr_lang", lang);
  }

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

  function formatDate(value, lang) {
    try {
      const d = new Date(value);
      return d.toLocaleDateString(lang === "my" ? "my-MM" : "en-SG", {
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
    const lang = localStorage.getItem("globalhr_lang") || "en";
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
        '</span></div><p class="mt-3 text-xs text-slate-500 dark:text-slate-400">' +
        (lang === "my" ? "တင်သည့်ရက်စွဲ" : "Posted") +
        ": " +
        formatDate(job.created_at, lang) +
        '</p><div class="mt-4"><a href="' +
        applyHref +
        '" class="inline-flex items-center rounded-md bg-brandBlue px-3 py-2 text-xs font-semibold text-white hover:bg-brandNavy transition-colors">' +
        (lang === "my" ? "လျှောက်ထားမည်" : "Apply") +
        "</a></div>";

      featuredJobsContainer.appendChild(card);
    });
  }

  async function loadFeaturedJobs() {
    if (!featuredJobsContainer || !featuredJobsEmpty) return;
    if (!window.globalHrSupabase) {
      console.error("Supabase client not found. Check js/supabase.js.");
      featuredJobsEmpty.classList.remove("hidden");
      return;
    }

    try {
      const result = await window.globalHrSupabase
        .from("jobs")
        .select("title, company, location, job_type, industry, apply_email, created_at")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);

      if (result.error) throw result.error;
      renderJobs(result.data || []);
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

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      const current = localStorage.getItem("globalhr_lang") || "en";
      const next = current === "en" ? "my" : "en";
      applyLanguage(next);
      if (featuredJobsContainer && featuredJobsEmpty) {
        loadFeaturedJobs();
      }
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = getStoredTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      applyLanguage(localStorage.getItem("globalhr_lang") || "en");
    });
  }

  applyTheme(getStoredTheme());
  applyLanguage(localStorage.getItem("globalhr_lang") || "en");
  if (featuredJobsContainer && featuredJobsEmpty) {
    loadFeaturedJobs();
  }

  function initPrefetchSameOriginHtml() {
    try {
      var origin = window.location.origin;
      var prefetched = {};
      document.querySelectorAll("a[href]").forEach(function (anchor) {
        var raw = anchor.getAttribute("href");
        if (!raw || raw.charAt(0) === "#") return;
        if (/^(mailto:|tel:|javascript:)/i.test(raw)) return;
        var url;
        try {
          url = new URL(raw, window.location.href);
        } catch (err) {
          console.error(err);
          return;
        }
        if (url.origin !== origin) return;
        var path = url.pathname;
        var lower = path.toLowerCase();
        if (lower.indexOf(".html") === -1 && path !== "/" && !/\/index\.html$/i.test(path)) return;

        var canonical = url.origin + url.pathname + url.search;
        var injected = false;
        function injectPrefetch() {
          if (injected) return;
          injected = true;
          if (prefetched[canonical]) return;
          prefetched[canonical] = true;
          var linkEl = document.createElement("link");
          linkEl.rel = "prefetch";
          linkEl.href = canonical;
          document.head.appendChild(linkEl);
        }
        anchor.addEventListener("mouseenter", injectPrefetch, { passive: true });
        anchor.addEventListener("touchstart", injectPrefetch, { passive: true, capture: true });
      });
    } catch (error) {
      console.error(error);
    }
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

  initPrefetchSameOriginHtml();
  initPageEnterMotion();
})();
