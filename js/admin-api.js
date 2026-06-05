(function () {
  var SESSION_KEY = "globalhr_admin_session_v1";

  function apiUrl() {
    return (
      (window.GLOBAL_HR_CMS_API_URL || "").replace(/\/$/, "") ||
      (window.globalHrSheetsJobs && window.globalHrSheetsJobs.apiUrl) ||
      ""
    );
  }

  function readSession() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.token || !parsed.username) return null;
      if (parsed.exp && Date.now() > parsed.exp) {
        clearSession();
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function writeSession(data) {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        token: data.token,
        username: data.username,
        exp: Date.now() + 12 * 60 * 60 * 1000,
      })
    );
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  function clearPublicJobsCache() {
    try {
      sessionStorage.removeItem("globalhr_jobs_v1");
    } catch (e) {
      /* ignore */
    }
    if (window.globalHrSheetsJobs && typeof window.globalHrSheetsJobs.clearCache === "function") {
      window.globalHrSheetsJobs.clearCache();
    }
  }

  async function post(action, payload) {
    var url = apiUrl();
    if (!url) {
      throw new Error("CMS API URL is not configured. Update js/cms-config.js.");
    }

    var body = Object.assign({ action: action }, payload || {});
    var session = readSession();
    if (session && session.token && action !== "login") {
      body.token = session.token;
    }

    var res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
      redirect: "follow",
      cache: "no-store",
    });

    var text = await res.text();
    var data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Admin API response was not JSON:", text.slice(0, 200));
      throw new Error("Invalid response from admin API.");
    }

    if (!data || data.ok !== true) {
      throw new Error((data && data.error) || "Request failed.");
    }

    return data;
  }

  window.globalHrAdminApi = {
    getSession: readSession,
    login: async function (username, password) {
      var data = await post("login", {
        username: username,
        password: password,
      });
      writeSession({ token: data.token, username: data.username });
      return data;
    },
    logout: async function () {
      var session = readSession();
      try {
        if (session && session.token) {
          await post("logout", { token: session.token });
        }
      } catch (e) {
        console.error(e);
      }
      clearSession();
    },
    listJobs: async function () {
      var data = await post("list", {});
      return data.jobs || [];
    },
    createJob: async function (job) {
      var data = await post("create", { job: job });
      clearPublicJobsCache();
      return data.job;
    },
    updateJob: async function (id, job) {
      var data = await post("update", { id: id, job: job });
      clearPublicJobsCache();
      return data.job;
    },
    deleteJob: async function (id) {
      await post("delete", { id: id });
      clearPublicJobsCache();
    },
    toggleJobStatus: async function (id) {
      var data = await post("toggleStatus", { id: id });
      clearPublicJobsCache();
      return data.job;
    },
  };
})();
