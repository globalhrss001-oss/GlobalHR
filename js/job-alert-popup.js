(function () {
  var DISMISS_KEY = "globalhr_job_alert_dismissed_at";
  var SUBSCRIBED_KEY = "globalhr_job_alert_subscribed";
  var DISMISS_DAYS = 14;
  var SHOW_DELAY_MS = 7000;
  var POPUP_ID = "jobAlertPopup";

  var path = window.location.pathname || "";
  if (/\/admin(\/|$)/i.test(path) || /subscribe\.html/i.test(path)) return;

  function now() {
    return Date.now();
  }

  function isDismissedRecently() {
    try {
      var raw = localStorage.getItem(DISMISS_KEY);
      if (!raw) return false;
      var dismissedAt = parseInt(raw, 10);
      if (!dismissedAt) return false;
      return now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
    } catch (e) {
      return false;
    }
  }

  function hasSubscribed() {
    try {
      return localStorage.getItem(SUBSCRIBED_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function markDismissed() {
    try {
      localStorage.setItem(DISMISS_KEY, String(now()));
    } catch (e) {}
  }

  function markSubscribed() {
    try {
      localStorage.setItem(SUBSCRIBED_KEY, "1");
    } catch (e) {}
  }

  if (isDismissedRecently() || hasSubscribed()) return;

  function getApiUrl() {
    return (
      (window.GLOBAL_HR_CMS_API_URL || "").replace(/\/$/, "") ||
      (window.globalHrSheetsJobs && window.globalHrSheetsJobs.apiUrl) ||
      ""
    );
  }

  function ensureApiUrl(callback) {
    var url = getApiUrl();
    if (url) {
      callback(url);
      return;
    }
    function done() {
      callback(getApiUrl());
    }
    var existing = document.querySelector('script[src*="cms-config.js"]');
    if (existing) {
      if (getApiUrl()) {
        done();
      } else {
        existing.addEventListener("load", done, { once: true });
      }
      return;
    }
    var script = document.createElement("script");
    script.src = "js/cms-config.js?v=20260605";
    script.onload = done;
    document.head.appendChild(script);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function prefixPath(relative) {
    if (/^https?:\/\//i.test(relative)) return relative;
    var base = window.location.pathname.replace(/[^/]*$/, "");
    return base + relative;
  }

  var popupEl;
  var showTimer;
  var previousFocus;

  function buildPopup() {
    if (document.getElementById(POPUP_ID)) return document.getElementById(POPUP_ID);

    popupEl = document.createElement("div");
    popupEl.id = POPUP_ID;
    popupEl.className = "job-alert-popup";
    popupEl.hidden = true;
    popupEl.innerHTML =
      '<div class="job-alert-popup__backdrop" data-job-alert-dismiss tabindex="-1" aria-hidden="true"></div>' +
      '<div class="job-alert-popup__panel" role="dialog" aria-modal="true" aria-labelledby="jobAlertPopupTitle">' +
      '<button type="button" class="job-alert-popup__close" data-job-alert-dismiss aria-label="Close job alerts popup">&times;</button>' +
      '<p class="job-alert-popup__eyebrow">Job alerts</p>' +
      '<h2 id="jobAlertPopupTitle" class="job-alert-popup__title">Get job alerts from Global HR</h2>' +
      '<p class="job-alert-popup__text">New openings in marine, shipyard, logistics, and more across Asia-Pacific &amp; beyond. Enter your email — we&rsquo;ll only contact you about relevant roles.</p>' +
      '<form id="jobAlertPopupForm" class="job-alert-popup__form" novalidate>' +
      '<div class="sr-only" aria-hidden="true">' +
      '<label for="jobAlertHp">Leave blank</label>' +
      '<input id="jobAlertHp" name="_hp" type="text" tabindex="-1" autocomplete="off" />' +
      "</div>" +
      '<label for="jobAlertEmail" class="job-alert-popup__label">Email</label>' +
      '<input id="jobAlertEmail" name="email" type="email" inputmode="email" autocomplete="email" spellcheck="false" placeholder="you@example.com" class="subscribe-input job-alert-popup__input" aria-describedby="jobAlertEmailError" required />' +
      '<p id="jobAlertEmailError" class="subscribe-field-error hidden" role="alert"></p>' +
      '<label class="job-alert-popup__consent">' +
      '<input id="jobAlertConsent" name="consent" type="checkbox" class="job-alert-popup__checkbox" />' +
      "<span>I agree that Global HR may contact me by email about job opportunities and recruitment services.</span>" +
      "</label>" +
      '<button type="submit" id="jobAlertSubmitBtn" class="job-alert-popup__submit" disabled>Get job alerts</button>' +
      '<p id="jobAlertStatus" class="job-alert-popup__status" role="status" aria-live="polite"></p>' +
      "</form>" +
      '<p class="job-alert-popup__footer-note">' +
      '<button type="button" class="job-alert-popup__dismiss-link" data-job-alert-dismiss>Not now</button>' +
      ' · <a href="' +
      prefixPath("subscribe.html?utm_source=popup&utm_campaign=job-alerts-7s") +
      '" class="job-alert-popup__link">Full signup</a>' +
      "</p>" +
      "</div>";

    document.body.appendChild(popupEl);
    bindPopupEvents(popupEl);
    return popupEl;
  }

  function setStatus(message, type) {
    var statusEl = document.getElementById("jobAlertStatus");
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = "job-alert-popup__status";
    if (type === "error") statusEl.className += " job-alert-popup__status--error";
    if (type === "success") statusEl.className += " job-alert-popup__status--success";
  }

  function validateEmail(showError) {
    var emailEl = document.getElementById("jobAlertEmail");
    if (!emailEl) return false;
    var value = emailEl.value.trim();
    if (!value) {
      if (showError) setEmailError("");
      return false;
    }
    if (!isValidEmail(value)) {
      if (showError) {
        setEmailError("Enter a valid email address (e.g. you@example.com).");
      }
      return false;
    }
    setEmailError("");
    return true;
  }

  function updateSubmitButton() {
    var submitBtn = document.getElementById("jobAlertSubmitBtn");
    if (!submitBtn) return;
    submitBtn.disabled = !validateEmail(false);
  }

  function setEmailError(message) {
    var emailEl = document.getElementById("jobAlertEmail");
    var errorEl = document.getElementById("jobAlertEmailError");
    if (!emailEl) return;
    if (message) {
      emailEl.classList.add("subscribe-input--invalid");
      emailEl.setAttribute("aria-invalid", "true");
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove("hidden");
      }
      return;
    }
    emailEl.classList.remove("subscribe-input--invalid");
    emailEl.setAttribute("aria-invalid", "false");
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.add("hidden");
    }
  }

  async function submitLead(url, payload) {
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
      throw new Error("Invalid response from signup service.");
    }
    if (!data || data.ok !== true) {
      throw new Error((data && data.error) || "Could not save your details. Please try again.");
    }
    return data;
  }

  function bindPopupEvents(root) {
    root.querySelectorAll("[data-job-alert-dismiss]").forEach(function (el) {
      el.addEventListener("click", closePopup);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root && !root.hidden) closePopup();
    });

    var form = document.getElementById("jobAlertPopupForm");
    if (!form) return;

    updateSubmitButton();

    var emailEl = document.getElementById("jobAlertEmail");
    if (emailEl) {
      emailEl.addEventListener("input", function () {
        validateEmail(true);
        updateSubmitButton();
        setStatus("", "info");
      });
      emailEl.addEventListener("blur", function () {
        validateEmail(true);
        updateSubmitButton();
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var emailEl = document.getElementById("jobAlertEmail");
      var consentEl = document.getElementById("jobAlertConsent");
      var submitBtn = document.getElementById("jobAlertSubmitBtn");
      var email = emailEl ? emailEl.value.trim() : "";

      if (!validateEmail(true)) {
        setStatus("Please enter a valid email address.", "error");
        updateSubmitButton();
        return;
      }

      if (!consentEl || !consentEl.checked) {
        setStatus("Please agree to be contacted about job opportunities.", "error");
        return;
      }

      setStatus("Submitting…", "info");
      if (submitBtn) submitBtn.disabled = true;

      ensureApiUrl(function (url) {
        if (!url) {
          updateSubmitButton();
          setStatus("Signup service is not configured. Please try again later.", "error");
          return;
        }

        submitLead(url, {
          action: "lead",
          name: "",
          email: email,
          phone: "",
          source: "popup",
          campaign: "job-alerts-7s",
          consent: "yes",
          _hp: (document.getElementById("jobAlertHp") && document.getElementById("jobAlertHp").value) || "",
        })
          .then(function () {
            markSubscribed();
            setStatus("You’re on the list. We’ll email you when new roles are available.", "success");
            var panel = root.querySelector(".job-alert-popup__panel");
            if (panel) {
              var title = root.querySelector(".job-alert-popup__title");
              var text = root.querySelector(".job-alert-popup__text");
              if (title) title.textContent = "Thank you";
              if (text) {
                text.textContent =
                  "We’ll notify you about relevant job openings from Global HR. You can close this window and keep browsing.";
              }
            }
            if (form) form.classList.add("hidden");
            var footer = root.querySelector(".job-alert-popup__footer-note");
            if (footer) footer.classList.add("hidden");
          })
          .catch(function (error) {
            console.error(error);
            updateSubmitButton();
            setStatus(
              error && error.message
                ? error.message
                : "Something went wrong. Please try again or contact us directly.",
              "error"
            );
          });
      });
    });
  }

  function shouldSkipShowing() {
    var active = document.activeElement;
    if (!active) return false;
    var tag = active.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
    if (active.isContentEditable) return true;
    return false;
  }

  function openPopup() {
    if (isDismissedRecently() || hasSubscribed()) return;
    if (shouldSkipShowing()) return;

    var root = buildPopup();
    if (!root || (!root.hidden && root.classList.contains("is-open"))) return;

    previousFocus = document.activeElement;
    root.hidden = false;
    root.classList.add("is-open");
    document.body.classList.add("job-alert-popup-open");

    var emailEl = document.getElementById("jobAlertEmail");
    if (emailEl) {
      updateSubmitButton();
      window.setTimeout(function () {
        emailEl.focus();
      }, 50);
    }
  }

  function closePopup() {
    var root = document.getElementById(POPUP_ID);
    if (!root || root.hidden) return;
    root.hidden = true;
    root.classList.remove("is-open");
    document.body.classList.remove("job-alert-popup-open");
    markDismissed();
    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  function schedulePopup() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showTimer = window.setTimeout(openPopup, SHOW_DELAY_MS);
      return;
    }
    showTimer = window.setTimeout(openPopup, SHOW_DELAY_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedulePopup);
  } else {
    schedulePopup();
  }

  window.addEventListener("pagehide", function () {
    if (showTimer) window.clearTimeout(showTimer);
  });
})();
