(function () {
  const SHEETS_JOBS_API_URL =
    "https://script.google.com/macros/s/AKfycbwKbgMArssmh7d5uoJTzykiNWUhYcrGZFgfewt5EUnjBWtIWz29Wv4Q9T1pNB8wq6qy/exec";
  const CACHE_KEY = "globalhr_jobs_v1";
  const CACHE_TTL_MS = 10 * 60 * 1000;

  let inFlight = null;

  function buildUrl(forceRefresh) {
    const base = SHEETS_JOBS_API_URL.replace(/\/$/, "");
    let url = base + "?status=all";
    if (forceRefresh) url += "&_=" + Date.now();
    return url;
  }

  function normalizeStatus(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function filterByStatus(jobs, status) {
    if (!status || status === "all") return jobs;
    const want = normalizeStatus(status);
    return jobs.filter(function (job) {
      return normalizeStatus(job.status || "active") === want;
    });
  }

  function isSampleJob(job) {
    if (!job) return false;
    if (job.is_sample === true || job.is_demo === true) return true;
    var status = normalizeStatus(job.status || "");
    if (status === "sample" || status === "beta" || status === "demo") return true;
    return /^demo-/i.test(String(job.id || ""));
  }

  function getDemoActiveJobs() {
    if (!window.globalHrDemoJobs || !Array.isArray(window.globalHrDemoJobs)) return [];
    return window.globalHrDemoJobs.filter(function (job) {
      var status = normalizeStatus(job.status || "active");
      return status === "active" || status === "sample" || status === "beta" || status === "demo";
    });
  }

  function ensureActiveJobs(jobs) {
    const active = filterByStatus(jobs, "active");
    if (active.length > 0) return active;
    return getDemoActiveJobs();
  }

  function readCache() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.jobs) || !parsed.ts) return null;
      if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      return parsed.jobs;
    } catch (e) {
      return null;
    }
  }

  function writeCache(jobs) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), jobs: jobs }));
    } catch (e) {
      /* quota or private mode */
    }
  }

  function isCacheStale() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return true;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.ts) return true;
      return Date.now() - parsed.ts > CACHE_TTL_MS;
    } catch (e) {
      return true;
    }
  }

  async function fetchAllJobsFromNetwork(forceRefresh) {
    const url = buildUrl(!!forceRefresh);
    const res = await fetch(url, { method: "GET", cache: "no-store", credentials: "omit" });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Jobs API response was not JSON:", text.slice(0, 200));
      throw new Error("Invalid response from Google Sheets jobs API.");
    }
    if (!data || data.ok !== true) {
      const msg = (data && data.error) || "Could not load jobs from Google Sheets.";
      throw new Error(msg);
    }
    const jobs = Array.isArray(data.jobs) ? data.jobs : [];
    writeCache(jobs);
    return jobs;
  }

  function revalidateInBackground() {
    if (inFlight) return;
    inFlight = fetchAllJobsFromNetwork(true)
      .catch(function () {
        /* keep showing cached data */
      })
      .finally(function () {
        inFlight = null;
      });
  }

  async function fetchAllJobsFromApi() {
    if (inFlight) return inFlight;

    const cached = readCache();
    if (cached) {
      if (isCacheStale()) revalidateInBackground();
      return cached;
    }

    inFlight = fetchAllJobsFromNetwork(false).finally(function () {
      inFlight = null;
    });
    return inFlight;
  }

  async function fetchJobs(status) {
    const jobs = await fetchAllJobsFromApi();
    return filterByStatus(jobs, status || "all");
  }

  function prefetch() {
    if (readCache() && !isCacheStale()) return;
    if (inFlight) return;
    if (readCache()) {
      revalidateInBackground();
      return;
    }
    inFlight = fetchAllJobsFromNetwork(false).finally(function () {
      inFlight = null;
    });
  }

  window.globalHrSheetsJobs = {
    apiUrl: SHEETS_JOBS_API_URL,
    fetchJobs: fetchJobs,
    fetchActiveJobs: function () {
      return fetchJobs("active").then(ensureActiveJobs);
    },
    fetchAllJobs: function () {
      return fetchJobs("all");
    },
    getCachedActiveJobs: function () {
      const cached = readCache();
      if (!cached) return getDemoActiveJobs().length ? getDemoActiveJobs() : null;
      return ensureActiveJobs(cached);
    },
    prefetch: prefetch,
    isSampleJob: isSampleJob,
  };
})();
