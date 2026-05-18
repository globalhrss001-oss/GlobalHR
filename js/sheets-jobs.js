(function () {
  const SHEETS_JOBS_API_URL =
    "https://script.google.com/macros/s/AKfycbwKbgMArssmh7d5uoJTzykiNWUhYcrGZFgfewt5EUnjBWtIWz29Wv4Q9T1pNB8wq6qy/exec";

  function buildUrl(status) {
    const base = SHEETS_JOBS_API_URL.replace(/\/$/, "");
    const q = status ? "?status=" + encodeURIComponent(status) : "";
    return base + q;
  }

  async function fetchJobs(status) {
    const url = buildUrl(status || "active");
    const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
    const data = await res.json().catch(function () {
      return {};
    });
    if (!res.ok || !data || data.ok !== true) {
      const msg = (data && data.error) || res.statusText || "Could not load jobs from Google Sheets.";
      throw new Error(msg);
    }
    return Array.isArray(data.jobs) ? data.jobs : [];
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
