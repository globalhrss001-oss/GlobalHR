(function () {
  const PAGE_SIZE = 6;
  const FETCH_LIMIT = 500;

  const jobSearchInput = document.getElementById("jobSearchInput");
  const filterLocation = document.getElementById("filterLocation");
  const filterJobType = document.getElementById("filterJobType");
  const filterIndustry = document.getElementById("filterIndustry");
  const jobResetFilters = document.getElementById("jobResetFilters");
  const jobListGrid = document.getElementById("jobListGrid");
  const jobListEmpty = document.getElementById("jobListEmpty");
  const jobListError = document.getElementById("jobListError");
  const jobLoadMore = document.getElementById("jobLoadMore");
  const jobResultsMeta = document.getElementById("jobResultsMeta");

  if (!jobListGrid || !jobListEmpty) return;

  let allJobs = [];
  let filteredJobs = [];
  let visibleCount = PAGE_SIZE;
  let searchDebounceTimer = null;

  function uniqueSorted(values) {
    return Array.from(new Set(values.filter(Boolean))).sort(function (a, b) {
      return a.localeCompare(b);
    });
  }

  function fillSelect(selectEl, values, allLabel) {
    if (!selectEl) return;
    const prev = selectEl.value;
    selectEl.innerHTML = "";
    const opt0 = document.createElement("option");
    opt0.value = "";
    opt0.textContent = allLabel;
    selectEl.appendChild(opt0);
    values.forEach(function (v) {
      const o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      selectEl.appendChild(o);
    });
    if (prev && values.indexOf(prev) !== -1) {
      selectEl.value = prev;
    } else {
      selectEl.value = "";
    }
  }

  function rebuildFilterOptions() {
    fillSelect(
      filterLocation,
      uniqueSorted(allJobs.map(function (j) { return j.location; })),
      "All locations"
    );
    fillSelect(
      filterJobType,
      uniqueSorted(allJobs.map(function (j) { return j.job_type; })),
      "All types"
    );
    fillSelect(
      filterIndustry,
      uniqueSorted(allJobs.map(function (j) { return j.industry; })),
      "All industries"
    );
  }

  function normalizeText(s) {
    return (s || "").toString().toLowerCase();
  }

  function applyFilters() {
    const kw = normalizeText(jobSearchInput ? jobSearchInput.value : "");
    const loc = filterLocation ? filterLocation.value : "";
    const jt = filterJobType ? filterJobType.value : "";
    const ind = filterIndustry ? filterIndustry.value : "";

    filteredJobs = allJobs.filter(function (job) {
      if (loc && job.location !== loc) return false;
      if (jt && job.job_type !== jt) return false;
      if (ind && job.industry !== ind) return false;
      if (!kw) return true;
      const hay = [
        job.title,
        job.company,
        job.industry,
        job.description,
        job.location,
        job.job_type,
      ]
        .map(normalizeText)
        .join(" ");
      return hay.indexOf(kw) !== -1;
    });

    visibleCount = PAGE_SIZE;
    renderList();
    updateMeta();
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

  function applyHrefFor(job) {
    const email = (job.apply_email || "").trim();
    if (email) {
      return (
        "mailto:" +
        encodeURIComponent(email) +
        "?subject=" +
        encodeURIComponent("Application: " + (job.title || "Job"))
      );
    }
    return "contact.html";
  }

  function truncateDescription(text) {
    const s = (text || "").replace(/\s+/g, " ").trim();
    if (s.length <= 160) return s;
    return s.slice(0, 157) + "…";
  }

  function renderList() {
    jobListGrid.innerHTML = "";
    const slice = filteredJobs.slice(0, visibleCount);

    if (filteredJobs.length === 0) {
      jobListEmpty.classList.remove("hidden");
      const emptyMsg = jobListEmpty.querySelector("p");
      if (emptyMsg) {
        emptyMsg.textContent =
          allJobs.length === 0
            ? "No active job openings right now. Check back soon or contact our team."
            : "No jobs match your filters right now.";
      }
      if (jobLoadMore) jobLoadMore.classList.add("hidden");
      return;
    }

    jobListEmpty.classList.add("hidden");

    slice.forEach(function (job) {
      const card = document.createElement("article");
      card.className =
        "rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 flex flex-col";

      const title = document.createElement("h2");
      title.className = "text-lg font-semibold text-brandNavy dark:text-slate-100";
      title.textContent = job.title || "—";

      const company = document.createElement("p");
      company.className = "mt-1 text-sm text-slate-600 dark:text-slate-300";
      company.textContent = job.company || "—";

      const tags = document.createElement("div");
      tags.className = "mt-3 flex flex-wrap gap-2 text-xs text-slate-700 dark:text-slate-200";

      function addTag(label) {
        const span = document.createElement("span");
        span.className =
          "rounded-full bg-brandLight dark:bg-slate-950 px-2 py-1 border border-slate-200 dark:border-slate-500 text-slate-800 dark:text-slate-200";
        span.textContent = label || "—";
        tags.appendChild(span);
      }
      addTag(job.location);
      addTag(job.job_type);
      addTag(job.industry);

      const desc = document.createElement("p");
      desc.className = "mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1";
      desc.textContent = truncateDescription(job.description);

      const posted = document.createElement("p");
      posted.className = "mt-3 text-xs text-slate-500 dark:text-slate-400";
      posted.textContent = "Posted: " + formatDate(job.created_at);

      const actions = document.createElement("div");
      actions.className = "mt-4";
      const a = document.createElement("a");
      a.href = applyHrefFor(job);
      a.className = "inline-flex items-center rounded-md bg-brandBlue px-3 py-2 text-xs font-semibold text-white hover:bg-brandNavy transition-colors";
      a.textContent = "Apply";
      actions.appendChild(a);

      card.appendChild(title);
      card.appendChild(company);
      card.appendChild(tags);
      card.appendChild(desc);
      card.appendChild(posted);
      card.appendChild(actions);

      jobListGrid.appendChild(card);
    });

    if (jobLoadMore) {
      if (visibleCount < filteredJobs.length) {
        jobLoadMore.classList.remove("hidden");
      } else {
        jobLoadMore.classList.add("hidden");
      }
    }
  }

  function updateMeta() {
    if (!jobResultsMeta) return;
    if (allJobs.length === 0) {
      jobResultsMeta.classList.add("hidden");
      return;
    }
    jobResultsMeta.classList.remove("hidden");
    jobResultsMeta.textContent =
      "Showing " +
      Math.min(visibleCount, filteredJobs.length) +
      " of " +
      filteredJobs.length +
      " matching roles.";
  }

  function showError(message) {
    if (!jobListError) return;
    jobListError.textContent = message;
    jobListError.classList.remove("hidden");
  }

  function hideError() {
    if (!jobListError) return;
    jobListError.classList.add("hidden");
    jobListError.textContent = "";
  }

  async function loadJobs() {
    hideError();
    if (!window.globalHrSheetsJobs) {
      showError("Jobs API not loaded. Check js/sheets-jobs.js.");
      return;
    }

    try {
      allJobs = await window.globalHrSheetsJobs.fetchActiveJobs();
      if (allJobs.length > FETCH_LIMIT) {
        allJobs = allJobs.slice(0, FETCH_LIMIT);
      }
      rebuildFilterOptions();
      applyFilters();
    } catch (error) {
      console.error(error);
      const detail = error && error.message ? String(error.message) : "";
      const base = "Could not load jobs. Please try again later.";
      showError(detail ? base + " (" + detail + ")" : base);
      allJobs = [];
      filteredJobs = [];
      jobListGrid.innerHTML = "";
      jobListEmpty.classList.remove("hidden");
      const emptyMsg = jobListEmpty.querySelector("p");
      if (emptyMsg) {
        emptyMsg.textContent = "Could not load job listings. Please refresh the page.";
      }
      if (jobResultsMeta) jobResultsMeta.classList.add("hidden");
      if (jobLoadMore) jobLoadMore.classList.add("hidden");
    }
  }

  if (jobSearchInput) {
    jobSearchInput.addEventListener("input", function () {
      if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(function () {
        applyFilters();
      }, 220);
    });
  }

  if (filterLocation) filterLocation.addEventListener("change", applyFilters);
  if (filterJobType) filterJobType.addEventListener("change", applyFilters);
  if (filterIndustry) filterIndustry.addEventListener("change", applyFilters);

  if (jobResetFilters) {
    jobResetFilters.addEventListener("click", function () {
      if (jobSearchInput) jobSearchInput.value = "";
      if (filterLocation) filterLocation.value = "";
      if (filterJobType) filterJobType.value = "";
      if (filterIndustry) filterIndustry.value = "";
      rebuildFilterOptions();
      applyFilters();
    });
  }

  if (jobLoadMore) {
    jobLoadMore.addEventListener("click", function () {
      visibleCount += PAGE_SIZE;
      renderList();
      updateMeta();
    });
  }

  loadJobs();
})();
