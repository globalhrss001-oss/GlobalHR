(function () {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const langToggle = document.getElementById("langToggle");
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
    const lang = localStorage.getItem("globalhr_lang") || "en";
    featuredJobsContainer.innerHTML = "";

    if (!Array.isArray(jobs) || jobs.length === 0) {
      featuredJobsEmpty.classList.remove("hidden");
      return;
    }

    featuredJobsEmpty.classList.add("hidden");

    jobs.forEach((job) => {
      const card = document.createElement("article");
      card.className = "rounded-xl border border-slate-200 bg-brandLight p-5";

      const applyHref = job.apply_email
        ? "mailto:" +
          encodeURIComponent(job.apply_email) +
          "?subject=" +
          encodeURIComponent("Application: " + (job.title || "Job Opening"))
        : "jobs.html";

      card.innerHTML =
        '<h3 class="text-base font-semibold text-brandNavy">' +
        (job.title || "-") +
        '</h3><p class="mt-1 text-sm text-slate-600">' +
        (job.company || "-") +
        '</p><div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-700"><span class="rounded-full bg-white px-2 py-1 border border-slate-200">' +
        (job.location || "-") +
        '</span><span class="rounded-full bg-white px-2 py-1 border border-slate-200">' +
        (job.job_type || "-") +
        '</span><span class="rounded-full bg-white px-2 py-1 border border-slate-200">' +
        (job.industry || "-") +
        '</span></div><p class="mt-3 text-xs text-slate-500">' +
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
    if (!window.supabase) {
      console.error("Supabase client not found. Check js/supabase.js.");
      featuredJobsEmpty.classList.remove("hidden");
      return;
    }

    try {
      const result = await supabase
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
      loadFeaturedJobs();
    });
  }

  applyLanguage(localStorage.getItem("globalhr_lang") || "en");
  loadFeaturedJobs();
})();
