(function () {
  const sb = window.globalHrSupabase;

  function t(en, my) {
    return (localStorage.getItem("globalhr_lang") || "en") === "my" ? my : en;
  }

  function showEl(el, msg) {
    if (!el) return;
    el.textContent = msg || "";
    if (msg) el.classList.remove("hidden");
    else el.classList.add("hidden");
  }

  function initAdminLogin() {
    const form = document.getElementById("adminLoginForm");
    const errEl = document.getElementById("loginError");
    if (!form || !sb) {
      if (!sb) showEl(errEl, "Supabase client not loaded.");
      return;
    }

    (async function () {
      try {
        const result = await sb.auth.getSession();
        if (result.error) throw result.error;
        if (result.data && result.data.session) {
          window.location.href = "dashboard.html";
        }
      } catch (error) {
        console.error(error);
      }
    })();

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      showEl(errEl, "");

      const emailInput = document.getElementById("loginEmail");
      const passInput = document.getElementById("loginPassword");
      const email = emailInput ? emailInput.value.trim() : "";
      const password = passInput ? passInput.value : "";

      try {
        const result = await sb.auth.signInWithPassword({ email: email, password: password });
        if (result.error) throw result.error;
        window.location.href = "dashboard.html";
      } catch (error) {
        console.error(error);
        const msg =
          error && error.message
            ? error.message
            : t("Sign-in failed. Check your email and password.", "ဝင်ရောက်မှု မအောင်မြင်ပါ။ အီးမေးလ်နှင့် စကားဝှက်ကို စစ်ပါ။");
        showEl(errEl, msg);
      }
    });
  }

  function initAdminDashboard() {
    const tableBody = document.getElementById("jobTableBody");
    const tableEmpty = document.getElementById("jobTableEmpty");
    const dashErr = document.getElementById("dashboardError");
    const logoutBtn = document.getElementById("logoutBtn");
    const addJobBtn = document.getElementById("addJobBtn");
    const modal = document.getElementById("jobModal");
    const modalClose = document.getElementById("jobModalClose");
    const jobForm = document.getElementById("jobForm");
    const jobFormCancel = document.getElementById("jobFormCancel");
    const jobFormError = document.getElementById("jobFormError");
    const jobModalTitle = document.getElementById("jobModalTitle");
    const adminUserEmail = document.getElementById("adminUserEmail");

    const fId = document.getElementById("fId");
    const fTitle = document.getElementById("fTitle");
    const fCompany = document.getElementById("fCompany");
    const fLocation = document.getElementById("fLocation");
    const fJobType = document.getElementById("fJobType");
    const fIndustry = document.getElementById("fIndustry");
    const fDescription = document.getElementById("fDescription");
    const fApplyEmail = document.getElementById("fApplyEmail");
    const fStatus = document.getElementById("fStatus");

    if (!tableBody || !sb) {
      if (!sb) showEl(dashErr, "Supabase client not loaded.");
      return;
    }

    let jobsCache = [];

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
      if (fApplyEmail) fApplyEmail.value = "";
      if (fStatus) fStatus.value = "active";
    }

    function openAddModal() {
      resetForm();
      if (jobModalTitle) jobModalTitle.textContent = t("Add new job", "အလုပ်အသစ်ထည့်ရန်");
      openModal();
    }

    function openEditModal(job) {
      resetForm();
      if (jobModalTitle) jobModalTitle.textContent = t("Edit job", "အလုပ်ပြင်ရန်");
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
        const tr = document.createElement("tr");
        tr.className = "hover:bg-slate-50/80 dark:hover:bg-slate-800/60";

        const tdTitle = document.createElement("td");
        tdTitle.className = "px-4 py-3 font-medium text-brandDark dark:text-slate-100";
        tdTitle.textContent = job.title || "—";

        const tdLoc = document.createElement("td");
        tdLoc.className = "px-4 py-3 text-slate-700 dark:text-slate-200";
        tdLoc.textContent = job.location || "—";

        const tdType = document.createElement("td");
        tdType.className = "px-4 py-3 text-slate-700 dark:text-slate-200";
        tdType.textContent = job.job_type || "—";

        const tdStatus = document.createElement("td");
        tdStatus.className = "px-4 py-3";
        const badge = document.createElement("span");
        const active = job.status === "active";
        badge.className =
          "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold " +
          (active
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
            : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200");
        badge.textContent = job.status || "—";
        tdStatus.appendChild(badge);

        const tdAct = document.createElement("td");
        tdAct.className = "px-4 py-3 text-right whitespace-nowrap";

        const btnToggle = document.createElement("button");
        btnToggle.type = "button";
        btnToggle.className =
          "mr-2 text-xs font-semibold text-brandPurple hover:text-brandNavy dark:text-violet-300 dark:hover:text-slate-100 transition-colors";
        btnToggle.textContent = active ? t("Hide", "ဖျောက်ရန်") : t("Show", "ပြရန်");
        btnToggle.setAttribute("data-action", "toggle");
        btnToggle.setAttribute("data-id", job.id);

        const btnEdit = document.createElement("button");
        btnEdit.type = "button";
        btnEdit.className =
          "mr-2 text-xs font-semibold text-brandBlue hover:text-brandNavy dark:text-sky-400 dark:hover:text-slate-100 transition-colors";
        btnEdit.textContent = t("Edit", "ပြင်ရန်");
        btnEdit.setAttribute("data-action", "edit");
        btnEdit.setAttribute("data-id", job.id);

        const btnDel = document.createElement("button");
        btnDel.type = "button";
        btnDel.className =
          "text-xs font-semibold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors";
        btnDel.textContent = t("Delete", "ဖျက်ရန်");
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
        const result = await sb.from("jobs").select("*").order("created_at", { ascending: false });
        if (result.error) throw result.error;
        jobsCache = result.data || [];
        renderTable(jobsCache);
      } catch (error) {
        console.error(error);
        showDashError(
          (error && error.message ? String(error.message) : "") ||
            t("Could not load jobs.", "အလုပ်များကို မဖတ်နိုင်ပါ။")
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
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");
      const job = findJob(id);
      if (!job) return;

      if (action === "edit") {
        openEditModal(job);
        return;
      }

      if (action === "delete") {
        const ok = window.confirm(
          t("Delete this job permanently?", "ဤအလုပ်ကို အပြီးတိုင် ဖျက်မလား။")
        );
        if (!ok) return;
        try {
          const del = await sb.from("jobs").delete().eq("id", id);
          if (del.error) throw del.error;
          await loadJobs();
        } catch (error) {
          console.error(error);
          showDashError(
            (error && error.message) || t("Delete failed.", "ဖျက်ခြင်း မအောင်မြင်ပါ။")
          );
        }
        return;
      }

      if (action === "toggle") {
        const next = job.status === "active" ? "hidden" : "active";
        try {
          const upd = await sb.from("jobs").update({ status: next }).eq("id", id);
          if (upd.error) throw upd.error;
          await loadJobs();
        } catch (error) {
          console.error(error);
          showDashError(
            (error && error.message) || t("Update failed.", "ပြင်ဆင်မှု မအောင်မြင်ပါ။")
          );
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

        const idVal = fId && fId.value ? fId.value.trim() : "";
        const payload = {
          title: (fTitle && fTitle.value.trim()) || "",
          company: (fCompany && fCompany.value.trim()) || "",
          location: fLocation ? fLocation.value : "",
          job_type: fJobType ? fJobType.value : "",
          industry: (fIndustry && fIndustry.value.trim()) || "",
          description: (fDescription && fDescription.value.trim()) || "",
          apply_email: fApplyEmail && fApplyEmail.value.trim() ? fApplyEmail.value.trim() : null,
          status: fStatus ? fStatus.value : "active",
        };

        try {
          if (idVal) {
            const upd = await sb.from("jobs").update(payload).eq("id", idVal);
            if (upd.error) throw upd.error;
          } else {
            const ins = await sb.from("jobs").insert(payload);
            if (ins.error) throw ins.error;
          }
          closeModal();
          await loadJobs();
        } catch (error) {
          console.error(error);
          showEl(
            jobFormError,
            (error && error.message) || t("Save failed.", "သိမ်းခြင်း မအောင်မြင်ပါ။")
          );
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async function () {
        try {
          const out = await sb.auth.signOut();
          if (out.error) throw out.error;
        } catch (error) {
          console.error(error);
        }
        window.location.href = "index.html";
      });
    }

    (async function () {
      try {
        const sess = await sb.auth.getSession();
        if (sess.error) throw sess.error;
        if (!sess.data || !sess.data.session) {
          window.location.href = "index.html";
          return;
        }
        if (adminUserEmail) {
          adminUserEmail.textContent = sess.data.session.user.email || "";
          adminUserEmail.classList.remove("hidden");
        }

        sb.auth.onAuthStateChange(function (event) {
          if (event === "SIGNED_OUT") {
            window.location.href = "index.html";
          }
        });

        await loadJobs();
      } catch (error) {
        console.error(error);
        window.location.href = "index.html";
      }
    })();

    const langBtn = document.getElementById("langToggle");
    if (langBtn) {
      langBtn.addEventListener("click", function () {
        window.setTimeout(function () {
          renderTable(jobsCache);
        }, 0);
      });
    }
  }

  const loginForm = document.getElementById("adminLoginForm");
  const dashboardRoot = document.getElementById("jobsDashboardRoot");

  if (loginForm) {
    initAdminLogin();
  } else if (dashboardRoot) {
    initAdminDashboard();
  }
})();
