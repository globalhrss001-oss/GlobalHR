(function () {
  var form = document.getElementById("subscribeForm");
  var statusEl = document.getElementById("subscribeStatus");
  var emailEl = document.getElementById("subEmail");
  var phoneEl = document.getElementById("subPhone");
  var consentEl = document.getElementById("subConsent");
  var submitBtn = document.getElementById("subscribeSubmitBtn");
  var successPanel = document.getElementById("subscribeSuccess");

  function apiUrl() {
    return (
      (window.GLOBAL_HR_CMS_API_URL || "").replace(/\/$/, "") ||
      (window.globalHrSheetsJobs && window.globalHrSheetsJobs.apiUrl) ||
      ""
    );
  }

  function marketingParams() {
    var params = new URLSearchParams(window.location.search);
    var source = (params.get("source") || params.get("utm_source") || "website").trim();
    var campaign = (params.get("campaign") || params.get("utm_campaign") || "").trim();
    return {
      source: source.slice(0, 64),
      campaign: campaign.slice(0, 128),
    };
  }

  function isFormValid() {
    if (!emailEl || !phoneEl || !consentEl) return false;
    if (!emailEl.value.trim() || !emailEl.checkValidity()) return false;
    if (!phoneEl.value.trim() || phoneEl.value.replace(/\D/g, "").length < 6) return false;
    if (!consentEl.checked) return false;
    return true;
  }

  function updateSubmitButton() {
    if (!submitBtn) return;
    submitBtn.disabled = !isFormValid();
  }

  function showStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = "mt-4 text-sm min-h-[1.25rem]";
    if (type === "error") {
      statusEl.className +=
        " text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-md px-3 py-2";
    } else if (type === "success") {
      statusEl.className +=
        " text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md px-3 py-2";
    } else {
      statusEl.className += " text-slate-600 dark:text-slate-300";
    }
  }

  function showSuccessPanel() {
    if (form) form.classList.add("hidden");
    if (successPanel) successPanel.classList.remove("hidden");
  }

  async function submitLead(payload) {
    var url = apiUrl();
    if (!url) {
      throw new Error("Signup service is not configured. Please try again later.");
    }

    var res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      cache: "no-store",
    });

    var text = await res.text();
    var data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Lead API response was not JSON:", text.slice(0, 200));
      throw new Error("Invalid response from signup service.");
    }

    if (!data || data.ok !== true) {
      throw new Error((data && data.error) || "Could not save your details. Please try again.");
    }

    return data;
  }

  if (!form || !statusEl) return;

  updateSubmitButton();
  [emailEl, phoneEl, consentEl].forEach(function (el) {
    if (el) el.addEventListener("input", updateSubmitButton);
    if (el) el.addEventListener("change", updateSubmitButton);
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!isFormValid()) {
      updateSubmitButton();
      showStatus("Please enter your email and phone, and agree to be contacted.", "error");
      return;
    }

    showStatus("Submitting…", "info");
    if (submitBtn) submitBtn.disabled = true;

    var meta = marketingParams();
    var payload = {
      action: "lead",
      email: emailEl.value.trim(),
      phone: phoneEl.value.trim(),
      source: meta.source,
      campaign: meta.campaign,
      consent: consentEl.checked ? "yes" : "no",
      _hp: (document.getElementById("subHp") && document.getElementById("subHp").value) || "",
    };

    try {
      await submitLead(payload);
      showSuccessPanel();
      showStatus("", "info");
    } catch (error) {
      console.error(error);
      updateSubmitButton();
      showStatus(
        error && error.message
          ? error.message
          : "Something went wrong. Please try again or contact us directly.",
        "error"
      );
    }
  });
})();
