(function () {
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const subjectEl = document.getElementById("contactSubject");
  const nameEl = document.getElementById("cName");
  const emailEl = document.getElementById("cEmail");
  const messageEl = document.getElementById("cMessage");
  const submitBtn = document.getElementById("contactSubmitBtn");

  // Formspree form endpoint (dashboard: https://formspree.io)
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgkbdpq";

  function t(key, fallback) {
    return window.GlobalHrI18n ? window.GlobalHrI18n.t(key, fallback) : fallback || key;
  }

  const LICENCE_MESSAGE = t(
    "contact.licenceMessage",
    "I would like to request a copy or verification of your licence document(s). Please contact me with the details."
  );

  function isFormValid() {
    if (!nameEl || !emailEl || !messageEl) return false;
    if (!nameEl.value.trim()) return false;
    if (!messageEl.value.trim()) return false;
    if (!emailEl.value.trim() || !emailEl.checkValidity()) return false;
    return true;
  }

  function updateSubmitButton() {
    if (!submitBtn) return;
    submitBtn.disabled = !isFormValid();
  }

  function initLicenceInquiryPrefill() {
    try {
      const params = new URLSearchParams(window.location.search);
      const reason = (params.get("reason") || "").toLowerCase();
      if (reason !== "licence") return;

      if (subjectEl) {
        subjectEl.value = t("contact.licenceSubject", "Global HR — licence verification request");
      }
      if (messageEl && !messageEl.value.trim()) {
        messageEl.value = LICENCE_MESSAGE;
      }
      if (messageEl) {
        window.requestAnimationFrame(function () {
          messageEl.focus();
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!form || !statusEl) return;

  initLicenceInquiryPrefill();
  updateSubmitButton();

  [nameEl, emailEl, messageEl].forEach(function (el) {
    if (el) el.addEventListener("input", updateSubmitButton);
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    var honeypot = document.getElementById("cHp");
    if (honeypot && honeypot.value.trim()) {
      form.reset();
      initLicenceInquiryPrefill();
      updateSubmitButton();
      statusEl.className = "mt-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2";
      statusEl.textContent = t(
        "contact.thanks",
        "Thank you — your message has been sent. We will reply soon."
      );
      return;
    }

    if (!isFormValid()) {
      updateSubmitButton();
      statusEl.className = "mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2";
      statusEl.textContent = t(
        "contact.required",
        "Please fill in all required fields (name, email, and message)."
      );
      return;
    }

    statusEl.className = "mt-3 text-sm text-slate-600";
    statusEl.textContent = "";

    if (FORMSPREE_ENDPOINT.indexOf("PLACEHOLDER") !== -1) {
      statusEl.className = "mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2";
      statusEl.textContent =
        "Set your Formspree URL in js/contact.js (FORMSPREE_ENDPOINT), then try again.";
      return;
    }

    if (submitBtn) submitBtn.disabled = true;

    try {
      const fd = new FormData(form);
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(function () {
        return {};
      });
      if (!res.ok) {
        throw new Error((data && data.error) || res.statusText || "Request failed");
      }
      form.reset();
      initLicenceInquiryPrefill();
      updateSubmitButton();
      statusEl.className = "mt-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2";
      statusEl.textContent = t(
        "contact.thanks",
        "Thank you — your message has been sent. We will reply soon."
      );
    } catch (error) {
      console.error(error);
      updateSubmitButton();
      statusEl.className = "mt-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-md px-3 py-2";
      statusEl.textContent =
        t("contact.error", "Something went wrong. Please try again or email us directly.") +
        (error && error.message ? " (" + error.message + ")" : "");
    }
  });

  function initWaChat() {
    var root = document.getElementById("waChat");
    var panel = document.getElementById("waChatPanel");
    var toggle = document.getElementById("waChatToggle");
    if (!root || !panel || !toggle) return;

    function setOpen(open) {
      root.classList.toggle("is-open", open);
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute(
        "aria-label",
        t(open ? "contact.waClose" : "contact.waOpen", open ? "Close chat" : "Open WhatsApp chat")
      );
    }

    toggle.addEventListener("click", function () {
      setOpen(panel.hidden);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });

    document.addEventListener("click", function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  }

  initWaChat();
})();
