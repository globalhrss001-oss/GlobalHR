(function () {
  const SHEETS_JOBS_API_URL =
    "https://script.google.com/macros/s/AKfycbwKbgMArssmh7d5uoJTzykiNWUhYcrGZFgfewt5EUnjBWtIWz29Wv4Q9T1pNB8wq6qy/exec";

  function buildUrl() {
    const base = SHEETS_JOBS_API_URL.replace(/\/$/, "");
    return base + "?status=all&_=" + Date.now();
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

  async function fetchAllJobsFromApi() {
    const url = buildUrl();
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
    return Array.isArray(data.jobs) ? data.jobs : [];
  }

  async function fetchJobs(status) {
    const jobs = await fetchAllJobsFromApi();
    return filterByStatus(jobs, status || "all");
  }

  window.globalHrSheetsJobs = {
    apiUrl: SHEETS_JOBS_API_URL,
    fetchJobs: fetchJobs,
    fetchActiveJobs: function () {
      return fetchJobs("active");
    },
    fetchAllJobs: function () {
      return fetchJobs("all");
    },
  };
})();
