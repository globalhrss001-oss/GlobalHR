(function () {
  var api = window.globalHrAdminApi;

  function t(en) {
    return en;
  }

  function showEl(el, msg) {
    if (!el) return;
    el.textContent = msg || "";
    if (msg) el.classList.remove("hidden");
    else el.classList.add("hidden");
  }

  function initPasswordToggle(passInput, toggleBtn) {
    if (!passInput || !toggleBtn) return;

    var eyeShow = document.getElementById("loginPasswordEyeShow");
    var eyeHide = document.getElementById("loginPasswordEyeHide");

    function setVisible(visible) {
      passInput.type = visible ? "text" : "password";
      toggleBtn.setAttribute("aria-pressed", visible ? "true" : "false");
      toggleBtn.setAttribute("aria-label", visible ? "Hide password" : "Show password");
      toggleBtn.title = visible ? "Hide password" : "Show password";
      if (eyeShow) eyeShow.classList.toggle("hidden", visible);
      if (eyeHide) eyeHide.classList.toggle("hidden", !visible);
    }

    toggleBtn.addEventListener("click", function () {
      setVisible(passInput.type === "password");
    });
  }

  function initAdminLogin() {
    var form = document.getElementById("adminLoginForm");
    var errEl = document.getElementById("loginError");
    if (!form || !api) {
      if (!api) showEl(errEl, "Admin API not loaded.");
      return;
    }

    if (api.getSession()) {
      window.location.href = "dashboard.html";
      return;
    }

    var passInput = document.getElementById("loginPassword");
    var passToggle = document.getElementById("loginPasswordToggle");
    initPasswordToggle(passInput, passToggle);

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      showEl(errEl, "");

      var userInput = document.getElementById("loginUsername");
      var username = userInput ? userInput.value.trim() : "";
      var password = passInput ? passInput.value : "";

      try {
        await api.login(username, password);
        window.location.href = "dashboard.html";
      } catch (error) {
        console.error(error);
        var msg =
          error && error.message
            ? error.message
            : t("Sign-in failed. Check your username and password.");
        showEl(errEl, msg);
      }
    });
  }

  function initAdminDashboard() {
    var tableBody = document.getElementById("jobTableBody");
    var tableEmpty = document.getElementById("jobTableEmpty");
    var dashErr = document.getElementById("dashboardError");
    var logoutBtn = document.getElementById("logoutBtn");
    var addJobBtn = document.getElementById("addJobBtn");
    var modal = document.getElementById("jobModal");
    var modalClose = document.getElementById("jobModalClose");
    var jobForm = document.getElementById("jobForm");
    var jobFormCancel = document.getElementById("jobFormCancel");
    var jobFormError = document.getElementById("jobFormError");
    var jobModalTitle = document.getElementById("jobModalTitle");
    var adminUserEmail = document.getElementById("adminUserEmail");

    var fId = document.getElementById("fId");
    var fTitle = document.getElementById("fTitle");
    var fCompany = document.getElementById("fCompany");
    var fLocation = document.getElementById("fLocation");
    var fJobType = document.getElementById("fJobType");
    var fIndustry = document.getElementById("fIndustry");
    var fDescription = document.getElementById("fDescription");
    var fApplyEmail = document.getElementById("fApplyEmail");
    var fStatus = document.getElementById("fStatus");

    if (!tableBody || !api) {
      if (!api) showEl(dashErr, "Admin API not loaded.");
      return;
    }

    var jobsCache = [];

    function showDashError(msg) {
      showEl(dashErr, msg || "");
    }

    function openModal() {
      if (!modal) return;
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
      showEl(jobFormError, "");
    }

    function resetForm() {
      if (fId) fId.value = "";
      if (fTitle) fTitle.value = "";
      if (fCompany) fCompany.value = "";
      if (fLocation) fLocation.selectedIndex = 0;
      if (fJobType) fJobType.selectedIndex = 0;
      if (fIndustry) fIndustry.value = "";
      if (fDescription) fDescription.value = "";
      if (fApplyEmail) fApplyEmail.value = "apply@globalhrss.com";
      if (fStatus) fStatus.value = "active";
    }

    function openAddModal() {
      resetForm();
      if (jobModalTitle) jobModalTitle.textContent = t("Add new job");
      openModal();
    }

    function openEditModal(job) {
      resetForm();
      if (jobModalTitle) jobModalTitle.textContent = t("Edit job");
      if (fId) fId.value = job.id || "";
      if (fTitle) fTitle.value = job.title || "";
      if (fCompany) fCompany.value = job.company || "";
      if (fLocation) fLocation.value = job.location || "Myanmar";
      if (fJobType) fJobType.value = job.job_type || "Full-time";
      if (fIndustry) fIndustry.value = job.industry || "";
      if (fDescription) fDescription.value = job.description || "";
      if (fApplyEmail) fApplyEmail.value = job.apply_email || "";
      if (fStatus) fStatus.value = job.status === "hidden" ? "hidden" : "active";
      openModal();
    }

    function renderTable(rows) {
      tableBody.innerHTML = "";
      if (!rows || rows.length === 0) {
        tableEmpty.classList.remove("hidden");
        return;
      }
      tableEmpty.classList.add("hidden");

      rows.forEach(function (job) {
        var tr = document.createElement("tr");
        tr.className = "hover:bg-slate-50/80 dark:hover:bg-slate-800/60";

        var tdTitle = document.createElement("td");
        tdTitle.className = "px-4 py-3 font-medium text-brandDark dark:text-slate-100";
        tdTitle.textContent = job.title || "—";

        var tdLoc = document.createElement("td");
        tdLoc.className = "px-4 py-3 text-slate-700 dark:text-slate-200";
        tdLoc.textContent = job.location || "—";

        var tdType = document.createElement("td");
        tdType.className = "px-4 py-3 text-slate-700 dark:text-slate-200";
        tdType.textContent = job.job_type || "—";

        var tdStatus = document.createElement("td");
        tdStatus.className = "px-4 py-3";
        var badge = document.createElement("span");
        var active = job.status === "active";
        badge.className =
          "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold " +
          (active
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
            : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200");
        badge.textContent = job.status || "—";
        tdStatus.appendChild(badge);

        var tdAct = document.createElement("td");
        tdAct.className = "px-4 py-3 text-right whitespace-nowrap text-slate-500 dark:text-slate-400";

        var btnToggle = document.createElement("button");
        btnToggle.type = "button";
        btnToggle.className =
          "mr-2 text-xs font-semibold text-brandPurple hover:text-brandNavy dark:text-violet-300 dark:hover:text-slate-100 transition-colors";
        btnToggle.textContent = active ? "Hide" : "Show";
        btnToggle.setAttribute("data-action", "toggle");
        btnToggle.setAttribute("data-id", job.id);

        var btnEdit = document.createElement("button");
        btnEdit.type = "button";
        btnEdit.className =
          "mr-2 text-xs font-semibold text-brandBlue hover:text-brandNavy dark:text-sky-400 dark:hover:text-slate-100 transition-colors";
        btnEdit.textContent = "Edit";
        btnEdit.setAttribute("data-action", "edit");
        btnEdit.setAttribute("data-id", job.id);

        var btnDel = document.createElement("button");
        btnDel.type = "button";
        btnDel.className =
          "text-xs font-semibold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors";
        btnDel.textContent = "Delete";
        btnDel.setAttribute("data-action", "delete");
        btnDel.setAttribute("data-id", job.id);

        tdAct.appendChild(btnToggle);
        tdAct.appendChild(btnEdit);
        tdAct.appendChild(btnDel);

        tr.appendChild(tdTitle);
        tr.appendChild(tdLoc);
        tr.appendChild(tdType);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAct);

        tableBody.appendChild(tr);
      });
    }

    async function loadJobs() {
      showDashError("");
      try {
        jobsCache = await api.listJobs();
        renderTable(jobsCache);
      } catch (error) {
        console.error(error);
        showDashError(
          (error && error.message ? String(error.message) : "") || "Could not load jobs."
        );
        jobsCache = [];
        renderTable([]);
      }
    }

    function findJob(id) {
      return jobsCache.find(function (j) {
        return j.id === id;
      });
    }

    tableBody.addEventListener("click", async function (e) {
      var btn = e.target.closest("button[data-action]");
      if (!btn) return;
      var id = btn.getAttribute("data-id");
      var action = btn.getAttribute("data-action");
      var job = findJob(id);
      if (!job) return;

      if (action === "edit") {
        openEditModal(job);
        return;
      }

      if (action === "delete") {
        var ok = window.confirm(t("Delete this job permanently?"));
        if (!ok) return;
        try {
          await api.deleteJob(id);
          await loadJobs();
        } catch (error) {
          console.error(error);
          showDashError((error && error.message) || t("Delete failed."));
        }
        return;
      }

      if (action === "toggle") {
        try {
          await api.toggleJobStatus(id);
          await loadJobs();
        } catch (error) {
          console.error(error);
          showDashError((error && error.message) || t("Update failed."));
        }
      }
    });

    if (addJobBtn) {
      addJobBtn.addEventListener("click", function () {
        openAddModal();
      });
    }

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (jobFormCancel) jobFormCancel.addEventListener("click", closeModal);

    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
      });
    }

    if (jobForm) {
      jobForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        showEl(jobFormError, "");

        var idVal = fId && fId.value ? fId.value.trim() : "";
        var payload = {
          title: (fTitle && fTitle.value.trim()) || "",
          company: (fCompany && fCompany.value.trim()) || "",
          location: fLocation ? fLocation.value : "",
          job_type: fJobType ? fJobType.value : "",
          industry: (fIndustry && fIndustry.value.trim()) || "",
          description: (fDescription && fDescription.value.trim()) || "",
          apply_email: fApplyEmail && fApplyEmail.value.trim() ? fApplyEmail.value.trim() : "",
          status: fStatus ? fStatus.value : "active",
        };

        try {
          if (idVal) {
            await api.updateJob(idVal, payload);
          } else {
            await api.createJob(payload);
          }
          closeModal();
          await loadJobs();
        } catch (error) {
          console.error(error);
          showEl(jobFormError, (error && error.message) || t("Save failed."));
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async function () {
        try {
          await api.logout();
        } catch (error) {
          console.error(error);
        }
        window.location.href = "index.html";
      });
    }

    (async function () {
      var session = api.getSession();
      if (!session) {
        window.location.href = "index.html";
        return;
      }
      if (adminUserEmail) {
        adminUserEmail.textContent = session.username || "";
        adminUserEmail.classList.remove("hidden");
      }
      await loadJobs();
    })();
  }

  var loginForm = document.getElementById("adminLoginForm");
  var dashboardRoot = document.getElementById("jobsDashboardRoot");

  if (loginForm) {
    initAdminLogin();
  } else if (dashboardRoot) {
    initAdminDashboard();
  }
})();
