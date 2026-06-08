(function () {
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const subjectEl = document.getElementById("contactSubject");
  const messageEl = document.getElementById("cMessage");

  // Formspree form endpoint (dashboard: https://formspree.io)
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgkbdpq";

  const LICENCE_MESSAGE =
    "I would like to request a copy or verification of your licence document(s). Please contact me with the details.";

  function initLicenceInquiryPrefill() {
    try {
      const params = new URLSearchParams(window.location.search);
      const reason = (params.get("reason") || "").toLowerCase();
      if (reason !== "licence") return;

      if (subjectEl) {
        subjectEl.value = "Global HR — licence verification request";
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

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    statusEl.className = "mt-3 text-sm text-slate-600";
    statusEl.textContent = "";

    if (FORMSPREE_ENDPOINT.indexOf("PLACEHOLDER") !== -1) {
      statusEl.className = "mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2";
      statusEl.textContent =
        "Set your Formspree URL in js/contact.js (FORMSPREE_ENDPOINT), then try again.";
      return;
    }

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
      statusEl.className = "mt-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2";
      statusEl.textContent = "Thank you — your message has been sent. We will reply soon.";
    } catch (error) {
      console.error(error);
      statusEl.className = "mt-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-md px-3 py-2";
      statusEl.textContent =
        "Something went wrong. Please try again or email us directly." +
        (error && error.message ? " (" + error.message + ")" : "");
    }
  });
})();
