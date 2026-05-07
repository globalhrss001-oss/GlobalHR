(function () {
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");

  // Create a form at https://formspree.io — paste your form endpoint below (e.g. https://formspree.io/f/abcxyz)
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/[PLACEHOLDER]";

  function t(en, my) {
    return (localStorage.getItem("globalhr_lang") || "en") === "my" ? my : en;
  }

  if (!form || !statusEl) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    statusEl.className = "mt-3 text-sm text-slate-600";
    statusEl.textContent = "";

    if (FORMSPREE_ENDPOINT.indexOf("PLACEHOLDER") !== -1) {
      statusEl.className = "mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2";
      statusEl.textContent = t(
        "Set your Formspree URL in js/contact.js (FORMSPREE_ENDPOINT), then try again.",
        "js/contact.js တွင် Formspree လိပ်စာကို သတ်မှတ်ပြီးနောက် ထပ်စမ်းပါ။"
      );
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
      statusEl.className = "mt-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2";
      statusEl.textContent = t(
        "Thank you — your message has been sent. We will reply soon.",
        "ကျေးဇူးတင်ပါသည် — သင့်စာကို ပို့ပြီးပါပြီ။ မကြာမီ ပြန်လည်ဆက်သွယ်ပါမည်။"
      );
    } catch (error) {
      console.error(error);
      statusEl.className = "mt-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-md px-3 py-2";
      statusEl.textContent =
        t("Something went wrong. Please try again or email us directly.", "တစ်ခုခု မှားယွင်းသွားပါသည်။ ထပ်မံကြိုးစားပါ သို့မဟုတ် တိုက်ရိုက် အီးမေးလ်ပို့ပါ။") +
        (error && error.message ? " (" + error.message + ")" : "");
    }
  });
})();
