(function () {
  function t(key, fallback) {
    return window.GlobalHrI18n ? window.GlobalHrI18n.t(key, fallback) : fallback || key;
  }

  var form = document.getElementById("subscribeForm");
  var statusEl = document.getElementById("subscribeStatus");
  var nameEl = document.getElementById("subName");
  var emailEl = document.getElementById("subEmail");
  var phoneEl = document.getElementById("subPhone");
  var emailErrorEl = document.getElementById("subEmailError");
  var phoneErrorEl = document.getElementById("subPhoneError");
  var consentEl = document.getElementById("subConsent");
  var submitBtn = document.getElementById("subscribeSubmitBtn");
  var successPanel = document.getElementById("subscribeSuccess");

  function apiUrl() {
    return (window.GLOBAL_HR_CMS_API_URL || "").replace(/\/$/, "");
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

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function phoneDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function hasAnyData() {
    if (nameEl && nameEl.value.trim()) return true;
    if (emailEl && emailEl.value.trim()) return true;
    if (phoneEl && phoneEl.value.trim()) return true;
    return false;
  }

  function validateEmail(showError) {
    if (!emailEl) return true;
    var value = emailEl.value.trim();
    if (!value) {
      setFieldError(emailEl, emailErrorEl, "");
      return true;
    }
    if (!isValidEmail(value)) {
      if (showError) {
        setFieldError(emailEl, emailErrorEl, t("subscribe.invalidEmail", "Enter a valid email address (e.g. you@example.com)."));
      }
      return false;
    }
    setFieldError(emailEl, emailErrorEl, "");
    return true;
  }

  function validatePhone(showError) {
    if (!phoneEl) return true;
    var value = phoneEl.value.trim();
    if (!value) {
      setFieldError(phoneEl, phoneErrorEl, "");
      return true;
    }
    var digits = phoneDigits(value);
    if (digits.length < 6) {
      if (showError) {
        setFieldError(phoneEl, phoneErrorEl, t("subscribe.invalidPhone", "Enter a valid phone number with at least 6 digits."));
      }
      return false;
    }
    setFieldError(phoneEl, phoneErrorEl, "");
    return true;
  }

  function setFieldError(input, errorEl, message) {
    if (!input) return;
    if (message) {
      input.classList.add("subscribe-input--invalid");
      input.setAttribute("aria-invalid", "true");
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove("hidden");
      }
      return;
    }
    input.classList.remove("subscribe-input--invalid");
    input.setAttribute("aria-invalid", "false");
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.add("hidden");
    }
  }

  function isFormValid(showErrors) {
    if (!hasAnyData()) {
      if (showErrors) {
        showStatus(t("subscribe.needContact", "Please enter at least your name, email, or phone."), "error");
      }
      return false;
    }
    var emailOk = validateEmail(showErrors);
    var phoneOk = validatePhone(showErrors);
    return emailOk && phoneOk;
  }

  function updateSubmitButton() {
    if (!submitBtn) return;
    submitBtn.disabled = !isFormValid(false);
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
      throw new Error(t("subscribe.notConfigured", "Signup service is not configured. Please try again later."));
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
      throw new Error(t("subscribe.invalidResponse", "Invalid response from signup service."));
    }

    if (!data || data.ok !== true) {
      throw new Error((data && data.error) || t("subscribe.saveError", "Could not save your details. Please try again."));
    }

    return data;
  }

  if (!form || !statusEl) return;

  updateSubmitButton();

  if (nameEl) nameEl.addEventListener("input", updateSubmitButton);
  if (consentEl) consentEl.addEventListener("change", updateSubmitButton);

  if (emailEl) {
    emailEl.addEventListener("input", function () {
      validateEmail(true);
      updateSubmitButton();
      if (statusEl.textContent) showStatus("", "info");
    });
    emailEl.addEventListener("blur", function () {
      validateEmail(true);
      updateSubmitButton();
    });
  }

  if (phoneEl) {
    phoneEl.addEventListener("input", function () {
      validatePhone(true);
      updateSubmitButton();
      if (statusEl.textContent) showStatus("", "info");
    });
    phoneEl.addEventListener("blur", function () {
      validatePhone(true);
      updateSubmitButton();
    });
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!isFormValid(true)) {
      updateSubmitButton();
      return;
    }
    if (!consentEl || !consentEl.checked) {
      showStatus(t("subscribe.needConsent", "Please agree to be contacted about jobs and services."), "error");
      return;
    }

    showStatus(t("subscribe.submitting", "Submitting…"), "info");
    if (submitBtn) submitBtn.disabled = true;

    var meta = marketingParams();
    var payload = {
      action: "lead",
      name: nameEl ? nameEl.value.trim() : "",
      email: emailEl ? emailEl.value.trim() : "",
      phone: phoneEl ? phoneEl.value.trim() : "",
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
          : t("subscribe.genericError", "Something went wrong. Please try again or contact us directly."),
        "error"
      );
    }
  });
})();
